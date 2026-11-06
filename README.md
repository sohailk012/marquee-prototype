# Backroom prototype

A clickable demo of an AI marketing team for a small business, built around a fictional dental practice (Oakmere Dental, Maidenhead). All data is made up.

**Pages**
- **Home**: a briefing, the monthly goal, the last 30 days in money and patients, a marketing calendar, Needs you, Happening now, Coming up, and a chat with the Head of Agents. Approving a plan from the chat adds it to the calendar.
- **Your team**: the org chart, using a pod model. The Head of Agents sits over three desks (Lead Gen, Social and Paid Ads). A shared Craft Bench and a Quality & Legal gate serve every desk.
- **Lead Gen**: the funnel, the enquiries board (HubSpot stages), one patient's journey end to end, how the tools connect, and attribution models.
- **Social**: a three-week content calendar, the Ideas Lab, and results.
- **Paid Ads**: budget pacing with a kill switch, suggestions with reasons, campaigns, and ads waiting for approval.

**Run locally:** `python3 -m http.server 5178 --directory prototype`, then open http://localhost:5178

Plain HTML, CSS and JavaScript with no build step: `index.html`, `styles.css`, `data.js` (all mock data) and `app.js` (views and interactions).
