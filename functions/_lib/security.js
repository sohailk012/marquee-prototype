/* Security for /api/chat: request checks, body limits, context allowlist,
 * passcode, Supabase login, rate limiting and the "who may call" gate.
 * No onRequest exports, so Pages does not route this file. */

import { HttpError, isAllowedOrigin } from './http.js';

const enc = new TextEncoder();

/* ---------------------------- Request checks ---------------------------- */

/** 403 for a foreign Origin, 415 unless the body is JSON. */
export function checkRequest(request, env) {
  const origin = request.headers.get('Origin');
  if (origin && !isAllowedOrigin(origin, request, env)) throw new HttpError(403, 'origin_not_allowed', origin);
  const type = (request.headers.get('Content-Type') || '').split(';')[0].trim().toLowerCase();
  if (type !== 'application/json') throw new HttpError(415, 'unsupported_media_type', type);
}

/** Cheap pre-check on the declared size, before anything else is read. */
export function checkDeclaredLength(request, limit) {
  const len = request.headers.get('content-length');
  if (len === null) return;
  if (!/^\d+$/.test(len.trim())) throw new HttpError(400, 'invalid_length');
  if (Number(len) > limit) throw new HttpError(413, 'body_too_large', `content-length ${len}`);
}

/** Read the body, stopping as soon as it passes the limit, then re-measure the real UTF-8 size. */
export async function readBody(request, limit) {
  checkDeclaredLength(request, limit);
  if (!request.body) return '';
  const reader = request.body.getReader();
  const chunks = [];
  let total = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > limit) {
      try { await reader.cancel(); } catch (_) { /* ignore */ }
      throw new HttpError(413, 'body_too_large', `streamed > ${limit}`);
    }
    chunks.push(value);
  }
  const buf = new Uint8Array(total);
  let off = 0;
  for (const c of chunks) { buf.set(c, off); off += c.byteLength; }
  const text = new TextDecoder().decode(buf);
  if (enc.encode(text).byteLength > limit) throw new HttpError(413, 'body_too_large', 'utf-8 length');
  return text;
}

/* --------------------------- Context allowlist -------------------------- */

const str = (v, max) => (typeof v === 'string' ? v.trim().slice(0, max) : typeof v === 'number' && Number.isFinite(v) ? String(v).slice(0, max) : undefined);
const num = (v) => (typeof v === 'number' && Number.isFinite(v) ? v : typeof v === 'string' && /^\d{1,9}(\.\d+)?$/.test(v.trim()) ? Number(v) : undefined);
const isObj = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function compact(obj) {
  const out = {};
  for (const [k, v] of Object.entries(obj)) if (v !== undefined && v !== '') out[k] = v;
  return Object.keys(out).length ? out : undefined;
}

/** Keep only the fields the prompts use; drop everything else the browser sent. */
export function pickContext(raw) {
  const c = isObj(raw) ? raw : {};
  const out = {};
  if (typeof c.today === 'string' && DATE_RE.test(c.today) && !Number.isNaN(Date.parse(c.today))) out.today = c.today;

  if (isObj(c.practice)) {
    const p = c.practice;
    out.practice = compact({ name: str(p.name, 80), town: str(p.town, 60), owner: str(p.owner, 60), ownerFull: str(p.ownerFull, 80) });
  }

  if (isObj(c.profile)) {
    const p = c.profile;
    let offers;
    if (isObj(p.offers)) {
      offers = {};
      for (const [k, v] of Object.entries(p.offers).slice(0, 12)) {
        const key = String(k).trim().slice(0, 40);
        const val = str(v, 20);
        if (key && val !== undefined) offers[key] = val;
      }
      if (!Object.keys(offers).length) offers = undefined;
    }
    out.profile = compact({
      business: str(p.business, 80),
      area: str(p.area, 60),
      type: str(p.type, 40),
      offers,
      goalWhat: str(p.goalWhat, 60),
      goalCount: num(p.goalCount),
      budget: num(p.budget),
      tone: str(p.tone, 40),
      avoid: str(p.avoid, 200),
    });
  }

  if (isObj(c.goal)) {
    const g = c.goal;
    out.goal = compact({ title: str(g.title, 120), text: str(g.text, 300), done: num(g.done), target: num(g.target) });
  }

  if (Array.isArray(c.stats)) {
    const stats = c.stats.filter((s) => typeof s === 'string').slice(0, 12).map((s) => s.trim().slice(0, 160)).filter(Boolean);
    if (stats.length) out.stats = stats;
  }

  if (Array.isArray(c.upcoming)) {
    const up = [];
    for (const e of c.upcoming.slice(0, 40)) {
      if (!isObj(e)) continue;
      const row = compact({
        date: typeof e.date === 'string' && DATE_RE.test(e.date) ? e.date : undefined,
        desc: str(e.desc, 160),
        desk: str(e.desk, 20),
        title: str(e.title, 100),
        status: str(e.status, 20),
      });
      if (row && row.title) up.push(row);
    }
    if (up.length) out.upcoming = up;
  }
  for (const k of Object.keys(out)) if (out[k] === undefined) delete out[k];
  return out;
}

