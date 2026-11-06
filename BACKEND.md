# Live AI for the prototype

The prototype works without any of this. With no backend, the chat uses its scripted demo replies. Follow these steps when you want the Head of Agents chat to use real AI.

There are two ways to run it:

- **Option A (free, now):** Cloudflare's own AI, called Workers AI, which has a free daily allowance. It uses Meta's Llama 3.3 model. Good enough for demos, and it costs nothing.
- **Option B (later, paid):** Claude from Anthropic. It gives better answers and costs a few pence a message. Switch to it once the product earns money.

Both options use the same sign-in (Supabase) and the same safety limits. Moving from A to B means changing two settings. You don't need to change any code.

## What's in the folder

| File | What it does |
|---|---|
| `agents/registry.js` | The AI team: each agent, its job and its **skills** (plain-English instructions). This is the file you edit. |
| `agents/knowledge.js` | Each agent's specialist working methods. |
| `functions/api/chat.js` | The chat (`/api/chat`): Head of Agents, then the desk managers, then Quality & Legal. |
| `functions/api/health.js` | `/api/health`. Tells the page whether live AI is switched on and whether sign-in is needed. |
| `functions/_lib/providers.js` | Talks to Workers AI or Claude. |
| `functions/_lib/security.js` | Sign-in check, passcode, rate limits and request checks. |
| `functions/_lib/http.js` | Which websites may call the API, and the response headers. |
| `_headers` | Security headers for the website pages. |
| `config.js` | The page's public settings: Supabase address, public key and API address. |

Nothing needs building, and there are no packages to install.

---

## Option A: free, using Cloudflare Workers AI

### A1. Create a Cloudflare account and connect the repo

1. Sign up at https://dash.cloudflare.com/sign-up. The free plan is enough.
2. Open **Workers & Pages**, then **Create**, then **Pages**, then **Connect to Git**.
3. Authorise GitHub and pick the repo **`sohailk012/marquee-prototype`**.
4. Build settings:
   - Framework preset: **None**
   - Build command: **leave empty**
   - Build output directory: **`/`**
5. Click **Save and Deploy**. You'll get an address like `https://marquee-prototype.pages.dev`.

Cloudflare finds the `functions/` folder automatically and turns it into `/api/chat` and `/api/health`.

### A2. Switch on the AI and the rate-limit store (called "bindings")

A binding connects a Cloudflare feature to your site. You need two.

**The AI binding**
1. Open your Pages project, then **Settings**, then **Bindings**, then **Add**.
2. Choose **Workers AI**.
3. Variable name: `AI`, exactly as written.
4. Save.

**The rate-limit store** (stops anyone using up your free allowance)
1. In the left menu, open **Storage & Databases**, then **KV**, then **Create**.
2. Name it `marquee-rate-limits`.
3. Back in your Pages project, open **Settings**, then **Bindings**, then **Add**, then **KV namespace**.
4. Variable name: `RL`. Namespace: `marquee-rate-limits`.
5. Save.

Then redeploy so the changes take effect: open **Deployments**, pick the latest one, then **Retry deployment**.

To check it worked, open `https://<your-site>.pages.dev/api/health`. You should see `"provider": "workers"` and `"configured": true`.

### A3. Decide who can use the chat

The chat is **closed by default**. Nobody can use it until you pick one of these:

1. **Sign-in with Supabase (recommended).** Only people you invite can use it. Set it up as in the "Supabase setup" section below.
2. **A shared passcode.** Add a variable `DEMO_PASSCODE` (type **Secret**) with any phrase. The page asks for it once.
3. **Open to anyone, for demos only.** Add `ALLOW_OPEN` = `1`. This only works with the free Workers AI. It is ignored for Claude, so an open page can never cost you money. Anyone who finds the address can use up the day's free allowance, so turn it off after the demo.

If sign-in is set up, the passcode is ignored.

---

## Option B: later, using Claude (paid)

1. Create a key at https://console.anthropic.com, under **API keys**.
2. **Set a monthly spend limit first. This step is mandatory.** In the Anthropic console, open **Settings**, then **Limits**. For a demo, £20 to £30 a month is plenty. The limit is your guarantee that a mistake or an abuser can't run up a large bill.
3. In Cloudflare, open your Pages project, then **Settings**, then **Variables and Secrets**, then **Add**:
   - `ANTHROPIC_API_KEY`, type **Secret**, value: your key.
   - `AI_PROVIDER`, type Text, value: `anthropic`.
