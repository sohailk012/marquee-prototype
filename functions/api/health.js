/* GET /api/health: tells the frontend whether live AI is available.
 * { ok: true, configured: boolean, model: string, passcodeRequired: boolean }
 * Never returns the key or the passcode. */

import { DEFAULT_MODEL, corsHeaders, json } from './chat.js';

export async function onRequestGet({ request, env }) {
  env = env || {};
  return json(
    {
      ok: true,
      configured: Boolean(env.ANTHROPIC_API_KEY),
      model: env.MODEL || DEFAULT_MODEL,
      passcodeRequired: Boolean(env.DEMO_PASSCODE),
    },
    200,
    request,
    env,
  );
}

export async function onRequestOptions({ request, env }) {
  return new Response(null, { status: 204, headers: corsHeaders(request, env || {}) });
}
