# Live AI for the prototype (Cloudflare Pages)

The prototype works without any of this: the chat falls back to its scripted demo. Follow these steps when you want the Head of Agents chat to use real AI (Claude).

## What's in the folder

| File | What it does |
|---|---|
| `agents/registry.js` | The AI team: each agent, its job and its **skills** (plain-English instructions). This is the file you edit. |
| `functions/api/chat.js` | The chat endpoint (`/api/chat`). Head of Agents → desk managers → Quality & Legal. |
| `functions/api/health.js` | `/api/health`. Tells the page whether live AI is switched on. |
| `.dev.vars.example` | Template for your local secrets file. |

Nothing needs building and there are no packages to install for the site itself.

## 1. Create a Cloudflare account

Go to https://dash.cloudflare.com/sign-up and sign up (the free plan is enough).

## 2. Connect the GitHub repo

1. In the Cloudflare dashboard, open **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.
2. Authorise GitHub and pick the repo **`sohailk012/marquee-prototype`** (if you rename it later, reconnect or update it in the project settings).
3. Build settings:
   - Framework preset: **None**
   - Build command: **leave empty**
   - Build output directory: **`/`**
4. Click **Save and Deploy**. You'll get an address like `https://marquee-prototype.pages.dev`.

The repo's root is the contents of the `prototype/` folder, so Cloudflare finds `functions/` automatically and turns it into `/api/chat` and `/api/health`.

## 3. Add your Anthropic API key (encrypted)

1. Get a key at https://console.anthropic.com → **API keys**. Set a monthly spend limit there too (for a demo, £20 to £30 is plenty).
2. In Cloudflare: your Pages project → **Settings** → **Variables and Secrets** → **Add**.
3. Name: `ANTHROPIC_API_KEY`, type **Secret** (encrypted), value: your key. Add it for **Production** (and **Preview** if you use preview links).
4. Redeploy (Deployments → the latest one → **Retry deployment**) so the new setting is picked up.

Never paste the key into any file in the repo, into the chat, or into `agents/registry.js`.

Check it worked: open `https://<your-site>.pages.dev/api/health`. You should see `"configured": true`.

## 4. Optional: a demo passcode

So strangers can't run up your bill, add a second variable `DEMO_PASSCODE` (type Secret) with any word you like. The chat then only answers requests that send that passcode (the page sends it in an `x-demo-pass` header). Share it only with people you're demoing to. `/api/health` shows `"passcodeRequired": true` when it's on.

Other optional settings (plain text variables):

| Name | Default | What it does |
|---|---|---|
| `MODEL` | `claude-opus-5-5` | Which Claude model to use. |
| `ALLOWED_ORIGINS` | (none) | Extra websites allowed to call the API, comma separated. `https://sohailk012.github.io` and localhost are always allowed. |
| `HEAD_EFFORT` / `DESK_EFFORT` / `QUALITY_EFFORT` | `low` / `medium` / `low` | How hard each step thinks: `low`, `medium`, `high`. Higher is slower and costs more. |

## 5. Test on your own computer

You need Node.js installed (https://nodejs.org, the LTS version).

```bash
cd prototype
cp .dev.vars.example .dev.vars      # then open .dev.vars and paste your key after ANTHROPIC_API_KEY=
npx wrangler pages dev .
```

Open the address it prints (usually http://localhost:8788). `.dev.vars` is ignored by git, so your key stays on your machine. Leave `ANTHROPIC_API_KEY=` empty to test the scripted fallback.

## 6. What a chat message costs (rough)

Using Claude Opus 5.5 ($4 per million tokens in, $20 per million out):

| Kind of message | Model calls | Rough cost |
|---|---|---|
| A question the Head of Agents answers, or clarifying questions | 1 | 2p to 4p |
| An answer that includes ad or post wording (checked by Quality & Legal) | 2 | 4p to 8p |
| "Plan something" (Head of Agents + 1 to 3 desks + Quality & Legal) | 3 to 5 | 12p to 30p |

A 20-minute demo with a dozen messages is usually under £2. Plans take roughly 15 to 30 seconds.

## 7. Add or change a skill

1. Open `prototype/agents/registry.js` (on GitHub you can click the pencil icon to edit it in the browser).
2. Find the agent, for example search for `Social Manager`.
3. In its `skills: [ ... ]` list, copy one skill block and paste it below:

   ```js
   {
     name: 'Google reviews',
     instructions: `Ask happy patients for a Google review by text the day after treatment finishes. Never offer anything in return for a review, and never write or edit reviews for them (DMCC Act 2024).`,
   },
   ```

4. Write the instructions the way you'd brief a new member of staff: what good looks like, rules of thumb, what to avoid.
5. Commit the change. Cloudflare redeploys in about a minute and the agent uses the new skill from the next message.

Tips:
- Keep each skill to one topic and a short paragraph or a few bullet lines.
- Don't type a backtick ( ` ) inside the instructions. Apostrophes and quotes are fine.
- The file is public with the website. No passwords, keys or real patient details.
- Quality & Legal skills are checks to catch common problems, not legal advice.

## How the chat works (for whoever maintains it)

`POST /api/chat` with `{ messages: [{role, content}], context?: { today, practice, goal, stats, upcoming } }`.

1. **Head of Agents** decides to answer, ask up to 3 clarifying questions, or brief desks.
2. Briefed **desk managers** run in parallel and each propose up to 4 calendar rows with a reason.
3. **Quality & Legal** reviews all rows in one pass, rewrites wording if needed and lists its checks.

Response: `{ reply, plan?: { intro, rows: [{desk, what, why, title, date}] }, questions?, agents, checks?, reviewed?, unavailableDesks? }`.
Errors: `{ error }` with 400 (bad request), 401 (wrong passcode), 500, or 503 (`not_configured` when there is no key; `upstream_busy` / `upstream_timeout` when Claude is busy). On any error the page should fall back to the scripted demo.