4. Retry the latest deployment. `/api/health` should now show `"provider": "anthropic"`.

To go back to the free option, change `AI_PROVIDER` to `workers`.

Never paste the key into any file, into the chat, or into `agents/registry.js`.

Rough cost on Claude Opus 5.5 ($4 per million tokens in, $20 per million out):

| Kind of message | Model calls | Rough cost |
|---|---|---|
| A question answered, or clarifying questions | 1 | 2p to 4p |
| An answer with ad or post wording (checked by Quality & Legal) | 2 | 4p to 8p |
| "Plan something" (Head of Agents, 1 to 3 desks, Quality & Legal) | 3 to 5 | 10p to 25p |

---

## Supabase setup (invite-only sign-in)

Supabase handles the email sign-in, so the backend never sees or stores a password.

1. **Create a project.** Sign up at https://supabase.com, then click **New project**. The free plan is fine. Choose a region near you, such as London.
2. **Make it invite-only.** Open **Authentication**, then **Sign In / Providers**, and turn **off** "Allow new users to sign up". Leave Email switched on.
3. **Invite people.** Open **Authentication**, then **Users**, then **Add user**, then **Send invitation**, and enter their email. They get a link to set a password. Start with just yourself.
4. **Tell Supabase where your site lives.** Open **Authentication**, then **URL Configuration**:
   - **Site URL:** `https://marquee-prototype.pages.dev`
   - **Redirect URLs:** add both of these:
     - `https://marquee-prototype.pages.dev/**`
     - `https://sohailk012.github.io/**`
5. **Copy two values** from **Project Settings**, then **API**:
   - the **Project URL**, which looks like `https://abcd1234.supabase.co`
   - the **anon public** key. Never use the `service_role` key anywhere.
6. **Put them in Cloudflare.** In your Pages project, open **Settings**, then **Variables and Secrets**, and add:
   - `SUPABASE_URL`: the Project URL
   - `SUPABASE_ANON_KEY`: the anon public key
7. **Put the same two values in `prototype/config.js`,** in the `supabaseUrl` and `supabaseAnonKey` fields.
   - If the page is served from Cloudflare Pages, leave `apiBase` empty.
   - On GitHub Pages, set `apiBase` to your Cloudflare address, for example `https://marquee-prototype.pages.dev`.
8. Retry the latest Cloudflare deployment. `/api/health` should now show `"authRequired": true`.

The anon key is designed to be public, which is why it can sit in `config.js`. The security comes from invite-only sign-up and from the server checking every request with Supabase.

---

## All the settings in one place

**Bindings** (Pages project, then **Settings**, then **Bindings**)

| Name | Type | What it does |
|---|---|---|
| `AI` | Workers AI | The free AI model (Option A). |
| `RL` | KV namespace | Rate limits. Strongly recommended. |

**Variables** (Pages project, then **Settings**, then **Variables and Secrets**)

| Name | Type | Default | What it does |
|---|---|---|---|
| `AI_PROVIDER` | Text | `workers` if `AI` exists and there's no Anthropic key, otherwise `anthropic` | Which AI to use: `workers` or `anthropic`. |
| `WORKERS_MODEL` | Text | `@cf/meta/llama-3.3-70b-instruct-fp8-fast` | Which Workers AI model to use. |
| `ANTHROPIC_API_KEY` | Secret | none | Claude key (Option B only). |
| `MODEL` | Text | `claude-opus-5-5` | Which Claude model to use. |
| `HEAD_EFFORT` / `DESK_EFFORT` / `QUALITY_EFFORT` | Text | `low` / `medium` / `low` | How hard each Claude step thinks. |
| `SUPABASE_URL` | Text | none | Supabase Project URL. Turns on required sign-in. |
| `SUPABASE_ANON_KEY` | Text | none | Supabase anon public key. |
| `DEMO_PASSCODE` | Secret | none | Shared passcode. Ignored when sign-in is on. |
| `ALLOW_OPEN` | Text | off | `1` = no sign-in needed. Demo only, and Workers AI only. |
| `ALLOWED_ORIGINS` | Text | none | Extra websites allowed to call the API, separated by commas. `https://sohailk012.github.io` and the Pages site itself are always allowed. |
| `ALLOW_LOCALHOST` | Text | off | `1` = allow `http://localhost` pages to call the API. Use it only on your own computer. |

**Built-in limits** (they need the `RL` binding)

