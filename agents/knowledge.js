/* =====================================================================
   SPECIALIST KNOW-HOW for every agent in Marquee.

   What this is
   - KNOWLEDGE maps each on-screen agent (the ids in data.js DATA.team)
     to 3 to 6 working methods ("skills"). The backend (registry.js) adds
     the instructions to each Claude prompt; the frontend can show the
     titles and summaries.
   - SOURCES lists where the expertise came from. The techniques were
     distilled and rewritten in our own words from permissively licensed
     open-source libraries (see CREDITS.md for licences and notices),
     then adapted to a UK private dental practice. "marquee" marks our
     own UK dental and compliance knowledge.

   Rules for editing
   - Keep every instruction 80 to 250 words, concrete and in plain
     British English. Avoid typing a backtick inside the text.
   - This file is published with the website. No secrets, no real
     patient details. Compliance notes are checks, not legal advice.
   - Plain ES module, no build step. Importable from the browser as
     ./agents/knowledge.js and from Pages Functions.
   ===================================================================== */

export const SOURCES = {
  marketingskills: {
    name: 'Marketing Skills for AI agents',
    author: 'Corey Haines',
    url: 'https://github.com/coreyhaines31/marketingskills',
    license: 'MIT',
  },
  agencyAgents: {
    name: 'The Agency (agency-agents)',
    author: 'AgentLand Contributors (msitarzewski)',
    url: 'https://github.com/msitarzewski/agency-agents',
    license: 'MIT',
  },
  wshobson: {
    name: 'Claude Code plugins and agents',
    author: 'Seth Hobson',
    url: 'https://github.com/wshobson/agents',
    license: 'MIT',
  },
  voltagent: {
    name: 'Awesome Claude Code Subagents',
    author: 'VoltAgent',
    url: 'https://github.com/VoltAgent/awesome-claude-code-subagents',
    license: 'MIT',
  },
  marquee: {
    name: 'Marquee UK dental marketing and compliance notes',
    author: 'Marquee',
    url: '',
    license: 'Original work for this prototype',
  },
};

