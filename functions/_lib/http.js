/* Shared HTTP helpers for the Pages Functions: CORS, JSON responses, errors.
 * This module has no onRequest exports, so Pages does not turn it into a route. */

export const DEFAULT_ORIGINS = ['https://sohailk012.github.io'];
const LOCAL_ORIGIN_RE = /^http:\/\/(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/;

export class HttpError extends Error {
  /** detail is only logged, never sent to the browser. */
  constructor(status, code, detail) {
    super(code);
    this.status = status;
    this.code = code;
    this.detail = detail;
  }
}

function sameOrigin(request) {
  try {
    return new URL(request.url).origin;
  } catch (_) {
    return '';
  }
}

/** True if this Origin may call the API. Same-origin (the Pages site itself) is always allowed. */
export function isAllowedOrigin(origin, request, env = {}) {
  if (!origin) return false;
  if (origin === sameOrigin(request)) return true;
  const extra = String(env.ALLOWED_ORIGINS || '')
    .split(',')
    .map((s) => s.trim().replace(/\/+$/, ''))
    .filter(Boolean);
  if ([...DEFAULT_ORIGINS, ...extra].includes(origin)) return true;
  return env.ALLOW_LOCALHOST === '1' && LOCAL_ORIGIN_RE.test(origin);
}

export function corsHeaders(request, env = {}) {
  const origin = request.headers.get('Origin') || '';
  const h = {
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-demo-pass',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  };
  if (isAllowedOrigin(origin, request, env)) h['Access-Control-Allow-Origin'] = origin;
  return h;
}

// _headers does not apply to Functions responses, so the API sets its own.
const API_SECURITY_HEADERS = {
  'Cache-Control': 'no-store',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'no-referrer',
  'X-Frame-Options': 'DENY',
  'Content-Security-Policy': "default-src 'none'; frame-ancestors 'none'",
};

export function json(data, status, request, env, extra = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      ...API_SECURITY_HEADERS,
      ...corsHeaders(request, env || {}),
      ...extra,
    },
  });
}

export function options(request, env) {
  return new Response(null, { status: 204, headers: { ...API_SECURITY_HEADERS, ...corsHeaders(request, env || {}) } });
}