- 6 messages a minute from one internet address
- 300 messages a day in total
- 60 messages a day per signed-in person

When a limit is hit, the chat replies `rate_limited` and the page falls back to the scripted demo. The limits reset by themselves.

---

## Free-tier limits (approximate)

These numbers are approximate and change from time to time. Check the current pricing pages before relying on them.

- **Workers AI:** 10,000 "neurons" a day for free, reset at midnight UTC. Llama 3.3 70B costs about 27,000 neurons per million input tokens and about 205,000 per million tokens out. Roughly:
  - a simple question costs about 200 neurons, so about 50 a day
  - a full "plan something" costs about 1,500 neurons, so about 6 a day

  When the allowance runs out, the chat replies `daily_limit_reached` until midnight UTC. More capacity needs the Workers Paid plan (about $5 a month, then pay per use). See https://developers.cloudflare.com/workers-ai/platform/pricing/
- **Workers KV** (rate limits): about 100,000 reads and **1,000 writes a day** free. Each chat message uses 2 to 3 writes, so the 300-a-day cap fits. If the write allowance runs out, the rate limits stop counting but the chat keeps working. See https://developers.cloudflare.com/kv/platform/pricing/
- **Cloudflare Pages Functions:** about 100,000 requests a day free.
- **Supabase free plan:** about 50,000 monthly active users. A free project pauses after about a week with no activity; you can restart it from the dashboard. Supabase's built-in email sender only sends a few emails an hour, which is fine for a handful of invites. See https://supabase.com/pricing

---

## Test on your own computer

