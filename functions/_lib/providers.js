/* AI providers behind one function: callModel(env, { system, messages, schema, maxTokens, effort }).
 *
 *   workers   Cloudflare Workers AI via the Pages binding env.AI (free daily allowance).
 *   anthropic Claude via the Messages API and env.ANTHROPIC_API_KEY.
 *
 * Both return the parsed JSON object the schema describes, or throw HttpError.
 * No onRequest exports, so Pages does not route this file. */

import { HttpError } from './http.js';

export const DEFAULT_MODEL = 'claude-opus-5-5';
export const DEFAULT_WORKERS_MODEL = '@cf/meta/llama-3.3-70b-instruct-fp8-fast';

const API_URL = 'https://api.anthropic.com/v1/messages';
const API_VERSION = '2026-10-21';
// Server-side refusal fallback: if the model's safety classifiers decline a request,
// the API re-runs it on Anthropic's recommended fallback model inside the same call.
// Only sent for models that accept it (set MODEL to anything else and it is left off).
const FALLBACK_BETA = 'server-side-fallback-2026-07-01';
const FALLBACK_MODELS = ['claude-opus-5-5', 'claude-opus-5', 'claude-fable-5-1', 'claude-sonnet-5-5'];

// Workers AI models whose docs list JSON Mode (response_format json_schema).
const WORKERS_JSON_MODE = [
  '@cf/meta/llama-3.3-70b-instruct-fp8-fast',
  '@cf/meta/llama-3.1-8b-instruct',
  '@cf/meta/llama-3-8b-instruct',
  '@hf/nousresearch/hermes-2-pro-mistral-7b',
  '@hf/thebloke/deepseek-coder-6.7b-instruct-awq',
  '@cf/deepseek-ai/deepseek-r1-distill-qwen-32b',
];

export const CALL_TIMEOUT_MS = 28000;

/* ------------------------------ Selection ------------------------------- */

const hasAI = (env) => Boolean(env.AI && typeof env.AI.run === 'function');

/** 'workers' | 'anthropic'. AI_PROVIDER wins; otherwise Workers AI when the AI binding exists and there's no Anthropic key. */
export function providerName(env = {}) {
  const p = String(env.AI_PROVIDER || '').trim().toLowerCase();
  if (p === 'workers' || p === 'anthropic') return p;
  if (hasAI(env) && !env.ANTHROPIC_API_KEY) return 'workers';
  return 'anthropic';
}

export function providerInfo(env = {}) {
  const provider = providerName(env);
  if (provider === 'workers') {
    return { provider, model: env.WORKERS_MODEL || DEFAULT_WORKERS_MODEL, configured: hasAI(env) };
  }
  return { provider, model: env.MODEL || DEFAULT_MODEL, configured: Boolean(env.ANTHROPIC_API_KEY) };
}

/* Per-provider prompt budgets. Llama 3.3 70B fp8-fast has a 24k-token window. */
export const BUDGETS = {
  anthropic: { knowledge: 28000, context: 8000, historyChars: Infinity, headTokens: 4000, deskTokens: 2500, qualityTokens: 2500 },
  workers: { knowledge: 8000, context: 5000, historyChars: 8000, headTokens: 1500, deskTokens: 2500, qualityTokens: 2500 },
};

export function budgetsFor(env) {
  return BUDGETS[providerName(env)];
}

/* ------------------------------- Dispatch ------------------------------- */

export function callModel(env, args) {
  return providerName(env) === 'workers' ? callWorkers(env, args) : callClaude(env, args);
}

/* --------------------------- Anthropic client --------------------------- */

export async function callClaude(env, { system, messages, schema, maxTokens, effort }) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), CALL_TIMEOUT_MS);
  const model = env.MODEL || DEFAULT_MODEL;
  const useFallback = FALLBACK_MODELS.includes(model);
  const headers = {
    'content-type': 'application/json',
    'x-api-key': env.ANTHROPIC_API_KEY,
    'anthropic-version': API_VERSION,
  };
  if (useFallback) headers['anthropic-beta'] = FALLBACK_BETA;
  const payload = {
    model,
    max_tokens: maxTokens,
    thinking: { type: 'adaptive' },
    output_config: { effort, format: { type: 'json_schema', schema } },
    system,
    messages,
  };
  if (useFallback) payload.fallbacks = 'default';
  let res;
  try {
    res = await fetch(API_URL, { method: 'POST', signal: controller.signal, headers, body: JSON.stringify(payload) });
  } catch (err) {
    throw new HttpError(503, err && err.name === 'AbortError' ? 'upstream_timeout' : 'upstream_unreachable', String(err && err.message));
  } finally {
    clearTimeout(timer);
  }

  if (!res.ok) {
    let detail = `status ${res.status}`;
    try {
      const e = await res.json();
      if (e && e.error && e.error.type) detail += ` ${e.error.type}`;
    } catch (_) { /* ignore */ }
    if (res.status === 401 || res.status === 403) throw new HttpError(503, 'not_configured', `key rejected: ${detail}`);
    if (res.status === 429 || res.status === 529 || res.status >= 500) throw new HttpError(503, 'upstream_busy', detail);
    throw new HttpError(500, 'upstream_error', detail);
  }

  const data = await res.json();
  if (data.stop_reason === 'refusal') throw new HttpError(500, 'model_refused');
  if (data.stop_reason === 'max_tokens') throw new HttpError(500, 'model_output_truncated');
  // Structured output arrives as JSON in the last text block (thinking/fallback blocks are skipped).
  const texts = (data.content || []).filter((b) => b.type === 'text').map((b) => b.text);
  const raw = texts[texts.length - 1];
  try {
    return JSON.parse(raw);
  } catch (_) {
    throw new HttpError(500, 'model_bad_json', 'anthropic text was not JSON');
  }
}