/* ------------------------------- Hashing -------------------------------- */

export async function sha256(text) {
  return new Uint8Array(await crypto.subtle.digest('SHA-256', enc.encode(String(text))));
}

export async function sha256Hex(text) {
  return [...(await sha256(text))].map((b) => b.toString(16).padStart(2, '0')).join('');
}

/** Constant-time compare of two secrets via their SHA-256 digests (equal length by construction). */
export async function passcodeMatches(given, expected) {
  const [a, b] = await Promise.all([sha256(given || ''), sha256(expected || '')]);
  if (crypto.subtle && typeof crypto.subtle.timingSafeEqual === 'function') {
    return crypto.subtle.timingSafeEqual(a, b); // Cloudflare Workers runtime
  }
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

/* ---------------------------- Supabase login ---------------------------- */

const AUTH_CACHE_MS = 60 * 1000;
const AUTH_CACHE_MAX = 500;
const AUTH_TIMEOUT_MS = 5000;
const authCache = new Map(); // sha256(token) -> { userId, until }

export function authConfigured(env) {
  return Boolean(env.SUPABASE_URL && env.SUPABASE_ANON_KEY);
}

function supabaseBase(env) {
  let u;
  try {
    u = new URL(String(env.SUPABASE_URL));
  } catch (_) {
    throw new HttpError(503, 'auth_unavailable', 'SUPABASE_URL is not a URL');
  }
  const local = u.hostname === 'localhost' || u.hostname === '127.0.0.1';
  if (u.protocol !== 'https:' && !(local && env.ALLOW_LOCALHOST === '1')) {
    throw new HttpError(503, 'auth_unavailable', 'SUPABASE_URL must be https');
  }
  return u.origin;
}

function bearer(request) {
  const h = request.headers.get('Authorization') || '';
  const m = /^Bearer ([A-Za-z0-9._~+/=-]{10,4096})$/.exec(h.trim());
  return m ? m[1] : '';
}

/** Returns { userId }. Throws 401 login_required, or 503 auth_unavailable if Supabase can't be reached. */
export async function verifyUser(request, env) {
  const token = bearer(request);
  if (!token) throw new HttpError(401, 'login_required', 'no bearer token');
  const key = await sha256Hex(token);
  const now = Date.now();
  const hit = authCache.get(key);
  if (hit && hit.until > now) return { userId: hit.userId };
  if (hit) authCache.delete(key);

  const base = supabaseBase(env); // only ever from env, never from the request
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), AUTH_TIMEOUT_MS);
  let res;
  try {
    res = await fetch(`${base}/auth/v1/user`, {
      method: 'GET',
      signal: controller.signal,
      headers: { apikey: env.SUPABASE_ANON_KEY, Authorization: `Bearer ${token}` },
    });
  } catch (err) {
    throw new HttpError(503, 'auth_unavailable', `supabase fetch: ${err && err.name}`);
  } finally {
    clearTimeout(timer);
  }
  if (res.status === 401 || res.status === 403) throw new HttpError(401, 'login_required', `supabase ${res.status}`);
  if (!res.ok) throw new HttpError(503, 'auth_unavailable', `supabase ${res.status}`);
  let user;
  try {
    user = await res.json();
  } catch (_) {
    throw new HttpError(503, 'auth_unavailable', 'supabase bad json');
  }
  if (!user || typeof user.id !== 'string' || !user.id) throw new HttpError(401, 'login_required', 'no user id');

  if (authCache.size >= AUTH_CACHE_MAX) {
    for (const [k, v] of authCache) if (v.until <= now) authCache.delete(k);
    while (authCache.size >= AUTH_CACHE_MAX) authCache.delete(authCache.keys().next().value);
  }
  authCache.set(key, { userId: user.id, until: now + AUTH_CACHE_MS });
  return { userId: user.id };
}

