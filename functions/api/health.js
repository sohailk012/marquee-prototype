/* GET /api/health: tells the frontend whether live AI is available.
 * { ok: true, configured, provider, model, passcodeRequired, authRequired }
 * Never returns keys, the passcode or any Supabase details. */

import { json, options } from '../_lib/http.js';
import { providerInfo } from '../_lib/providers.js';
import { authConfigured } from '../_lib/security.js';

export async function onRequestGet({ request, env }) {
  env = env || {};
  const { provider, model, configured } = providerInfo(env);
  const authRequired = authConfigured(env);
  return json(
    {
      ok: true,
      configured,
      provider,
      model,
      // Login replaces the passcode when Supabase is configured.
      passcodeRequired: !authRequired && Boolean(env.DEMO_PASSCODE),
      authRequired,
    },
    200,
    request,
    env,
  );
}

export async function onRequestOptions({ request, env }) {
  return options(request, env || {});
}