/* --------------------------- Workers AI client -------------------------- */

/** Find the first balanced {...} block in text (string-aware). */
export function extractJsonObject(text) {
  const s = String(text || '');
  for (let start = s.indexOf('{'); start !== -1; start = s.indexOf('{', start + 1)) {
    let depth = 0;
    let inStr = false;
    let esc = false;
    for (let i = start; i < s.length; i++) {
      const ch = s[i];
      if (inStr) {
        if (esc) esc = false;
        else if (ch === '\\') esc = true;
        else if (ch === '"') inStr = false;
        continue;
      }
      if (ch === '"') inStr = true;
      else if (ch === '{') depth++;
      else if (ch === '}' && --depth === 0) {
        try {
          return JSON.parse(s.slice(start, i + 1));
        } catch (_) {
          break; // try the next '{'
        }
      }
    }
  }
  return null;
}

/** Workers AI returns { response } as an object in JSON mode, or as a string otherwise. */
export function parseWorkersOutput(out) {
  const r = out && typeof out === 'object' && 'response' in out ? out.response : out;
  if (r && typeof r === 'object' && !Array.isArray(r)) return r;
  if (typeof r === 'string') {
    const t = r.trim().replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, '');
    try {
      const v = JSON.parse(t);
      if (v && typeof v === 'object' && !Array.isArray(v)) return v;
    } catch (_) { /* fall through */ }
    const v = extractJsonObject(t);
    if (v && typeof v === 'object' && !Array.isArray(v)) return v;
  }
  return null;
}

function systemText(system) {
  return Array.isArray(system) ? system.map((b) => (b && b.text) || '').join('\n\n') : String(system || '');
}

function withTimeout(promise, ms) {
  let timer;
  const t = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new HttpError(503, 'upstream_timeout', `workers ai > ${ms}ms`)), ms);
  });
  return Promise.race([promise, t]).finally(() => clearTimeout(timer));
}

function mapWorkersError(err) {
  if (err instanceof HttpError) return err;
  const msg = String((err && err.message) || err);
  if (/neuron|daily|quota|3036/i.test(msg)) return new HttpError(503, 'daily_limit_reached', msg);
  if (/capacity|overload|rate|429|3040|busy|timeout|5\d\d/i.test(msg)) return new HttpError(503, 'upstream_busy', msg);
  return new HttpError(500, 'upstream_error', msg);
}

export async function callWorkers(env, { system, messages, schema, maxTokens }) {
  if (!env.AI || typeof env.AI.run !== 'function') throw new HttpError(503, 'not_configured', 'no AI binding');
  const model = env.WORKERS_MODEL || DEFAULT_WORKERS_MODEL;
  const jsonMode = WORKERS_JSON_MODE.includes(model);
  const sys = `${systemText(system)}

## Format
Reply with one JSON object only, no other text, matching this JSON Schema. Use every property listed; use empty strings or empty lists when a field does not apply.
${JSON.stringify(schema)}`;
  const base = {
    messages: [{ role: 'system', content: sys }, ...messages.map((m) => ({ role: m.role, content: m.content }))],
    max_tokens: maxTokens,
    temperature: 0.4,
  };

  const run = (input) => withTimeout(Promise.resolve().then(() => env.AI.run(model, input)), CALL_TIMEOUT_MS);
  let out;
  try {
    out = await run(jsonMode ? { ...base, response_format: { type: 'json_schema', json_schema: schema } } : base);
  } catch (err) {
    // "JSON Mode couldn't be met": retry once without JSON mode and parse the text ourselves.
    if (jsonMode && /json mode/i.test(String(err && err.message))) {
      try {
        out = await run(base);
      } catch (err2) {
        throw mapWorkersError(err2);
      }
    } else {
      throw mapWorkersError(err);
    }
  }
  const parsed = parseWorkersOutput(out);
  if (!parsed) throw new HttpError(500, 'model_bad_json', 'workers output had no JSON object');
  return parsed;
}