export function _clearAuthCache() {
  authCache.clear();
}

/* ------------------------------ Access gate ----------------------------- */

/**
 * Who may call /api/chat, in order:
 *   1. Supabase login, if SUPABASE_URL + SUPABASE_ANON_KEY are set (replaces the passcode).
 *   2. DEMO_PASSCODE, if set.
 *   3. Open access only with ALLOW_OPEN=1 AND the free Workers AI provider (demo only).
 *   Otherwise: closed (401).
 * Returns { mode, userId? }.
 */
export async function checkAccess(request, env, provider) {
  if (authConfigured(env)) {
    const { userId } = await verifyUser(request, env);
    return { mode: 'login', userId };
  }
  if (env.DEMO_PASSCODE) {
    if (!(await passcodeMatches(request.headers.get('x-demo-pass'), env.DEMO_PASSCODE))) {
      throw new HttpError(401, 'unauthorised', 'wrong passcode');
    }
    return { mode: 'passcode' };
  }
  if (env.ALLOW_OPEN === '1' && provider === 'workers') return { mode: 'open' };
  throw new HttpError(401, 'access_not_configured', 'no auth, no passcode, not open');
}

/* ----------------------------- Rate limiting ---------------------------- */

export const LIMITS = { perIpPerMinute: 6, perDay: 300, perUserPerDay: 60 };

async function bump(kv, checks) {
  // KV has no atomic increment: read all, refuse if any is full, then write.
  // Counts are approximate under heavy concurrency, which is fine for a demo.
  const values = await Promise.all(checks.map((c) => kv.get(c.key)));
  const counts = values.map((v) => Number.parseInt(v || '0', 10) || 0);
  const over = checks.findIndex((c, i) => counts[i] >= c.limit);
  if (over !== -1) throw new HttpError(429, 'rate_limited', checks[over].key.split(':')[1]);
  await Promise.all(checks.map((c, i) => kv.put(c.key, String(counts[i] + 1), { expirationTtl: c.ttl })));
}

function withKv(env) {
  const kv = env.RL;
  return kv && typeof kv.get === 'function' && typeof kv.put === 'function' ? kv : null;
}

async function guarded(fn) {
  try {
    await fn();
  } catch (err) {
    if (err instanceof HttpError) throw err;
    // KV outage or the free-tier write quota: log and let the request through rather than take the app down.
    console.error('rate limit store error', err && err.message);
  }
}

/** Before auth: 6 a minute per IP, 300 a day overall. */
export async function rateLimitRequest(request, env, now = Date.now()) {
  const kv = withKv(env);
  if (!kv) return;
  const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
  const ipKey = (await sha256Hex(`ip:${ip}`)).slice(0, 24);
  const minute = Math.floor(now / 60000);
  const day = new Date(now).toISOString().slice(0, 10);
  await guarded(() => bump(kv, [
    { key: `rl:ip:${ipKey}:${minute}`, limit: LIMITS.perIpPerMinute, ttl: 120 },
    { key: `rl:day:${day}`, limit: LIMITS.perDay, ttl: 2 * 86400 },
  ]));
}

/** After login: 60 a day per signed-in user. */
export async function rateLimitUser(userId, env, now = Date.now()) {
  const kv = withKv(env);
  if (!kv || !userId) return;
  const userKey = (await sha256Hex(`user:${userId}`)).slice(0, 24);
  const day = new Date(now).toISOString().slice(0, 10);
  await guarded(() => bump(kv, [{ key: `rl:user:${userKey}:${day}`, limit: LIMITS.perUserPerDay, ttl: 2 * 86400 }]));
}
