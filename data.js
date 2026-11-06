/* Mock data for the prototype. Everything here is fictional: the practice,
   the people and the numbers. No real client data. */

window.DATA = {
  today: '2026-11-06',
  product: 'Marquee',
  practice: { name: 'Oakmere Dental', town: 'Maidenhead', owner: 'Maya', ownerFull: 'Dr Maya Patel' },
  manager: { name: 'Sam', role: 'Your account manager' },

  goal: {
    title: 'November goal',
    text: '40 Invisalign and implant consultations',
    done: 12, target: 40, expectedByToday: 8,
  },

  desks: {
    lead: { name: 'Lead Gen', short: 'Lead Gen', route: 'lead' },
    social: { name: 'Social', short: 'Social', route: 'social' },
    ads: { name: 'Paid Ads', short: 'Paid Ads', route: 'ads' },
    bench: { name: 'Craft Bench' },
    quality: { name: 'Quality & Legal' },
  },

  /* ---------- Home ---------- */
  stats: [
    { label: 'New enquiries', value: '186', delta: '+18%', good: true, note: 'vs previous 30 days' },
    { label: 'Consultations booked', value: '61', delta: '+11%', good: true, note: '33% of enquiries' },
    { label: 'Treatment accepted', value: '£48,600', delta: '+23%', good: true, note: '23 patients' },
    { label: 'Cost per consultation', value: '£38', delta: '−£6', good: true, note: 'across all ads' },
  ],

  weeklyEnquiries: [
    { wk: '14 Sep', v: 31 }, { wk: '21 Sep', v: 28 }, { wk: '28 Sep', v: 35 }, { wk: '5 Oct', v: 33 },
    { wk: '12 Oct', v: 39 }, { wk: '19 Oct', v: 42 }, { wk: '26 Oct', v: 47 }, { wk: '2 Nov', v: 51 },
  ],

  sources: [
    { name: 'Google Search ads', v: 71 },
    { name: 'Instagram & Facebook (organic)', v: 38 },
    { name: 'Meta lead ads', v: 33 },
    { name: 'Website & Google profile', v: 27 },
    { name: 'Patient referrals', v: 17 },
  ],

  needsYou: [
    { id: 'n1', desk: 'social', title: 'Approve the implant consultation carousel',
      why: '5 slides that walk a nervous patient through the first visit. Proofread and checked against ad rules.',
      kind: 'approve', calId: 'c6' },
    { id: 'n2', desk: 'ads', title: 'Move £150 from Meta to Google Search',
      why: 'Search is booking consultations at £29 each. Meta is at £52. Same total spend.',
      kind: 'approve', calId: 'c20' },
    { id: 'n3', desk: 'lead', title: '4 enquiries waiting over 2 hours for a call',
      why: 'They had the instant text. Leah (your treatment coordinator) should call them before 5pm.',
      kind: 'task' },
    { id: 'n4', desk: 'social', title: 'Upload photos from Tuesday’s team shoot',
      why: 'Needed for the “Meet the nurses” post on 11 November.',
      kind: 'upload' },
  ],

  happeningNow: [
    { desk: 'ads', who: 'Paid Ads', what: 'Writing 6 headline options for the Invisalign Open Evening' },
    { desk: 'lead', who: 'Lead Gen', what: 'Re-scoring 38 enquiries from October that went quiet' },
    { desk: 'social', who: 'Social', what: 'Cutting a 20-second Reel from the hygienist interview' },
  ],

  /* ---------- Calendar ---------- */
  calendar: [
    { id: 'c1', date: '2026-11-02', desk: 'social', title: 'Meet Dr Patel (Reel)', status: 'done', detail: '28-second intro filmed in surgery 2. Reached 4,180 people, 61 saves.' },
    { id: 'c2', date: '2026-11-03', desk: 'lead', title: 'Instant text reply goes live', status: 'done', detail: 'Every new enquiry gets a text within 2 minutes with a booking link. Median reply time dropped from 3h 10m to 2 minutes.' },
    { id: 'c3', date: '2026-11-04', desk: 'social', title: '3 Invisalign myths (Reel)', status: 'done', detail: 'Talking-head format. Best performer this month: 9,420 reach, 212 saves, 14 profile link taps.' },
    { id: 'c4', date: '2026-11-05', desk: 'ads', title: 'New implant lead ad creative', status: 'done', detail: 'Two new images on the Meta lead form. Early read in 7 days.' },
    { id: 'c5', date: '2026-11-01', desk: 'ads', title: 'Google Search: Invisalign (always on)', status: 'live', detail: '£22 a day on “Invisalign Maidenhead” and nearby searches. 31 consultations in the last 30 days.' },
    { id: 'c6', date: '2026-11-06', desk: 'social', title: 'Implant consultation carousel', status: 'needs', detail: '5 slides: what happens at the first visit, how long it takes, costs explained, finance, how to book.' },
    { id: 'c7', date: '2026-11-09', desk: 'social', title: 'A day at Oakmere (Reel)', status: 'scheduled', detail: 'Behind-the-scenes, 30 seconds, no patients shown.' },
    { id: 'c20', date: '2026-11-09', desk: 'ads', title: 'Shift £150 to Google Search', status: 'needs', detail: 'Waiting for your approval. Moves budget from Meta lead ads (£52 per consultation) to Search (£29).' },
    { id: 'c8', date: '2026-11-10', desk: 'lead', title: 'Nurture email 2: paying monthly', status: 'scheduled', detail: 'Goes to 64 people who had a consultation but haven’t decided. Explains 0% finance in plain English.' },
    { id: 'c9', date: '2026-11-11', desk: 'social', title: 'Meet the nurses (carousel)', status: 'blocked', detail: 'Waiting for the team shoot photos.' },
    { id: 'c10', date: '2026-11-12', desk: 'lead', title: 'Referral ask to October patients', status: 'drafting', detail: 'Short thank-you text to 41 patients who finished treatment in October, with a refer-a-friend link.' },
    { id: 'c11', date: '2026-11-13', desk: 'social', title: 'Why we don’t do Black Friday', status: 'drafting', detail: 'Honest post: health care isn’t a flash sale, but here’s how 0% finance works.' },
    { id: 'c12', date: '2026-11-16', desk: 'ads', title: 'Open Evening ads go live', status: 'drafting', detail: 'Meta and Google ads for the 19 November Invisalign Open Evening. £15 a day for 3 days.' },
    { id: 'c13', date: '2026-11-17', desk: 'social', title: 'Whitening vs veneers (Reel)', status: 'idea', detail: 'From the Ideas Lab: comparison videos are getting 2× the saves in dental this month.' },
    { id: 'c14', date: '2026-11-19', desk: 'lead', title: 'Invisalign Open Evening, 6 to 8pm', status: 'scheduled', detail: '12 free scans. 7 booked so far. Reminder texts at 24 hours and 2 hours.' },
    { id: 'c15', date: '2026-11-20', desk: 'social', title: 'Open Evening highlights (Stories)', status: 'idea', detail: 'Live Stories on the night, with consent from anyone shown.' },
    { id: 'c16', date: '2026-11-23', desk: 'ads', title: 'Creative test: video vs photo', status: 'idea', detail: 'Same offer, two formats, £10 a day each for 7 days.' },
    { id: 'c17', date: '2026-11-24', desk: 'lead', title: 'Win back 2025 no-shows', status: 'drafting', detail: '29 people booked a consultation last year and didn’t come. Gentle check-in email.' },
    { id: 'c18', date: '2026-11-25', desk: 'social', title: 'Patient story: Jo’s smile', status: 'drafting', detail: 'Written consent on file. Real photos only, no filters, no promised results.' },
    { id: 'c19', date: '2026-11-26', desk: 'lead', title: 'Monthly results call with Sam', status: 'scheduled', detail: '30 minutes. Money in, cost per patient, what we change in December.' },
    { id: 'c21', date: '2026-11-27', desk: 'social', title: 'Ask the dentist: implants (Reel)', status: 'idea', detail: 'Top 3 questions from this month’s enquiries, answered by Dr Patel.' },
    { id: 'c22', date: '2026-11-30', desk: 'ads', title: 'Pause Open Evening ads', status: 'scheduled', detail: 'Automatic. Budget goes back to Search.' },
    { id: 'c23', date: '2026-11-30', desk: 'lead', title: 'December plan ready for you', status: 'scheduled', detail: 'New year smile campaign. The Head of Agents will bring it with the reasons.' },
  ],

  /* ---------- Team (pod model) ---------- */
  team: {
    head: { id: 'head', name: 'Head of Agents', job: 'Your one point of contact. Asks you the right questions, briefs the desks, and brings plans back with the reasons.', now: 'Preparing the December plan', state: 'working' },
    human: { id: 'sam', name: 'Sam', job: 'Your human account manager. Checks the team’s work, joins your monthly results call, and is on WhatsApp if anything feels off.', now: 'Reviewing this week’s approvals', state: 'working' },
    desks: [
      {
        id: 'lead', name: 'Lead Gen', owns: 'Consultations booked and treatment accepted',
        manager: { id: 'm-lead', name: 'Lead Gen Manager', job: 'Owns the numbers: enquiries, consultations booked, cost per patient. Decides where effort goes each week.', now: 'Checking pace against the November goal', state: 'working' },
        crew: [
          { id: 'opp', name: 'Opportunity Analyst', job: 'Finds and tests new sources of patients: referral schemes, local partners, events.', now: 'Comparing Open Evening sign-ups by source', state: 'working' },
          { id: 'aud', name: 'Audience Researcher', job: 'Defines who we are after (personas, postcodes, treatments) and what makes them ready to book.', now: 'Idle', state: 'idle' },
          { id: 'cap', name: 'Enquiry Capture', job: 'Looks after every way in: website forms, Meta and Google lead forms, calls, Instagram DMs. Makes sure nothing is lost.', now: 'Always on', state: 'always' },
          { id: 'stl', name: 'Speed-to-Lead', job: 'Replies to every new enquiry within 2 minutes by text and email, with a booking link.', now: 'Always on', state: 'always' },
          { id: 'score', name: 'Scoring & Routing', job: 'Scores each enquiry (treatment, distance, timing, finance) and sends the hot ones to Leah first.', now: 'Re-scoring quiet October enquiries', state: 'working' },
          { id: 'nur', name: 'Nurture', job: 'Keeps in touch with people who aren’t ready yet, with helpful emails, not hard sells.', now: 'Email 2 scheduled for 10 Nov', state: 'working' },
          { id: 'crm', name: 'CRM Keeper', job: 'Keeps HubSpot clean: removes duplicates, fills gaps, keeps stages honest.', now: 'Always on', state: 'always' },
          { id: 'attr', name: 'Attribution Analyst', job: 'Works out which channels actually bring paying patients, and what each one costs.', now: 'Idle', state: 'idle' },
          { id: 'ops', name: 'Ops Coordinator', job: 'Watches the handoffs: late call-backs, broken forms, no-shows, stalled plans.', now: 'Flagged 4 late call-backs', state: 'needs' },
        ],
      },
      {
        id: 'social', name: 'Social', owns: 'Reach, saves and enquiries from social',
        manager: { id: 'm-social', name: 'Social Manager', job: 'Plans the monthly content calendar around the practice’s goals, not vanity numbers.', now: 'Waiting on your carousel approval', state: 'needs' },
        crew: [
          { id: 'plan', name: 'Content Planner', job: 'Turns goals and questions patients ask into a weekly mix of Reels, carousels and Stories.', now: 'Drafting the December themes', state: 'working' },
          { id: 'trend', name: 'Ideas Lab', job: 'Four watchers on Reels, TikTok and Shorts who report what is working in dental this week.', now: 'Weekly report ready', state: 'working' },
          { id: 'comm', name: 'Community', job: 'Drafts replies to comments and DMs. Anything clinical or negative comes to you first.', now: 'Always on', state: 'always' },
          { id: 'sched', name: 'Scheduler', job: 'Posts at the right times once you approve. In this version you press publish.', now: '3 posts queued', state: 'working' },
        ],
      },
      {
        id: 'ads', name: 'Paid Ads', owns: 'Cost per consultation and spend',
        manager: { id: 'm-ads', name: 'Paid Ads Manager', job: 'Decides where the ad money goes, and moves it when the numbers say so (with your OK).', now: 'Proposed a £150 budget shift', state: 'needs' },
        crew: [
          { id: 'google', name: 'Google Ads Buyer', job: 'Runs Search: keywords, bids, negative keywords, ad text tests.', now: 'Writing Open Evening headlines', state: 'working' },
          { id: 'meta', name: 'Meta Ads Buyer', job: 'Runs Facebook and Instagram lead ads and audiences.', now: 'Watching the new implant creative', state: 'working' },
          { id: 'guard', name: 'Budget Guard', job: 'Checks spend every hour against your caps. Can pause everything in one go.', now: 'Always on', state: 'always' },
          { id: 'track', name: 'Conversion Tracking', job: 'Sends booked and accepted treatments back to Google and Meta so they learn who is worth finding.', now: 'Always on', state: 'always' },
        ],
      },
    ],
    later: ['Email & SMS', 'Reviews & Google profile', 'SEO & Website', 'Outdoor & Print'],
    bench: [
      { id: 'copy', name: 'Copywriter', job: 'Writes every word in the practice’s voice, for every desk.', now: 'Open Evening ad text', state: 'working' },
      { id: 'design', name: 'Designer', job: 'Carousels, ad images and templates in the Oakmere look.', now: 'Idle', state: 'idle' },
      { id: 'video', name: 'Video Editor', job: 'Cuts Reels and ads from the footage you upload.', now: 'Hygienist interview Reel', state: 'working' },
      { id: 'research', name: 'Researcher', job: 'Competitors, local prices, what patients search for.', now: 'Idle', state: 'idle' },
      { id: 'analyst', name: 'Analyst', job: 'Pulls the numbers together for every desk and for your monthly call.', now: 'Weekly numbers', state: 'working' },
    ],
    quality: [
      { id: 'proof', name: 'Proofreader', job: 'Spelling, grammar, facts, prices.', now: 'Always on', state: 'always' },
      { id: 'voice', name: 'Brand Voice', job: 'Makes sure it sounds like Oakmere, not like an advert.', now: 'Always on', state: 'always' },
      { id: 'adrules', name: 'Ad Rules', job: 'Checks against the CAP Code, ASA guidance for health claims and GDC advertising guidance. No promised results, no prescription-only medicines.', now: 'Always on', state: 'always' },
      { id: 'privacy', name: 'Privacy & Consent', job: 'UK GDPR and PECR: consent to text and email, opt-outs, patient photo consent.', now: 'Always on', state: 'always' },
    ],
  },

  /* ---------- Lead Gen ---------- */
  funnel: [
    { stage: 'Visitors from ads, social and search', v: 6420 },
    { stage: 'Enquiries', v: 186 },
    { stage: 'Qualified', v: 128 },
    { stage: 'Consultation booked', v: 61 },
    { stage: 'Attended', v: 52 },
    { stage: 'Plan accepted', v: 23 },
  ],
  funnelNotes: {
    'Enquiries': 'Smile quiz converts 3× better than the plain contact form.',
    'Qualified': 'Most drop-outs are outside 10 miles or after NHS check-ups only.',
    'Consultation booked': 'Biggest leak. Enquiries called within 1 hour book at 52%; after 1 day it falls to 19%.',
    'Attended': '2 reminder texts brought no-shows down from 22% to 15%.',
    'Plan accepted': 'Finance is the top reason people wait. Nurture email 2 tackles it.',
  },
  leadBoard: [
    { col: 'New', items: [
      { n: 'Priya S.', t: 'Invisalign', src: 'Google Search', score: 81, age: '12 min' },
      { n: 'Tom W.', t: 'Implant', src: 'Meta lead ad', score: 64, age: '2 h 40 m', late: true },
      { n: 'Grace L.', t: 'Whitening', src: 'Instagram DM', score: 38, age: '3 h', late: true },
    ]},
    { col: 'Contacted', items: [
      { n: 'Daniel O.', t: 'Implant', src: 'Website', score: 77, age: '1 day' },
      { n: 'Aisha R.', t: 'Invisalign', src: 'Referral', score: 88, age: '1 day' },
    ]},
    { col: 'Booked', items: [
      { n: 'Ben H.', t: 'Invisalign', src: 'Google Search', score: 72, age: 'Mon 9 Nov' },
      { n: 'Claire M.', t: 'Implant', src: 'Meta lead ad', score: 69, age: 'Tue 10 Nov' },
      { n: 'Femi A.', t: 'Invisalign', src: 'Open Evening', score: 75, age: 'Thu 19 Nov' },
    ]},
    { col: 'Plan sent', items: [
      { n: 'Hannah K.', t: 'Invisalign', src: 'Google Search', score: 72, age: '£3,950' },
      { n: 'Rob P.', t: 'Implant', src: 'Referral', score: 84, age: '£2,800' },
    ]},
    { col: 'Accepted', items: [
      { n: 'Leila N.', t: 'Invisalign', src: 'Instagram', score: 79, age: '£4,200' },
      { n: 'Mark T.', t: 'Implant', src: 'Google Search', score: 70, age: '£2,650' },
    ]},
  ],

  journey: {
    who: 'Hannah K.', treatment: 'Invisalign', value: '£3,950',
    steps: [
      { date: '14 Oct', desk: 'social', agent: 'Social desk', title: 'Sees the “3 Invisalign myths” Reel', what: 'Hannah watches it twice and saves it. No details shared yet, so nothing in the CRM.', tool: 'Instagram', crm: 'Not in HubSpot yet' },
      { date: '21 Oct', desk: 'ads', agent: 'Google Ads Buyer', title: 'Searches “invisalign maidenhead cost” and clicks our ad', what: 'The ad promises a free scan and clear prices. The link carries a tracking tag so we know where she came from.', tool: 'Google Ads · utm_source=google, utm_campaign=invisalign-search', crm: 'Click ID stored on the page' },
      { date: '21 Oct', desk: 'lead', agent: 'Enquiry Capture', title: 'Takes the 4-question smile quiz and leaves her details', what: 'Name, mobile, email, and a tick to agree to texts. The form sends everything to our connector the second she presses submit.', tool: 'Website form → webhook → Make', crm: 'Contact created · Stage: Lead' },
      { date: '21 Oct', desk: 'lead', agent: 'CRM Keeper', title: 'Checks she isn’t already a patient', what: 'Matches on mobile and email (the “dedupe key”). New person, so a fresh record with source fields filled in.', tool: 'HubSpot', crm: 'Source: Google Search · First touch: Instagram' },
      { date: '21 Oct', desk: 'lead', agent: 'Scoring & Routing', title: 'Scores her 72 out of 100 and marks her Qualified', what: 'Invisalign (+20), 4 miles away (+15), wants to start within 3 months (+20), open to finance (+10), opened the email (+7).', tool: 'HubSpot scoring', crm: 'Stage: Qualified · Owner: Leah' },
      { date: '21 Oct', desk: 'lead', agent: 'Speed-to-Lead', title: 'Texts her within 2 minutes with a booking link', what: 'At the same moment Leah gets a Slack alert to call. Hannah books herself in before Leah rings.', tool: 'HubSpot SMS · Slack alert', crm: 'Task for Leah: call within 1 hour' },
      { date: '22 Oct', desk: 'lead', agent: 'Enquiry Capture', title: 'Books a free consultation online', what: 'The booking goes into the practice diary and a deal opens in the CRM with the expected value.', tool: 'Dentally online booking → HubSpot', crm: 'Deal: Invisalign · £3,950 · Consultation booked' },
      { date: '28 Oct', desk: 'lead', agent: 'Ops Coordinator', title: 'Reminded at 24 hours and 2 hours, and turns up', what: 'Attendance syncs back from the practice software, so nobody updates it by hand.', tool: 'Dentally ↔ HubSpot (two-way sync)', crm: 'Deal stage: Attended' },
      { date: '28 Oct', desk: 'lead', agent: 'Nurture', title: 'Gets her plan but wants to think about it', what: 'She goes into a 3-email sequence: how monthly payments work, a patient story, what the first month feels like.', tool: 'HubSpot sequence', crm: 'Deal stage: Plan sent' },
      { date: '4 Nov', desk: 'lead', agent: 'Leah (your team)', title: 'Accepts with 0% finance and pays her deposit', what: 'The deal is marked won. Nobody had to chase.', tool: 'HubSpot', crm: 'Deal: Won · £3,950' },
      { date: '4 Nov', desk: 'ads', agent: 'Conversion Tracking', title: 'Tells Google this click became a £3,950 patient', what: 'Google now looks for more people like Hannah, not just more clicks.', tool: 'Offline conversion upload (click ID)', crm: 'Sent to Google Ads' },
      { date: '5 Nov', desk: 'lead', agent: 'Attribution Analyst', title: 'Splits the credit fairly', what: 'Instagram started it, Google closed it. Her answer to “How did you hear about us?” was “Saw you on Instagram”, which proves the Reels are working even though they never get the last click.', tool: 'Attribution report', crm: 'First: Instagram · Last: Google Search' },
    ],
  },

  flow: {
    columns: [
      { title: 'Where enquiries start', items: ['Website smile quiz', 'Meta lead forms', 'Google ads & calls', 'Instagram DMs', 'Open Evening sign-ups'] },
      { title: 'Connector', items: ['Webhook fires on submit', 'Make (or Zapier) maps the fields', 'Checks consent to text and email'] },
      { title: 'Clean & score', items: ['Dedupe on mobile + email', 'Fill missing details', 'Score: treatment, distance, timing, finance'] },
      { title: 'HubSpot (the CRM)', items: ['Contact + lifecycle stage', 'Deal + value + stage', 'Owner: treatment coordinator', 'Source and first touch'] },
      { title: 'What happens next', items: ['Text within 2 minutes', 'Slack alert to Leah', 'Booking in Dentally (two-way sync)', 'Nurture emails if not ready'] },
      { title: 'Back to the ad platforms', items: ['Booked and won sent to Google Ads', 'Same to Meta (Conversions API)', 'Platforms learn who is worth finding'] },
    ],
    terms: [
      { t: 'Webhook', d: 'A form “shouts” the details to another app the moment someone presses submit. No waiting, no copying.' },
      { t: 'Native integration', d: 'Two apps that already know how to talk, like a Meta lead form straight into HubSpot. Set up once, no code.' },
      { t: 'Connector (iPaaS)', d: 'Make, Zapier or n8n sit in the middle and pass data between apps that don’t talk directly.' },
      { t: 'Field mapping', d: 'Deciding that “Phone” on the form goes into “Mobile” in HubSpot. Get it wrong and texts never send.' },
      { t: 'Dedupe key', d: 'The detail used to spot the same person twice. We use mobile and email together.' },
      { t: 'Lifecycle stage vs deal stage', d: 'Lifecycle is who the person is (Lead, Qualified, Patient). Deal stage is where this treatment is (Booked, Attended, Won).' },
      { t: 'Two-way sync', d: 'Changes in either app update the other, so a no-show in Dentally shows up in HubSpot without anyone typing it.' },
      { t: 'Offline conversion', d: 'Telling Google or Meta that a click turned into a paying patient days later, so they optimise for patients, not clicks.' },
    ],
  },

  attribution: {
    channels: ['Google Search ads', 'Instagram organic', 'Meta lead ads', 'Website & Google profile', 'Referrals'],
    spend: [1390, 0, 920, 0, 0],
    models: {
      'First touch': [6, 8, 4, 2, 3],
      'Last touch': [10, 2, 5, 3, 3],
      'Linear': [7.8, 5.2, 4.4, 2.6, 3],
      'W-shaped': [8.4, 5.6, 4.2, 1.8, 3],
    },
    modelNotes: {
      'First touch': 'All credit to what someone saw first. Flatters social and awareness.',
      'Last touch': 'All credit to the final click. Flatters Google Search. What most ad platforms show you.',
      'Linear': 'Equal credit to every touch along the way.',
      'W-shaped': 'Most credit to the first touch, the enquiry and the booking, with the rest shared. Our default.',
    },
    selfReported: [
      { name: 'Instagram or Facebook', v: 9 },
      { name: 'Google', v: 7 },
      { name: 'A friend or family', v: 4 },
      { name: 'Walked past', v: 2 },
      { name: 'Other', v: 1 },
    ],
  },

  /* ---------- Social ---------- */
  ideas: [
    { title: 'Myth-busting in under 20 seconds', stat: '2.1× saves', d: 'One dentist, one myth, straight to camera. Captions on. Works best posted at 7pm.' },
    { title: 'Comparison videos', stat: '1.8× shares', d: '“Whitening vs veneers”, “braces vs aligners”. Patients use them to decide.' },
    { title: 'Nurse POV, behind the scenes', stat: '+34% follows', d: 'Calm, real, no music trends needed. Builds trust with nervous patients.' },
    { title: 'Before and after: careful', stat: 'Rules apply', d: 'Only real, consented, unedited photos of your own patients, with no promised results. Our Ad Rules check handles it.' },
  ],
  socialWeekly: [
    { wk: '14 Sep', reach: 6.1, enq: 3 }, { wk: '21 Sep', reach: 5.4, enq: 2 }, { wk: '28 Sep', reach: 7.9, enq: 4 },
    { wk: '5 Oct', reach: 8.6, enq: 5 }, { wk: '12 Oct', reach: 11.2, enq: 7 }, { wk: '19 Oct', reach: 9.8, enq: 6 },
    { wk: '26 Oct', reach: 12.4, enq: 8 }, { wk: '2 Nov', reach: 14.9, enq: 9 },
  ],
  carousel: {
    caption: 'Thinking about an implant but not sure what the first visit involves? Here’s exactly what happens, how long it takes, and what it costs. No pressure, no surprises. Book a free chat via the link in bio.',
    slides: ['What happens at your first implant visit', 'A 3D scan, not a drill', '45 minutes, and you leave with a written plan', 'Prices on the plan. Pay monthly from 0%', 'Book a free consultation'],
    checks: ['Proofread', 'Brand voice: calm, plain English', 'Ad rules: no promised outcomes, finance wording checked', 'No patients shown'],
  },

  /* ---------- Paid ads ---------- */
  budget: { month: 2400, spent: 472, expected: 480 },
  campaigns: [
    { name: 'Google Search: Invisalign', platform: 'Google', state: 'live', daily: 22, consults: 31, cpc: 29, trend: [5, 6, 8, 7, 9, 10, 12] },
    { name: 'Google Search: Implants', platform: 'Google', state: 'live', daily: 18, consults: 12, cpc: 44, trend: [3, 2, 4, 3, 4, 3, 4] },
    { name: 'Meta lead ad: Implant consultation', platform: 'Meta', state: 'live', daily: 20, consults: 9, cpc: 52, trend: [4, 3, 3, 2, 3, 2, 2] },
    { name: 'Meta + Google: Open Evening', platform: 'Both', state: 'scheduled', daily: 15, consults: 0, cpc: null, trend: [] },
  ],
  recommendations: [
    { id: 'r1', title: 'Move £150 from Meta to Google Search', why: 'Search books consultations at £29 against £52 on Meta. Over the rest of November that’s about 3 extra consultations for the same money.', needs: true },
    { id: 'r2', title: 'Stop paying for “dental implants cost uk”', why: '£86 spent in 21 days, no enquiries. People searching nationally aren’t coming to Maidenhead.', needs: false, done: 'Done automatically (under your £100 rule)' },
    { id: 'r3', title: 'Approve the Open Evening ads', why: 'Three versions below, all checked. They go live on 16 November.', needs: true },
  ],
  adVariants: [
    { h: 'Free Invisalign Scan, Thu 19 Nov | Oakmere Dental Maidenhead', d: 'See your new smile in 3D before you decide. 12 spaces, 6–8pm. Pay monthly from 0%.' },
    { h: 'Thinking About Invisalign? | Come to Our Open Evening', d: 'Meet Dr Patel, ask anything, get a free scan. No pressure. Book one of 12 spaces.' },
    { h: 'Straighter Teeth, Clear Prices | Invisalign Open Evening', d: 'Free 3D scan and a written plan with prices on the night. Thursday 19 November.' },
  ],
};