export const KNOWLEDGE = {
  /* =================================================================
     HEAD OF AGENTS
     ================================================================= */
  head: [
    {
      id: 'head-brief',
      title: 'Turning a request into a clear brief',
      summary: 'Works out what you really need and gives each team a short, specific job.',
      instructions: `Before briefing anyone, restate the request as one outcome in patients or pounds (for example "6 more implant consultations booked before 20 December"). Then fill five slots: treatment, goal number, time window, budget limit, and anything the owner ruled in or out. Fill slots from the client context first; only ask about a slot when a wrong guess would cost real money or time, and ask at most three short questions. Brief only the teams whose work moves that outcome: demand that already exists (people searching) is the ads team; demand that needs creating is social; turning enquiries into booked consultations is the new patients team. Each brief is 2 to 4 sentences and names the one number the team should move, the deadline, and a constraint. Never brief a team just so it feels included.`,
      sources: ['marketingskills', 'marquee'],
    },
    {
      id: 'head-priorities',
      title: 'Choosing what matters most this week',
      summary: 'Finds the one bottleneck that is costing the most patients and fixes that first.',
      instructions: `Look at the patient journey as a chain: people who see us, people who get in touch, consultations booked, consultations attended, treatment accepted. Find the weakest link against target (the biggest drop compared with last month or the goal) and put effort there first; improving any other link adds little until that one is fixed. Use the 80/20 rule: one or two treatments usually drive most of the revenue (often implants and Invisalign), so protect their pipeline before spending time on low-value work. Weigh every idea by likely extra consultations, cost and effort, and say what you are choosing not to do. Think one step ahead: a cheaper ad that brings poor-fit enquiries can raise the cost of each accepted treatment. Recommend one main move and at most two supporting ones.`,
      sources: ['marketingskills', 'marquee'],
    },
    {
      id: 'head-report',
      title: 'Explaining results simply',
      summary: 'Leads with what happened and what to do next, in plain numbers.',
      instructions: `Structure every update as: the answer first (one sentence, ahead of or behind target and by how much), then the two or three facts that explain it, then the recommended next step and what you need from the owner. Compare each number with something: the target, last month, or the same month last year. Use whole numbers and pounds; round sensibly. Be honest about small numbers: 3 consultations against 5 last week is noise, not a trend, so say "too early to tell" rather than inventing a cause. Separate what we know from what we think. Never quote a figure that is not in the context. One chart-worthy idea per update is enough; resist listing every metric.`,
      sources: ['wshobson', 'marquee'],
    },
    {
      id: 'head-approvals',
      title: 'Asking for approval the right way',
      summary: 'Puts every change in front of you with the cost, the expected effect and how to undo it.',
      instructions: `Anything that spends money, changes what patients see, or contacts patients needs the owner's yes. Present each proposal in four parts: what is happening now, the change, the expected effect in consultations or pounds (a range, not a promise), and how we would undo it. Offer a clear default and at most one alternative. Group small related changes into a single approval so the owner is not asked ten times a week. If a proposal touches advertising rules, patient photos, reviews or messaging consent, say that Quality and Legal has checked it and name the check in a few words. Never describe a planned change as done.`,
      sources: ['marketingskills', 'marquee'],
    },
  ],

  /* =================================================================
     NEW PATIENTS (LEAD GEN) DESK
     ================================================================= */
  'm-lead': [
    {
      id: 'lead-economics',
      title: 'Knowing what a new patient is worth',
      summary: 'Works out how much we can afford to spend to win each treatment patient.',
      instructions: `Work backwards from money. For each treatment, take the typical treatment value and the practice's margin, then decide the most we can pay to win one accepted treatment (for example, if an implant case is worth £2,500 and we can spend 15% on winning it, the ceiling is about £375). Divide by the share of consultations that become treatment to get the most we can pay per consultation booked. Use only figures in the context; if the margin or conversion rate is missing, say so and give a range. Judge every channel against these ceilings, not against clicks or enquiry counts. A channel above the ceiling needs a fix or a cut; one well below it may deserve more budget. Revisit the ceilings monthly.`,
      sources: ['marketingskills', 'marquee'],
    },
    {
      id: 'lead-consult-to-treatment',
      title: 'Turning consultations into treatment',
      summary: 'Makes sure people who come in get a clear plan, a clear price and a friendly follow-up.',
      instructions: `The cheapest extra patient is one who already came in. Check four things. First, attendance: reminders 48 hours and 2 hours before, with an easy way to rearrange, and a call for anyone who misses. Second, the plan: every patient leaves with a written treatment plan and the price, ideally on the day and no later than 24 hours. Third, money: explain pay-monthly options plainly, with the provider's own wording, and never pressure. Fourth, follow-up: the treatment coordinator calls within 2 working days, then a helpful email at about a week and a gentle check-in at a month. Track the share of consultations that accept treatment by treatment and by clinician, and look at the reasons people give for waiting (cost, nerves, timing) to shape nurture content.`,
      sources: ['marketingskills', 'marquee'],
    },
    {
      id: 'lead-weekly-focus',
      title: 'Setting the team\'s focus each week',
      summary: 'Picks the one stage of the patient journey that needs the most help this week.',
      instructions: `Each week, check the stages in order: enquiries in, contacted within the hour, consultations booked, attended, treatment accepted. Compare each with target and with the last four weeks. A problem higher up explains symptoms lower down, so fix the earliest broken stage first (slow call-backs will depress bookings no matter how good the ads are). End the review with exactly one call per issue: hold (normal ups and downs or too few numbers to judge), fix (a known problem with a known fix), test (an idea worth trying, with a measure and a stop date), or investigate (the numbers cannot be trusted yet). Assign each call to one specialist and give a date.`,
      sources: ['marketingskills', 'marquee'],
    },
    {
      id: 'lead-ethical-offers',
      title: 'Offers that are fair and honest',
      summary: 'Uses free consultations and events to lower the barrier, never pressure or gimmicks.',
      instructions: `Good dental offers remove a worry rather than discount the treatment: a free consultation or scan, a clear fixed price, pay-monthly options, a meet-the-dentist evening, or a nervous-patient first visit with no treatment on the day. Lead with the thing that removes the patient's main objection (cost, fear, not knowing what happens). "Free" must be genuinely free with no catch. Limited places or dates are fine only when true. Avoid deep discounts on clinical treatment, which can cheapen trust and push people to decide on price. Do not tie gifts to agreeing treatment. Every offer has a short set of plain terms (what is included, who it is for, end date) and is checked by Quality and Legal before going out.`,
      sources: ['marketingskills', 'marquee'],
    },
  ],

  opp: [
    {
      id: 'opp-local-partners',
      title: 'Finding local partners',
      summary: 'Teams up with nearby businesses whose customers are likely to want our treatments.',
      instructions: `List businesses in the Maidenhead area whose customers overlap with ours and who gain from the link: bridal shops, wedding venues and photographers (whitening and Invisalign before the big day), gyms and sports clubs (mouthguards, sports dentistry), local employers (a staff dental talk or check-up evening), and estate agents or welcome packs for new residents. Offer them something useful for their customers, such as a talk, a printed guide or an evening, not a sales pitch. Agree one simple way to track each partner (a named landing page or "how did you hear" option). Do not pay other health professionals for referring patients, and keep any customer offer modest and with clear terms. Start with two partners, review after 8 weeks, keep what produces consultations.`,
      sources: ['marketingskills', 'marquee'],
    },
    {
      id: 'opp-experiments',
      title: 'Testing new ideas properly',
      summary: 'Tries one new idea at a time, with a clear measure and a date to decide.',
      instructions: `Write each idea as a test that can fail: "A free whitening talk at the gym will produce 5 consultation enquiries in 4 weeks." Score ideas on likely impact, confidence and ease (1 to 10 each) and run the top one or two. Each test needs a single measure (enquiries or consultations, not likes), a budget cap, a stop date and a named owner. Run no more than two tests at once so results stay readable. With small numbers, look for clear differences, not tiny ones; if the result is unclear after the stop date, say so and decide whether to rerun or drop it. Keep a simple log of every test, what happened and what we learned, so good ideas are not repeated by accident.`,
      sources: ['agencyAgents', 'marketingskills'],
    },
    {
      id: 'opp-open-evenings',
      title: 'Running open evenings that fill the diary',
      summary: 'Plans patient evenings where most of the work happens before and after the night.',
      instructions: `Most of an event's value is created before and after it. Before: pick one treatment theme (Invisalign or implants), cap places at 10 to 15, use a simple sign-up page with a consent tick, promote for 2 to 3 weeks to past enquirers, the email list, social and a small local ad budget, and send reminders at 24 hours and 2 hours. During: short talk from the dentist, real questions answered, free scan or assessment where possible, and the treatment coordinator notes each guest's interest and next step. After: follow up within 48 hours, referring to what each person asked about; book consultations on the night where people want to. Measure consultations booked and treatments accepted, not attendance. Repeat events on a regular rhythm; a quarterly evening builds momentum.`,
      sources: ['marketingskills', 'marquee'],
    },
    {
      id: 'opp-referrals',
      title: 'Designing a refer-a-friend scheme',
      summary: 'Asks happy patients to recommend us at the right moment, with a simple fair thank-you.',
      instructions: `Ask at moments of delight: the day aligners come off, the final fit of an implant crown, after a glowing review or a thank-you card. Make sharing easy with a personal link or a printed card, since word of mouth often happens offline. A two-sided thank-you (something for both the patient and their friend, such as a voucher toward hygiene or whitening) usually works better than one-sided. Keep rewards modest, give them when the friend attends a first visit rather than when they buy treatment, and publish clear terms. Never reward reviews. Track referrals in the records so the referrer can be thanked personally. Review the scheme after 3 months: how many patients were asked, how many shared, how many friends booked.`,
      sources: ['marketingskills', 'marquee'],
    },
  ],

  aud: [
    {
      id: 'aud-voice-of-patient',
      title: 'Learning how patients describe their worries',
      summary: 'Collects the exact words patients use so our messages sound like them.',
      instructions: `Mine what patients already say: Google reviews (ours and nearby practices), enquiry form messages, questions asked on calls and at consultations, social comments, and local forums. For each source, note the trigger (what made them look now), the worry (cost, pain, time, embarrassment, past bad experience), the outcome they want in their own words, and what nearly stopped them. Rank themes by how often they appear and how strongly they are felt. Keep exact phrases, for example "I've hidden my smile in photos for years", and hand them to the copywriter. Never record anything that identifies a person or their health in research notes; summarise patterns only. Refresh this every quarter.`,
      sources: ['marketingskills', 'marquee'],
    },
    {
      id: 'aud-patient-profiles',
      title: 'Building simple patient profiles',
      summary: 'Describes the three or four kinds of patient we most want to reach, based on evidence.',
      instructions: `Create 3 or 4 short profiles, one per main treatment, built from real enquiries and reviews rather than guesses. Each profile covers: who they are in everyday terms (for example "professional in their 30s to 50s, wants straighter teeth without metal braces"), the moment that triggers a search (a wedding, a new job, a broken tooth, a missing tooth affecting eating), main worries, what proof reassures them, where they spend time online, and how they prefer to be contacted. Note what would make them a poor fit (wants NHS-only care, lives far away). Avoid stereotypes and never base a profile on assumed health conditions or other sensitive traits. Mark each claim as evidence or assumption, and replace assumptions as data arrives.`,
      sources: ['marketingskills', 'voltagent'],
    },
    {
      id: 'aud-catchment',
      title: 'Mapping where patients come from',
      summary: 'Works out the area worth advertising to, based on how far people will travel.',
      instructions: `Use postcodes from past enquiries and accepted treatments (in aggregate only) to see where paying patients actually live. People travel further for high-value treatment: a hygiene visit draws from about 15 minutes away, implants and Invisalign often 30 to 40 minutes. Set ad radiuses per treatment accordingly, usually about 10 miles for general and whitening, up to 15 to 20 miles for implants, and exclude areas that produce enquiries but rarely book. Note commuter patterns (Maidenhead to London, Reading, Slough) and local events that change demand. Recheck the map every quarter and share it with the ads team.`,
      sources: ['marquee'],
    },
  ],

  cap: [
    {
      id: 'cap-all-channels',
      title: 'Catching every enquiry, wherever it lands',
      summary: 'Makes sure no enquiry from the website, phone, ads or messages gets lost.',
      instructions: `List every way a person can get in touch: website forms, Facebook and Instagram lead forms, Instagram and Facebook messages, Google Business Profile calls and messages, phone, email and walk-ins. Each must create one record in the enquiry list within minutes, with name, contact details, treatment interest, source and consent status. Set up a text-back for missed calls in opening hours. Test every route weekly with a clearly labelled test enquiry and delete it afterwards, so tests do not pollute the numbers or trigger real ad conversions. If a route breaks, flag it to Day-to-day immediately. Never move clinical details from messages into the marketing list; keep only what is needed to get back to the person.`,
      sources: ['marketingskills', 'marquee'],
    },
    {
      id: 'cap-forms',
      title: 'Making enquiry forms quick to fill in',
      summary: 'Keeps forms short and friendly so more people finish them.',
      instructions: `Every extra field loses some people, so ask only what is needed to call them back: name, mobile, email, treatment of interest (a short pick list), and the best time to call. Ask anything else later. Label fields clearly, show errors next to the field in plain words, and make it work well on a phone (big tap targets, the right keyboard for numbers and email). The button says what happens: "Request my free consultation", not "Submit". Under the button, say what happens next and when ("Leah will call you within an hour in opening hours"). Marketing consent is a separate, unticked box with plain wording for texts and emails; it is never required to send the form. Link the privacy notice.`,
      sources: ['marketingskills', 'marquee'],
    },
    {
      id: 'cap-source',
      title: 'Recording where each enquiry came from',
      summary: 'Notes how every person found us, so we know which marketing works.',
      instructions: `Capture the source two ways. Automatically: keep tracking tags on every ad and email link in one consistent naming style (source, medium, campaign named by treatment and month) and save them with the enquiry. Self-reported: ask "How did you hear about us?" on every form and call, with a short pick list (Google search, Facebook or Instagram, friend or family, walked past, other with a text box). Self-reported answers catch word of mouth and social media that tracking misses. Never overwrite the first recorded source when a person enquires again; add the new touch instead. Phone enquiries need the same question asked and typed in, otherwise phone-heavy channels look weak.`,
      sources: ['marketingskills'],
    },
  ],

  stl: [
    {
      id: 'stl-first-reply',
      title: 'Replying to new enquiries within minutes',
      summary: 'Sends a friendly text and email within 2 minutes with a link to book.',
      instructions: `Reply fast: interest fades quickly, and replies within 5 minutes are far more likely to start a conversation than replies after half an hour. The first text goes within 2 minutes, from "Oakmere Dental" so they know who it is, uses their first name, confirms what they asked about, offers one booking link, and says when a person will call. Keep it under 160 characters where possible and avoid emojis. Example shape: "Hi Sarah, thanks for asking about Invisalign at Oakmere Dental. Book a free consultation here [link] or Leah will call you before 5pm today." The matching email can add a little more (what the first visit involves, parking). This is a reply to their own request, so it is a service message, but it must not include unrelated promotions.`,
      sources: ['marketingskills', 'marquee'],
    },
    {
      id: 'stl-call-cadence',
      title: 'Following up calls without being pushy',
      summary: 'Tries a few times over a few days, then moves to gentle emails.',
      instructions: `Call within an hour in opening hours. If there is no answer: leave a short, warm voicemail and send a text straight after saying who called and why. Try again on day 1 at a different time of day, and on day 4. After three attempts, send a final friendly message ("We'll leave it with you, here's the link whenever you're ready") and move them to follow-up emails if they consented, otherwise close the enquiry. Out of hours, the auto-reply says exactly when a person will call. Escalate any enquiry that has not been called within the target time to the new patients lead. Log every attempt so nobody gets called twice in an hour by different staff.`,
      sources: ['marketingskills', 'marquee'],
    },
    {
      id: 'stl-text-rules',
      title: 'Writing texts people are happy to get',
      summary: 'Keeps texts short, clear, personal and easy to stop.',
      instructions: `Each text has one job and one link. Start with who it is from. Write like a helpful receptionist, not an advert: no capitals for emphasis, no exclamation marks, no urgency that is not real. Stay within 160 characters when you can, since emojis and curly quotes can shrink the limit and double the cost. Send between 9am and 7pm on weekdays and late morning on Saturdays, never late at night. Marketing texts (anything promoting a treatment, event or offer) need the person's prior consent and a simple way to stop, such as "Reply STOP to opt out". Service texts (a reply to their enquiry, appointment reminders) do not need marketing consent but must stay purely about the service.`,
      sources: ['marketingskills', 'marquee'],
    },
  ],

  score: [
    {
      id: 'score-model',
      title: 'Scoring who is most likely to book',
      summary: 'Gives each enquiry a score so the best ones get called first.',
      instructions: `Score out of 100 using two kinds of signal. Fit, from what they told us: treatment value (implants and Invisalign highest, whitening and hygiene lower), distance from the practice, and timing (wants to start within 3 months scores high). Engagement, from what they did: booked online, replied to a text, opened emails, visited the prices or finance page, attended an event. Add negative points for signs of poor fit: wants NHS-only care, lives far outside the catchment, fake or incomplete details, or asked to stop contact. Weight actions that show buying intent (visiting the finance page) well above casual ones (opening one email). Set three bands, for example hot 70 and above, warm 40 to 69, cold below 40, and route each band to a different follow-up.`,
      sources: ['marketingskills', 'marquee'],
    },
    {
      id: 'score-calibrate',
      title: 'Checking the scores are right',
      summary: 'Compares scores with who actually booked, and adjusts every few months.',
      instructions: `A score is only useful if high scores really book more often. Every quarter, take the enquiries from a past period whose outcome is known and check: what share of hot, warm and cold enquiries booked a consultation and accepted treatment? If warm enquiries book nearly as often as hot ones, the bands are wrong. Look for good patients the score missed and poor fits it ranked high, and adjust the points behind them. Change one or two things at a time, write down what changed and why, and compare against the previous quarter. Never score on guesses about a person's health, age, ethnicity or finances beyond what they chose to tell us.`,
      sources: ['marketingskills', 'marquee'],
    },
    {
      id: 'score-quiet',
      title: 'Spotting quiet enquiries worth another try',
      summary: 'Finds people who went quiet but are still worth a gentle check-in.',
      instructions: `Each month, review enquiries that went silent. Re-score them with fresh behaviour: anyone who recently opened an email, visited the website again or clicked an event invitation moves up. People who attended a consultation but did not start treatment are the most valuable quiet group: they know us and have a plan. Suggest a personal check-in from the treatment coordinator for the top 10, with a reason to get back in touch (a new finance option, an open evening, a reminder that their plan is still valid). People who asked not to be contacted, or who did not consent to marketing, are left alone; at most, a service follow-up about their own unanswered question.`,
      sources: ['marketingskills', 'marquee'],
    },
  ],

  nur: [
    {
      id: 'nur-sequence',
      title: 'Planning a helpful email series',
      summary: 'Sends a short run of useful emails to people who are thinking about treatment.',
      instructions: `For people not ready to book, plan 6 to 8 emails over about 3 to 4 weeks, then move to a monthly newsletter. A proven order: 1) a warm welcome with the guide or answer they asked for (straight away); 2) what the first visit is like, especially for nervous patients (day 2 to 3); 3) the common worry for that treatment explained honestly (day 5 to 7); 4) how the treatment works step by step (about day 10); 5) a real patient story with written consent (about day 14); 6) what is included in the price and how paying monthly works (about day 18); 7) answers to the top objections (about day 22); 8) a clear invitation to book a free consultation (about day 26). Stop the series as soon as they book.`,
      sources: ['marketingskills', 'marquee'],
    },
    {
      id: 'nur-email-craft',
      title: 'Writing emails people open and read',
      summary: 'Clear subject lines, one message per email, and one button to book.',
      instructions: `One email, one job, one main button. Subject lines are clear before clever, about 40 to 60 characters, and specific ("What happens at your first Invisalign visit"). Use the preview text to add a second reason to open. Write short paragraphs, from a named person (for example the treatment coordinator), in plain language, and give something useful before asking for anything. Buttons describe what they get ("Book my free consultation"). Avoid fake personal touches, false urgency, all-caps and heavy images that hide the message. Every marketing email shows who it is from, the practice address and a one-click unsubscribe. Measure clicks and consultations booked, not opens, because opens are unreliable.`,
      sources: ['marketingskills', 'marquee'],
    },
    {
      id: 'nur-reengage',
      title: 'Waking up quiet contacts kindly',
      summary: 'Checks in with people who have stopped opening emails, then lets them go.',
      instructions: `People who have not clicked for about 4 to 6 months get a short re-engagement series of 3 emails over 2 weeks: a useful update or new option, a simple question ("Still interested in straighter teeth? Tell us what's holding you back"), and a polite goodbye that confirms we will stop emailing unless they click to stay. Remove anyone who does not respond from regular sends. A smaller, interested list protects deliverability and respects people's inboxes. Never re-add people who unsubscribed, and do not use patient treatment history for marketing segments unless the practice's privacy notice and consent cover it.`,
      sources: ['marketingskills', 'marquee'],
    },
  ],

  crm: [
    {
      id: 'crm-stages',
      title: 'Keeping clear stages for every enquiry',
      summary: 'Uses the same simple steps for everyone, from first contact to treatment.',
      instructions: `Use one agreed set of stages and define each one so everyone moves people the same way: new enquiry, contacted, consultation booked, consultation attended, plan given, treatment accepted, treatment started, and closed (with a reason: not ready, price, chose elsewhere, not suitable, no response). Each stage has required details before anyone can move a record on (for example, a booked date before "consultation booked"). Record dates for each stage, because time between stages shows where people get stuck. Closed reasons are a pick list, not free text, so they can be counted. The practice management system is the source of truth for appointments and payments; the enquiry list mirrors it, not the other way round.`,
      sources: ['marketingskills', 'marquee'],
    },
    {
      id: 'crm-hygiene',
      title: 'Keeping the list tidy and accurate',
      summary: 'Removes duplicates and fills gaps so nobody is called twice or missed.',
      instructions: `Run a weekly tidy-up. Match duplicates on mobile number and email first, then name and postcode; merge rather than delete, keeping the earliest source and the latest activity. Check required fields (name, one contact method, treatment interest, source, consent status) and flag gaps to the person who owns the record. Standardise phone numbers to one format and treatments to one pick list. Never store clinical notes, X-rays or medical history in the marketing list; that belongs in the clinical record. Set a retention rule, for example remove enquiries with no contact for 2 years unless they are patients, and action deletion and opt-out requests promptly.`,
      sources: ['marketingskills', 'marquee'],
    },
    {
      id: 'crm-consent-records',
      title: 'Recording permission properly',
      summary: 'Stores when and how each person agreed to texts or emails.',
      instructions: `For every contact, store consent per channel (email, text, phone calls for marketing) with the date, the wording they agreed to, and where (website form, lead form, front desk). Unsubscribes and "stop" replies update the record within 24 hours and sync to every tool that sends messages. Keep a suppression list of people who opted out so they are never re-imported. If consent status is unknown, treat it as no for marketing messages. When importing old lists, do not assume past patients agreed to marketing; check the original wording first and ask Privacy and permission if unsure.`,
      sources: ['marquee'],
    },
  ],

  attr: [
    {
      id: 'attr-source-of-truth',
      title: 'Counting patients from one trusted place',
      summary: 'Uses the practice\'s own records, not the ad platforms, to count real patients.',
      instructions: `Pick one source of truth for how many patients we won: the practice management system or the enquiry list, where bookings and payments are real. Ad platforms each claim credit using their own rules and will overlap, so never add Google's and Meta's numbers together. Use the platforms to explain where patients came from, not to decide how many there were. Report it plainly: "Google and Facebook together claim 31 consultations; our diary shows 24; the gap is double-counting and people who saw an ad but booked by phone." Look for agreement in direction (both say Google is improving) rather than matching figures to the decimal.`,
      sources: ['marketingskills'],
    },
    {
      id: 'attr-models',
      title: 'Giving fair credit to each channel',
      summary: 'Looks at both how people first found us and what finally made them book.',
      instructions: `Every credit rule tells a different story. First-touch credits whatever introduced the person; last-touch credits whatever came right before they booked. For dental treatments that people think about for weeks, show both side by side: social media often starts the journey and Google search or the practice name often closes it. The gap between the two views is the insight. Treat searches for "Oakmere Dental" as people who already knew us; do not count them as a win for Google ads without saying so. Use the "how did you hear about us" answers as the tiebreaker, especially for word of mouth. Stay consistent month to month so trends can be trusted.`,
      sources: ['marketingskills'],
    },
    {
      id: 'attr-cost-per-patient',
      title: 'Working out what each patient really cost',
      summary: 'Shows the cost per consultation and per treatment patient for each channel.',
      instructions: `For each channel and treatment, report: spend, enquiries, consultations booked, consultations attended, treatments accepted, cost per consultation booked and cost per accepted treatment, alongside treatment value. Wait for results to mature: implants and Invisalign can take 4 to 8 weeks from first enquiry to acceptance, so judge a month's spend after that lag, and say when numbers are still coming in. Small numbers swing wildly; with fewer than about 10 consultations in a period, describe the direction and avoid firm conclusions. Include the cost of time and offers where known. Recommend budget moves only when the difference is large and consistent over several weeks.`,
      sources: ['marketingskills', 'marquee'],
    },
  ],

  ops: [
    {
      id: 'ops-sla',
      title: 'Watching response times',
      summary: 'Spots late call-backs and unanswered messages before patients are lost.',
      instructions: `Track three promises daily: first text within 2 minutes, first call within 1 hour in opening hours, and replies to social messages within 4 working hours. List anything breaching a promise with the person's name, how late, and who owns it, and alert the owner of the task, then the new patients lead if it is still open after another hour. Look for patterns: late call-backs clustered on Monday mornings or lunchtimes suggest a staffing gap, not a person problem. Report the share of enquiries meeting each promise weekly, and suggest one fix at a time, such as a lunchtime cover rota or a callback slot in the diary.`,
      sources: ['marketingskills', 'marquee'],
    },
    {
      id: 'ops-checks',
      title: 'Catching broken forms and tracking',
      summary: 'Runs regular checks so problems are found by us, not by lost patients.',
      instructions: `Weekly, submit a labelled test enquiry through each form and lead form and confirm it reaches the enquiry list, triggers the first text, and appears correctly in reports; delete it afterwards. Check booking links, phone numbers on ads and the website, and that the event sign-up page still works. Watch for sudden drops: if enquiries fall by half from a channel overnight while spend is steady, suspect something broken (a form, a tracking tag, a disapproved ad) before blaming the market. When you cannot find the cause, say so plainly, list what you ruled out, and name the one next check that would settle it. Never make changes to live ads or the website yourself; report the fix and ask.`,
      sources: ['marketingskills', 'marquee'],
    },
    {
      id: 'ops-no-shows',
      title: 'Reducing missed consultations',
      summary: 'Uses reminders and easy rearranging so fewer people miss their appointment.',
      instructions: `Track the no-show rate for consultations by treatment, source and day of week. Standard reminders: confirmation straight after booking (date, time, address, parking, what to bring, who they will meet), a reminder 48 hours before with an easy rearrange link, and a short text 2 hours before. Nervous patients get a reassurance note about what happens and that nothing is done without their agreement. If a person misses, call the same day and offer a new slot, with no blame. If one source has a much higher no-show rate (often social lead forms), flag it so the ads team can add a qualifying question. Reminders are service messages and must not include promotions.`,
      sources: ['marquee'],
    },
  ],

  /* =================================================================
     SOCIAL MEDIA DESK
     ================================================================= */
  'm-social': [
    {
      id: 'social-pillars',
      title: 'Choosing what we talk about',
      summary: 'Sets four themes for posts so every week supports the practice\'s goals.',
      instructions: `Build the calendar on 4 content themes tied to the business goal, with a rough monthly mix: explain (about 40%: how treatments work, costs, myths, answers to real patient questions), reassure (about 25%: first visit walkthroughs, nervous-patient support, what the team does to keep you comfortable), people and place (about 20%: the team, the surgery, local community), and invite (about 15%: free consultations, open evenings, clear calls to book). Each theme should map to a treatment priority for the month. Check every planned post against the question "would a patient save or share this?" If not, improve it or cut it. Revisit the mix monthly using what produced messages and enquiries.`,
      sources: ['agencyAgents', 'marketingskills', 'marquee'],
    },
    {
      id: 'social-measure',
      title: 'Measuring what matters on social',
      summary: 'Judges posts by saves, shares, messages and enquiries, not likes.',
      instructions: `Rank signals by how close they are to a booking: enquiries and booked consultations from social, then messages and link clicks, then saves and shares, then comments, then reach and likes. Each week, look at the top 3 and bottom 3 posts and write one line on why each did well or badly (the opening line, the format, the topic, the time). Repeat what works with a fresh angle; drop formats that consistently underperform after 4 tries. Keep a running list of questions people ask in comments and messages; they are the best source of next month's posts. Report social to the owner in patients and enquiries first, and only mention follower numbers if asked.`,
      sources: ['marketingskills', 'marquee'],
    },
    {
      id: 'social-batching',
      title: 'Making content in a few hours a fortnight',
      summary: 'Plans one filming session that gives two weeks of posts.',
      instructions: `Dental teams are busy, so batch. Every fortnight, book a 30 to 45 minute filming slot with a dentist and one other team member. Prepare a shot list in advance: 4 to 6 short straight-to-camera answers (one question each, under 30 seconds), 3 or 4 behind-the-scenes clips (setting up a surgery, the scanner, the welcome at reception), and a few photos for carousels. From one session, cut Reels, carousel slides, Stories and a quote graphic. Film vertically, in good natural light, with a clip-on microphone. Only film patients with written consent for that use, and keep screens and paperwork with patient details out of shot.`,
      sources: ['marketingskills', 'marquee'],
    },
  ],

  plan: [
    {
      id: 'plan-hooks',
      title: 'Writing opening lines that stop the scroll',
      summary: 'Starts every post with a line that makes the right people want to keep reading.',
      instructions: `The first line or first 2 seconds decide whether anyone stays. Use hooks that promise something useful and true: a question patients really ask ("Does Invisalign hurt?"), a myth to correct ("You're not too old for straighter teeth"), a specific number ("3 things that happen at your first implant consultation"), or a short story ("Last week a patient told us she hadn't smiled in photos for 10 years"; only with her consent). Avoid clickbait the post cannot deliver, shock images, scare tactics about dental disease, or making people feel bad about their teeth. Write three hook options for each post and pick the clearest.`,
      sources: ['marketingskills', 'marquee'],
    },
    {
      id: 'plan-formats',
      title: 'Picking the right format',
      summary: 'Chooses between short videos, swipe-through posts and Stories for each idea.',
      instructions: `Short vertical videos (Reels) are best for reach: 15 to 30 seconds, a hook in the first 3 seconds, captions on screen (most people watch without sound), one idea per video. Carousels are best for saves: about 6 slides in a simple arc (a hook slide, the problem, why it matters, the answer, the detail or proof, and a closing slide with one call to action), large text, consistent design. Stories are for the people who already follow us: polls, question boxes, day-in-the-life, reminders about events, with a link sticker to book. Plan roughly 1 Reel, 1 carousel and 1 lighter post a week, plus Stories most days.`,
      sources: ['marketingskills', 'agencyAgents', 'marquee'],
    },
    {
      id: 'plan-repurpose',
      title: 'Getting more from every idea',
      summary: 'Turns one good piece of content into several posts across different places.',
      instructions: `Start from one strong source: a dentist's answer on video, a blog post, an open evening talk or a frequently asked question. From it, make a short video, a carousel summarising the steps, 2 or 3 Stories with a poll or question box, a quote graphic, and a paragraph for the email newsletter. Space the pieces across 2 to 3 weeks rather than posting them all at once. Adapt each to the platform rather than copying: Facebook audiences are often older and respond to clear practical posts; Instagram favours visuals; TikTok favours raw, unpolished explanation. Keep a library of past posts tagged by treatment and theme, and refresh winners after 3 to 6 months.`,
      sources: ['marketingskills'],
    },
    {
      id: 'plan-calendar',
      title: 'Building the monthly calendar',
      summary: 'Lays out the month so every post has a purpose and a date.',
      instructions: `Plan a month ahead and fix the dates that matter first: open evenings, school holidays, local events, awareness days that genuinely fit (National Smile Month in May to June, Mouth Cancer Action Month in November), and the treatment focus for the month. Then fill each week with the agreed mix. For every post, record: working title, format, theme, treatment, hook, call to action, who needs to film or approve it, and whether a patient features (and if their consent is on file). Leave one flexible slot a week for something timely. Flag posts that need the owner's sign-off, such as anything with prices, patient stories or before-and-after images.`,
      sources: ['marketingskills', 'marquee'],
    },
  ],

  trend: [
    {
      id: 'trend-spotting',
      title: 'Spotting what is working right now',
      summary: 'Checks what dental and local accounts are doing well this week.',
      instructions: `Each week, review what is performing for UK dental practices, cosmetic clinics and local Maidenhead businesses on Instagram, TikTok and YouTube Shorts. Look at formats, not individual posts: myth-busting to camera, side-by-side comparisons, point-of-view behind the scenes, "what happens at your first visit", reacting to common questions. For each trend, note the format, why it works (curiosity, reassurance, humour), and how Oakmere could use it in its own voice. Give a short list of 3 to 5 ideas ranked by fit with this month's treatment goals and how easy they are to film. Never copy another practice's content, wording or images.`,
      sources: ['agencyAgents', 'marketingskills', 'marquee'],
    },
    {
      id: 'trend-fit',
      title: 'Deciding if a trend suits a dental practice',
      summary: 'Filters out trends that would look unprofessional or break the rules.',
      instructions: `Run each trend through four checks. Brand fit: would a calm, trusted local dentist do this? Skip anything mocking patients, crude humour, or dance trends the team would feel awkward doing. Rules: does it involve health claims, prescription-only medicines, before-and-after images or patients? If so, send it to Quality and Legal first. Rights: business accounts must use sounds from the platform's commercial music library or original audio, not chart music. Safety: avoid trends that encourage DIY dental treatments, at-home whitening hacks or anything that could hurt someone. A trend that passes is used as a format, adapted to answer a real patient question.`,
      sources: ['agencyAgents', 'marquee'],
    },
    {
      id: 'trend-video-shape',
      title: 'Structuring short videos',
      summary: 'Gives each short video a simple shape: hook, problem, answer, next step.',
      instructions: `Use a simple structure for 15 to 30 second videos: 0 to 3 seconds, the hook (spoken line, on-screen text and a visual that all say the same thing at once); 3 to 10 seconds, the problem or question and why it matters; 10 to 25 seconds, the clear answer; final seconds, one next step ("Questions? Message us" or "Free consultation, link in bio"). For list videos, one point every 5 to 8 seconds. Captions on every video: no more than 2 lines on screen, 3 to 5 words per line, timed to speech, kept out of the bottom fifth of the screen where app buttons sit. Show the end result first in tutorials.`,
      sources: ['marketingskills', 'agencyAgents'],
    },
  ],

  comm: [
    {
      id: 'comm-replies',
      title: 'Replying to comments and messages',
      summary: 'Answers quickly and warmly, and moves anything personal to a private chat.',
      instructions: `Reply to comments and messages within a few working hours, warmly and briefly, in the practice voice. General questions (do you offer Invisalign, where do you park, do you see nervous patients) get a direct answer and an invitation to book or message. Anything about a person's own teeth, pain, symptoms, treatment or price for their case moves to a private message or a phone call; never give clinical advice in public. For urgent pain or swelling, give the practice phone number and NHS 111 out of hours. Never confirm or hint that someone is a patient in public, even if they say so first. Thank people for kind comments by name. Draft replies for the owner's approval when the topic is sensitive.`,
      sources: ['wshobson', 'marquee'],
    },
    {
      id: 'comm-negative',
      title: 'Handling complaints and bad reviews',
      summary: 'Sends every complaint to you first, and drafts a calm reply that moves it offline.',
      instructions: `Every negative comment or review goes to the owner before any reply. Draft a response that acknowledges the feeling without arguing or admitting liability, apologises for the experience, does not mention any treatment or personal details (confirming someone is a patient breaches confidentiality), and invites them to contact the practice manager directly with a name and phone number. Keep it under 70 words. Reply within 1 to 2 working days. Do not delete genuine criticism. Report fake or abusive reviews through the platform's own process. Follow up offline using the practice complaints procedure, and log themes so recurring problems reach the owner.`,
      sources: ['wshobson', 'marquee'],
    },
    {
      id: 'comm-reviews',
      title: 'Getting more genuine reviews',
      summary: 'Asks every happy patient for a review in a fair way that follows the rules.',
      instructions: `Ask every patient, not only those you expect to be happy: selectively asking only satisfied patients (review gating) and offering rewards for reviews are against Google's rules and UK consumer law, which bans fake and incentivised reviews that are not disclosed. Ask at a good moment (end of treatment, aligners off) with a direct link and a short message, once, plus one reminder at most. Never write reviews for patients, post staff reviews, or edit what patients say. Reply to all reviews, positive or negative, without revealing any treatment or personal details. Use reviews on the website or ads only as they were written, with the patient's permission where they can be identified.`,
      sources: ['marketingskills', 'marquee'],
    },
  ],

  sched: [
    {
      id: 'sched-timing',
      title: 'Posting at the right times',
      summary: 'Picks posting times from our own results, not guesswork.',
      instructions: `Start with sensible defaults for a local practice: weekday early evenings (about 6 to 8pm) and Sunday evenings, when people browse and plan their week, plus a lunchtime slot for Facebook. After 6 weeks, use the account's own insights to find when followers are online and which time slots produced the most saves, messages and clicks, and adjust. Keep a steady rhythm rather than bursts: 3 feed posts a week beats 9 one week and none the next. Avoid posting promotions at sensitive moments (local tragedies, national mourning). Schedule ahead, but check the queue each morning in case anything needs pausing.`,
      sources: ['marketingskills', 'marquee'],
    },
    {
      id: 'sched-specs',
      title: 'Getting sizes and captions right',
      summary: 'Makes sure every post looks right on each app and is easy for everyone to read.',
      instructions: `Use the right shapes: vertical 9:16 (1080 by 1920) for Reels, Stories and TikTok, 4:5 (1080 by 1350) for feed posts and carousels. Keep text and faces inside the central safe area, away from the top and bottom where app buttons sit. Burn captions into videos and add alt text to images for people using screen readers. Captions: front-load the point in the first line, keep paragraphs short, one call to action, 3 to 5 relevant hashtags (local and treatment, such as #MaidenheadDentist and #Invisalign), no hashtag walls. Put links in the bio or a Story link sticker on Instagram. Check spelling, names, prices and dates one last time before scheduling.`,
      sources: ['marketingskills', 'agencyAgents'],
    },
    {
      id: 'sched-final-check',
      title: 'The final check before anything goes out',
      summary: 'Confirms approval, consent and the rules before a post is ready to publish.',
      instructions: `Before marking a post ready, confirm: the owner has approved it (posts with prices, offers, patient stories or before-and-after images always need explicit approval); any patient shown has written consent for this specific use, and the date and scope are on file; Quality and Legal has passed any claim, price or offer; links work and lead to the right page; the post is scheduled on the right account and date; and nothing in the background shows patient records, screens or other patients. In this version the owner presses publish, so the status is "ready to publish", never "posted", until the owner confirms.`,
      sources: ['marquee'],
    },
  ],

  /* =================================================================
     ADS DESK
     ================================================================= */
  'm-ads': [
    {
      id: 'ads-budget-split',
      title: 'Deciding where the ad money goes',
      summary: 'Splits the budget between what already works and a small amount for trying new things.',
      instructions: `Put most of the budget where people are already looking: Google search for high-value treatments in the local area. Use Facebook and Instagram to create demand for implants and Invisalign among people not yet searching. Keep roughly 70 to 80% on proven campaigns and 20 to 30% on testing new ideas, audiences or ad styles. Judge each channel on cost per consultation booked and cost per accepted treatment against the ceilings the new patients lead sets, not on clicks. Report searches for the practice name separately from other searches: people searching "Oakmere Dental" already knew us, so their cheap results should not hide expensive general searches.`,
      sources: ['marketingskills', 'agencyAgents'],
    },
    {
      id: 'ads-scaling',
      title: 'Moving and growing budgets safely',
      summary: 'Changes budgets in small steps and waits to see the effect.',
      instructions: `Change budgets in steps of about 20%, never 30% or more at once, because large jumps reset the platforms' learning and make results jumpy. Wait 3 to 5 days between increases. When results look worse, check before acting: is the number of results too small to judge, is the campaign still learning, or are bookings simply arriving late? A rise in cost per consultation is a question, not a verdict. Every proposed change states: current state, the change, the expected effect as a range of consultations, and how to roll it back. All budget changes are proposals for the owner to approve, and the monthly cap in the context is never exceeded without asking.`,
      sources: ['marketingskills'],
    },
    {
      id: 'ads-weekly-check',
      title: 'Reviewing the ads every week',
      summary: 'Checks the ads in a fixed order and decides one action for each issue.',
      instructions: `Check in this order, because problems higher up explain symptoms lower down: spend against pace, then traffic (clicks, cost per click), then enquiries and consultations, then the ads themselves (tired creative, disapprovals), then the landing page, then tracking. End each issue with one decision: hold (normal ups and downs, too little data, still learning), fix (named problem, known fix), test (an idea with a measure and a stop date) or investigate (the numbers cannot be trusted yet, which overrides the others). Close with a summary under 200 words for the owner: results against target, the biggest changes and their likely cause, and next week's decisions.`,
      sources: ['marketingskills'],
    },
    {
      id: 'ads-landing',
      title: 'Matching the ad to the page',
      summary: 'Makes sure the page people land on says what the ad promised.',
      instructions: `The landing page headline should repeat the promise of the ad that sent people there: an ad for "Invisalign in Maidenhead, free consultation" lands on an Invisalign page whose headline says exactly that, not on the homepage. Each treatment gets its own page with: a clear headline, the price or "from" price if published, what the treatment involves, who it suits, the dentist's name and GDC number, real reviews, answers to the main worries, finance explained, and one booking form near the top and again at the bottom. Remove distractions such as the full site menu where possible. Check the page loads fast on a phone. Always have at least one test running on the page, such as a headline or form change.`,
      sources: ['marketingskills', 'marquee'],
    },
  ],

  google: [
    {
      id: 'google-structure',
      title: 'Setting up Google search ads properly',
      summary: 'Organises ads by treatment so each search sees the most relevant ad.',
      instructions: `Build one campaign per main treatment (implants, Invisalign, whitening, emergency) so budgets can be controlled separately, and a separate campaign for searches of the practice name. Within each, group keywords by theme: cost questions ("invisalign cost maidenhead"), location ("dental implants near me", "implants maidenhead"), and comparisons ("invisalign vs braces"). Use phrase and exact match for core terms; use broad match only with smart bidding, enough conversion data and a strong negative list. Target people located in the area (presence), not just people interested in it, about 10 to 20 miles depending on treatment. Run ads in the hours the phone is answered, or remove call options outside them. Name everything consistently: platform, treatment, theme, date.`,
      sources: ['marketingskills', 'marquee'],
    },
    {
      id: 'google-negatives',
      title: 'Stopping wasted clicks',
      summary: 'Blocks searches that will never become patients.',
      instructions: `Read the search terms report weekly and add negatives based on what people actually typed, never on guesses. Common waste for dental ads: jobs and training ("dental nurse jobs", "course"), NHS-only requests where the practice is private, "free" and "cheap" treatment hunting, treatment abroad ("turkey teeth"), DIY and products ("whitening strips", "at home kit"), other practices by name, and far-away towns. Remember the report shows a sample, so do not judge on a handful of clicks; before calling a term wasteful, check whether its spend is above the most we can pay for a consultation. Keep shared negative lists at account level for terms that are never relevant.`,
      sources: ['marketingskills', 'marquee'],
    },
    {
      id: 'google-rsa',
      title: 'Writing Google ad headlines people click',
      summary: 'Writes short, specific headlines that fit Google\'s limits and the rules.',
      instructions: `Responsive search ads take up to 15 headlines (30 characters each) and 4 descriptions (90 characters each); provide at least 10 distinct headlines. Mix types: treatment plus town ("Invisalign in Maidenhead"), the offer ("Free Invisalign Consultation"), reassurance ("Nervous Patients Welcome"), proof that can be backed up ("Rated 4.9 on Google" only if true and current), price ("Implants From £X" only if published and genuinely available), and the next step ("Book Online in 2 Minutes"). Pin only when a line must always show. Add sitelinks (25 characters), callouts and a call asset. Avoid "best", "pain-free", "guaranteed", "permanent" and exclamation marks. Never mention prescription-only medicines such as anti-wrinkle injections.`,
      sources: ['marketingskills', 'marquee'],
    },
    {
      id: 'google-bidding',
      title: 'Choosing how much to bid',
      summary: 'Starts with controlled bids, then lets Google bid automatically once it has enough data.',
      instructions: `Start new campaigns with maximise clicks with a cost-per-click cap, or manual bidding, to gather data cheaply. Once a campaign is reliably recording booked consultations (as a rule of thumb, around 30 or more a month, ideally 50), switch to maximise conversions and then target cost per acquisition set near the recent average. Optimise for booked consultations, not form starts or page views, and mark only meaningful actions as primary conversions. Do not change targets more than about 20% at a time or more than once every couple of weeks. Expect a learning period of 1 to 2 weeks after changes, and do not judge results during it.`,
      sources: ['marketingskills'],
    },
  ],

  meta: [
    {
      id: 'meta-broad',
      title: 'Letting good ads find the right people',
      summary: 'Uses broad local audiences and lets the ad itself attract the right patients.',
      instructions: `Meta's delivery system now finds people mainly through the ad content, so keep targeting simple and let creative do the work: a local radius around the practice (about 10 to 15 miles), adults 25 to 65 for implants and Invisalign, and few other limits. Detailed targeting based on health topics has been removed, and you must not try to rebuild it with proxies. Instead, make the ad speak clearly to one kind of person and one worry, so the right people stop and the wrong ones scroll past. Treatment and cosmetic procedure ads must target over 18s. Do not upload patient lists for targeting, because it reveals who is a patient.`,
      sources: ['marketingskills', 'agencyAgents', 'marquee'],
    },
    {
      id: 'meta-creative-testing',
      title: 'Testing new ad ideas regularly',
      summary: 'Tries a few new ad ideas every month and keeps the ones that bring consultations.',
      instructions: `Test 3 to 5 new ad concepts per month. Test in order of impact: the angle first (cost, nerves, confidence for an event, convenience), then the opening hook, then the visual style, then the wording, then the button. Native-looking content (a dentist talking to a phone camera, a real team photo) usually beats polished stock imagery. Video: hook in the first 3 seconds, captions on, 15 to 30 seconds. Watch frequency: if the same people see an ad more than about 2 to 3 times a week in prospecting, or cost per lead rises about 30%, refresh it. Write each test so it can lose: name the measure, the comparison and the expected result.`,
      sources: ['marketingskills', 'agencyAgents'],
    },
    {
      id: 'meta-lead-forms',
      title: 'Building lead forms that bring real enquiries',
      summary: 'Uses short forms with a couple of honest questions to filter out time-wasters.',
      instructions: `Use the higher-intent form type, which adds a review screen before submitting, to cut accidental and junk leads. Ask 2 or 3 short qualifying questions: treatment of interest, when they want to start, and whether they want to hear about pay-monthly options. Add an optional, unticked consent box for marketing texts and emails, link the privacy notice, and make the thank-you screen say what happens next and offer a booking link and the phone number. Send leads to the enquiry list instantly so the 2-minute reply fires; lead form enquiries go cold faster than website ones. Track lead quality by consultations booked per 10 leads, not just cost per lead.`,
      sources: ['agencyAgents', 'marquee'],
    },
    {
      id: 'meta-policy',
      title: 'Staying within Facebook and Instagram ad rules',
      summary: 'Avoids wording and images that Meta rejects for health and cosmetic ads.',
      instructions: `Meta does not allow ads that assert or imply someone's personal characteristics, including health: avoid "Are you embarrassed by your crooked teeth?" or "Your missing teeth are holding you back"; say "Thinking about straighter teeth?" instead. Avoid images that encourage negative self-image, such as zoomed-in close-ups of damaged teeth. Meta restricts before-and-after images for cosmetic procedures, so check the current policy before planning one and expect rejection. Ads for cosmetic treatments must be limited to over 18s. Never advertise prescription-only medicines (such as anti-wrinkle injections). If an ad is rejected, read the reason, fix the cause and resubmit; do not try to disguise the content.`,
      sources: ['marquee'],
    },
  ],

  guard: [
    {
      id: 'guard-pacing',
      title: 'Keeping spending on track',
      summary: 'Checks spend against the monthly budget so there are no surprises.',
      instructions: `Every hour, compare spend so far with expected spend by today (monthly budget multiplied by the share of the month gone) for each campaign and in total. Flag overspend when any campaign is more than about 15% ahead of pace, or the total is on course to exceed the monthly cap. Flag underspend when a campaign is more than about 25% behind, which often means disapproved ads, a tiny audience or a bid too low. Remember platforms can spend up to twice the daily budget on a single day while averaging out over the month. Report in pounds and days ("on course to spend £1,240 of £1,100 by 30 November"), with the likely cause.`,
      sources: ['marketingskills', 'marquee'],
    },
    {
      id: 'guard-anomalies',
      title: 'Spotting sudden problems',
      summary: 'Notices when spend or results jump or drop in a way that needs a look.',
      instructions: `Compare today with the same weekday over the last four weeks. Alert on: spend up more than 50% with no matching rise in enquiries; cost per click up more than 40%; clicks with zero enquiries for 24 hours where enquiries usually come daily; a sudden drop in recorded conversions (often broken tracking, not a bad day); new disapprovals; or budget being spent outside the target area. Before alerting, check obvious causes (a bank holiday, a deliberate change in the change history). Each alert says what happened, by how much, the likely cause, and the suggested action, ranked by how much money is at risk.`,
      sources: ['marketingskills', 'marquee'],
    },
    {
      id: 'guard-stop',
      title: 'Using the emergency stop',
      summary: 'Can pause all ads at once if something goes badly wrong, then tells you why.',
      instructions: `Pausing everything is for emergencies only: spend clearly running away (for example, more than the whole weekly budget in a day), an ad running with wrong prices or a rule-breaking claim, the website or booking system down so clicks are wasted, or the owner asks. In those cases, pause first, then tell the owner immediately: what was paused, why, what it cost, and what is needed to restart. Keep a list of exactly what was paused so it can be restored as it was. For anything less severe, propose rather than act. Never raise budgets or launch anything; this role can only slow or stop spend.`,
      sources: ['marquee'],
    },
  ],

  track: [
    {
      id: 'track-what-counts',
      title: 'Deciding what counts as a success',
      summary: 'Tells Google and Facebook about real bookings, not just clicks or page visits.',
      instructions: `Decide exactly what counts before setting anything up. A confirmed enquiry (the form actually submitted and the thank-you shown) counts; a click on the submit button does not, because it includes failed attempts and bots. Better still is a booked consultation, and best is an attended consultation or accepted treatment fed back from the enquiry list. Make booked consultations the main goal the platforms optimise for, and keep page views, calls under 60 seconds and form starts as secondary signals only. Give each success a value where possible (for example, a typical consultation value) so bidding favours high-value treatments. Check that a recorded success matches a real entry in the diary.`,
      sources: ['marketingskills', 'marquee'],
    },
    {
      id: 'track-offline',
      title: 'Sending bookings back to the ad platforms',
      summary: 'Lets Google and Facebook learn which clicks became real patients.',
      instructions: `Most dental bookings happen by phone or in the practice, so the ad platforms never see them unless we tell them. Store the click ID that comes with each ad click (Google's and Meta's) alongside the enquiry, then upload stage changes (consultation booked, attended, treatment accepted) back to each platform daily or weekly. Send only what is needed: the click ID, the stage name and the time, plus a value if helpful. Do not send treatment details, medical information or anything that reveals a health condition. Matching by hashed email or phone (enhanced conversions or the Conversions API) is only used with a clear legal basis and consent, and never for special category details.`,
      sources: ['marketingskills', 'marquee'],
    },
    {
      id: 'track-verify',
      title: 'Checking tracking really works',
      summary: 'Proves each success is being recorded before trusting the numbers.',
      instructions: `A tag firing is not the same as a conversion arriving. Verify both separately: use the preview tool to see the tag fire on the real success moment, then confirm the platform received it (Google's conversion diagnostics, Meta's Events Manager). Label every finding as seen, reported or inferred. After any website change, retest. Watch for double counting (two tags for one form), thank-you pages that count refreshes, and test enquiries that send real conversions to live accounts. Advertising cookies and pixels need the visitor's consent under UK rules, so check the cookie banner blocks them until people agree, and expect some data loss from people who decline.`,
      sources: ['marketingskills', 'marquee'],
    },
    {
      id: 'track-naming',
      title: 'Tagging links consistently',
      summary: 'Labels every link the same way so results are easy to compare.',
      instructions: `Every link in ads, emails, social bios and printed QR codes carries tracking tags in one agreed style, all lower case with hyphens: source (google, facebook, instagram, newsletter, leaflet), medium (cpc, paid-social, email, social, print), campaign (treatment and month, for example implants-2026-11) and, where useful, content for the ad or post version. Keep the list of allowed values in one shared sheet and reject anything that does not match, because "Facebook", "facebook" and "fb" become three separate rows in reports. Use Google's auto-tagging alongside these tags, and never put personal details (names, emails, phone numbers) in a link.`,
      sources: ['marketingskills', 'marquee'],
    },
  ],

  /* =================================================================
     CRAFT BENCH
     ================================================================= */
  copy: [
    {
      id: 'copy-three-questions',
      title: 'Making every line specific',
      summary: 'Tests each sentence to make sure it is clear, true and could only be about Oakmere.',
      instructions: `Run every line through three questions. Can the reader picture it? "Your first visit takes 45 minutes and nothing is done without your say-so" beats "a relaxing experience". Can it be proven true or false? A checkable fact is a claim; "world-class care" is decoration. Could another practice write the same sentence? If so, rewrite it with what is specific to Oakmere: the dentist's name, the town, the scanner, the parking, the actual price. If the fact needed is missing, mark it as [NEED: detail] rather than inventing it. Keep most lines plain and save one or two punchy lines per piece, usually the headline. Before handing over, check every change is better, not just different.`,
      sources: ['marketingskills'],
    },
    {
      id: 'copy-headlines',
      title: 'Writing headlines people click',
      summary: 'Writes short, clear headlines that tell people what they get.',
      instructions: `A headline states the single most important message. Patterns that suit dentistry: outcome without the worry ("Straighter teeth without metal braces"), the treatment plus town plus next step ("Dental implants in Maidenhead: free consultation"), a real question in the patient's words ("How much do dental implants cost?"), or the process made simple ("Invisalign in 4 steps"). Clear beats clever every time. Use numbers only when true and specific. Write 3 options, explain the reason for each in one line, and recommend one. For ads and landing pages, match the headline to what the person searched or clicked. Never promise results ("perfect smile"), speed you cannot guarantee, or comfort you cannot promise ("pain-free").`,
      sources: ['marketingskills', 'marquee'],
    },
    {
      id: 'copy-structure',
      title: 'Building pages and ads that persuade gently',
      summary: 'Lays out the worry, the answer and the next step in a calm, honest order.',
      instructions: `For treatment pages and longer ads, follow a calm order: name the situation the reader recognises, show what life could look like after, explain how the treatment gets them there, prove it (reviews, the dentist's experience, real photos with consent), handle the main worries (cost, pain, time, what if I'm nervous), and end with one clear next step. Problem then solution works for health if you describe the problem with empathy and never shame or frighten. Calls to action follow "action plus what they get": "Book my free consultation", "See implant prices", never "Submit" or "Click here". One idea per section, 3 to 5 benefits at most, short paragraphs.`,
      sources: ['marketingskills', 'marquee'],
    },
    {
      id: 'copy-no-ai-tells',
      title: 'Writing that sounds human',
      summary: 'Avoids the phrases that make writing sound like a robot or a hard sell.',
      instructions: `Readers who spot machine-sounding copy start doubting everything else. Avoid: "it's not X, it's Y" reveals; lists of negatives ("no wait, no fuss, no pain"); a claim followed by a trail of extra clauses; self-answered questions ("The result? A smile you'll love"); stock openers ("In today's busy world", "Say goodbye to", "Unlock your best smile"); vague power words (seamless, transform, elevate, journey, cutting-edge); and dashes in headlines, ads and texts. Use at most one list of three per section. Vary sentence length. Say what actually happens, with a real fact, instead of an adjective. Read it aloud: if a receptionist would not say it on the phone, rewrite it.`,
      sources: ['marketingskills', 'voltagent'],
    },
    {
      id: 'copy-claims',
      title: 'Only saying what we can prove',
      summary: 'Keeps every claim honest and explains what proof would allow a stronger one.',
      instructions: `Write only claims the practice can support with evidence held on file. When a requested claim is not supported, do not quietly drop it: name it, say why it falls short, offer the closest honest version, and say what would unlock the original. For example, "Maidenhead's best dentist" becomes "Rated 4.9 by 312 patients on Google" if that is true and current, and the original would need independent evidence that is very hard to get. "Painless" becomes "We'll go at your pace and check in with you throughout". Clinical results are described as typical outcomes with individual variation. Prices state what is included. Every patient-facing piece then goes to Quality and Legal.`,
      sources: ['marketingskills', 'marquee'],
    },
  ],

  design: [
    {
      id: 'design-brand-system',
      title: 'Keeping every graphic on brand',
      summary: 'Uses the same colours, fonts and style so posts look like Oakmere at a glance.',
      instructions: `Work from a small, fixed kit: 2 brand colours plus a neutral, 1 or 2 fonts, a logo lock-up for light and dark backgrounds, and 3 or 4 templates (quote, tip carousel, event announcement, team intro). Every graphic uses the kit; no new fonts or colours per post. Photography style: real people from the practice in natural light, calm and warm, not stock photos of models with impossibly white teeth. The first slide or frame sets the style for the rest of a carousel. Keep layouts simple, with generous space and one focal point. Review the grid every month so the feed looks consistent and recognisable.`,
      sources: ['agencyAgents', 'marketingskills'],
    },
    {
      id: 'design-legibility',
      title: 'Making graphics easy to read',
      summary: 'Uses big text, strong contrast and safe margins so everyone can read posts on a phone.',
      instructions: `Design for a phone held at arm's length. Body text on graphics at least about 40 pixels on a 1080-wide canvas, headlines larger, and no more than about 20 words per slide. Text and background contrast should meet accessibility guidance (a ratio of at least 4.5 to 1 for normal text). Keep important text away from the top and bottom 15 to 20% of vertical formats, where app buttons and captions sit. Do not put text in images that also need to work as ads without checking it stays readable at small sizes. Provide alt text for every image. Export as high-quality JPG or PNG at the platform's exact dimensions.`,
      sources: ['agencyAgents', 'marketingskills'],
    },
    {
      id: 'design-clinical-images',
      title: 'Using before-and-after and clinical photos responsibly',
      summary: 'Shows only real, unedited, consented photos of our own patients.',
      instructions: `Before-and-after images must be real photos of the practice's own patients, treated by the named clinician, with written consent for the exact use (website, social, ads) on file. Take both photos in the same conditions: same angle, distance, lighting and camera settings. Edit only to crop or to correct overall exposure equally on both; never whiten, smooth or alter teeth or skin. Show typical results, not just the best case, and add a short note that results vary from person to person. Hide anything that identifies the patient unless they agreed to be identifiable. Avoid graphic surgical images. Do not use before-and-after images in Facebook or Instagram ads without checking current Meta policy.`,
      sources: ['marquee'],
    },
  ],

  video: [
    {
      id: 'video-edit-structure',
      title: 'Editing short clips that keep attention',
      summary: 'Cuts videos tight, with a strong start and captions throughout.',
      instructions: `Build a rough cut that tells the story first (hook, problem, answer, next step), then tighten. Cut every pause, "um" and repeated start; trim so the first word is spoken within half a second. Open on the most interesting moment, not a logo. Change the shot or add a visual every 2 to 4 seconds in short clips (a zoom, a cutaway of the scanner, on-screen text) without becoming frantic. Burn in captions: 2 lines at most, 3 to 5 words per line, highlighted key words, kept in the middle of the screen. End with a simple card showing the next step. Keep finished clips between 15 and 30 seconds for Reels and ads, up to 60 seconds for explainers.`,
      sources: ['marketingskills', 'agencyAgents'],
    },
    {
      id: 'video-quality',
      title: 'Getting clear sound and picture',
      summary: 'Fixes sound and light first, because poor audio makes people scroll away.',
      instructions: `Audio matters as much as the picture: use a clip-on microphone, remove background noise from the suction and compressor, keep voice levels consistent across clips, and keep any music quiet underneath speech. Correct colour so skin tones and teeth look natural; never whiten teeth or alter clinical results in the edit. Film and export vertical 9:16 at 1080 by 1920, plus a 4:5 or 1:1 version for feed ads where needed. Use only music from the platform's commercial library or licensed tracks. Before export, check for patient names on screens, paperwork or other patients in the background, and blur anything you find.`,
      sources: ['agencyAgents', 'marquee'],
    },
    {
      id: 'video-repurpose',
      title: 'Making several clips from one recording',
      summary: 'Turns one longer video into several short ones for different places.',
      instructions: `From any longer recording (a dentist interview, an open evening talk, a treatment explainer), pull out every self-contained answer of 15 to 45 seconds that makes sense on its own. Give each clip its own hook line on screen and its own caption. Make a vertical version for Reels, Stories and TikTok and a square or 4:5 version for Facebook feed and ads. Keep a simple library of clips tagged by treatment, question and who appears, with each person's consent recorded. Reuse strong clips in ads only after the person featured has agreed to advertising use, which is separate from consent for social posts.`,
      sources: ['marketingskills', 'marquee'],
    },
  ],

  research: [
    {
      id: 'research-competitors',
      title: 'Checking what other local practices offer',
      summary: 'Looks at nearby practices\' prices, offers and reviews to find where Oakmere stands out.',
      instructions: `Review 5 to 8 private practices within about 20 minutes of Maidenhead. For each, note: treatments promoted, published prices and "from" prices, current offers, finance options, review rating and count, what patients praise and complain about, how they handle nervous patients, and the style of their social media and ads (visible in Meta's Ad Library and in Google results). Record the date and the link for every fact, since prices change. Summarise where Oakmere is clearly different, where it is behind, and gaps nobody fills well. Be fair and factual; never copy wording or images, and never suggest comparison claims in ads unless they are fair, verifiable and approved by Quality and Legal.`,
      sources: ['marketingskills', 'voltagent', 'marquee'],
    },
    {
      id: 'research-search-demand',
      title: 'Finding out what patients search for',
      summary: 'Looks at what people in the area type into Google about treatments.',
      instructions: `Build a list of the searches people make about each treatment: cost ("how much are dental implants uk"), comparison ("invisalign vs braces"), worry ("does implant surgery hurt"), local ("dentist maidenhead nervous patients"), and timing ("how long does invisalign take"). Use Google's keyword planner, the "people also ask" boxes, Google Trends and the practice's own search terms report. Group searches by intent: researching, comparing, ready to book. Hand the ready-to-book group to the ads team and the researching and comparing groups to social and the website as content ideas. Note seasonal patterns, such as whitening interest before summer and weddings.`,
      sources: ['marketingskills', 'voltagent'],
    },
    {
      id: 'research-evidence',
      title: 'Checking facts before they are used',
      summary: 'Makes sure every fact, statistic and quote comes from a reliable, dated source.',
      instructions: `Every fact we may use with patients needs a source, a date and a link. Prefer official and professional sources: the NHS, the General Dental Council, the British Dental Association, the Oral Health Foundation, and the manufacturer's own published information for products like Invisalign. Treat blogs, other practices' websites and social posts as leads to check, not proof. Write findings as "what the source says" separately from "what we conclude". Flag anything older than about 2 years or that only one source supports. Never pass on a statistic for an ad unless Quality and Legal agrees it can be substantiated.`,
      sources: ['voltagent', 'marquee'],
    },
  ],

  analyst: [
    {
      id: 'analyst-kpis',
      title: 'Choosing the few numbers that matter',
      summary: 'Tracks 5 to 7 key numbers so everyone can see how the practice is doing.',
      instructions: `Keep the headline set to 5 to 7 numbers, each with a target and a comparison: new enquiries, share contacted within an hour, consultations booked, consultations attended, treatments accepted and their value, cost per consultation booked, and cost per accepted treatment. Break each down by treatment and channel only underneath the headline view. Define every number once in writing (for example, "booked" means a date in the diary, not a request) and never change a definition without saying so. Each team gets its own working view (social: saves, messages, enquiries from social; ads: spend, pace, cost per consultation), but they all roll up to the same headline numbers.`,
      sources: ['wshobson', 'marquee'],
    },
    {
      id: 'analyst-story',
      title: 'Turning numbers into a clear story',
      summary: 'Explains what changed, why, and what to do about it, in plain words.',
      instructions: `Structure every report as: the headline (on or off target, by how much), the context (compared with last month and the target), the two or three things that explain the change, and the recommended action. Lead with the "so what", not the method. Show at most one chart per point, labelled in plain words, with the target marked. Be careful with small numbers: with fewer than about 10 events, describe direction, not percentages, and avoid declaring trends from one week. Separate facts from interpretation, and say how confident you are. Use the same order and format every month so the owner learns where to look.`,
      sources: ['wshobson', 'marquee'],
    },
    {
      id: 'analyst-monthly-call',
      title: 'Preparing the monthly results call',
      summary: 'Gets a one-page summary ready so the monthly call takes 20 minutes, not an hour.',
      instructions: `Prepare a one-page summary for Sam's monthly call with the owner: results against the monthly goal, the three biggest wins and three biggest problems, what each team did and what it led to, spend against budget, and decisions needed. Add a short list of questions the owner is likely to ask with the answers ready ("Why did implant enquiries drop?"). Include results that are still coming in (consultations from last month's ads) with a note on when they will be known. Keep it to whole numbers and pounds, avoid marketing terms, and attach detail only as an appendix.`,
      sources: ['wshobson', 'marquee'],
    },
  ],

  /* =================================================================
     FINAL CHECKS (QUALITY AND LEGAL)
     ================================================================= */
  proof: [
    {
      id: 'proof-facts',
      title: 'Checking every fact, price and date',
      summary: 'Makes sure names, prices, dates and numbers are right before anything goes out.',
      instructions: `Check every factual detail against the client context: prices and what they include, "from" prices (a fair share of patients must actually be able to get that price), dates and days of the week (does 14 November really fall on a Friday?), times, the practice name, address and phone number, clinicians' names, titles and GDC numbers, review ratings and counts, and finance terms. Remove any statistic, result or claim that is not in the context or not backed by evidence on file. Check every link goes to the right page. List each correction in a short note so the writer learns from it.`,
      sources: ['marquee'],
    },
    {
      id: 'proof-sweeps',
      title: 'Editing in several focused passes',
      summary: 'Reads the text several times, each time looking for one kind of problem.',
      instructions: `Edit in separate passes, one concern at a time, then re-check earlier passes. 1) Clarity: can a busy person understand it on first read? Cut jargon and long sentences. 2) Voice: does it sound like Oakmere throughout? 3) So what: does each claim connect to something the patient cares about? 4) Prove it: is every claim supported? 5) Specificity: replace vague words with facts. 6) Feeling: is there warmth without pressure? 7) Risk: are worries addressed and next steps clear and low-risk (free consultation, no obligation)? Finally check spelling, grammar and British English (colour, centre, organise, programme, enquiry), consistent capitals, and no double spaces.`,
      sources: ['marketingskills'],
    },
    {
      id: 'proof-format',
      title: 'Checking length and format limits',
      summary: 'Makes sure text fits each channel\'s character limits and layout.',
      instructions: `Check each piece fits where it is going: Google headlines 30 characters and descriptions 90; sitelinks and callouts 25; Meta primary text front-loads the point in the first 125 characters; text messages about 160 characters per segment (emojis and curly quotes reduce this); email subject lines about 40 to 60 characters; calendar titles under 8 words. Check every call to action is a clear verb plus what they get, and there is only one main one. Check that dates and times use one format (Friday 14 November, 6.30pm). Flag anything that will be cut off on a phone screen.`,
      sources: ['marketingskills', 'marquee'],
    },
  ],

  voice: [
    {
      id: 'voice-guide',
      title: 'Sounding like Oakmere',
      summary: 'Keeps everything calm, warm and plain, like a trusted local dentist talking.',
      instructions: `Oakmere's voice is calm, warm, plain and quietly confident. It sounds like a kind, experienced dentist explaining something to one nervous adult across the desk. We are: clear rather than clever, reassuring rather than salesy, specific rather than vague, honest about cost and effort. We are not: pushy, jokey about pain or fear, clinical and cold, or full of hype. Use "we" and "you", short sentences, everyday words ("tooth replacement", not "edentulous span"), British spelling, and no exclamation marks or emojis in ads. Explain, don't sell: what happens, how long it takes, what it costs, how to book.`,
      sources: ['agencyAgents', 'marquee'],
    },
    {
      id: 'voice-tone',
      title: 'Adjusting the tone for each situation',
      summary: 'Keeps the same personality but changes the tone for ads, replies, complaints and reminders.',
      instructions: `The voice stays the same; the tone flexes. Ads and headlines: a little bolder and very direct, still no hype. Social posts: friendly and conversational, a touch of warmth or light humour about everyday things, never about pain, fear or people's teeth. Nervous-patient content: slow, gentle, lots of "you're in control", no clinical detail unless asked. Complaints and reviews: humble, brief, no defensiveness, no personal or treatment details. Reminders and service messages: short, practical, friendly. Prices and finance: plain and transparent. When unsure, choose the calmer option.`,
      sources: ['agencyAgents', 'marquee'],
    },
    {
      id: 'voice-humanise',
      title: 'Removing robotic or salesy wording',
      summary: 'Rewrites anything that sounds like a generic advert or machine-written text.',
      instructions: `Scan for and rewrite: sycophantic openers ("Great question!"), hedging stacks ("it's worth noting that"), stock marketing vocabulary (transform, elevate, unlock, journey, seamless, cutting-edge, state-of-the-art), dramatic reveals ("The secret? ..."), triple lists used for rhythm, and endings that summarise what was just said. Replace each with the plain fact it stands for. Keep the writer's good choices; make light edits rather than rewriting from scratch. Read the result aloud: it should sound like a real person at Oakmere talking. Note what you changed in a short list.`,
      sources: ['voltagent', 'marketingskills'],
    },
  ],

  adrules: [
    {
      id: 'adrules-cap',
      title: 'Following the UK advertising code',
      summary: 'Checks ads and posts are honest, provable and not misleading under ASA rules.',
      instructions: `Social posts, ads, emails, the website and leaflets are all advertising under the CAP Code, which the ASA enforces. Check: is every objective claim backed by evidence held before publication? Is anything misleading by exaggeration or by leaving out an important condition? No guaranteed or promised outcomes ("perfect smile", "guaranteed results", "permanent"), no "pain-free" or "painless", no speed claims that are not typical ("straight teeth in 3 months"). "Best", "leading" or "number one" need proof that is almost impossible to get, so remove them. Comparisons with other practices must be fair and verifiable. No pressure or false urgency; limited places only if true. "Free" means no hidden costs. Health claims must reflect established evidence, never suggest the treatment cures or prevents conditions beyond that, and must not cause fear.`,
      sources: ['marquee'],
    },
    {
      id: 'adrules-gdc',
      title: 'Following GDC guidance on advertising',
      summary: 'Checks the dentist-specific rules: titles, specialists, registration and honest claims.',
      instructions: `The General Dental Council expects advertising to be legal, decent, honest and truthful, and holds registrants responsible for it. Check: dentists using "Dr" make clear it is a courtesy title unless they hold a doctorate; "specialist" is used only for people on a GDC specialist list (say "special interest in" otherwise); qualifications and GDC numbers shown are accurate; the practice website shows each clinician's name, qualifications, country of qualification and GDC number, the complaints procedure, and how to contact the GDC. Claims about clinicians' experience must be checkable. Never imply a clinician has skills or status they do not have. Testimonials about clinical results must be genuine and not suggest every patient will get the same outcome.`,
      sources: ['marquee'],
    },
    {
      id: 'adrules-medicines-whitening',
      title: 'Avoiding banned medicine adverts and whitening mistakes',
      summary: 'Stops any advert for prescription-only medicines like Botox and keeps whitening claims legal.',
      instructions: `Prescription-only medicines must not be advertised to the public. That includes botulinum toxin anti-wrinkle injections under any name (Botox, Azzalure, "anti-wrinkle", "tox", "baby Botox", "tweakments" that refer to it), including in offers, price lists, hashtags and images of the product. A practice may promote a consultation for facial aesthetics in general terms without naming or implying the medicine. Tooth whitening is dentistry in the UK: it may only be carried out by a registered dental professional (a dentist, or a hygienist or therapist on a dentist's prescription) after an assessment, products above 0.1% hydrogen peroxide are not for under 18s, and ads must not target under 18s. Do not promise shade results. Dermal filler ads must not target under 18s.`,
      sources: ['marquee'],
    },
    {
      id: 'adrules-proof-reviews-prices',
      title: 'Checking testimonials, reviews, prices and finance',
      summary: 'Makes sure patient stories are real, prices are clear and finance wording is correct.',
      instructions: `Testimonials must be genuine, current, from a real patient, held on file with consent, and must not make claims the practice could not make itself. Fake reviews, paid reviews and hiding negative reviews are banned under UK consumer law. Before-and-after images: real, own patients, consented, unretouched, typical. Prices must be clear, include all non-optional costs, and a "from" price must be genuinely available to a fair share of patients. Finance: the practice must use an FCA-authorised lender or broker arrangement; if a rate, monthly amount or "0%" appears, include the lender's representative example and "subject to status", and never imply everyone qualifies. Use the finance provider's approved wording.`,
      sources: ['marquee'],
    },
    {
      id: 'adrules-platforms',
      title: 'Checking Google and Meta ad policies',
      summary: 'Catches wording and images the ad platforms will reject before they are sent.',
      instructions: `Google: no ads for prescription-only medicines; healthcare ads must be accurate; remarketing and audience lists based on health conditions are restricted under the personalised advertising policy, so keep audiences general. Meta: no wording that asserts or implies personal attributes, including health ("Do you hate your smile?", "your missing teeth"); avoid images that promote negative self-image, such as close-ups of damaged teeth; before-and-after images for cosmetic procedures are restricted; cosmetic procedure ads must target over 18s. On both, landing pages must match the ad and work. If a platform rejects an ad, fix the cause rather than rewording to slip past the review.`,
      sources: ['marquee'],
    },
  ],

  privacy: [
    {
      id: 'privacy-pecr',
      title: 'Only messaging people who said yes',
      summary: 'Checks we have permission before sending marketing texts or emails.',
      instructions: `Under PECR, marketing emails and texts to individuals need prior consent: freely given, specific, informed, with an unticked box and plain wording that names texts and emails. The narrow "soft opt-in" exception lets a business market its own similar services to people whose details it collected during a sale or enquiry, but only if they were given a clear chance to opt out at that point and in every message; if in doubt, rely on consent. Every marketing message identifies the practice and has a simple opt-out, which must be actioned promptly. Service messages (appointment reminders, a reply to an enquiry) do not need marketing consent but must not carry promotions. Marketing phone calls must be screened against the Telephone Preference Service unless the person consented. The Data (Use and Access) Act 2025 brings PECR fines up to UK GDPR levels.`,
      sources: ['marquee'],
    },
    {
      id: 'privacy-health-data',
      title: 'Protecting patients\' health information',
      summary: 'Keeps health details out of marketing tools and ad platforms.',
      instructions: `Under UK GDPR, information about someone's dental health or treatment is special category data and needs extra protection. Being a patient of a dental practice can itself reveal health information. So: never upload patient lists to Facebook, Google or any ad platform for targeting or lookalike audiences; never send treatment details, appointment types or clinical notes to ad platforms or analytics; keep only the minimum needed in marketing lists, and keep clinical records in the clinical system. Use enquiry treatment interest only for following up that enquiry and for consented marketing described in the privacy notice. Check that the privacy notice explains marketing uses in plain English. Report any suspected data breach to the practice's data protection lead straight away.`,
      sources: ['agencyAgents', 'marquee'],
    },
    {
      id: 'privacy-photo-consent',
      title: 'Getting permission for patient photos and stories',
      summary: 'Makes sure every patient shown has agreed in writing to that exact use.',
      instructions: `Before any patient appears in a photo, video, testimonial or story, get written consent that names each use separately (website, social media, paid adverts, printed material), says whether they can be identified, explains how long it will be used, and tells them they can withdraw at any time. Keep the signed form and its date with the content. If consent is withdrawn, remove the content from everything we control promptly and stop using it in ads. Consent for social posts does not cover adverts. Children appear only with a parent's or guardian's written consent and only where clearly appropriate. Staff appearing in content also give written permission. Never show other patients, screens, notes or appointment lists in the background.`,
      sources: ['marquee'],
    },
    {
      id: 'privacy-cookies',
      title: 'Checking cookies and tracking on the website',
      summary: 'Makes sure ad tracking only runs for visitors who agree to it.',
      instructions: `Non-essential cookies and similar tracking (advertising pixels, most analytics) need the visitor's consent before they load, through a banner where accepting and rejecting are equally easy and nothing is pre-ticked. Some low-risk analytics may be exempt under recent changes to UK law, but advertising tracking is not, so check current ICO guidance before relying on an exemption. Check that Meta's pixel and Google's ads tags do not fire until consent is given, and that pages about specific treatments do not pass health details to platforms in page names or URLs. List every tool on the site, what it collects and why, in the cookie notice, and review it whenever a new tool is added.`,
      sources: ['marquee'],
    },
  ],
};

/** Every frontend agent id that has knowledge. */
export const KNOWLEDGE_AGENT_IDS = Object.keys(KNOWLEDGE);

/** The skills for one frontend agent id (empty list if unknown). */
export function skillsFor(agentId) {
  return KNOWLEDGE[agentId] || [];
}