You need Node.js installed (https://nodejs.org, the LTS version).

```bash
cd prototype
cp .dev.vars.example .dev.vars      # then fill in the values you want to test
npx wrangler pages dev . --ai=AI --kv=RL
```

- No `wrangler.toml` is needed. The `--ai` and `--kv` flags create the bindings locally.
- Running the AI locally still uses your Cloudflare account's allowance.
- To call the API from a page served on `localhost`, put `ALLOW_LOCALHOST=1` in `.dev.vars`.
- For a quick local test without sign-in, put `ALLOW_OPEN=1` in `.dev.vars`.
- `.dev.vars`, `.env` and `.wrangler/` are ignored by git (see `prototype/.gitignore`), so your secrets stay on your machine.

## Add or change a skill

1. Open `prototype/agents/registry.js`. On GitHub you can click the pencil icon to edit it in the browser.
2. Find the agent, for example by searching for `Social Manager`.
3. In its `skills: [ ... ]` list, copy one skill block and paste it below:

   ```js
   {
     name: 'Google reviews',
     instructions: `Ask happy patients for a Google review by text the day after treatment finishes. Never offer anything in return for a review, and never write or edit reviews for them (DMCC Act 2024).`,
   },
   ```

4. Write the instructions the way you'd brief a new member of staff.
5. Commit the change. Cloudflare redeploys in about a minute.

Tips:
- Keep each skill to one topic.
- Don't type a backtick ( ` ) inside the instructions.
- The file is public with the website, so never put passwords, keys or real patient details in it.

---

## For whoever maintains it

### Request

`POST /api/chat`

- **Headers:**
  - `Content-Type: application/json` (required; anything else returns 415)
  - `Authorization: Bearer <Supabase access_token>` when sign-in is on
  - otherwise, `x-demo-pass: <passcode>` when a passcode is set
- **Body (64 KB max):** `{ messages: [{ role: 'user'|'assistant', content }], context? }`
  - up to 20 messages of up to 2,000 characters each, and the last one must be from the user
- **`context`:** only these fields are kept, and everything else is dropped:
  - `today` (YYYY-MM-DD)
  - `practice{name,town,owner,ownerFull}`
  - `profile{business,area,type,offers,goalWhat,goalCount,budget,tone,avoid}`
    - `offers`: up to 12 name→price pairs, prices of 20 characters or fewer
    - `avoid`: 200 characters or fewer
  - `goal{title,text,done,target}`
  - `stats`: up to 12 strings of 160 characters or fewer
  - `upcoming`: up to 40 of `{date,desc?,desk,title,status}`

### Order of checks

1. Origin (403)
2. Content type (415)
3. Declared size (413)
4. Rate limits per IP and per day (429)
5. Sign-in, passcode or open access (401 or 503)
6. Rate limit per user (429)
7. Provider configured (503)
8. Real body size (413) and validation (400)

### Response

`{ reply, plan?: { intro, rows: [{desk, what, why, title, date}] }, questions?, agents, checks?, reviewed?, unavailableDesks? }`

Errors are always just `{ error: code }`. Details go only to `console.error` (Cloudflare's function logs).

| Status | Codes |
|---|---|
| 400 | `invalid_json`, `invalid_length`, `messages_required`, `too_many_messages`, `invalid_message`, `message_too_long`, `last_message_must_be_user`, `invalid_context` |
| 401 | `login_required` (sign-in on; token missing or invalid), `unauthorised` (wrong passcode), `access_not_configured` (no sign-in, passcode or open mode set: closed by default) |
| 403 | `origin_not_allowed` |
| 413 | `body_too_large` |
| 415 | `unsupported_media_type` |
| 429 | `rate_limited` (with `Retry-After: 60`) |
| 500 | `upstream_error`, `model_refused`, `model_output_truncated`, `model_bad_json`, `no_plan`, `server_error` |
| 503 | `not_configured`, `auth_unavailable` (Supabase unreachable), `upstream_busy`, `upstream_timeout`, `upstream_unreachable`, `daily_limit_reached` (Workers AI free allowance used up) |

On any error the page should fall back to the scripted demo, and on 401 `login_required` it should show sign-in.

### `GET /api/health`

`{ ok, configured, provider: 'workers'|'anthropic', model, passcodeRequired, authRequired }`

### How the chat works

1. The **Head of Agents** answers, asks up to 3 clarifying questions, or briefs desks.
2. The briefed **desk managers** run in parallel. Each proposes up to 4 calendar rows with a reason.
3. **Quality & Legal** reviews all rows in one pass.

Output limits:
- Workers AI: head 1,500 tokens; desks and Quality 2,500 each
- Claude: head 4,000 tokens; desks and Quality 2,500 each

### Sign-in check

The server calls `GET {SUPABASE_URL}/auth/v1/user` with `apikey: SUPABASE_ANON_KEY` and the user's bearer token.
- `SUPABASE_URL` only ever comes from the environment and must be `https`.
- A successful check is cached in memory for 60 seconds, keyed by a SHA-256 hash of the token.

### Rate limits

- They use KV keys that expire by themselves:
  - per IP per minute: 2-minute lifetime, with the IP hashed
  - per day: 2-day lifetime
  - per user per day: 2-day lifetime
- KV has no atomic counter, so the counts are approximate when many requests arrive at the same moment.
- If KV fails, the error is logged and the request is allowed.

### Workers AI details (checked against Cloudflare's docs, 6 Nov 2026)

- **Binding:** the call is `env.AI.run(model, { messages, max_tokens, response_format })`. In the dashboard it is added under Settings, then Bindings, then Workers AI. Locally, use `wrangler pages dev --ai=AI`.
- **Model and context:** `@cf/meta/llama-3.3-70b-instruct-fp8-fast` exists and has a 24,000-token context window. Its default `max_tokens` is 256, so the code always sets it.
- **JSON mode:**
  - It is requested with `response_format: { type: 'json_schema', json_schema: <schema> }`. This model is first on the JSON Mode supported list, along with `llama-3.1-8b-instruct`, `llama-3-8b-instruct`, `hermes-2-pro-mistral-7b`, `deepseek-coder-6.7b-instruct-awq` and `deepseek-r1-distill-qwen-32b`.
  - The answer comes back in `response`. That is an object in JSON mode and a string otherwise, and the code accepts both.
  - Cloudflare says JSON mode can fail with "JSON Mode couldn't be met". When that happens, the code retries once without it and pulls the first `{...}` block out of the text.
  - JSON mode doesn't support streaming, and we don't stream.
- **Free allowance:** 10,000 neurons a day, reset at midnight UTC. This model costs 26,668 neurons per million input tokens and 204,805 per million output tokens.
- **Smaller prompts for Llama:**
  - each agent's know-how is cut to about 8,000 characters, with the rest as one-line summaries
  - the client context is cut to 5,000 characters
  - the chat history is cut to the latest 8,000 characters

### Security headers

`_headers` sets these on the website pages:
- CSP
- `X-Content-Type-Options`
- `Referrer-Policy`
- `Permissions-Policy`
- COOP
- `X-Frame-Options`

Pages doesn't apply `_headers` to Functions, so `/api/*` responses set `Cache-Control: no-store`, `nosniff`, `X-Frame-Options` and a locked-down CSP in code.
