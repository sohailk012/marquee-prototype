# Marquee prototype

A clickable demo of an AI marketing team for a small business, built around a fictional dental practice (Oakmere Dental, Maidenhead). All data is made up.

**Pages**
- **Home** has two layouts to compare, switched at the top:
  - **Today**: one approval card at a time, showing the real post or ad, then Coming up tiles, results told as a sentence, and a live team ticker.
  - **Creative wall**: the month as a mood board. Drag tiles between days.
  - Both include the Head of Agents chat. Approving a plan adds it to the calendar.
- **Your team**: the org chart, using a pod model. The Head of Agents sits over three desks (Lead Gen, Social and Paid Ads). A shared Craft Bench and a Quality & Legal gate serve every desk.
- **Lead Gen**: the funnel, the enquiries board (HubSpot stages), one patient's journey end to end, how the tools connect, and attribution models.
- **Social**: an Instagram grid preview, upcoming post tiles, the Ideas Lab ("Use this idea") and results.
- **Paid Ads**: budget pacing with a kill switch, suggestions with reasons, campaigns, and ads waiting for approval.

**Run locally:** `python3 -m http.server 5178 --directory prototype`, then open http://localhost:5178

Plain HTML, CSS and JavaScript with no build step: `index.html`, `styles.css`, `data.js` (all mock data) and `app.js` (views and interactions).

**Live AI chat:** `functions/api/chat.js` runs on Cloudflare Pages and calls Claude. Agent skills live in `agents/registry.js`. Setup is in `BACKEND.md`. Without the backend, as on GitHub Pages, the chat uses scripted demo replies.
