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
    lead: { name: 'New patients', short: 'New patients', route: 'lead' },
    social: { name: 'Social media', short: 'Social', route: 'social' },
    ads: { name: 'Ads', short: 'Ads', route: 'ads' },
    bench: { name: 'Writers & designers' },
    quality: { name: 'Final checks' },
  },

  /* ---------- Home ---------- */
  stats: [
    { label: 'New enquiries', value: '186', delta: '+18%', good: true, note: 'on the month before' },
    { label: 'Consultations booked', value: '61', delta: '+11%', good: true, note: '33% of enquiries' },
    { label: 'Treatment accepted', value: '£48,600', delta: '+23%', good: true, note: '23 patients' },
    { label: 'Cost per consultation', value: '£38', delta: '−£6', good: true, note: 'across all ads' },
  ],

  weeklyEnquiries: [
    { wk: '14 Sep', v: 31 }, { wk: '21 Sep', v: 28 }, { wk: '28 Sep', v: 35 }, { wk: '5 Oct', v: 33 },
    { wk: '12 Oct', v: 39 }, { wk: '19 Oct', v: 42 }, { wk: '26 Oct', v: 47 }, { wk: '2 Nov', v: 51 },
  ],

  sources: [
    { name: 'Google ads', v: 71 },
    { name: 'Instagram & Facebook posts', v: 38 },
    { name: 'Facebook & Instagram ads', v: 33 },
    { name: 'Your website & Google listing', v: 27 },
    { name: 'Recommended by a patient', v: 17 },
  ],

  needsYou: [
    { id: 'n1', desk: 'social', title: 'Approve the implant consultation carousel',
      why: 'Five slides for nervous patients about what happens at the first visit. Spelling and ad rules are already checked.',
      kind: 'approve', calId: 'c6' },
    { id: 'n2', desk: 'ads', title: 'Move £150 from Facebook ads to Google ads',
      why: 'Google ads get you a consultation for £29. Facebook and Instagram ads cost £52. You spend the same overall.',
      kind: 'approve', calId: 'c20' },
    { id: 'n3', desk: 'lead', title: '4 enquiries waiting over 2 hours for a call',
      why: 'They got our automatic text. Leah should ring them before 5pm. People called quickly are much more likely to book.',
      kind: 'task' },
    { id: 'n4', desk: 'social', title: 'Upload photos from Tuesday’s team shoot',
      why: 'We need them for the “Meet the nurses” post on 11 November.',
      kind: 'upload' },
  ],

  happeningNow: [
    { desk: 'ads', who: 'Ads', what: 'Writing 6 headlines for the Invisalign open evening' },
    { desk: 'lead', who: 'New patients', what: 'Checking 38 October enquiries that went quiet' },
    { desk: 'social', who: 'Social media', what: 'Editing a 20-second video from the hygienist interview' },
  ],

  /* ---------- Calendar ---------- */
  calendar: [
    { id: 'c1', date: '2026-11-02', desk: 'social', title: 'Meet Dr Patel (Reel)', status: 'done', detail: '28-second intro filmed in surgery 2. Reached 4,180 people, 61 saves.' },
    { id: 'c2', date: '2026-11-03', desk: 'lead', title: 'Instant text reply goes live', status: 'done', detail: 'Everyone who gets in touch now gets a text within 2 minutes with a link to book. We used to take about 3 hours to reply.' },
    { id: 'c3', date: '2026-11-04', desk: 'social', title: '3 Invisalign myths (Reel)', status: 'done', detail: 'Dr Patel talking to camera. Your best post this month: seen by 9,420 people, saved 212 times, 14 people tapped through to your page.' },
    { id: 'c4', date: '2026-11-05', desk: 'ads', title: 'New implant lead ad creative', status: 'done', detail: 'Two new images on the Meta lead form. Early read in 7 days.' },
    { id: 'c5', date: '2026-11-01', desk: 'ads', title: 'Google ads: Invisalign (running all month)', status: 'live', detail: '£22 a day. Shows when people near you search for Invisalign. 31 consultations booked in the last 30 days.' },
    { id: 'c6', date: '2026-11-06', desk: 'social', title: 'Implant consultation carousel', status: 'needs', detail: '5 slides: what happens at the first visit, how long it takes, costs explained, finance, how to book.' },
    { id: 'c7', date: '2026-11-09', desk: 'social', title: 'A day at Oakmere (Reel)', status: 'scheduled', detail: 'Behind-the-scenes, 30 seconds, no patients shown.' },
    { id: 'c20', date: '2026-11-09', desk: 'ads', title: 'Move £150 to Google ads', status: 'needs', detail: 'Waiting for your OK. Moves money from Facebook ads (£52 a consultation) to Google ads (£29).' },
    { id: 'c8', date: '2026-11-10', desk: 'lead', title: 'Follow-up email: paying monthly', status: 'scheduled', detail: 'Goes to 64 people who had a consultation but haven’t decided yet. Explains how paying monthly works.' },
    { id: 'c9', date: '2026-11-11', desk: 'social', title: 'Meet the nurses (carousel)', status: 'blocked', detail: 'Waiting for the team shoot photos.' },
    { id: 'c10', date: '2026-11-12', desk: 'lead', title: 'Referral ask to October patients', status: 'drafting', detail: 'Short thank-you text to 41 patients who finished treatment in October, with a refer-a-friend link.' },
    { id: 'c11', date: '2026-11-13', desk: 'social', title: 'Why we don’t do Black Friday', status: 'drafting', detail: 'Honest post: health care isn’t a flash sale, but here’s how 0% finance works.' },
    { id: 'c12', date: '2026-11-16', desk: 'ads', title: 'Open evening ads start', status: 'drafting', detail: 'Google and Facebook ads for the open evening on 19 November. £15 a day for 3 days.' },
    { id: 'c13', date: '2026-11-17', desk: 'social', title: 'Whitening vs veneers (Reel)', status: 'idea', detail: 'Videos comparing two treatments are getting twice as many saves as usual in dental right now.' },
    { id: 'c14', date: '2026-11-19', desk: 'lead', title: 'Invisalign open evening, 6 to 8pm', status: 'scheduled', detail: '12 free scans available, 7 booked so far. Everyone gets a reminder text the day before and 2 hours before.' },
    { id: 'c15', date: '2026-11-20', desk: 'social', title: 'Open evening highlights (Stories)', status: 'idea', detail: 'Live Stories on the night, with consent from anyone shown.' },
    { id: 'c16', date: '2026-11-23', desk: 'ads', title: 'Test: video or photo?', status: 'idea', detail: 'Same offer as a video and as a photo, £10 a day each for a week, to see which works better.' },
    { id: 'c17', date: '2026-11-24', desk: 'lead', title: 'Check in with 2025 no-shows', status: 'drafting', detail: '29 people booked a consultation last year and didn’t come. Gentle check-in email.' },
    { id: 'c18', date: '2026-11-25', desk: 'social', title: 'Patient story: Jo’s smile', status: 'drafting', detail: 'Jo has signed the consent form. Real photos only, no filters, no promises about results.' },
    { id: 'c19', date: '2026-11-26', desk: 'lead', title: 'Monthly results call with Sam', status: 'scheduled', detail: '30 minutes. What came in, what each patient cost, and what we change for December.' },
    { id: 'c21', date: '2026-11-27', desk: 'social', title: 'Ask the dentist: implants (Reel)', status: 'idea', detail: 'Top 3 questions from this month’s enquiries, answered by Dr Patel.' },
    { id: 'c22', date: '2026-11-30', desk: 'ads', title: 'Open evening ads stop', status: 'scheduled', detail: 'Happens automatically. The money goes back to Google ads.' },
    { id: 'c23', date: '2026-11-30', desk: 'lead', title: 'December plan ready for you', status: 'scheduled', detail: 'A plan for the new year, with the reason for each part.' },
  ],

  /* ---------- Team (pod model) ---------- */
  team: {
    head: { id: 'head', name: 'Your marketing lead', job: 'The one you talk to. Asks what you need, hands the work to the right team, and comes back with a plan and the reasons for it.', now: 'Putting together the December plan', state: 'working' },
    human: { id: 'sam', name: 'Sam', job: 'A real person. Checks the team’s work, runs your monthly results call, and is on WhatsApp if anything feels wrong.', now: 'Reviewing this week’s approvals', state: 'working' },
    desks: [
      {
        id: 'lead', name: 'New patients', owns: 'Getting consultations booked and treatment agreed',
        manager: { id: 'm-lead', name: 'New patients lead', job: 'Responsible for enquiries, consultations booked and what each new patient costs. Decides what to focus on each week.', now: 'Checking we’re on track for November', state: 'working' },
        crew: [
          { id: 'opp', name: 'New ideas', job: 'Looks for new ways to find patients, like referrals, local partners and events, and tries them out.', now: 'Looking at where open evening sign-ups came from', state: 'working' },
          { id: 'aud', name: 'Patient research', job: 'Works out who we’re trying to reach, where they live, and what makes them ready to book.', now: 'Idle', state: 'idle' },
          { id: 'cap', name: 'Enquiries inbox', job: 'Collects every enquiry, from your website, ads, phone calls and Instagram messages, so none get lost.', now: 'Always on', state: 'always' },
          { id: 'stl', name: 'Quick reply', job: 'Texts and emails every new enquiry within 2 minutes with a link to book.', now: 'Always on', state: 'always' },
          { id: 'score', name: 'Sorting', job: 'Works out who is most likely to book, based on treatment, distance and timing, and puts them at the top of Leah’s list.', now: 'Checking quiet October enquiries', state: 'working' },
          { id: 'nur', name: 'Follow-ups', job: 'Keeps in touch with people who aren’t ready yet, with friendly, useful emails.', now: 'Next email goes on 10 Nov', state: 'working' },
          { id: 'crm', name: 'Records', job: 'Keeps your patient enquiry list tidy: no duplicates, no missing details.', now: 'Always on', state: 'always' },
          { id: 'attr', name: 'Results', job: 'Works out where your paying patients really came from, and what each one cost.', now: 'Idle', state: 'idle' },
          { id: 'ops', name: 'Day-to-day', job: 'Spots things slipping, like late call-backs, broken forms and no-shows, and tells you.', now: 'Spotted 4 late call-backs', state: 'needs' },
        ],
      },
      {
        id: 'social', name: 'Social media', owns: 'People seeing your posts, and enquiries from them',
        manager: { id: 'm-social', name: 'Social media lead', job: 'Plans each month’s posts around what the practice needs, like more implant patients.', now: 'Waiting for you to approve the carousel', state: 'needs' },
        crew: [
          { id: 'plan', name: 'Post planner', job: 'Turns the questions patients ask into a week of videos, photo posts and Stories.', now: 'Planning December’s posts', state: 'working' },
          { id: 'trend', name: 'Trend watch', job: 'Keeps an eye on Instagram, TikTok and YouTube to see what’s working for dentists this week.', now: 'This week’s trends are ready', state: 'working' },
          { id: 'comm', name: 'Comments & messages', job: 'Drafts replies to comments and messages. Anything about treatment, or anything negative, comes to you first.', now: 'Always on', state: 'always' },
          { id: 'sched', name: 'Posting', job: 'Gets posts ready to go out at the best times. For now, you press the button to publish.', now: '3 posts ready to go', state: 'working' },
        ],
      },
      {
        id: 'ads', name: 'Ads', owns: 'What you spend, and what each consultation costs',
        manager: { id: 'm-ads', name: 'Ads lead', job: 'Decides where your ad money goes, and suggests moving it when something works better. Nothing moves without your OK.', now: 'Suggested moving £150', state: 'needs' },
        crew: [
          { id: 'google', name: 'Google ads', job: 'Runs your Google ads: which searches you show up for, what you pay, and what the ads say.', now: 'Writing open evening headlines', state: 'working' },
          { id: 'meta', name: 'Facebook & Instagram ads', job: 'Runs your ads on Facebook and Instagram, and decides who sees them.', now: 'Watching the new implant ad', state: 'working' },
          { id: 'guard', name: 'Spend watch', job: 'Checks your ad spend every hour against your limits. Can stop everything at once.', now: 'Always on', state: 'always' },
          { id: 'track', name: 'Teaching the ads', job: 'Tells Google and Facebook which clicks became paying patients, so they find more people like them.', now: 'Always on', state: 'always' },
        ],
      },
    ],
    later: ['Email & text', 'Reviews', 'Website & Google', 'Leaflets & posters'],
    bench: [
      { id: 'copy', name: 'Copywriter', job: 'Writes every post, ad and email so it sounds like your practice.', now: 'Open evening ad words', state: 'working' },
      { id: 'design', name: 'Designer', job: 'Makes your posts and ad images look like Oakmere.', now: 'Idle', state: 'idle' },
      { id: 'video', name: 'Video Editor', job: 'Turns the videos you film into short clips for social media and ads.', now: 'Hygienist interview video', state: 'working' },
      { id: 'research', name: 'Researcher', job: 'Looks at other local practices, their prices, and what patients search for.', now: 'Idle', state: 'idle' },
      { id: 'analyst', name: 'Numbers', job: 'Pulls the numbers together for every team and for your monthly call.', now: 'This week’s numbers', state: 'working' },
    ],
    quality: [
      { id: 'proof', name: 'Proofreader', job: 'Checks spelling, facts and prices.', now: 'Always on', state: 'always' },
      { id: 'voice', name: 'Sounds like you', job: 'Makes sure everything sounds like Oakmere and not like a sales pitch.', now: 'Always on', state: 'always' },
      { id: 'adrules', name: 'Advertising rules', job: 'Checks the UK rules on advertising dental care. No promises about results, and no ads for prescription-only treatments like Botox.', now: 'Always on', state: 'always' },
      { id: 'privacy', name: 'Privacy & permission', job: 'Makes sure we only text or email people who said yes, and that patients agreed to any photo we use.', now: 'Always on', state: 'always' },
    ],
  },

  /* ---------- Lead Gen ---------- */
  funnel: [
    { stage: 'People who visited your website', v: 6420 },
    { stage: 'Enquiries', v: 186 },
    { stage: 'Likely to book', v: 128 },
    { stage: 'Consultation booked', v: 61 },
    { stage: 'Attended', v: 52 },
    { stage: 'Plan accepted', v: 23 },
  ],
  funnelNotes: {
    'Enquiries': 'The smile quiz gets three times more people to get in touch than the old contact form.',
    'Likely to book': 'Most of the rest live over 10 miles away or only want NHS check-ups.',
    'Consultation booked': 'Biggest drop. People called within an hour book half the time. Wait a day and it falls to 1 in 5.',
    'Attended': 'Two reminder texts cut no-shows from about 1 in 5 to about 1 in 7.',
    'Plan accepted': 'Cost is the main reason people wait. Our next follow-up email explains paying monthly.',
  },
  leadBoard: [
    { col: 'New', items: [
      { n: 'Priya S.', t: 'Invisalign', src: 'Google ad', score: 81, age: '12 min' },
      { n: 'Tom W.', t: 'Implant', src: 'Facebook ad', score: 64, age: '2 h 40 m', late: true },
      { n: 'Grace L.', t: 'Whitening', src: 'Instagram message', score: 38, age: '3 h', late: true },
    ]},
    { col: 'Contacted', items: [
      { n: 'Daniel O.', t: 'Implant', src: 'Website', score: 77, age: '1 day' },
      { n: 'Aisha R.', t: 'Invisalign', src: 'Recommended', score: 88, age: '1 day' },
    ]},
    { col: 'Booked', items: [
      { n: 'Ben H.', t: 'Invisalign', src: 'Google ad', score: 72, age: 'Mon 9 Nov' },
      { n: 'Claire M.', t: 'Implant', src: 'Facebook ad', score: 69, age: 'Tue 10 Nov' },
      { n: 'Femi A.', t: 'Invisalign', src: 'Open Evening', score: 75, age: 'Thu 19 Nov' },
    ]},
    { col: 'Plan sent', items: [
      { n: 'Hannah K.', t: 'Invisalign', src: 'Google ad', score: 72, age: '£3,950' },
      { n: 'Rob P.', t: 'Implant', src: 'Recommended', score: 84, age: '£2,800' },
    ]},
    { col: 'Accepted', items: [
      { n: 'Leila N.', t: 'Invisalign', src: 'Instagram', score: 79, age: '£4,200' },
      { n: 'Mark T.', t: 'Implant', src: 'Google ad', score: 70, age: '£2,650' },
    ]},
  ],

  journey: {
    who: 'Hannah K.', treatment: 'Invisalign', value: '£3,950',
    steps: [
      { date: '14 Oct', desk: 'social', agent: 'Social media team', title: 'Sees the “3 Invisalign myths” Reel', what: 'Hannah watches it twice and saves it. We don’t know who she is yet.', tool: 'Instagram', crm: 'Not on our list yet' },
      { date: '21 Oct', desk: 'ads', agent: 'Google ads', title: 'Googles “invisalign maidenhead cost” and clicks our ad', what: 'The ad offers a free scan and clear prices. The link is tagged so we can see she came from Google.', tool: 'Google ads', crm: 'We note she came from Google' },
      { date: '21 Oct', desk: 'lead', agent: 'Enquiries inbox', title: 'Takes the 4-question smile quiz and leaves her details', what: 'Name, mobile, email, and a tick to say we can text her. Her details reach us the moment she presses send.', tool: 'Your website', crm: 'Added as a new enquiry' },
      { date: '21 Oct', desk: 'lead', agent: 'Records', title: 'Checks she isn’t already a patient', what: 'We match her mobile and email against your list. She’s new, so she gets her own record, with a note of where she came from.', tool: 'HubSpot (your enquiry list)', crm: 'Came from: Google. First saw us: Instagram' },
      { date: '21 Oct', desk: 'lead', agent: 'Sorting', title: 'Rates her 72 out of 100: likely to book', what: 'She wants Invisalign, lives 4 miles away, wants to start within 3 months, is happy to pay monthly, and opened our email.', tool: 'HubSpot', crm: 'Likely to book · Leah to call' },
      { date: '21 Oct', desk: 'lead', agent: 'Quick reply', title: 'Texts her within 2 minutes with a link to book', what: 'At the same time Leah gets a message to call her. Hannah books herself in before Leah even rings.', tool: 'Text message, plus a message to Leah', crm: 'Leah: call within the hour' },
      { date: '22 Oct', desk: 'lead', agent: 'Enquiries inbox', title: 'Books a free consultation online', what: 'The booking goes straight into your diary, and we note it could be worth £3,950.', tool: 'Your online booking (Dentally)', crm: 'Consultation booked · £3,950' },
      { date: '28 Oct', desk: 'lead', agent: 'Day-to-day', title: 'Reminded at 24 hours and 2 hours, and turns up', what: 'Your diary tells us she came in, so nobody has to type it up.', tool: 'Dentally, linked to HubSpot', crm: 'Came to her consultation' },
      { date: '28 Oct', desk: 'lead', agent: 'Follow-ups', title: 'Gets her plan but wants to think about it', what: 'She gets three emails over two weeks: how paying monthly works, another patient’s story, and what the first month is like.', tool: 'Follow-up emails', crm: 'Plan sent, thinking about it' },
      { date: '4 Nov', desk: 'lead', agent: 'Leah (your team)', title: 'Accepts with 0% finance and pays her deposit', what: 'Done. Nobody had to chase her.', tool: 'HubSpot', crm: 'Treatment agreed · £3,950' },
      { date: '4 Nov', desk: 'ads', agent: 'Teaching the ads', title: 'Tells Google her click became a £3,950 patient', what: 'Google can now show your ads to more people like Hannah.', tool: 'Google ads', crm: 'Shared with Google' },
      { date: '5 Nov', desk: 'lead', agent: 'Results', title: 'Works out what really brought her in', what: 'Instagram got her interested and Google got her to book. When we asked how she heard about us, she said Instagram. So the videos are working, even though Google gets the final click.', tool: 'Monthly results', crm: 'First: Instagram · Then: Google' },
    ],
  },

  flow: {
    columns: [
      { title: 'Someone gets in touch', items: ['Smile quiz on your website', 'Facebook ad form', 'Google ad or phone call', 'Instagram message', 'Open evening sign-up'] },
      { title: 'Passed along instantly', items: ['Their details are sent the moment they press send', 'A linking app (Make or Zapier) puts each detail in the right place', 'We check they said yes to texts and emails'] },
      { title: 'Tidied and sorted', items: ['Checked they’re not already on your list', 'Missing details filled in', 'Rated on how likely they are to book'] },
      { title: 'Your enquiry list (HubSpot)', items: ['Who they are', 'What treatment and what it’s worth', 'Who is calling them (Leah)', 'Where they found you'] },
      { title: 'What happens next', items: ['A text within 2 minutes', 'A message to Leah to call', 'Booked into your diary (Dentally)', 'Follow-up emails if they’re not ready'] },
      { title: 'Ads get smarter', items: ['Google is told who booked and who said yes', 'Facebook is told the same', 'So they show your ads to more people like them'] },
    ],
    terms: [
      { t: 'Instant hand-off', d: 'When someone presses send on a form, their details go straight to your list. Nobody copies anything by hand.' },
      { t: 'Apps that link up', d: 'Some apps already work together, like Facebook ad forms and HubSpot. We switch that on once.' },
      { t: 'Linking apps', d: 'Make and Zapier sit in the middle and pass details between apps that don’t work together on their own.' },
      { t: 'Putting details in the right place', d: '“Phone” on a form has to land in “Mobile” on your list, or the automatic texts won’t send.' },
      { t: 'No duplicates', d: 'We match on mobile and email so the same person isn’t on your list twice.' },
      { t: 'Person and treatment', d: 'Your list tracks the person (new, likely to book, patient) and each treatment separately (booked, attended, agreed).' },
      { t: 'Kept in sync', d: 'If someone misses an appointment in Dentally, HubSpot knows straight away. No typing it in twice.' },
      { t: 'Teaching the ads', d: 'Telling Google and Facebook which clicks became paying patients, days later, so they find more people like them.' },
    ],
  },

  attribution: {
    channels: ['Google ads', 'Instagram and Facebook posts', 'Facebook and Instagram ads', 'Your website and Google listing', 'Recommended by a patient'],
    spend: [1390, 0, 920, 0, 0],
    models: {
      'Where they first saw you': [6, 8, 4, 2, 3],
      'What they clicked last': [10, 2, 5, 3, 3],
      'Shared equally': [7.8, 5.2, 4.4, 2.6, 3],
      'Our balanced view': [8.4, 5.6, 4.2, 1.8, 3],
    },
    modelNotes: {
      'Where they first saw you': 'Gives all the credit to where someone first came across you. This makes social media look best.',
      'What they clicked last': 'Gives all the credit to the last thing they clicked before getting in touch. This makes Google look best, and it’s what Google and Facebook show you.',
      'Shared equally': 'Every step along the way gets an equal share.',
      'Our balanced view': 'Most credit goes to where they first saw you, what made them get in touch, and what made them book. This is the view we use.',
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
    { title: 'Quick myth-busting videos', stat: '2× more saves', d: 'One dentist clears up one myth, talking to camera, in under 20 seconds. Add captions. Post around 7pm.' },
    { title: 'This or that?', stat: 'Shared nearly 2× more', d: '“Whitening or veneers?”, “Braces or aligners?” People use these to help them decide.' },
    { title: 'A day with the nurses', stat: 'A third more followers', d: 'Calm, everyday footage from the practice. Nervous patients like seeing who they’ll meet.' },
    { title: 'Before and after photos', stat: 'Handle with care', d: 'Only real, unedited photos of your own patients who said yes, and never a promise that results will be the same. We check every one.' },
  ],
  socialWeekly: [
    { wk: '14 Sep', reach: 6.1, enq: 3 }, { wk: '21 Sep', reach: 5.4, enq: 2 }, { wk: '28 Sep', reach: 7.9, enq: 4 },
    { wk: '5 Oct', reach: 8.6, enq: 5 }, { wk: '12 Oct', reach: 11.2, enq: 7 }, { wk: '19 Oct', reach: 9.8, enq: 6 },
    { wk: '26 Oct', reach: 12.4, enq: 8 }, { wk: '2 Nov', reach: 14.9, enq: 9 },
  ],
  carousel: {
    caption: 'Thinking about an implant but not sure what the first visit involves? Here’s exactly what happens, how long it takes, and what it costs. No pressure, no surprises. Book a free chat via the link in bio.',
    slides: ['What happens at your first implant visit', 'A 3D scan, not a drill', '45 minutes, and you leave with a written plan', 'Prices on the plan. Pay monthly from 0%', 'Book a free consultation'],
    checks: ['Spelling checked', 'Sounds like Oakmere', 'Follows the advertising rules', 'No patients shown'],
  },

  /* ---------- Paid ads ---------- */
  budget: { month: 2400, spent: 472, expected: 480 },
  campaigns: [
    { name: 'Google ads: Invisalign', platform: 'Google', state: 'live', daily: 22, consults: 31, cpc: 29, trend: [5, 6, 8, 7, 9, 10, 12] },
    { name: 'Google ads: Implants', platform: 'Google', state: 'live', daily: 18, consults: 12, cpc: 44, trend: [3, 2, 4, 3, 4, 3, 4] },
    { name: 'Facebook & Instagram: Implant consultation', platform: 'Meta', state: 'live', daily: 20, consults: 9, cpc: 52, trend: [4, 3, 3, 2, 3, 2, 2] },
    { name: 'Google & Facebook: Open evening', platform: 'Both', state: 'scheduled', daily: 15, consults: 0, cpc: null, trend: [] },
  ],
  recommendations: [
    { id: 'r1', title: 'Move £150 from Facebook ads to Google ads', why: 'A consultation costs £29 through Google and £52 through Facebook. Moving £150 should get you about 3 more consultations this month, for the same money.', needs: true },
    { id: 'r2', title: 'Stop showing ads to people searching “dental implants cost uk”', why: '£86 spent in 3 weeks with no enquiries. People searching across the UK aren’t going to travel to Maidenhead.', needs: false, done: 'Done for you (it was under £100)' },
    { id: 'r3', title: 'Approve the open evening ads', why: 'Three versions are below, all checked. They start on 16 November.', needs: true },
  ],
  adVariants: [
    { h: 'Free Invisalign Scan, Thu 19 Nov | Oakmere Dental Maidenhead', d: 'See your new smile in 3D before you decide. 12 spaces, 6–8pm. Pay monthly from 0%.' },
    { h: 'Thinking About Invisalign? | Come to Our Open Evening', d: 'Meet Dr Patel, ask anything, get a free scan. No pressure. Book one of 12 spaces.' },
    { h: 'Straighter Teeth, Clear Prices | Invisalign Open Evening', d: 'Free 3D scan and a written plan with prices on the night. Thursday 19 November.' },
  ],

  /* ---------- Notifications ---------- */
  notifications: [
    { id: 'u1', level: 'urgent', title: 'Hot implant enquiry waiting 47 minutes', body: 'Aisha R. was recommended by a patient and wants to start this month. People called within the hour are twice as likely to book.', time: '2 min ago', actions: [['I’ll call her now', 'called'], ['Send to Leah', 'leah']] },
    { id: 'u2', level: 'urgent', title: 'Facebook ads spent too fast, so we paused them', body: '£64 spent by 11am, three times the usual. We’ve paused them. Your Google ads are still running.', time: 'Today 11:04', actions: [['Keep it paused', 'keep'], ['Turn it back on', 'resume']] },
    { id: 'm1', level: 'money', title: 'Leila N. accepted a £4,200 Invisalign plan', body: 'Found you on Instagram, booked through Google. Deposit paid.', time: 'Today 10:12' },
    { id: 'w1', level: 'warn', title: 'New 2-star Google review', body: 'About waiting times on Tuesday. A calm reply is drafted for you to check. Replying within 24 hours matters.', time: 'Yesterday 18:40', actions: [['See the draft reply', 'review']] },
    { id: 'i1', level: 'info', title: 'Your carousel is ready to approve', body: '5 slides on what happens at an implant consultation.', time: 'Today 9:30', go: '#home' },
    { id: 'i2', level: 'info', title: 'Weekly report: your best week yet', body: '51 enquiries and 19 consultations booked. Each consultation cost £38 in ads.', time: 'Mon 9:00', go: '#desks/lead' },
  ],
  reviewDraft: 'Thank you for letting us know, and we’re sorry you waited longer than you should have on Tuesday. That’s not the experience we want for anyone. Our practice manager would like to hear more. Could you call us on the practice number, or reply here? — The Oakmere team',
};
