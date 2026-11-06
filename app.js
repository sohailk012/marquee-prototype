/* Marquee prototype: plain JavaScript, no build step.
   Views are functions that return HTML strings. Clicks are handled in one
   place through data-action attributes. All data is mock (see data.js). */
(function () {
  'use strict';
  const D = window.DATA;
  const CFG = window.MARQUEE_CONFIG || {};

  /* ---------------- State ---------------- */
  const S = {
    month: '2026-11',
    filters: { lead: true, social: true, ads: true },
    needs: D.needsYou.slice(),
    calendar: D.calendar.map(e => Object.assign({}, e)),
    chat: [],
    chatBusy: false,
    leadTab: 'overview',
    journeyStep: 0,
    attrModel: 'Our balanced view',
    recs: D.recommendations.map(r => Object.assign({}, r)),
    adsPaused: false,
    called: {},
    lastFocus: null,
    homeView: (() => { try { return localStorage.getItem('marquee_home') || 'today'; } catch (e) { return 'today'; } })(),
    history: [],
    usedIdeas: {},
    awaitPass: false,
    notes: D.notifications.map(n => Object.assign({ read: false }, n)),
    alertShown: {},
    customSkills: {},
    skillQuery: '',
    K: null,
    profile: null,
    draft: null,
    setupStep: 0,
  };

  /* ---------------- Helpers ---------------- */
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const $ = (sel, root) => (root || document).querySelector(sel);
  const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const DAYS_LONG = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const MON_S = MONTHS.map(m => m.slice(0, 3));
  const parse = s => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
  const iso = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const TODAY = parse(D.today);
  const fmtShort = s => { const d = parse(s); return `${DAYS[d.getDay()]} ${d.getDate()} ${MON_S[d.getMonth()]}`; };
  const deskName = k => (D.desks[k] || {}).name || k;
  const deskTag = k => `<span class="desk-tag"><i class="sw sw-${k}"></i>${esc(deskName(k))}</span>`;
  const n = v => v.toLocaleString('en-GB');

  const STATUS = {
    done: { label: 'Done', dot: 'idle' },
    live: { label: 'Live', dot: 'always' },
    scheduled: { label: 'Scheduled', dot: 'always' },
    drafting: { label: 'Team working on it', dot: 'working' },
    needs: { label: 'Needs you', dot: 'needs' },
    blocked: { label: 'Waiting on you', dot: 'needs' },
    idea: { label: 'Idea', dot: 'idle' },
  };
  const AGENT_STATE = { working: 'Working', needs: 'Needs you', always: 'Always on', idle: 'Available' };
  const statusEl = st => { const s = STATUS[st] || STATUS.idea; return `<span class="status"><i class="dot dot-${s.dot}"></i>${s.label}</span>`; };
  const agentState = st => `<span class="status"><i class="dot dot-${st}"></i>${AGENT_STATE[st]}</span>`;

  function toast(msg) {
    const t = $('#toast');
    t.textContent = msg; t.hidden = false;
    clearTimeout(toast._t);
    toast._t = setTimeout(() => { t.hidden = true; }, 3200);
  }

  /* ---------------- Drawer ---------------- */
  function openDrawer(html, opts) {
    S.lastFocus = document.activeElement;
    $('#drawer-body').innerHTML = html;
    $('#drawer').hidden = false; $('#scrim').hidden = false;
    document.body.style.overflow = 'hidden';
    const focusEl = (opts && opts.focus && $(opts.focus)) || $('.drawer-close');
    setTimeout(() => focusEl && focusEl.focus(), 30);
  }
  function closeDrawer() {
    $('#drawer').hidden = true; $('#scrim').hidden = true;
    document.body.style.overflow = '';
    S.drawerKind = null;
    if (S.lastFocus && document.contains(S.lastFocus)) S.lastFocus.focus();
  }

  /* ---------------- Charts ---------------- */
  function barChart(o) {
    const data = o.data, W = 600, H = o.height || 190, pl = 30, pr = 6, pt = 22, pb = 26;
    const max = Math.max(...data.map(d => d.v));
    const step = max > 40 ? 20 : max > 16 ? 5 : max > 8 ? 2 : 1;
    const top = Math.ceil(max / step) * step;
    const iw = W - pl - pr, ih = H - pt - pb, bw = iw / data.length;
    const gap = Math.max(2, bw * 0.28), barW = bw - gap, base = pt + ih, r = 4;
    let g = '';
    for (let t = 0; t <= top; t += step * (top / step > 4 ? 2 : 1)) {
      const y = base - (t / top) * ih;
      g += `<line class="gridline" x1="${pl}" x2="${W - pr}" y1="${y}" y2="${y}"/><text class="axis-label" x="${pl - 8}" y="${y + 4}" text-anchor="end">${t}</text>`;
    }
    data.forEach((d, i) => {
      const h = Math.max(1, (d.v / top) * ih), x = pl + i * bw + gap / 2, y = base - h, rr = Math.min(r, h);
      const path = `M${x},${base} V${y + rr} Q${x},${y} ${x + rr},${y} H${x + barW - rr} Q${x + barW},${y} ${x + barW},${y + rr} V${base} Z`;
      const last = i === data.length - 1;
      g += `<path class="bar" d="${path}" fill="${o.color}" opacity="${last ? 1 : 0.78}"/>`;
      if (last) g += `<text class="val-label" x="${x + barW / 2}" y="${y - 7}" text-anchor="middle">${esc(o.fmt ? o.fmt(d.v) : d.v)}</text>`;
      if (data.length <= 10 || i % 2 === 0) g += `<text class="axis-label" x="${x + barW / 2}" y="${H - 6}" text-anchor="middle">${esc(d.label)}</text>`;
      g += `<rect class="hit" x="${pl + i * bw}" y="${pt}" width="${bw}" height="${ih}" data-tip="<b>${esc(esc(o.fmt ? o.fmt(d.v) : d.v))}</b> ${esc(esc(o.unit || ''))} · ${esc(esc(o.tipPrefix || ''))}${esc(esc(d.label))}"/>`;
    });
    const rows = data.map(d => `<tr><td>${esc(d.label)}</td><td class="num">${esc(o.fmt ? o.fmt(d.v) : d.v)}</td></tr>`).join('');
    const id = 'tbl-' + Math.random().toString(36).slice(2, 8);
    return `<div class="chart"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(o.aria)}">${g}</svg><div class="tip"></div></div>
      <button class="link tiny table-toggle" type="button" data-action="toggle-table" data-target="${id}" aria-expanded="false">Show as table</button>
      <table class="data-table" id="${id}" hidden><thead><tr><th>${esc(o.labelHead || 'Week of')}</th><th class="num">${esc(o.valueHead || 'Value')}</th></tr></thead><tbody>${rows}</tbody></table>`;
  }
  function hbars(items, opts) {
    const max = Math.max(...items.map(i => i.v)) || 1;
    return `<div class="hbars">${items.map(i => `
      <div class="hbar"><div class="hbar-name"><span>${esc(i.name)}</span>${i.note ? `<span class="muted">${esc(i.note)}</span>` : ''}</div>
      <div class="hbar-track"><span style="width:${(i.v / max) * 100}%;${opts && opts.color ? `background:${opts.color}` : ''}"></span></div>
      <div class="hbar-v">${esc(opts && opts.fmt ? opts.fmt(i.v) : i.v)}</div></div>`).join('')}</div>`;
  }

  /* ================================================================
     HOME
     ================================================================ */
  function greeting() {
    const h = new Date().getHours();
    return h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening';
  }

  /* ---------------- Creative tiles ---------------- */
  const ICON = {
    reel: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="2" y="2" width="12" height="12" rx="3"/><path d="M6.5 5.5v5l4-2.5z" fill="currentColor" stroke="none"/></svg>',
    carousel: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="1.5" y="3.5" width="9" height="9" rx="2"/><path d="M13 5v6.5a1.5 1.5 0 0 1-1.5 1.5"/><path d="M14.5 6.5v3"/></svg>',
    post: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="2" y="2" width="12" height="12" rx="3"/><circle cx="6" cy="6.5" r="1.3"/><path d="m3 12 3.5-3.5 2.5 2 2-1.5 2 2"/></svg>',
    ad: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M2.5 6.5v3h2l5 3v-9l-5 3z"/><path d="M12 6a3 3 0 0 1 0 4"/></svg>',
    message: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="1.5" y="3" width="13" height="10" rx="2"/><path d="m2 4 6 4.5L14 4"/></svg>',
    event: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="2" y="3" width="12" height="11" rx="2"/><path d="M2 6.5h12M5.5 1.5v3M10.5 1.5v3"/></svg>',
  };
  ICON.heart = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M8 13.5S2 10 2 5.8A3 3 0 0 1 8 4.4a3 3 0 0 1 6 1.4C14 10 8 13.5 8 13.5z"/></svg>';
  ICON.bubble = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M13.5 8a5.5 5.5 0 0 1-8.1 4.8L2.5 13.5l.8-2.8A5.5 5.5 0 1 1 13.5 8z"/></svg>';
  ICON.send = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14 2 7 9M14 2l-4.5 12L7 9 2 6.5z"/></svg>';
  ICON.spark = '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M8 1.5c.4 3.2 1.9 5 5 5.5-3.1.5-4.6 2.3-5 5.5-.4-3.2-1.9-5-5-5.5 3.1-.5 4.6-2.3 5-5.5z"/></svg>';
  const KIND_LABEL = { reel: 'Reel', carousel: 'Carousel', post: 'Post', ad: 'Ad', message: 'Email & text', event: 'Event' };
  function kindOf(e) {
    if (e.kind) return e.kind;
    const t = e.title;
    if (/Reel/.test(t)) return 'reel';
    if (/carousel|Stories/i.test(t)) return 'carousel';
    if (e.desk === 'ads') return 'ad';
    if (/evening|call|plan ready|review/i.test(t)) return 'event';
    if (e.desk === 'lead') return 'message';
    return 'post';
  }
  const cleanTitle = t => t.replace(/ \((Reel|carousel|Stories)\)/i, '');
  function tile(e, opts) {
    opts = opts || {};
    const k = kindOf(e), needs = e.status === 'needs' || e.status === 'blocked';
    const cls = ['tile', 'tile-' + k, e.status === 'done' ? 'is-done' : '', e.status === 'idea' ? 'is-idea' : '', needs ? 'needs-you' : '', e.isNew ? 'is-new' : ''].join(' ');
    const drag = opts.drag && parse(e.date) >= TODAY && e.status !== 'done' ? 'draggable="true"' : '';
    return `<button class="${cls}" type="button" data-action="open-event" data-id="${e.id}" ${drag} title="${esc(e.title)} · ${(STATUS[e.status] || STATUS.idea).label}">
      <span class="t-kind">${ICON[k]}${KIND_LABEL[k]}</span>
      ${k === 'reel' && !opts.mini ? '<span class="play"></span>' : ''}
      ${k === 'message' && !opts.mini ? `<span class="bubble">${esc(e.detail.split('.')[0])}.</span>` : ''}
      <span class="t-title">${esc(cleanTitle(e.title))}</span>
      ${opts.mini ? '' : statusEl(e.status)}
    </button>`;
  }

  /* ---------------- Home: switch between Today and Wall ---------------- */
  function viewHome() {
    return `<div class="topline rise"><span class="eyebrow">${DAYS_LONG[TODAY.getDay()]} ${TODAY.getDate()} ${MONTHS[TODAY.getMonth()]} · ${esc(D.practice.name)}</span></div>` + viewToday();
  }
  function viewPlan() {
    return `<div class="topline rise"><span class="eyebrow">Your marketing plan · ${esc(D.practice.name)}</span></div>` + viewWall();
  }
  const DESK_TABS = [['lead', 'New patients'], ['social', 'Social media'], ['ads', 'Ads']];
  function viewDesks() {
    const sub = S.desk;
    return `<div class="desk-switch-wrap rise"><div class="seg glass-seg" role="tablist" aria-label="Desks">${DESK_TABS.map(([k, l]) =>
      `<a role="tab" href="#desks/${k}" aria-selected="${sub === k}" class="seg-item"><i class="sw sw-${k}"></i>${l}</a>`).join('')}</div></div>` +
      ({ lead: viewLead, social: viewSocial, ads: viewAds })[sub]();
  }

  /* ---------------- Today feed ---------------- */
  const NEED_META = {
    n1: { faces: [['CP', 'social'], ['Cw', 'bench'], ['Ds', 'bench'], ['Pr', 'quality']], workers: 'the post planner, writer, designer and spelling check', checks: ['Spelling checked', 'Sounds like Oakmere', 'Follows advertising rules', 'No patients shown'] },
    n2: { faces: [['PM', 'ads'], ['GA', 'ads'], ['An', 'bench']], workers: 'the ads team', checks: ['Same total spend', 'Within your limits'] },
    n3: { faces: [['OC', 'lead'], ['SL', 'lead']], workers: 'the new patients team', checks: ['All said yes to being contacted'] },
    n4: { faces: [['SM', 'social'], ['Ds', 'bench']], workers: 'the social media team', checks: ['Anyone in the photos must sign a consent form'] },
  };
  const FACE_BG = { lead: '#0E9184', social: '#C8622F', ads: '#5560C9', bench: '#B9831F', quality: '#7A5FA3' };

  function needVisual(nd) {
    if (nd.id === 'n1') {
      const c = D.carousel;
      return `<div class="phone"><div class="screen">
        <div class="ig-top"><i></i>oakmeredental</div>
        <div class="ig-media"><div class="ig-track">${c.slides.map((s, i) => `<div class="ig-slide"><small>${i + 1}/${c.slides.length}</small>${esc(s)}<small>Oakmere Dental</small></div>`).join('')}</div></div>
        <div class="ig-actions">${ICON.heart}${ICON.bubble}${ICON.send}</div>
        <div class="ig-cap"><b>oakmeredental</b> ${esc(c.caption)}</div></div></div>`;
    }
    if (nd.id === 'n2') {
      return `<div class="vs">
        <div class="vs-row"><div class="row"><span>Google ads</span><b>£29 a consultation</b></div><div class="vs-bar"><span style="width:36%"></span></div></div>
        <div class="vs-row"><div class="row"><span>Facebook ads</span><b>£52 a consultation</b></div><div class="vs-bar"><span style="width:65%;background:#9AA1E2"></span></div></div>
        <div class="vs-move">£150 → Google</div>
        <div class="small muted" style="text-align:center">About 3 more consultations this month for the same money</div></div>`;
    }
    if (nd.id === 'n3') {
      const ppl = [['Tom W.', '2h 40m'], ['Grace L.', '3h'], ['Ravi D.', '2h 15m'], ['Sophie B.', '2h 5m']];
      return `<div class="people">${ppl.map((p, i) => `<div class="person" style="--i:${i}"><span class="avatar">${p[0][0]}</span><b>${p[0]}</b><small>Waiting ${p[1]}</small></div>`).join('')}</div>`;
    }
    return `<div class="drop"><div class="thumbs"><i></i><i></i><i></i></div>Drop Tuesday’s photos here<span class="small" style="font-weight:500">Straight off your phone is fine. We’ll do the rest.</span></div>`;
  }
  function focusCard(nd) {
    const meta = NEED_META[nd.id] || { faces: [], workers: '', checks: [] };
    const btns = {
      approve: `<button class="btn btn-gold btn-big" type="button" data-action="deck-approve" data-id="${nd.id}">Approve</button>
        <button class="btn btn-line btn-big" type="button" data-action="event-changes" data-id="${nd.calId}">Ask for changes</button>`,
      task: `<button class="btn btn-gold btn-big" type="button" data-action="deck-approve" data-id="${nd.id}">Done, I’ve called them</button>
        <button class="btn btn-line btn-big" type="button" data-action="need-calls" data-id="${nd.id}">Who are they?</button>`,
      upload: `<button class="btn btn-gold btn-big" type="button" data-action="need-upload" data-id="${nd.id}">Upload photos</button>`,
    }[nd.kind];
    return `<article class="focus" id="focus" aria-live="polite">
      <div class="focus-visual v-${nd.desk}">${needVisual(nd)}</div>
      <div class="focus-body">
        ${deskTag(nd.desk)}
        <h3>${esc(nd.title)}</h3>
        <p class="why">${esc(nd.why)}</p>
        <div class="who-worked"><span class="faces">${meta.faces.map(f => `<span style="background:${FACE_BG[f[1]]}">${f[0]}</span>`).join('')}</span><span>Prepared by ${esc(meta.workers)}</span></div>
        <div class="checks">${meta.checks.map(c => `<span>✓ ${esc(c)}</span>`).join('')}</div>
        <div class="focus-actions">${btns}<button class="btn btn-ghost" type="button" data-action="deck-skip" data-id="${nd.id}">Later</button></div>
      </div></article>`;
  }
  function sparkPath(vals, w, h) {
    const max = Math.max(...vals), min = Math.min(...vals);
    return vals.map((v, i) => `${i ? 'L' : 'M'}${(i / (vals.length - 1)) * w},${h - 3 - ((v - min) / ((max - min) || 1)) * (h - 6)}`).join(' ');
  }
  function viewToday() {
    const g = D.goal, needs = S.needs, active = needs[0];
    const C = 2 * Math.PI * 70, pct = g.done / g.target, pace = g.expectedByToday / g.target;
    const soon = S.calendar.filter(e => { const d = parse(e.date); return d > TODAY && (d - TODAY) / 864e5 <= 10; }).sort((a, b) => a.date.localeCompare(b.date));
    const byDay = {}; soon.forEach(e => (byDay[e.date] = byDay[e.date] || []).push(e));
    const weekly = D.weeklyEnquiries.map(w => w.v), reach = D.socialWeekly.map(w => w.reach), cpc = [52, 49, 47, 45, 44, 41, 40, 38];
    const spark = (vals, color) => `<svg class="spark" viewBox="0 0 200 40" preserveAspectRatio="none" aria-hidden="true"><path d="${sparkPath(vals, 200, 40)}" fill="none" stroke="${color}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    return `
    <section class="hero2">
      <div class="rise" style="--i:1">
        <h1>${greeting()}, ${esc(D.practice.owner)} <span class="wave" aria-hidden="true">${ICON.spark}</span></h1>
        <p class="sub">${needs.length ? `<b>${needs.length} thing${needs.length > 1 ? 's' : ''} need${needs.length > 1 ? '' : 's'} you today.</b> It should take about ${Math.max(1, needs.length - 1)} minute${needs.length > 2 ? 's' : ''}.` : '<b>Nothing needs you right now.</b> The team is working through this week’s plan.'}</p>
        <form class="askbar" data-form="ask"><span class="avatar">${ICON.spark}</span>
          <label for="ask-input" style="position:absolute;left:-9999px">Ask your team</label>
          <input id="ask-input" name="q" type="text" autocomplete="off" placeholder="What do you need? e.g. more implant patients">
          <button class="btn btn-dark" type="submit">Ask</button></form>
        <div class="suggest" style="margin-top:10px">
          <button type="button" data-action="ask" data-q="Plan a new year smile campaign">New year campaign</button>
          <button type="button" data-action="ask" data-q="We need more implant patients">More implant patients</button>
          <button type="button" data-action="ask" data-q="How is the ad budget doing?">How’s the budget?</button>
        </div>
      </div>
      <div class="ring rise" style="--i:2" role="img" aria-label="${g.done} of ${g.target} consultations booked. ${g.done - g.expectedByToday} ahead of pace.">
        <svg viewBox="0 0 168 168"><circle class="track" cx="84" cy="84" r="70" fill="none" stroke-width="14"/>
          <circle class="fill" cx="84" cy="84" r="70" fill="none" stroke-width="14" stroke-dasharray="${C}" stroke-dashoffset="${C}" data-target="${C * (1 - pct)}"/>
          <circle class="pace" cx="84" cy="84" r="70" fill="none" stroke-width="18" stroke-dasharray="3 ${C}" stroke-dashoffset="${-C * pace}"/></svg>
        <div class="ring-label"><b data-count="${g.done}">${g.done}</b><span>of ${g.target} consultations booked in November</span></div>
      </div>
    </section>

    <section class="deck-wrap">
      <div>
        <div class="deck-head"><h2>${needs.length ? 'Needs you' : 'All done'}</h2>${needs.length ? `<div class="deck-dots">${needs.map((_, i) => `<i class="${i === 0 ? 'on' : ''}"></i>`).join('')}</div><span class="small muted">One at a time</span>` : ''}</div>
        ${active ? focusCard(active) : `<div class="done-card"><h3>All done for today.</h3><p>We’ll text you if anything urgent comes up.</p><span class="bulbs" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></span></div>`}
      </div>
      <div class="queue">${needs.length > 1 ? `<h4>Up next</h4>${needs.slice(1).map(nd => `<button class="q-card" type="button" data-action="deck-pick" data-id="${nd.id}">${deskTag(nd.desk)}<b>${esc(nd.title)}</b></button>`).join('')}` : ''}</div>
    </section>

    <section class="section">
      <div class="section-head"><h2>Coming up</h2><p>The next 10 days. Tap anything to see it or change it.</p></div>
      <div class="strip">${Object.keys(byDay).map((k, i) => { const d = parse(k); return `<div class="strip-day rise" style="--i:${i}"><span><b>${d.getDate()}</b>${DAYS[d.getDay()]}</span>${byDay[k].map(e => tile(e)).join('')}</div>`; }).join('')}</div>
    </section>

    <section class="section">
      <p class="story">In the last 30 days, <span class="num" data-count="186">186</span> people got in touch, <span class="num" data-count="61">61</span> booked a consultation and patients agreed to <span class="num" data-count="48600" data-prefix="£">£48,600</span> of treatment.</p>
      <div class="story-tiles">
        <div class="s-tile rise" style="--i:1"><span class="stat-label">Enquiries this week</span><div class="stat-value" data-count="51">51</div><span class="stat-foot"><b>Your best week</b> · it was 31 in September</span>${spark(weekly, '#17150F')}</div>
        <div class="s-tile rise" style="--i:2"><span class="stat-label">Cost per consultation</span><div class="stat-value" data-count="38" data-prefix="£">£38</div><span class="stat-foot"><b>£14 cheaper</b> than in September</span>${spark(cpc, '#5560C9')}</div>
        <div class="s-tile rise" style="--i:3"><span class="stat-label">People who saw your posts</span><div class="stat-value">14.9k</div><span class="stat-foot"><b>+20%</b> this week</span>${spark(reach, '#C8622F')}</div>
      </div>
      <details class="more" style="margin-top:22px"><summary class="link">Where did they come from?</summary>
        <div class="charts" style="margin-top:12px">
          <div><div class="chart-title">New enquiries each week</div>${barChart({ data: D.weeklyEnquiries.map(w => ({ label: w.wk, v: w.v })), color: '#17150F', unit: 'enquiries', tipPrefix: 'week of ', aria: 'Weekly enquiries rising from 31 to 51', valueHead: 'Enquiries' })}</div>
          <div><div class="chart-title">Where they came from</div>${hbars(D.sources.map(s => ({ name: s.name, v: s.v })))}</div>
        </div></details>
    </section>

    <section class="section">
      <div class="live"><span class="lbl"><i></i>Your team is working on</span><div class="live-msg" id="live-msg">${esc(TICKER[0][1])}<small>${esc(TICKER[0][0])}</small></div></div>
    </section>`;
  }
  const TICKER = [
    ['Google ads', 'Writing 6 headlines for the open evening'],
    ['Sorting', 'Checking 38 October enquiries that went quiet'],
    ['Video editor', 'Editing a 20-second video from the hygienist interview'],
    ['Quick reply', 'Texted a new Invisalign enquiry 1 minute after she got in touch'],
    ['Trend watch', 'Noticed “this or that” videos getting twice the saves this week'],
    ['Spend watch', 'Checked ad spend: £18 so far today, well under your £80 limit'],
    ['Spelling check', 'Fixed 2 typos in the follow-up email before you saw it'],
  ];

  /* ---------------- Creative wall ---------------- */
  function viewWall() {
    const [y, m] = S.month.split('-').map(Number);
    const first = new Date(y, m - 1, 1);
    const start = new Date(first); start.setDate(1 - ((first.getDay() + 6) % 7));
    const last = new Date(y, m, 0);
    const end = new Date(last); end.setDate(last.getDate() + (7 - ((last.getDay() + 6) % 7) - 1));
    let cells = '', agenda = '';
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const key = iso(d), out = d.getMonth() !== m - 1, past = d < TODAY;
      const evs = S.calendar.filter(e => e.date === key && S.filters[e.desk]);
      cells += `<div class="wall-day ${out ? 'out' : ''} ${past ? 'past' : ''} ${key === D.today ? 'today' : ''}" data-day="${key}" ${!out && !past ? 'data-drop="1"' : ''}>
        <div class="wall-num"><span>${d.getDate()}</span>${!out && !past ? `<button class="cal-add" type="button" data-action="add-on-day" data-date="${key}" aria-label="Ask the team for something on ${fmtShort(key)}">+</button>` : ''}</div>
        ${evs.map(e => tile(e, { mini: true, drag: true })).join('')}</div>`;
      if (!out && evs.length) agenda += `<div class="strip-day" style="margin-bottom:14px"><span><b>${d.getDate()}</b>${DAYS[d.getDay()]}</span>${evs.map(e => tile(e)).join('')}</div>`;
    }
    const canPrev = S.month > '2026-11', canNext = S.month < '2026-12';
    return `
      <div class="wall-top rise">
        <div><h2>${MONTHS[m - 1]}</h2><p class="small muted" style="margin-top:8px">Drag anything to a different day. Tap to open it. Press + on a day to ask for something new.</p></div>
        <div class="row wrap">
          <div class="filters" role="group" aria-label="Show desks">${['lead', 'social', 'ads'].map(k => `<button class="filter" type="button" data-action="filter" data-desk="${k}" aria-pressed="${S.filters[k]}"><i class="sw sw-${k}"></i>${deskName(k)}</button>`).join('')}</div>
          <button class="btn btn-ghost btn-sm" type="button" data-action="month" data-dir="-1" ${canPrev ? '' : 'disabled style="opacity:.3"'} aria-label="Previous month">‹</button>
          <button class="btn btn-ghost btn-sm" type="button" data-action="month" data-dir="1" ${canNext ? '' : 'disabled style="opacity:.3"'} aria-label="Next month">›</button>
        </div>
      </div>
      <div class="wall-layout">
        <div>
          <div class="wall" style="margin-bottom:6px">${['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(x => `<span class="wall-dow">${x}</span>`).join('')}</div>
          <div class="wall rise" style="--i:1" id="calendar">${cells}</div>
          <div class="agenda" style="margin-top:8px">${agenda || '<p class="empty">Nothing planned yet. Press Ask to get a plan.</p>'}</div>
        </div>
        <aside class="side-strip rise" style="--i:2">
          <div class="s-tile"><span class="stat-label">Needs you</span><div class="stat-value">${S.needs.length}</div>${S.needs.length ? `<button class="link small" type="button" data-action="go" data-href="#home">Go through them</button>` : '<span class="stat-foot">All clear</span>'}</div>
          <div class="s-tile"><span class="stat-label">Consultations booked</span><div class="stat-value">${D.goal.done}<span class="muted" style="font-size:16px"> / ${D.goal.target}</span></div><span class="stat-foot"><b>${D.goal.done - D.goal.expectedByToday} more</b> than we need by today</span></div>
          <div class="s-tile"><span class="stat-label">Treatment agreed</span><div class="stat-value">£48.6k</div><span class="stat-foot"><b>Up 23%</b> on last month</span></div>
        </aside>
      </div>`;
  }

  function needItem(nd) {
    const btns = {
      approve: `<button class="btn btn-dark btn-sm" type="button" data-action="need-approve" data-id="${nd.id}">Approve</button>
                <button class="btn btn-line btn-sm" type="button" data-action="need-review" data-id="${nd.id}">Review</button>`,
      task: `<button class="btn btn-dark btn-sm" type="button" data-action="need-calls" data-id="${nd.id}">See who to call</button>`,
      upload: `<button class="btn btn-dark btn-sm" type="button" data-action="need-upload" data-id="${nd.id}">Upload photos</button>`,
    }[nd.kind];
    return `<div class="need" data-need="${nd.id}">${deskTag(nd.desk)}<span class="need-title">${esc(nd.title)}</span>
      <span class="need-why">${esc(nd.why)}</span><div class="need-actions">${btns}</div></div>`;
  }

  function eventDrawer(id) {
    const e = S.calendar.find(x => x.id === id); if (!e) return;
    let extra = '';
    if (id === 'c6') extra = carouselPreview();
    let actions = '';
    if (e.status === 'needs') actions = `<button class="btn btn-dark" type="button" data-action="event-approve" data-id="${id}">Approve</button><button class="btn btn-line" type="button" data-action="event-changes" data-id="${id}">Ask for changes</button>`;
    else if (e.status === 'idea') actions = `<button class="btn btn-dark" type="button" data-action="event-go" data-id="${id}">Yes, do it</button><button class="btn btn-line" type="button" data-action="event-drop" data-id="${id}">No thanks</button>`;
    else if (e.status === 'blocked') actions = `<button class="btn btn-dark" type="button" data-action="need-upload" data-id="n4">Upload photos</button>`;
    else if (e.status === 'drafting' || e.status === 'scheduled') actions = `<button class="btn btn-line" type="button" data-action="event-changes" data-id="${id}">Ask for changes</button>`;
    openDrawer(`
      <span class="eyebrow">${fmtShort(e.date)}</span>
      <h2 id="drawer-title" style="margin-top:6px">${esc(e.title)}</h2>
      <div class="meta">${deskTag(e.desk)}${statusEl(e.status)}</div>
      <div class="drawer-section"><h4>What it is</h4><p>${esc(e.detail)}</p></div>
      ${extra}
      ${e.status !== 'idea' ? `<div class="drawer-section"><h4>Checked before you see it</h4><ul class="checklist"><li>Spelling</li><li>Sounds like Oakmere</li><li>UK advertising rules for dentists</li><li>Privacy and permission</li></ul></div>` : ''}
      <div class="drawer-actions">${actions}</div>`);
  }
  function carouselPreview() {
    const c = D.carousel;
    return `<div class="drawer-section"><h4>Slides</h4><div class="slides">${c.slides.map((s, i) => `<div class="slide"><small>${i + 1} / ${c.slides.length}</small>${esc(s)}<small>Oakmere Dental</small></div>`).join('')}</div></div>
      <div class="drawer-section"><h4>Caption</h4><p>${esc(c.caption)}</p></div>`;
  }

  function setEventStatus(id, status) { const e = S.calendar.find(x => x.id === id); if (e) e.status = status; }
  function removeNeed(id, cb) {
    const el = document.querySelector(`[data-need="${id}"]`);
    S.needs = S.needs.filter(x => x.id !== id);
    if (el) { el.classList.add('leaving'); setTimeout(() => { cb && cb(); render(); }, 240); } else { cb && cb(); render(); }
  }

  /* ---------------- Chat with Head of Agents ---------------- */
  const PLANS = {
    implants: {
      intro: 'Here’s how I’d get you more implant patients. All three teams have had a look.',
      rows: [
        { desk: 'ads', what: 'Google ads for “dental implants” in Maidenhead and 4 nearby towns', why: 'People searching locally book for about £44 each. People searching across the UK never booked.', title: 'Implant Google ads: nearby towns', date: '2026-11-18' },
        { desk: 'social', what: 'A carousel that explains implant costs line by line', why: 'Cost is the top question in implant enquiries this month.', title: 'Implant costs explained (carousel)', date: '2026-11-21' },
        { desk: 'lead', what: '3 follow-up emails to implant enquiries who haven’t booked yet', why: 'People usually take 3 to 6 weeks to decide on implants. 38 people are at that stage now.', title: 'Implant follow-up emails start', date: '2026-11-27' },
        { desk: 'lead', what: 'Ask October implant patients for a referral', why: 'People recommended by a friend go ahead twice as often as people from ads.', title: 'Ask implant patients to recommend a friend', date: '2026-12-02' },
      ],
    },
    newyear: {
      intro: 'Here’s a plan for the new year. January is the busiest month for Invisalign enquiries, so we start building up in December.',
      rows: [
        { desk: 'social', what: 'Film 4 short videos in one afternoon: common myths, costs, how long it takes, and a patient’s story', why: 'One afternoon of filming covers December and January.', title: 'New year content shoot', date: '2026-12-01' },
        { desk: 'lead', what: 'A “start in January” waiting list with a free scan', why: 'People decide over Christmas and book in January. A waiting list means they choose you first.', title: 'January waiting list opens', date: '2026-12-08' },
        { desk: 'ads', what: 'Google and Facebook ads, building up to £30 a day from 27 December', why: 'Ads are cheapest between Christmas and New Year, and lots of people are thinking about it then.', title: 'New year ads start', date: '2026-12-27' },
        { desk: 'social', what: 'A “smile by summer” video and Stories', why: 'Invisalign takes about 6 months, so January to July is easy to picture.', title: 'Smile by summer (Reel)', date: '2026-12-29' },
      ],
    },
  };
  function genericPlan(topic) {
    const t = topic.charAt(0).toUpperCase() + topic.slice(1);
    return {
      intro: `Here’s a first plan for ${topic}. It starts small so we can see what works before you spend more.`,
      rows: [
        { desk: 'social', what: `Two short videos answering the questions people ask about ${topic}`, why: 'Answering real questions gets saved and shared, and that leads to enquiries.', title: `${t}: your questions answered (Reel)`, date: '2026-11-18' },
        { desk: 'ads', what: `Try Google ads for ${topic} in Maidenhead for 2 weeks, at £10 a day`, why: 'This tells us quickly whether people nearby are looking for it.', title: `${t}: trial Google ads`, date: '2026-11-21' },
        { desk: 'lead', what: `A ${topic} page on your website with a short quiz and a free consultation`, why: 'The quiz gets three times more people to get in touch than a plain contact form.', title: `${t}: new web page`, date: '2026-11-24' },
      ],
    };
  }

  /* Scripted fallback, used when the live AI isn't connected (e.g. on GitHub Pages). */
  function replyFor(q) {
    const t = q.toLowerCase();
    const treat = (t.match(/implants?|whitening|veneers?|invisalign|aligners?|braces|bonding|hygiene|check.?ups?|emergenc\w*|crowns?|dentures?|nervous patients/) || [])[0];
    const season = /new year|january|christmas|december|festive/.test(t);
    if (treat && /implant/.test(treat)) return { plan: 'implants' };
    if (season && (!treat || /invisalign|aligner|braces/.test(treat))) return { plan: 'newyear' };
    if (treat) return { generic: treat };
    if (/budget|spend|spent|\bads?\b|cost per|google|meta|facebook ads/.test(t)) return { text: `So far this month we’ve spent <b>£472 of £2,400</b>, which is on track. Google ads are working best: <b>£29 for each consultation</b>. Facebook ads cost £52, so I’ve suggested moving £150 to Google. It’s waiting for your OK on the Today screen.` };
    if (/how.*(going|doing)|result|report|numbers|enquir|patients? (this|last)/.test(t)) return { text: `In the last 30 days, <b>186 people</b> got in touch, <b>61</b> booked a consultation and patients agreed to <b>£48,600</b> of treatment. That’s 23% more than the month before. The one thing to fix is call-backs: people called within an hour book half the time, but after a day only 1 in 5 do.` };
    if (/post|instagram|social|reel|tiktok|content/.test(t)) return { generic: 'social content' };
    if (/review|google profile|rating/.test(t)) return { text: `Reviews will get their own team soon. For now, the new patients team can ask this month’s finished patients for a review. Say <b>“ask October patients for reviews”</b> and I’ll plan it.` };
    if (/^(hi|hello|hey|yo)\b/.test(t)) return { text: `Hi ${esc(D.practice.owner)}! What do you need? More patients for a treatment, a plan for a date, or a question about how things are going.` };
    return { ask: true };
  }

  /* Live AI connection (Cloudflare Pages Function, see BACKEND.md). Falls back to scripted. */
  const API = { base: '', live: false, checked: false, model: null };
  /* Only these backends may ever receive chat messages (stops a crafted ?api= link redirecting them). */
  const API_ALLOWED = ['', 'https://marquee-prototype.pages.dev', 'http://localhost:8788'].concat(CFG.apiBase ? [CFG.apiBase] : []);
  const toOrigin = v => { try { return v ? new URL(v).origin : ''; } catch (e) { return null; } };
  try {
    const qp = new URLSearchParams(location.search).get('api');
    if (qp !== null && API_ALLOWED.includes(toOrigin(qp))) localStorage.setItem('marquee_api', toOrigin(qp));
    const saved = localStorage.getItem('marquee_api') || CFG.apiBase || '';
    API.base = API_ALLOWED.includes(saved) ? saved : '';
    if (saved && !API_ALLOWED.includes(saved)) localStorage.removeItem('marquee_api');
  } catch (e) { API.base = API_ALLOWED.includes(CFG.apiBase || '') ? (CFG.apiBase || '') : ''; }
  function checkApi() {
    fetch(API.base + '/api/health', { cache: 'no-store' })
      .then(r => (r.ok ? r.json() : null))
      .then(j => { API.checked = true; API.live = !!(j && j.configured); API.model = j && j.model; renderChat(); })
      .catch(() => { API.checked = true; API.live = false; renderChat(); });
  }
  const getPass = () => { try { return sessionStorage.getItem('marquee_pass') || ''; } catch (e) { return ''; } };
  const setPass = v => { try { sessionStorage.setItem('marquee_pass', v); } catch (e) { /* ignore */ } };
  const mdLite = s => esc(s).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/\n/g, '<br>');

  function chatHtml() {
    const msgs = S.chat.map(m => {
      if (m.kind === 'typing') return `<div class="msg msg-them"><span class="typing" aria-label="Typing"><i></i><i></i><i></i></span>${m.note ? `<div class="tiny muted" style="margin-top:6px">${esc(m.note)}</div>` : ''}</div>`;
      if (m.kind === 'plan') return planCard(m);
      return `<div class="msg ${m.from === 'me' ? 'msg-me' : 'msg-them'}">${m.html}</div>`;
    }).join('');
    const mode = API.live ? `<span class="mode live"><i></i>Live AI${API.model ? ' · ' + esc(API.model) : ''}</span>` : `<span class="mode"><i></i>Demo: these are sample replies</span>`;
    return `<div class="row"><span class="avatar avatar-lg" style="color:var(--gold)">${ICON.spark}</span><div><h2 id="drawer-title" style="font-size:20px">Your marketing lead</h2>${mode}</div></div>
      <div class="chat" id="chat-log">${msgs || `<div class="msg msg-them">Hi ${esc(D.practice.owner)}. What do you need? More patients for a treatment, a plan for a date, or a question about how things are going.</div>
        <div class="suggest"><button type="button" data-action="ask" data-q="Get more whitening patients before Christmas">More whitening before Christmas</button><button type="button" data-action="ask" data-q="What should we post next week?">What should we post next week?</button><button type="button" data-action="ask" data-q="How are we doing this month?">How are we doing?</button></div>`}</div>
      <form class="ask chat-input" data-form="chat"><label for="chat-input" style="position:absolute;left:-9999px">Message Head of Agents</label>
        <input id="chat-input" name="q" type="${S.awaitPass ? 'password' : 'text'}" autocomplete="off" placeholder="${S.awaitPass ? 'Demo passcode' : 'Type a reply'}"><button class="btn btn-dark" type="submit">Send</button></form>`;
  }
  function planCard(m) {
    const p = m.plan;
    const state = m.state || 'open';
    return `<div class="msg msg-them">${mdLite(p.intro || 'Here’s the plan.')}</div>
      ${m.agents && m.agents.length ? `<div class="briefed">Worked on by: ${esc(m.agents.join(', '))}</div>` : ''}
      <div class="plan-card">
        <div><b>The plan</b><div class="small muted">Each step has the reason behind it. ${m.checks && m.checks.length ? 'Checked: ' + esc(m.checks.join(' · ')) : 'Spelling and advertising rules checked.'}</div></div>
        ${p.rows.map(r => `<div class="plan-row">${deskTag(r.desk)}<div>${esc(r.what)}<small>Why: ${esc(r.why)}${r.date ? ' · ' + fmtShort(r.date) : ''}</small></div></div>`).join('')}
        <div class="row wrap">${state === 'open'
          ? `<button class="btn btn-dark btn-sm" type="button" data-action="plan-approve" data-mid="${m.id}">Approve and add to calendar</button><button class="btn btn-line btn-sm" type="button" data-action="plan-change" data-mid="${m.id}">Ask for changes</button>`
          : state === 'approved' ? `<span class="status"><i class="dot dot-always"></i>Approved. ${p.rows.length} items added to your calendar.</span>` : `<span class="status"><i class="dot dot-working"></i>Changes requested</span>`}</div>
      </div>`;
  }
  function renderChat() {
    if (S.drawerKind !== 'chat' || $('#drawer').hidden) return;
    $('#drawer-body').innerHTML = chatHtml();
    const log = $('#drawer'); log.scrollTop = log.scrollHeight;
    const inp = $('#chat-input'); inp && inp.focus();
  }
  function openChat(prefill) {
    S.drawerKind = 'chat';
    openDrawer(chatHtml(), { focus: '#chat-input' });
    if (prefill) setTimeout(() => { const i = $('#chat-input'); if (i) { i.value = prefill; i.focus(); } }, 40);
    const dr = $('#drawer'); dr.scrollTop = dr.scrollHeight;
  }
  let mid = 0;
  function contextForAI() {
    return {
      today: D.today,
      practice: D.practice,
      profile: S.profile,
      goal: D.goal,
      stats: D.stats.map(s => `${s.label}: ${s.value} (${s.delta} ${s.note})`),
      upcoming: S.calendar.filter(e => parse(e.date) >= TODAY).map(e => ({ date: e.date, desk: e.desk, title: e.title, status: e.status })),
    };
  }
  function pushPlan(plan, extra) {
    const rows = (plan.rows || []).filter(r => ['lead', 'social', 'ads'].includes(r.desk)).map(r => ({
      desk: r.desk, what: r.what || r.title, why: r.why || '', title: r.title || r.what, date: /^\d{4}-\d{2}-\d{2}$/.test(r.date || '') ? r.date : D.today,
    }));
    S.chat.push(Object.assign({ kind: 'plan', id: ++mid, plan: { intro: plan.intro, rows } }, extra || {}));
    S.history.push({ role: 'assistant', content: `${plan.intro || 'Plan'}\n` + rows.map(r => `- [${r.desk}] ${r.what} (${r.date}). Why: ${r.why}`).join('\n') });
  }
  function scriptedReply(q) {
    let r = replyFor(q);
    if (r.ask && S.pendingTopic && q.length < 40) r = { generic: q.toLowerCase().replace(/[^a-z ]/g, '').trim() || 'this' };
    S.pendingTopic = false;
    if (r.plan) pushPlan(PLANS[r.plan]);
    else if (r.generic) pushPlan(genericPlan(r.generic));
    else if (r.text) { S.chat.push({ from: 'them', html: r.text }); S.history.push({ role: 'assistant', content: r.text.replace(/<[^>]+>/g, '') }); }
    else {
      S.pendingTopic = true;
      S.chat.push({ from: 'them', html: `Happy to help. Two quick questions first:<ol><li>Which treatment do you want more of? Implants, Invisalign, whitening or something else?</li><li>Is there a date you’re working towards?</li></ol>
        <div class="suggest" style="margin-top:10px"><button type="button" data-action="ask" data-q="Implants">Implants</button><button type="button" data-action="ask" data-q="Invisalign for the new year">Invisalign for the new year</button><button type="button" data-action="ask" data-q="Whitening before Christmas">Whitening before Christmas</button></div>` });
    }
  }
  async function liveReply() {
    const headers = { 'Content-Type': 'application/json' };
    const pass = getPass(); if (pass) headers['x-demo-pass'] = pass;
    if (AUTH.session) headers.Authorization = 'Bearer ' + AUTH.session.access_token;
    const res = await fetch(API.base + '/api/chat', { method: 'POST', headers, body: JSON.stringify({ messages: S.history.slice(-20), context: contextForAI() }) });
    if (res.status === 401 && AUTH.client) { S.chat.push({ from: 'them', html: 'Your sign-in has expired. Please sign in again.' }); AUTH.client.auth.signOut(); return true; }
    if (res.status === 401 && (await res.clone().json().catch(() => ({}))).error !== 'unauthorised') return false;
    if (res.status === 401) { S.awaitPass = true; S.chat.push({ from: 'them', html: 'This demo is protected. Type the demo passcode to continue.' }); return true; }
    if (!res.ok) return false;
    const j = await res.json();
    if (j.plan && j.plan.rows && j.plan.rows.length) {
      if (j.reply && j.reply !== j.plan.intro) j.plan.intro = j.plan.intro || j.reply;
      pushPlan(j.plan, { agents: j.agents, checks: j.checks });
    } else {
      let html = mdLite(j.reply || '');
      if (j.questions && j.questions.length) html += `<ol>${j.questions.map(x => `<li>${esc(x)}</li>`).join('')}</ol>`;
      if (j.agents && j.agents.length) html += `<div class="tiny muted" style="margin-top:6px">Worked on by: ${esc(j.agents.join(', '))}</div>`;
      S.chat.push({ from: 'them', html });
      S.history.push({ role: 'assistant', content: (j.reply || '') + (j.questions ? '\n' + j.questions.join('\n') : '') });
    }
    return true;
  }
  async function sendChat(q) {
    q = q.trim(); if (!q || S.chatBusy) return;
    if (S.drawerKind !== 'chat' || $('#drawer').hidden) openChat();
    if (S.awaitPass) {
      S.awaitPass = false; setPass(q);
      S.chat.push({ from: 'me', html: '••••••' });
      q = (S.history.filter(h => h.role === 'user').slice(-1)[0] || {}).content || '';
      S.history = S.history.slice(0, -1);
      if (!q) { renderChat(); return; }
    } else {
      S.chat.push({ from: 'me', html: esc(q) });
    }
    S.history.push({ role: 'user', content: q });
    S.chat.push({ kind: 'typing', note: API.live ? 'Asking the teams. This takes up to 30 seconds.' : '' }); S.chatBusy = true; renderChat();
    let ok = false;
    if (API.live) { try { ok = await liveReply(); } catch (e) { ok = false; } }
    if (!ok) await new Promise(r => setTimeout(r, 900));
    S.chat = S.chat.filter(m => m.kind !== 'typing'); S.chatBusy = false;
    if (!ok) {
      if (API.live) S.chat.push({ from: 'them', html: '<span class="tiny muted">Couldn’t reach the team just now, so here’s a sample reply.</span>' });
      scriptedReply(q);
    }
    renderChat();
  }


  /* ================================================================
     NOTIFICATIONS: a bell for everything, a pop-up only for urgent
     ================================================================ */
  const LEVEL = { urgent: ['Urgent', '#E5484D'], warn: ['Needs a reply', '#E8A21A'], money: ['Money in', '#30A46C'], info: ['Update', '#5560C9'] };
  function updateBell() {
    const n = S.notes.filter(x => !x.read && !x.handled).length, b = $('#bell-count');
    if (!b) return; b.hidden = !n; b.textContent = n;
  }
  function noteRow(x) {
    const [lbl, col] = LEVEL[x.level];
    const acts = x.handled ? `<span class="status"><i class="dot dot-always"></i>${esc(x.handled)}</span>`
      : (x.actions || []).map((a, i) => `<button class="btn ${i ? 'btn-line' : 'btn-dark'} btn-sm" type="button" data-action="note-act" data-id="${x.id}" data-a="${a[1]}">${esc(a[0])}</button>`).join('')
        + (x.go ? `<button class="btn btn-line btn-sm" type="button" data-action="note-go" data-id="${x.id}">Open</button>` : '');
    return `<div class="note ${x.level} ${x.read ? '' : 'unread'}"><span class="note-dot" style="background:${col}"></span>
      <div class="note-body"><div class="row between"><span class="note-lbl" style="color:${col}">${lbl}</span><span class="tiny muted">${esc(x.time)}</span></div>
      <b>${esc(x.title)}</b><p>${esc(x.body)}</p>${acts ? `<div class="need-actions">${acts}</div>` : ''}</div></div>`;
  }
  function notesDrawer() {
    S.drawerKind = 'notes';
    const urgent = S.notes.filter(x => x.level === 'urgent'), rest = S.notes.filter(x => x.level !== 'urgent');
    const html = `<span class="eyebrow">Updates</span><h2 id="drawer-title" style="margin-top:6px">What you should know</h2>
      <div class="drawer-section"><h4>Urgent</h4><div class="notes">${urgent.map(noteRow).join('')}</div></div>
      <div class="drawer-section"><h4>Everything else</h4><div class="notes">${rest.map(noteRow).join('')}</div></div>
      <div class="drawer-section card card-soft"><b>How we reach you</b>
        <ul class="reach"><li><b>Urgent</b>, like a keen patient waiting or ads overspending: a pop-up here and a text to your phone.</li>
        <li><b>Things to approve</b>: on your Today screen, with a WhatsApp reminder if they wait a day.</li>
        <li><b>Good news</b>, like a patient saying yes: here, and in an email at 8am.</li>
        <li><b>How it’s going</b>: a short report every Friday, and a monthly call with Sam.</li></ul>
        <p class="tiny muted" style="margin-top:8px">We won’t contact you between 8pm and 7am unless it’s about money. You can change all of this.</p></div>
      <div class="drawer-actions"><button class="btn btn-line btn-sm" type="button" data-action="demo-alert">Show me a demo alert</button></div>`;
    if ($('#drawer').hidden) openDrawer(html); else $('#drawer-body').innerHTML = html;
    S.notes.forEach(x => { if (x.level !== 'urgent') x.read = true; }); updateBell();
  }
  function showAlert(id) {
    const x = S.notes.find(n => n.id === id); if (!x || x.handled) return;
    S.alertShown[id] = true;
    const box = $('#alert');
    box.innerHTML = `<div class="alert-head"><span class="alert-pulse"></span><span class="note-lbl" style="color:#E5484D">Urgent · ${esc(x.time)}</span>
      <button class="drawer-close" type="button" data-action="alert-close" aria-label="Dismiss">×</button></div>
      <b id="alert-title">${esc(x.title)}</b><p>${esc(x.body)}</p>
      <div class="need-actions">${(x.actions || []).map((a, i) => `<button class="btn ${i ? 'btn-line' : 'btn-dark'} btn-sm" type="button" data-action="note-act" data-id="${x.id}" data-a="${a[1]}">${esc(a[0])}</button>`).join('')}
      <button class="btn btn-ghost btn-sm" type="button" data-action="alert-snooze" data-id="${x.id}">In 30 min</button></div>`;
    box.hidden = false; box.classList.remove('out');
  }
  function hideAlert() { const b = $('#alert'); b.classList.add('out'); setTimeout(() => { b.hidden = true; }, 260); }
  function noteAction(id, a) {
    const x = S.notes.find(n => n.id === id); if (!x) return;
    const done = {
      called: ['Calling her now', 'Thanks. We’ll note the call on her record.'],
      leah: ['Sent to Leah', 'Leah has Aisha’s details and what to say.'],
      keep: ['Kept paused', 'They’ll stay paused. The ads team will suggest a fix tomorrow.'],
      resume: ['Turned back on', 'Back on, with a £40-a-day limit so it can’t happen again.'],
      review: [null, null],
    }[a];
    if (a === 'review') { hideAlert(); reviewDrawer(x); return; }
    x.handled = done[0]; x.read = true; toast(done[1]); hideAlert(); updateBell();
    if (S.drawerKind === 'notes' && !$('#drawer').hidden) notesDrawer();
  }
  function reviewDrawer(x) {
    S.drawerKind = 'review';
    openDrawer(`<span class="eyebrow">Reviews</span><h2 id="drawer-title" style="margin-top:6px">Reply to the 2-star review</h2>
      <div class="drawer-section card card-soft"><span class="small muted">★★☆☆☆ · Google · yesterday</span><p style="margin-top:6px">“Lovely staff but I waited 35 minutes past my appointment on Tuesday with no explanation.”</p></div>
      <div class="drawer-section"><h4>Our suggested reply (it doesn’t mention any treatment, to protect their privacy)</h4>
        <textarea rows="6" style="width:100%;border:1px solid var(--line-3);border-radius:14px;padding:12px;font:inherit;background:rgba(255,255,255,.7)">${esc(D.reviewDraft)}</textarea></div>
      <div class="drawer-actions"><button class="btn btn-dark" type="button" data-action="review-post" data-id="${x.id}">Approve and post</button></div>`);
  }

  /* ================================================================
     LOGIN: Supabase Auth, invite-only. Switched on by filling in config.js.
     ================================================================ */
  const AUTH = { client: null, session: null, ready: false, configured: !!(CFG.supabaseUrl && CFG.supabaseAnonKey), demo: false, msg: '', mode: 'password', busy: false };
  try { AUTH.demo = sessionStorage.getItem('marquee_demo') === '1'; } catch (e) { /* ignore */ }
  function loadScript(src) { return new Promise((ok, bad) => { const t = document.createElement('script'); t.src = src; t.onload = ok; t.onerror = bad; document.head.appendChild(t); }); }
  async function initAuth() {
    if (!AUTH.configured) { AUTH.ready = true; return; }
    try {
      await loadScript('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/dist/umd/supabase.min.js');
      AUTH.client = window.supabase.createClient(CFG.supabaseUrl, CFG.supabaseAnonKey, { auth: { flowType: 'pkce', detectSessionInUrl: true, persistSession: true } });
      const { data } = await AUTH.client.auth.getSession();
      AUTH.session = data.session;
      AUTH.client.auth.onAuthStateChange((_e, session) => { AUTH.session = session; render(); });
      if (location.search.includes('code=')) history.replaceState(null, '', location.pathname + location.hash);
    } catch (e) { AUTH.msg = 'We couldn’t reach the sign-in service. Check your connection and try again.'; }
    AUTH.ready = true;
  }
  const signedIn = () => !!AUTH.session || (!AUTH.configured && AUTH.demo);
  function viewLogin() {
    if (!AUTH.ready) return `<div class="login"><div class="login-card"><p class="muted">Loading…</p></div></div>`;
    const mode = AUTH.mode;
    if (!AUTH.configured) return `<div class="login"><div class="login-card rise">
      <span class="brand-name">Marquee</span><span class="bulbs" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></span>
      <h1>Sign in to your marketing team</h1>
      <p class="lede">Sign-in isn’t switched on for this demo copy yet. When it is, only people you invite can get in.</p>
      <button class="btn btn-dark btn-big" type="button" data-action="enter-demo" style="width:100%">View the demo</button>
      <p class="tiny muted" style="margin-top:14px">Everything inside is made up. Oakmere Dental is a pretend practice.</p></div></div>`;
    return `<div class="login"><form class="login-card rise" data-form="login" novalidate>
      <span class="brand-name">Marquee</span><span class="bulbs" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></span>
      <h1>${mode === 'reset' ? 'Reset your password' : 'Sign in to your marketing team'}</h1>
      <p class="lede">${mode === 'link' ? 'We’ll email you a link. Tap it and you’re in.' : mode === 'reset' ? 'We’ll email you a link to choose a new password.' : 'Use the email your account manager invited.'}</p>
      <label class="field"><span>Email</span><input type="email" name="email" autocomplete="email" required value="${esc(AUTH.email || '')}"></label>
      ${mode === 'password' ? `<label class="field"><span>Password</span><input type="password" name="password" autocomplete="current-password" required></label>` : ''}
      ${AUTH.msg ? `<p class="login-msg" role="alert">${esc(AUTH.msg)}</p>` : ''}
      <button class="btn btn-dark btn-big" type="submit" style="width:100%;margin-top:18px" ${AUTH.busy ? 'disabled' : ''}>${AUTH.busy ? 'One moment…' : mode === 'password' ? 'Sign in' : 'Email me the link'}</button>
      <div class="login-alt">${mode !== 'password' ? '<button class="link" type="button" data-action="auth-mode" data-m="password">Sign in with a password</button>' : '<button class="link" type="button" data-action="auth-mode" data-m="link">Email me a sign-in link instead</button><button class="link" type="button" data-action="auth-mode" data-m="reset">Forgot password?</button>'}</div>
      <p class="tiny muted" style="margin-top:14px">Invite only. No account? Ask your account manager.</p>
    </form></div>`;
  }
  async function submitLogin(form) {
    const email = form.email.value.trim(), pw = form.password ? form.password.value : '';
    AUTH.email = email;
    if (!/^\S+@\S+\.\S+$/.test(email)) { AUTH.msg = 'Please enter a valid email address.'; render(); return; }
    AUTH.busy = true; AUTH.msg = ''; render();
    const redirectTo = location.origin + location.pathname;
    let error;
    if (AUTH.mode === 'password') ({ error } = await AUTH.client.auth.signInWithPassword({ email, password: pw }));
    else if (AUTH.mode === 'link') ({ error } = await AUTH.client.auth.signInWithOtp({ email, options: { shouldCreateUser: false, emailRedirectTo: redirectTo } }));
    else ({ error } = await AUTH.client.auth.resetPasswordForEmail(email, { redirectTo }));
    AUTH.busy = false;
    if (error) AUTH.msg = AUTH.mode === 'password' ? 'That email and password don’t match. Try again, or use a sign-in link.' : 'We couldn’t send that. Check the email address is the one you were invited with.';
    else if (AUTH.mode !== 'password') AUTH.msg = 'Check your email for the link.';
    render();
  }
  async function signOut() {
    if (AUTH.client) await AUTH.client.auth.signOut();
    AUTH.session = null; AUTH.demo = false; try { sessionStorage.removeItem('marquee_demo'); } catch (e) { /* ignore */ }
    closeDrawer(); render();
  }

  /* ================================================================
     ONBOARDING: set up your business (route #setup)
     ================================================================ */
  const SEED_PROFILE = {
    owner: 'Maya', business: 'Oakmere Dental', area: 'Maidenhead', type: 'dental',
    offers: { Invisalign: '2,950', Implants: '2,400', Whitening: '295' },
    goalWhat: 'Invisalign', goalCount: 40, budget: 2400,
    tone: 'calm', avoid: 'Cheap, painless, best in Berkshire',
    connected: { website: true, instagram: true, facebook: true, gbp: true, gads: true, hubspot: true, pms: true },
    approver: 'me', dailyCap: 80, quiet: true, alertBy: 'text',
  };
  const BIZ_TYPES = [['dental', 'Dental practice'], ['clinic', 'Clinic or therapist'], ['trades', 'Trades and home services'], ['property', 'Estate or letting agent'], ['other', 'Something else']];
  const OFFERS = { dental: ['Invisalign', 'Implants', 'Whitening', 'Veneers', 'Check-ups', 'Emergency appointments'], clinic: ['First appointment', 'Treatment course', 'Memberships'], trades: ['New boiler', 'Kitchen', 'Bathroom', 'Roof', 'Repairs'], property: ['Valuations', 'Lettings', 'Sales'], other: ['Main service', 'Second service'] };
  const TONES = [
    ['calm', 'Calm and reassuring', 'Nervous about the dentist? Most of our patients were too. Here’s what your first visit looks like.'],
    ['friendly', 'Friendly and chatty', 'Fancy a straighter smile by summer? Pop in for a free chat, the kettle’s on.'],
    ['polished', 'Polished and premium', 'Considered, precise care, close to home. Book a private consultation with our team.'],
  ];
  const CONNECTIONS = [['website', 'Your website', 'So enquiries land in one place'], ['instagram', 'Instagram', 'To plan and publish posts'], ['facebook', 'Facebook', 'Posts and ads'], ['gbp', 'Google listing', 'Reviews and your map listing'], ['gads', 'Google ads', 'To run and check your ads'], ['hubspot', 'HubSpot', 'Your enquiry list'], ['pms', 'Practice diary (Dentally)', 'So we know who booked and turned up']];
  const SETUP_STEPS = ['Your business', 'What you sell', 'Your goal', 'How you sound', 'Where you are online', 'Your rules', 'All set'];

  function loadProfile() { try { const p = JSON.parse(localStorage.getItem('marquee_profile') || 'null'); return p && p.business ? p : null; } catch (e) { return null; } }
  function saveProfile() { try { localStorage.setItem('marquee_profile', JSON.stringify(S.profile)); } catch (e) { /* ignore */ } }
  function applyProfile() {
    const p = S.profile; if (!p) return;
    D.practice.owner = p.owner || D.practice.owner; D.practice.name = p.business || D.practice.name; D.practice.town = p.area || D.practice.town;
    document.querySelectorAll('.client').forEach(el => { el.textContent = D.practice.name; });
  }

  function viewSetup() {
    const p = S.draft, i = S.setupStep, last = SETUP_STEPS.length - 1;
    const chip = (name, val, label, on) => `<button type="button" class="opt ${on ? 'on' : ''}" data-action="setup-pick" data-name="${name}" data-val="${esc(val)}" aria-pressed="${!!on}">${esc(label)}</button>`;
    let body = '';
    if (i === 0) body = `<h1>Let’s get to know your business</h1><p class="lede">This takes about 5 minutes. You can change anything later.</p>
      <div class="form-grid">
        <label class="field"><span>Your first name</span><input data-field="owner" value="${esc(p.owner || '')}" placeholder="e.g. Maya" autocomplete="given-name"></label>
        <label class="field"><span>Business name</span><input data-field="business" value="${esc(p.business || '')}" placeholder="e.g. Oakmere Dental" autocomplete="organization"></label>
        <label class="field"><span>Town or area you serve</span><input data-field="area" value="${esc(p.area || '')}" placeholder="e.g. Maidenhead"></label>
      </div>
      <div class="field"><span>What kind of business is it?</span><div class="opts">${BIZ_TYPES.map(([v, l]) => chip('type', v, l, p.type === v)).join('')}</div></div>`;
    if (i === 1) body = `<h1>What do you want more of?</h1><p class="lede">Pick the things you sell. Add a “from” price if you show one publicly. We only ever use the prices you give us.</p>
      <div class="offer-list">${(OFFERS[p.type] || OFFERS.other).map(o => { const on = p.offers && o in p.offers; return `<div class="offer ${on ? 'on' : ''}">
        <button type="button" class="opt ${on ? 'on' : ''}" data-action="setup-offer" data-val="${esc(o)}" aria-pressed="${on}">${esc(o)}</button>
        ${on ? `<label class="price"><span>from £</span><input data-offer="${esc(o)}" inputmode="numeric" value="${esc(p.offers[o] || '')}" placeholder="optional" aria-label="${esc(o)} price from"></label>` : ''}</div>`; }).join('')}</div>`;
    if (i === 2) { const picks = Object.keys(p.offers || {}); body = `<h1>What does a good month look like?</h1><p class="lede">This becomes the goal on your Today screen. We’ll tell you each week if we’re on track.</p>
      <div class="field"><span>What should we focus on first?</span><div class="opts">${(picks.length ? picks : ['New customers']).map(o => chip('goalWhat', o, o, p.goalWhat === o)).join('')}</div></div>
      <label class="field"><span>How many consultations or bookings a month would make you happy?</span><input type="number" min="1" max="999" data-field="goalCount" value="${esc(p.goalCount || '')}" style="max-width:160px"></label>
      <label class="field"><span>Monthly ad budget: <b id="budget-out">£${n(Number(p.budget || 0))}</b> <small class="muted">(paid straight to Google and Facebook, not to us)</small></span>
        <input type="range" min="0" max="5000" step="100" data-field="budget" value="${esc(p.budget || 0)}"></label>
      <p class="small muted">Not sure? Most practices like yours start between £1,000 and £2,500 a month. We can start lower and grow it once it works.</p>`; }
    if (i === 3) { const t = TONES.find(x => x[0] === p.tone) || TONES[0]; body = `<h1>How should you sound?</h1><p class="lede">Your writer uses this for every post, ad and email.</p>
      <div class="tone-grid">${TONES.map(([v, l, ex]) => `<button type="button" class="tone ${p.tone === v ? 'on' : ''}" data-action="setup-pick" data-name="tone" data-val="${v}" aria-pressed="${p.tone === v}"><b>${l}</b><span>“${esc(ex)}”</span></button>`).join('')}</div>
      <label class="field"><span>Words or claims we should never use</span><input data-field="avoid" value="${esc(p.avoid || '')}" placeholder="e.g. cheap, painless, best in town"></label>
      <div class="sample card card-soft"><span class="tiny muted">How a post might start</span><p>${esc(t[2])}</p></div>`; }
    if (i === 4) body = `<h1>Where are you online?</h1><p class="lede">Connecting lets the team see what’s working and save you typing. In this demo, the buttons just pretend. In the real thing you sign in to each one and can disconnect any time.</p>
      <div class="connect-grid">${CONNECTIONS.map(([k, l, d]) => { const on = p.connected && p.connected[k]; return `<div class="connect ${on ? 'on' : ''}"><div><b>${l}</b><span>${d}</span></div>
        <button type="button" class="btn ${on ? 'btn-line' : 'btn-dark'} btn-sm" data-action="setup-connect" data-val="${k}">${on ? 'Connected ✓' : 'Connect'}</button></div>`; }).join('')}</div>
      <p class="small muted" style="margin-top:12px">Skip any you don’t use. We never post or spend without your OK.</p>`;
    if (i === 5) body = `<h1>Your rules</h1><p class="lede">The team works within these. Change them whenever you like.</p>
      <div class="field"><span>Who approves posts and ads?</span><div class="opts">${chip('approver', 'me', 'Just me', p.approver === 'me')}${chip('approver', 'me+manager', 'Me or my practice manager', p.approver === 'me+manager')}</div></div>
      <label class="field"><span>Most we can spend on ads in one day: <b id="cap-out">£${n(Number(p.dailyCap || 0))}</b></span><input type="range" min="10" max="300" step="10" data-field="dailyCap" value="${esc(p.dailyCap || 80)}"></label>
      <div class="field"><span>How should we reach you if something is urgent?</span><div class="opts">${chip('alertBy', 'text', 'Text message', p.alertBy === 'text')}${chip('alertBy', 'whatsapp', 'WhatsApp', p.alertBy === 'whatsapp')}${chip('alertBy', 'email', 'Email only', p.alertBy === 'email')}</div></div>
      <label class="check"><input type="checkbox" data-field="quiet" ${p.quiet ? 'checked' : ''}> Don’t contact me between 8pm and 7am unless it’s about money</label>`;
    if (i === last) body = `<h1>You’re all set, ${esc(p.owner || 'there')}.</h1><p class="lede">Here’s what your team does in the next 48 hours.</p>
      <ol class="next48">
        <li><b>Today</b> Your marketing lead reads everything you told us and writes your first monthly plan.</li>
        <li><b>Tomorrow morning</b> The new patients team sets up quick replies, so every enquiry gets a text within 2 minutes.</li>
        <li><b>Tomorrow</b> The social media team drafts your first week of posts in your ${esc((TONES.find(x => x[0] === p.tone) || TONES[0])[1].toLowerCase())} voice.</li>
        <li><b>Within 48 hours</b> Sam, your account manager, calls to check it all makes sense.</li>
      </ol>
      <div class="card card-soft summary-card"><b>${esc(p.business || '')}</b><span>${esc((BIZ_TYPES.find(b => b[0] === p.type) || [0, ''])[1])} · ${esc(p.area || '')}</span>
        <span>Goal: ${esc(p.goalCount || '')} ${esc(p.goalWhat || '')} a month · Ads up to £${n(Number(p.budget || 0))} a month</span></div>`;
    return `<div class="setup">
      <div class="setup-top"><span class="eyebrow">Step ${i + 1} of ${SETUP_STEPS.length} · ${SETUP_STEPS[i]}</span>
        <div class="setup-bar">${SETUP_STEPS.map((_, k) => `<i class="${k <= i ? 'on' : ''}"></i>`).join('')}</div></div>
      <div class="setup-card rise">${body}</div>
      <div class="setup-nav">${i > 0 && i < last ? `<button class="btn btn-line btn-big" type="button" data-action="setup-back">Back</button>` : '<span></span>'}
        ${i < last ? `<button class="btn btn-dark btn-big" type="button" data-action="setup-next">${i === last - 1 ? 'Finish' : 'Next'}</button>` : `<button class="btn btn-dark btn-big" type="button" data-action="setup-done">Go to my Today screen</button>`}</div>
      ${i === 0 ? `<p class="small muted" style="text-align:center;margin-top:14px"><button class="link" type="button" data-action="setup-demo">Skip and use the demo practice</button></p>` : ''}
    </div>`;
  }
  function readSetupFields() {
    document.querySelectorAll('.setup [data-field]').forEach(el => {
      const k = el.dataset.field;
      S.draft[k] = el.type === 'checkbox' ? el.checked : (el.type === 'number' || el.type === 'range') ? Number(el.value) : el.value.trim();
    });
    document.querySelectorAll('.setup [data-offer]').forEach(el => { S.draft.offers[el.dataset.offer] = el.value.replace(/[^\d,]/g, ''); });
  }
  function setupValid() {
    const p = S.draft, i = S.setupStep;
    if (i === 0 && (!p.owner || !p.business || !p.area || !p.type)) return 'Please fill in your name, business, area and type.';
    if (i === 1 && !Object.keys(p.offers || {}).length) return 'Pick at least one thing you sell.';
    if (i === 2 && (!p.goalWhat || !p.goalCount)) return 'Pick a focus and a number for the month.';
    return '';
  }

  /* ================================================================
     TEAM
     ================================================================ */
  function node(a, extra) {
    return `<button class="node ${extra || ''}" type="button" data-action="agent" data-id="${a.id}"><span><b>${esc(a.name)}</b><small>${a.now && a.now !== 'Idle' && a.now !== 'Always on' ? esc(a.now) : AGENT_STATE[a.state]}</small></span><i class="dot dot-${a.state}" style="margin-left:auto" aria-label="${AGENT_STATE[a.state]}"></i></button>`;
  }
  function viewTeam() {
    const T = D.team;
    return `
    <div class="page-head"><span class="eyebrow">Your team</span><h1>Who’s who</h1>
      <p class="lede">You only talk to your marketing lead. They pass the work to the right team. The same writers and designers work for every team, so everything sounds like Oakmere. Everything is checked before you see it.</p>
      <div class="row wrap" style="margin-top:6px"><a class="btn btn-dark btn-sm" href="#setup">Edit your business details</a><a class="btn btn-line btn-sm" href="#setup/new">Try set-up as a new business</a></div></div>

    <section class="section">
      <div class="org-top">
        <div class="node node-you"><span class="avatar avatar-soft">M</span><span><b>${esc(D.practice.ownerFull)}</b><small>You say yes or no</small></span></div>
        <span class="connector-h"></span>
        ${node(T.head, 'node-head')}
        <span class="connector-h dashed"></span>
        ${node(T.human)}
      </div>
      <div class="trunk"></div>
      <div class="desk-row">
        ${T.desks.map(d => `
          <div class="desk-col ${d.id}">
            <h3><span>${esc(d.name)}</span><a href="#desks/${d.id}">See their work</a></h3>
            <p class="owns">In charge of: ${esc(d.owns)}</p>
            ${node(d.manager)}
            <div class="crew">${d.crew.map(c => node(c)).join('')}</div>
          </div>`).join('')}
      </div>
      <div class="shared">
        <div class="shared-col bench"><h3>Writers & designers</h3><p>They work for every team, so your posts, ads and emails all sound like you.</p>
          <div class="nodes">${T.bench.map(a => node(a)).join('')}</div></div>
        <div class="shared-col quality"><h3>Final checks</h3><p>Everything is checked here before you see it. These are checks, not legal advice.</p>
          <div class="nodes">${T.quality.map(a => node(a)).join('')}</div></div>
      </div>
      <div class="later"><span>Teams you can add later:</span>${T.later.map(l => `<span class="slot">${esc(l)}</span>`).join('')}</div>
    </section>

    ${trainingSection()}

    <section class="section">
      <div class="section-head"><h2>Why it’s set up this way</h2><p>It’s how most good agencies work.</p></div>
      <div class="why-pod">
        <div><b>Someone is responsible</b>Each team has a lead who answers for one thing you care about, like consultations booked or what each patient costs.</div>
        <div><b>It all sounds like you</b>The same writer and designer work for every team, so your ads, posts and emails feel like they come from one practice.</div>
        <div><b>Checked before you see it</b>Spelling, tone, advertising rules and permissions are checked every time. You only see work that’s ready.</div>
      </div>
    </section>`;
  }
  /* ---------------- Training (from agents/knowledge.js) ---------------- */
  const skillsOf = id => ((S.K && S.K.KNOWLEDGE && S.K.KNOWLEDGE[id]) || []).concat(S.customSkills[id] || []);
  const safeUrl = u => (/^https:\/\//i.test(u || '') ? u : '');
  const srcOf = sid => (S.K && S.K.SOURCES && S.K.SOURCES[sid]) || null;
  function allAgents() {
    const T = D.team, out = [{ a: T.head, team: 'Your marketing lead' }];
    T.desks.forEach(d => { out.push({ a: d.manager, team: d.name }); d.crew.forEach(c => out.push({ a: c, team: d.name })); });
    T.bench.forEach(a => out.push({ a, team: D.desks.bench.name }));
    T.quality.forEach(a => out.push({ a, team: D.desks.quality.name }));
    return out;
  }
  function skillCard(sk, open) {
    const srcs = (sk.sources || []).map(srcOf).filter(Boolean);
    return `<details class="skill" ${open ? 'open' : ''}><summary><b>${esc(sk.title)}</b><span>${esc(sk.summary || '')}</span></summary>
      ${sk.instructions ? `<div class="skill-how"><h5>How they do it</h5><p>${esc(sk.instructions)}</p></div>` : ''}
      ${srcs.length ? `<div class="skill-src">Learned from: ${srcs.map(x => safeUrl(x.url) ? `<a href="${esc(safeUrl(x.url))}" target="_blank" rel="noopener">${esc(x.name)}</a>` : esc(x.name)).join(' · ')}</div>` : sk.custom ? '<div class="skill-src">Added by you</div>' : ''}
    </details>`;
  }
  function trainingSection() {
    if (!S.K) return `<section class="section"><div class="section-head"><h2>How your team is trained</h2><p>Loading…</p></div></section>`;
    const list = allAgents(), total = list.reduce((n, x) => n + skillsOf(x.a.id).length, 0);
    const sources = Object.entries(S.K.SOURCES || {});
    const q = (S.skillQuery || '').toLowerCase();
    const groups = {};
    list.forEach(({ a, team }) => skillsOf(a.id).forEach(sk => {
      if (q && !(sk.title + ' ' + (sk.summary || '') + ' ' + a.name).toLowerCase().includes(q)) return;
      (groups[team] = groups[team] || []).push({ a, sk });
    }));
    return `<section class="section" id="training">
      <div class="section-head"><h2>How your team is trained</h2><p>Each team member follows written methods taken from experienced marketers, adjusted for a UK dental practice.</p></div>
      <div class="story-tiles">
        <div class="s-tile"><span class="stat-label">Team members</span><div class="stat-value">${list.length}</div><span class="stat-foot">plus Sam, a real person</span></div>
        <div class="s-tile"><span class="stat-label">Skills they know</span><div class="stat-value">${total}</div><span class="stat-foot">tap anyone to see theirs</span></div>
        <div class="s-tile"><span class="stat-label">Where the know-how comes from</span><div class="stat-value">${sources.length}</div><span class="stat-foot">free, open guides by marketers</span></div>
      </div>
      <div class="sources">${sources.map(([k, x]) => `<a class="source" ${safeUrl(x.url) ? `href="${esc(safeUrl(x.url))}" target="_blank" rel="noopener"` : ''}><b>${esc(x.name)}</b><span>${esc(x.author || '')}${x.license ? ' · ' + esc(x.license) : ''}</span></a>`).join('')}</div>
      <div class="lib-head"><h3>All skills</h3><label class="lib-search"><span style="position:absolute;left:-9999px">Search skills</span><input type="search" id="skill-q" placeholder="Search, e.g. headlines, reviews, budget" value="${esc(S.skillQuery || '')}"></label></div>
      ${Object.keys(groups).length ? Object.entries(groups).map(([team, items]) => `<div class="lib-group"><h4>${esc(team)}</h4><div class="lib-grid">${items.map(({ a, sk }) =>
        `<button class="lib-item" type="button" data-action="agent" data-id="${a.id}"><span class="tiny muted">${esc(a.name)}</span><b>${esc(sk.title)}</b><span>${esc(sk.summary || '')}</span></button>`).join('')}</div></div>`).join('') : '<p class="empty">No skills match that.</p>'}
    </section>`;
  }

  function findAgent(id) {
    const T = D.team;
    const all = [T.head, T.human, ...T.bench, ...T.quality];
    T.desks.forEach(d => all.push(Object.assign({ desk: d.id }, d.manager), ...d.crew.map(c => Object.assign({ desk: d.id }, c))));
    const a = all.find(x => x.id === id);
    if (a && !a.desk) a.desk = T.bench.includes(a) ? 'bench' : T.quality.includes(a) ? 'quality' : null;
    return a;
  }
  function teachDrawer(id) {
    const a = findAgent(id); if (!a) return;
    openDrawer(`<span class="eyebrow">Teach ${esc(a.name)}</span><h2 id="drawer-title" style="margin-top:6px">What should they know?</h2>
      <p class="small muted" style="margin-top:8px">Write it like you’d brief a new member of staff. They’ll follow it from now on.</p>
      <label class="field"><span>Name it</span><input id="teach-title" type="text" placeholder="e.g. How we talk about prices"></label>
      <label class="field"><span>What they should do</span><textarea id="teach-body" rows="6" placeholder="e.g. Always say implants start from £2,400 and that we offer free consultations. Never compare our prices with other practices."></textarea></label>
      <div class="drawer-actions"><button class="btn btn-dark" type="button" data-action="teach-save" data-id="${id}">Save</button><button class="btn btn-line" type="button" data-action="agent" data-id="${id}">Back</button></div>`, { focus: '#teach-title' });
  }
  function agentDrawer(id) {
    const a = findAgent(id); if (!a) return;
    const isHuman = id === 'sam';
    const deskLine = a.desk ? `<span class="desk-tag"><i class="sw sw-${a.desk}"></i>${esc(deskName(a.desk))}</span>` : '';
    openDrawer(`
      <span class="eyebrow">${isHuman ? 'Real person' : 'AI team member'}</span>
      <h2 id="drawer-title" style="margin-top:6px">${esc(a.name)}</h2>
      <div class="meta">${deskLine}${agentState(a.state)}</div>
      <div class="drawer-section"><h4>What they do</h4><p>${esc(a.job)}</p></div>
      <div class="drawer-section"><h4>Right now</h4><p>${esc(a.now)}</p></div>
      ${isHuman ? '' : `<div class="drawer-section"><h4>What they know (${skillsOf(id).length})</h4>
        <div class="skills">${skillsOf(id).map((sk, i) => skillCard(sk, i === 0)).join('') || '<p class="small muted">Loading their training…</p>'}</div>
        <button class="btn btn-line btn-sm" type="button" data-action="teach" data-id="${id}" style="margin-top:10px">Teach them something</button></div>`}
      ${a.desk === 'quality' ? '' : `<div class="drawer-section"><h4>Checked before you see it</h4><ul class="checklist"><li>Spelling</li><li>Sounds like you</li><li>Advertising rules</li><li>Privacy and permission</li></ul></div>`}
      <div class="drawer-actions">${isHuman
        ? `<button class="btn btn-dark" type="button" data-action="toast" data-msg="This would open WhatsApp with Sam.">Message Sam</button><button class="btn btn-line" type="button" data-action="toast" data-msg="Booked: monthly results call, Thu 26 Nov at 12:30.">Book a call</button><button class="btn btn-ghost" type="button" data-action="sign-out">Sign out${AUTH.session ? ' (' + esc(AUTH.session.user.email) + ')' : ''}</button>`
        : `<button class="btn btn-dark" type="button" data-action="chat-about" data-name="${esc(a.name)}">Ask about this</button>`}</div>`);
  }

  /* ================================================================
     LEAD GEN
     ================================================================ */
  function deskHero(k, title, lede, managerId) {
    const T = D.team, d = T.desks.find(x => x.id === k);
    return `<div class="desk-hero"><div class="page-head">
      <span class="eyebrow">${deskTag(k)}</span><h1>${title}</h1><p class="lede">${lede}</p></div>
      <button class="node" type="button" data-action="agent" data-id="${managerId}"><span><b>${esc(d.manager.name)}</b><small>${esc(d.manager.now)}</small></span><i class="dot dot-${d.manager.state}" style="margin-left:12px"></i></button></div>`;
  }
  const LEAD_TABS = [['overview', 'Summary'], ['enquiries', 'Enquiries'], ['journey', 'One patient, start to finish'], ['connect', 'How the apps link up'], ['attribution', 'What’s working best']];
  function viewLead() {
    return `${deskHero('lead', 'New patients', 'Everyone who got in touch, how quickly we replied, and who went ahead with treatment.', 'm-lead')}
      <div class="tabs" role="tablist">${LEAD_TABS.map(([k, l]) => `<button class="tab" role="tab" type="button" aria-selected="${S.leadTab === k}" data-action="lead-tab" data-tab="${k}">${l}</button>`).join('')}</div>
      <div class="tab-body" role="tabpanel">${({ overview: leadOverview, enquiries: leadBoard, journey: leadJourney, connect: leadConnect, attribution: leadAttr })[S.leadTab]()}</div>`;
  }
  function leadOverview() {
    const f = D.funnel, max = f[0].v;
    const rows = f.map((s, i) => {
      const prev = i ? f[i - 1].v : null;
      const conv = prev ? Math.round((s.v / prev) * 100) : null;
      const w = i === 0 ? 100 : Math.max(2, (s.v / f[1].v) * 70);
      const note = D.funnelNotes[s.stage];
      const leak = s.stage === 'Consultation booked';
      return `<div class="f-row"><span class="f-name">${esc(s.stage)}</span>
        <div class="f-bar"><span style="width:${w}%;${i === 0 ? 'background:#BFDFDA;color:#0B5F57' : ''}">${w > 12 ? n(s.v) : ''}</span>${w <= 12 ? `<em>${n(s.v)}</em>` : ''}</div>
        <span class="f-conv">${i === 0 ? 'Last 30 days' : i === 1 ? '<b>3 in 100</b> visitors' : `<b>${conv}%</b> of the row above`}</span>
        ${note ? `<p class="f-note ${leak ? 'leak' : ''}">${esc(note)}</p>` : ''}</div>`;
    }).join('');
    return `
      <div class="section-head"><h2>From website visit to treatment, last 30 days</h2><p>The first bar isn’t to scale, so the smaller numbers are easier to read.</p></div>
      <div class="funnel">${rows}</div>
      <div class="grid cols-3 section">
        <div class="card card-soft"><span class="stat-label">How fast we reply</span><div class="stat-value" style="margin-top:4px">2 min</div><p class="small muted" style="margin-top:6px">An automatic text and email. It used to take about 3 hours.</p></div>
        <div class="card card-soft"><span class="stat-label">How fast Leah calls</span><div class="stat-value" style="margin-top:4px">38 min</div><p class="small muted" style="margin-top:6px">On average. We aim for under an hour. 4 people are waiting longer today.</p></div>
        <div class="card card-soft"><span class="stat-label">Ad cost for each new patient</span><div class="stat-value" style="margin-top:4px">£100</div><p class="small muted" style="margin-top:6px">£2,310 on ads, 23 patients went ahead. Each was worth £2,113 on average.</p></div>
      </div>
      <div class="section">
        <div class="section-head"><h2>How we decide who to call first</h2><p>Each person gets a score out of 100. Over 60 goes to the top of Leah’s list.</p></div>
        <div class="grid cols-4">
          ${[['Treatment', 'Implants and Invisalign score highest'], ['Distance', 'Closer to the practice scores higher'], ['Timing', 'Wants to start within 3 months'], ['Interest', 'Opened our emails or looked at prices']].map(([t, d]) => `<div><b>${t}</b><p class="small muted" style="margin-top:4px">${d}</p></div>`).join('')}
        </div>
      </div>`;
  }
  function leadBoard() {
    return `<div class="section-head"><h2>Everyone who got in touch</h2><p>An orange edge means they’ve waited too long for a call.</p></div>
      <div class="board">${D.leadBoard.map(c => `<div class="board-col"><h4>${esc(c.col)}<span class="muted">${c.items.length}</span></h4>
        ${c.items.map(l => `<div class="lead-card ${l.late && !S.called[l.n] ? 'late' : ''}"><b>${esc(l.n)}</b><small>${esc(l.t)} · ${esc(l.src)}</small>
          <div class="row"><span>Score <span class="score">${l.score}</span></span><span class="${l.late && !S.called[l.n] ? 'late-note' : 'muted'}">${l.late && !S.called[l.n] ? 'Waiting ' : ''}${esc(l.age)}</span></div></div>`).join('')}</div>`).join('')}</div>
      <p class="small muted" style="margin-top:14px">Names are made up. In the real thing, this updates by itself from your enquiry list.</p>`;
  }
  function leadJourney() {
    const J = D.journey, i = S.journeyStep, s = J.steps[i];
    return `<div class="section-head"><h2>${esc(J.who)}: from a Reel to a ${esc(J.value)} ${esc(J.treatment)} plan</h2><p>Who did what, and what happened at each step.</p></div>
      <div class="journey">
        <div class="j-list">${J.steps.map((st, k) => `<button class="j-step d-${st.desk} ${k === i ? 'on' : ''}" type="button" data-action="j-step" data-i="${k}"><small>${esc(st.date)}</small>${esc(st.title)}</button>`).join('')}</div>
        <div class="j-detail card">
          <div class="j-progress">${J.steps.map((_, k) => `<i class="${k <= i ? 'on' : ''}"></i>`).join('')}</div>
          <div class="row" style="margin-top:18px;gap:16px">${deskTag(s.desk)}<span class="small muted">${esc(s.date)} · Step ${i + 1} of ${J.steps.length}</span></div>
          <h3>${esc(s.title)}</h3>
          <p class="what">${esc(s.what)}</p>
          <div class="j-facts"><div><span>Who did it</span>${esc(s.agent)}</div><div><span>Where</span>${esc(s.tool)}</div><div><span>On her record</span>${esc(s.crm)}</div></div>
          <div class="j-nav"><button class="btn btn-line btn-sm" type="button" data-action="j-step" data-i="${i - 1}" ${i === 0 ? 'disabled style="opacity:.4"' : ''}>Back</button>
            <button class="btn btn-dark btn-sm" type="button" data-action="j-step" data-i="${i + 1}" ${i === J.steps.length - 1 ? 'disabled style="opacity:.4"' : ''}>Next step</button></div>
        </div>
      </div>`;
  }
  function leadConnect() {
    const F = D.flow;
    return `<div class="section-head"><h2>What happens when someone gets in touch</h2><p>Left to right, in about 2 seconds. Nobody types anything in by hand.</p></div>
      <div class="flow">${F.columns.map((c, i) => `<div class="flow-col ${i === 3 ? 'crm' : ''}"><h4>${esc(c.title)}</h4>${c.items.map(x => `<div class="fbox">${esc(x)}</div>`).join('')}</div>`).join('')}</div>
      <div class="flow-loop">↺ When a patient books and goes ahead, we tell Google and Facebook, so your ads reach more people like them.</div>
      <div class="section"><div class="section-head"><h2>What the techy bits mean</h2></div>
        <div class="terms">${F.terms.map(t => `<div><b>${esc(t.t)}</b><p>${esc(t.d)}</p></div>`).join('')}</div></div>
      <div class="section card card-soft"><b>Rules we follow</b><p class="small" style="margin-top:6px;color:var(--ink-2)">We only text or email people who said yes, and we keep a note that they did. If someone asks us to stop, we stop straight away. Patient details stay with UK or EU companies who have signed an agreement to protect them. These are checks, not legal advice.</p></div>`;
  }
  function leadAttr() {
    const A = D.attribution, vals = A.models[S.attrModel];
    const items = A.channels.map((c, i) => ({ name: c, v: vals[i], note: A.spend[i] ? `£${n(Math.round(A.spend[i] / vals[i]))} in ads per patient` : 'Free' }));
    return `<div class="section-head"><h2>Where your patients really came from</h2><p>23 patients went ahead in the last 30 days. Most saw you in more than one place, so there are different ways to count. Try them.</p></div>
      <div class="seg" role="group" aria-label="How to count">${Object.keys(A.models).map(k => `<button type="button" aria-pressed="${k === S.attrModel}" data-action="attr" data-m="${k}">${k}</button>`).join('')}</div>
      <p class="small" style="margin-top:12px;color:var(--ink-2)">${esc(A.modelNotes[S.attrModel])}</p>
      <div class="charts" style="margin-top:8px">
        <div><div class="chart-title">Patients from each place</div>${hbars(items, { fmt: v => (Math.round(v * 10) / 10).toString(), color: 'var(--lead)' })}</div>
        <div><div class="chart-title">What patients told us</div><div class="chart-sub">We ask “How did you hear about us?” at the consultation.</div>${hbars(A.selfReported, { color: '#1B1B1A' })}
          <p class="small muted" style="margin-top:14px">Google’s figures say Google brings most patients. Patients say they first heard of you on Instagram. Both are true. That’s why we don’t cut your social media just because Google gets the final click.</p></div>
      </div>
      <div class="section grid cols-3">
        <div><b>Tagged links</b><p class="small muted" style="margin-top:4px">Every link we post has a hidden tag saying where it was posted, so we know where each enquiry came from.</p></div>
        <div><b>What a new patient costs</b><p class="small muted" style="margin-top:4px">About £100 in ads this month. The average treatment is £2,113, so the ads pay for themselves at the first appointment.</p></div>
        <div><b>The view we use</b><p class="small muted" style="margin-top:4px">Our balanced view. It gives credit to where people first saw you, what made them get in touch, and what made them book. That’s how most patients decide.</p></div>
      </div>`;
  }

  /* ================================================================
     SOCIAL
     ================================================================ */
  function viewSocial() {
    const posts = S.calendar.filter(e => e.desk === 'social').sort((a, b) => b.date.localeCompare(a.date));
    const upcoming = posts.filter(p => parse(p.date) >= TODAY).sort((a, b) => a.date.localeCompare(b.date));
    const GRAD = { reel: 'linear-gradient(160deg,#E98E62,#7F3A16)', carousel: 'linear-gradient(160deg,#F4D6C4,#D99A78)', post: 'linear-gradient(160deg,#FBE7DA,#E8B596)' };
    const older = [['Smile makeover tips', 'reel'], ['Meet reception', 'post'], ['Why floss?', 'carousel'], ['Our new scanner', 'reel']];
    const cells = posts.slice(0, 8).map(p => ({ t: cleanTitle(p.title), k: kindOf(p), next: parse(p.date) >= TODAY, idea: p.status === 'idea' }))
      .concat(older.map(o => ({ t: o[0], k: o[1] }))).slice(0, 12);
    return `${deskHero('social', 'Social media', 'What’s going out on Instagram and Facebook, and which posts bring people in.', 'm-social')}
      <section class="section feed-layout">
        <div class="grid-phone rise"><div class="phone"><div class="screen">
          <div class="ig-profile"><i></i><div><b>oakmeredental</b>Oakmere Dental · Maidenhead<br><span class="muted">Private dentist · Invisalign · Implants</span></div></div>
          <div class="ig-grid">${cells.map((c, i) => `<div class="ig-cell ${c.next ? 'next' : ''}" style="--i:${i};background:${c.idea ? '#EEE7DD' : GRAD[c.k] || GRAD.post};${c.idea ? 'color:#8A8A85' : ''}">${esc(c.t)}</div>`).join('')}</div>
        </div></div><p class="small muted" style="text-align:center;margin-top:12px">How your Instagram will look. Upcoming posts have a gold edge.</p></div>
        <div>
          <div class="section-head"><h2>Coming up</h2><p>A gold dot means it needs you</p></div>
          <div class="post-big">${upcoming.map((p, i) => `<div class="rise" style="--i:${i}"><span class="small muted">${fmtShort(p.date)}</span>${tile(p)}</div>`).join('')}</div>
        </div>
      </section>
      <section class="section"><div class="section-head"><h2>What’s working for dentists this week</h2><p>From watching Instagram, TikTok and YouTube.</p></div>
        <div class="ideas">${D.ideas.map((it, i) => `<div class="idea2 rise" style="--i:${i}">
          <svg class="rising" viewBox="0 0 200 34" preserveAspectRatio="none" aria-hidden="true"><path d="${sparkPath([3, 4, 3, 5, 6, 6, 8, 9 + i], 200, 34)}" fill="none" stroke="#C8622F" stroke-width="2.5" stroke-linecap="round"/></svg>
          <span class="stat-big">${esc(it.stat)}</span><b>${esc(it.title)}</b><p class="small" style="color:var(--ink-2)">${esc(it.d)}</p>
          ${i === 3 ? '<span class="status"><i class="dot dot-always"></i>We check every one for you</span>' : S.usedIdeas[i] ? '<span class="status"><i class="dot dot-working"></i>Added to your plan</span>' : `<button class="btn btn-line btn-sm" type="button" data-action="use-idea" data-i="${i}" style="align-self:flex-start">Try this</button>`}</div>`).join('')}</div>
        <p class="small muted" style="margin-top:12px">We look at what’s popular and sum it up. We never copy anyone’s posts.</p></section>
      <section class="section charts">
        <div><div class="chart-title">People who saw your posts each week</div><div class="chart-sub">In thousands, Instagram and Facebook together.</div>
          ${barChart({ data: D.socialWeekly.map(w => ({ label: w.wk, v: w.reach })), color: '#C8622F', fmt: v => v + 'k', unit: 'reached', tipPrefix: 'week of ', aria: 'Weekly reach rising from 6.1 thousand to 14.9 thousand', valueHead: 'Reach (thousands)' })}</div>
        <div><div class="chart-title">Enquiries from your posts</div><div class="chart-sub">People who tapped a link or sent a message, then got in touch.</div>
          ${barChart({ data: D.socialWeekly.map(w => ({ label: w.wk, v: w.enq })), color: '#C8622F', unit: 'enquiries', tipPrefix: 'week of ', aria: 'Weekly enquiries from social rising from 3 to 9', valueHead: 'Enquiries' })}</div>
      </section>`;
  }

  /* ================================================================
     PAID ADS
     ================================================================ */
  function viewAds() {
    const B = D.budget, pct = (B.spent / B.month) * 100, pace = (B.expected / B.month) * 100;
    return `${deskHero('ads', 'Ads', 'What you’re spending on Google and Facebook ads, and what each new patient costs. Nothing changes without your OK.', 'm-ads')}
      <section class="section card">
        <div class="pacing"><div>
          <div class="row between wrap"><b>November ad budget</b><span class="small muted">Day 6 of 30</span></div>
          <div class="pace-bar" role="img" aria-label="£${B.spent} spent of £${n(B.month)}; pace mark at £${B.expected}"><span style="width:${pct}%"></span><i style="left:${pace}%"></i></div>
          <div class="goal-legend"><span><b style="color:var(--ink)">£${B.spent} spent</b> of £${n(B.month)}</span><span>On track · the line shows where we should be by today</span></div>
        </div>
        <div class="guard"><div class="small"><b>Spending limit</b><br><span class="muted">${S.adsPaused ? 'All ads stopped' : 'Never more than £80 a day. Checked every hour.'}</span></div>
          <button class="btn ${S.adsPaused ? 'btn-dark' : 'btn-line'}" type="button" data-action="pause-all">${S.adsPaused ? 'Turn ads back on' : 'Stop all ads'}</button></div></div>
      </section>
      <section class="section"><div class="section-head"><h2>Suggested changes</h2><p>Each one comes with the reason. Changes under £100 happen on their own, as you agreed.</p></div>
        <div class="recs">${S.recs.map(r => `<div class="rec"><div class="rec-body"><b>${esc(r.title)}</b><p>${esc(r.why)}</p></div>
          ${r.state === 'approved' ? `<span class="status"><i class="dot dot-always"></i>Approved</span>` : r.done ? `<span class="status"><i class="dot dot-idle"></i>${esc(r.done)}</span>`
          : r.id === 'r3' ? `<a class="btn btn-line btn-sm" href="#ads-variants" data-action="scroll" data-target="ads-variants">See the ads</a>`
          : `<div class="row"><button class="btn btn-dark btn-sm" type="button" data-action="rec-approve" data-id="${r.id}">Approve</button><button class="btn btn-ghost btn-sm" type="button" data-action="rec-no" data-id="${r.id}">Not now</button></div>`}</div>`).join('')}</div></section>
      <section class="section"><div class="section-head"><h2>Your ads</h2><p>Last 30 days</p></div>
        <div class="camps">
          <div class="camp camp-h"><span>Ad</span><span>Status</span><span class="num">Per day</span><span class="num">Consultations</span><span class="num">Cost of each</span></div>
          ${D.campaigns.map(c => `<div class="camp"><span><b>${esc(c.name)}</b></span><span>${S.adsPaused && c.state === 'live' ? statusEl('blocked').replace('Waiting on you', 'Paused') : statusEl(c.state)}</span><span class="num">£${c.daily}</span><span class="num">${c.consults || '–'}</span><span class="num">${c.cpc ? `<b>£${c.cpc}</b>` : '–'}</span></div>`).join('')}
        </div></section>
      <section class="section" id="ads-variants"><div class="section-head"><h2>Open evening ads, waiting for your OK</h2><p>Three versions, so we can see which works best. All checked against the UK rules for dental ads.</p></div>
        <div class="grid cols-3">${D.adVariants.map((a, i) => `<div class="ad-prev"><span class="sp"><b>Sponsored</b> · oakmeredental.example</span><span class="h">${esc(a.h)}</span><span class="d">${esc(a.d)}</span><span class="ok">✓ No promises about results · ✓ Prices worded correctly · ✓ Spelling checked</span></div>`).join('')}</div>
        <div class="row" style="margin-top:16px">${S.recs.find(r => r.id === 'r3').state === 'approved' ? `<span class="status"><i class="dot dot-always"></i>Approved. They start on Mon 16 Nov.</span>` : `<button class="btn btn-dark" type="button" data-action="rec-approve" data-id="r3">Approve all three</button><button class="btn btn-line" type="button" data-action="event-changes" data-id="c12">Ask for changes</button>`}</div>
      </section>
      <section class="section card card-soft"><b>Rules we stick to</b><p class="small" style="margin-top:6px;color:var(--ink-2)">Ads run on your own accounts and your own card. We can suggest spending more, but only you can say yes. We never advertise prescription-only treatments like Botox, never use before-and-after photos in ads, and word anything about paying monthly the way the rules require.</p></section>`;
  }

  /* ================================================================
     ROUTER
     ================================================================ */
  const VIEWS = { home: viewHome, plan: viewPlan, desks: viewDesks, team: viewTeam, setup: viewSetup };
  function route() {
    let [r, sub] = (location.hash || '#home').slice(1).split('/');
    if (['lead', 'social', 'ads'].includes(r)) { sub = r; r = 'desks'; }
    if (r === 'desks') S.desk = ['lead', 'social', 'ads'].includes(sub) ? sub : (S.desk || 'lead');
    if (r === 'setup' && !S.draft) { S.draft = sub === 'new' ? { offers: {}, connected: {}, tone: 'calm', approver: 'me', dailyCap: 80, quiet: true, alertBy: 'text', budget: 1500 } : JSON.parse(JSON.stringify(S.profile)); S.setupStep = 0; }
    return VIEWS[r] ? r : 'home';
  }
  function render() {
    if (!signedIn()) {
      document.body.dataset.route = 'login'; S.lastView = 'login';
      $('#view').innerHTML = viewLogin();
      const f = document.querySelector('.login input'); if (f && !AUTH.busy) f.focus();
      return;
    }
    const r = route();
    const key = r + (r === 'desks' ? S.desk : '') + (r === 'setup' ? S.setupStep : '');
    const fresh = key !== S.lastView; S.lastView = key;
    $('#view').classList.toggle('calm', !fresh);
    document.body.dataset.route = r;
    $('#view').innerHTML = VIEWS[r]();
    document.querySelectorAll('[data-nav]').forEach(a => { const on = a.dataset.nav === r; a.classList.toggle('on', on); if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); });
    moveLens();
    if (S.drawerKind === 'chat') renderChat();
    afterRender(fresh);
  }

  /* the glass lens that slides under the active dock item */
  function moveLens() {
    const lens = $('#dock-lens'), on = document.querySelector('.dock [data-nav].on');
    if (!lens) return;
    if (!on) { lens.style.opacity = 0; return; }
    lens.style.opacity = 1; lens.style.width = on.offsetWidth + 'px'; lens.style.transform = `translateX(${on.offsetLeft}px)`;
  }
  window.addEventListener('resize', moveLens);

  /* ---------------- Motion after each render ---------------- */
  const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function afterRender(fresh) {
    document.querySelectorAll('.ring .fill[data-target]').forEach(c => {
      if (fresh && !reduced) requestAnimationFrame(() => requestAnimationFrame(() => { c.style.strokeDashoffset = c.dataset.target; }));
      else { c.style.transition = 'none'; c.style.strokeDashoffset = c.dataset.target; }
    });
    if (fresh && !reduced) document.querySelectorAll('[data-count]').forEach(el => {
      const to = Number(el.dataset.count), pre = el.dataset.prefix || '', t0 = performance.now(), dur = 1100;
      const step = now => { const p = Math.min(1, (now - t0) / dur), v = Math.round(to * (1 - Math.pow(1 - p, 3))); el.textContent = pre + v.toLocaleString('en-GB'); if (p < 1) requestAnimationFrame(step); };
      requestAnimationFrame(step);
    });
    clearInterval(S.tick);
    if ($('#live-msg')) {
      let k = 0;
      S.tick = setInterval(() => {
        const box = $('#live-msg'); if (!box) { clearInterval(S.tick); return; }
        k = (k + 1) % TICKER.length;
        const el = document.createElement('div'); el.className = 'live-msg'; el.id = 'live-msg';
        el.innerHTML = `${esc(TICKER[k][1])}<small>${esc(TICKER[k][0])}</small>`;
        box.replaceWith(el);
      }, 3400);
    }
  }
  function burst(fromEl) {
    if (reduced || !fromEl) return;
    const r = fromEl.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    const colors = ['#F2B23A', '#FFD27A', '#C8622F', '#0E9184', '#5560C9'];
    for (let i = 0; i < 22; i++) {
      const b = document.createElement('i'); b.className = 'burst';
      const a = (Math.PI * 2 * i) / 22, dist = 70 + Math.random() * 90;
      b.style.left = cx + 'px'; b.style.top = cy + 'px'; b.style.background = colors[i % colors.length];
      b.style.setProperty('--dx', Math.cos(a) * dist + 'px'); b.style.setProperty('--dy', Math.sin(a) * dist + 'px');
      document.body.appendChild(b); setTimeout(() => b.remove(), 950);
    }
  }
  function approveNeed(id) {
    const nd = S.needs.find(x => x.id === id); if (!nd) return;
    if (nd.calId) setEventStatus(nd.calId, 'scheduled');
    if (id === 'n2') { const r = S.recs.find(x => x.id === 'r1'); if (r) r.state = 'approved'; }
    S.needs = S.needs.filter(x => x.id !== id);
  }
  window.addEventListener('hashchange', () => {
    if (!location.hash.startsWith('#setup')) S.draft = null; if (!$('#drawer').hidden) closeDrawer(); render(); window.scrollTo(0, 0); });

  /* ---------------- Events ---------------- */
  document.addEventListener('click', ev => {
    const el = ev.target.closest('[data-action]');
    if (ev.target.id === 'scrim') { closeDrawer(); return; }
    if (!el) return;
    const a = el.dataset.action, id = el.dataset.id;
    switch (a) {
      case 'close-drawer': closeDrawer(); break;
      case 'toast': toast(el.dataset.msg); break;
      case 'open-sam': agentDrawer('sam'); break;
      case 'filter': S.filters[el.dataset.desk] = !S.filters[el.dataset.desk]; render(); break;
      case 'month': {
        const [y, m] = S.month.split('-').map(Number); const d = new Date(y, m - 1 + Number(el.dataset.dir), 1);
        S.month = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`; render(); break;
      }
      case 'open-event': S.drawerKind = 'event'; eventDrawer(id); break;
      case 'add-on-day': openChat(`For ${fmtShort(el.dataset.date)}: `); break;
      case 'ask': sendChat(el.dataset.q); break;
      case 'chat-about': closeDrawer(); openChat(`About the ${el.dataset.name}: `); break;
      case 'go': location.hash = el.dataset.href; break;
      case 'teach': teachDrawer(id); break;
      case 'enter-demo': AUTH.demo = true; try { sessionStorage.setItem('marquee_demo', '1'); } catch (e) { /* ignore */ } location.hash = '#home'; render(); break;
      case 'auth-mode': AUTH.mode = el.dataset.m; AUTH.msg = ''; render(); break;
      case 'sign-out': signOut(); break;
      case 'setup-pick': readSetupFields(); S.draft[el.dataset.name] = el.dataset.val; if (el.dataset.name === 'type') S.draft.offers = {}; render(); break;
      case 'setup-offer': { readSetupFields(); const o = el.dataset.val; if (o in S.draft.offers) delete S.draft.offers[o]; else S.draft.offers[o] = ''; render(); break; }
      case 'setup-connect': readSetupFields(); S.draft.connected[el.dataset.val] = !S.draft.connected[el.dataset.val]; render(); if (S.draft.connected[el.dataset.val]) toast('Connected (demo). In the real thing you’d sign in to it.'); break;
      case 'setup-next': { readSetupFields(); const err = setupValid(); if (err) { toast(err); break; } S.setupStep++; render(); window.scrollTo(0, 0); break; }
      case 'setup-back': readSetupFields(); S.setupStep = Math.max(0, S.setupStep - 1); render(); window.scrollTo(0, 0); break;
      case 'setup-done': S.profile = S.draft; S.draft = null; saveProfile(); applyProfile(); location.hash = '#home'; toast(`Welcome, ${D.practice.owner}. Your team is getting started.`); break;
      case 'setup-demo': S.draft = null; location.hash = '#home'; break;
      case 'teach-save': {
        const t = ($('#teach-title') || {}).value || '', d = ($('#teach-body') || {}).value || '';
        if (!t.trim() || !d.trim()) { toast('Add a short name and what they should do.'); break; }
        (S.customSkills[id] = S.customSkills[id] || []).push({ title: t.trim(), summary: d.trim().split('.')[0] + '.', instructions: d.trim(), custom: true });
        agentDrawer(id); toast('Saved. They’ll follow this from now on.'); break;
      }
      case 'open-notes': notesDrawer(); break;
      case 'note-act': noteAction(id, el.dataset.a); break;
      case 'note-go': { const x = S.notes.find(n => n.id === id); if (x) { x.read = true; closeDrawer(); location.hash = x.go; updateBell(); } break; }
      case 'alert-close': hideAlert(); break;
      case 'alert-snooze': hideAlert(); toast('We’ll remind you in 30 minutes.'); break;
      case 'demo-alert': { closeDrawer(); const next = S.notes.find(n => n.level === 'urgent' && !n.handled); if (next) setTimeout(() => showAlert(next.id), 300); else toast('No urgent alerts left. Nice.'); break; }
      case 'review-post': { const x = S.notes.find(n => n.id === id); if (x) { x.handled = 'Reply posted'; x.read = true; } closeDrawer(); updateBell(); toast('Reply posted on Google.'); break; }
      case 'open-chat': openChat(); break;
      case 'home-view': S.homeView = el.dataset.v; try { localStorage.setItem('marquee_home', S.homeView); } catch (e) { /* ignore */ } render(); window.scrollTo({ top: 0, behavior: 'smooth' }); break;
      case 'deck-approve': {
        const card = $('#focus'); burst(ev.target.closest('button'));
        if (card) card.classList.add('fly');
        setTimeout(() => { approveNeed(id); render(); }, card ? 420 : 0);
        toast({ n1: 'Approved. It goes out this evening.', n2: 'Approved. £150 moves to Google ads from Monday.', n3: 'Thanks. We’ll note the calls on their records.' }[id] || 'Done.');
        break;
      }
      case 'deck-skip': { const i = S.needs.findIndex(x => x.id === id); if (i > -1) S.needs.push(S.needs.splice(i, 1)[0]); render(); break; }
      case 'deck-pick': { const i = S.needs.findIndex(x => x.id === id); if (i > -1) S.needs.unshift(S.needs.splice(i, 1)[0]); render(); const f = $('#focus'); f && f.scrollIntoView({ behavior: 'smooth', block: 'center' }); break; }
      case 'use-idea': {
        const i = Number(el.dataset.i), it = D.ideas[i]; S.usedIdeas[i] = true;
        const dates = ['2026-11-18', '2026-11-21', '2026-11-26', '2026-11-28'];
        S.calendar.push({ id: 'idea' + i, date: dates[i], desk: 'social', title: it.title + ' (Reel)', status: 'drafting', detail: `From the Ideas Lab: ${it.d}`, isNew: true });
        render(); toast(`Added to ${fmtShort(dates[i])}. The team will start on it.`); break;
      }
      case 'need-approve': {
        const nd = S.needs.find(x => x.id === id);
        removeNeed(id, () => {
          if (nd && nd.calId) setEventStatus(nd.calId, 'scheduled');
          if (id === 'n2') { const r = S.recs.find(x => x.id === 'r1'); if (r) r.state = 'approved'; }
        });
        toast(id === 'n2' ? 'Approved. £150 moves to Google ads from Monday.' : 'Approved. It goes out this evening.');
        break;
      }
      case 'need-review': { const nd = S.needs.find(x => x.id === id); if (nd && nd.calId) { S.drawerKind = 'event'; eventDrawer(nd.calId); } break; }
      case 'need-calls': callsDrawer(); break;
      case 'need-upload': uploadDrawer(); break;
      case 'mark-called': {
        S.called[el.dataset.name] = true; callsDrawer();
        if (Object.keys(S.called).length >= 4) { closeDrawer(); removeNeed('n3'); toast('All 4 called. We’ll note how each call went.'); }
        break;
      }
      case 'do-upload': closeDrawer(); removeNeed('n4', () => setEventStatus('c9', 'drafting')); toast('12 photos uploaded. The designer is starting on the “Meet the nurses” post.'); break;
      case 'event-approve': {
        setEventStatus(id, 'scheduled');
        const nd = S.needs.find(x => x.calId === id);
        closeDrawer();
        if (nd) removeNeed(nd.id, () => { if (nd.id === 'n2') { const r = S.recs.find(x => x.id === 'r1'); if (r) r.state = 'approved'; } }); else render();
        toast('Approved. It’s on the calendar.');
        break;
      }
      case 'event-changes': changesDrawer(id); break;
      case 'send-changes': {
        const e = S.calendar.find(x => x.id === id);
        if (e) e.status = 'drafting';
        const nd = S.needs.find(x => x.calId === id);
        closeDrawer();
        if (nd) removeNeed(nd.id); else render();
        toast(`Sent to the ${e ? deskName(e.desk).toLowerCase() : ''} team. They’ll come back to you within the hour.`);
        break;
      }
      case 'event-go': setEventStatus(id, 'drafting'); closeDrawer(); render(); toast('Great. The team will start on it.'); break;
      case 'event-drop': S.calendar = S.calendar.filter(x => x.id !== id); closeDrawer(); render(); toast('Removed. We’ll suggest fewer ideas like that.'); break;
      case 'plan-approve': {
        const m = S.chat.find(x => x.id === Number(el.dataset.mid)); if (!m || m.state) break;
        m.state = 'approved';
        m.plan.rows.forEach((r, i) => S.calendar.push({ id: `p${m.id}-${i}`, date: r.date, desk: r.desk, title: r.title, status: 'drafting', detail: `${r.what}. Why: ${r.why}`, isNew: true }));
        S.month = m.plan.rows[0].date.slice(0, 7);
        renderChat(); toast(`${m.plan.rows.length} items added to your calendar.`);
        setTimeout(() => { closeDrawer(); if (route() !== 'plan') location.hash = '#plan'; else render(); setTimeout(() => { const c = $('#calendar'); c && c.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, 60); }, 900);
        break;
      }
      case 'plan-change': {
        const m = S.chat.find(x => x.id === Number(el.dataset.mid)); if (!m) break;
        m.state = 'changes'; S.chat.push({ from: 'them', html: 'Of course. What would you change? The budget, the dates, or leave something out?' }); renderChat(); break;
      }
      case 'agent': agentDrawer(id); break;
      case 'lead-tab': S.leadTab = el.dataset.tab; render(); break;
      case 'goto-attr': ev.preventDefault(); S.leadTab = 'attribution'; location.hash = '#desks/lead'; break;
      case 'j-step': { const i = Number(el.dataset.i); if (i >= 0 && i < D.journey.steps.length) { S.journeyStep = i; render(); } break; }
      case 'attr': S.attrModel = el.dataset.m; render(); break;
      case 'rec-approve': {
        const r = S.recs.find(x => x.id === id); if (r) r.state = 'approved';
        if (id === 'r1') { S.needs = S.needs.filter(x => x.id !== 'n2'); setEventStatus('c20', 'scheduled'); }
        if (id === 'r3') setEventStatus('c12', 'scheduled');
        render(); toast(id === 'r3' ? 'Approved. The open evening ads start on Monday 16 November.' : 'Approved. £150 moves to Google ads from Monday.');
        break;
      }
      case 'rec-no': { S.recs = S.recs.filter(x => x.id !== id); render(); toast('OK. We’ll look at it again next week.'); break; }
      case 'pause-all': S.adsPaused = !S.adsPaused; render(); toast(S.adsPaused ? 'All ads stopped. Nothing more will be spent until you turn them back on.' : 'Ads are back on.'); break;
      case 'scroll': ev.preventDefault(); { const t = document.getElementById(el.dataset.target); t && t.scrollIntoView({ behavior: 'smooth' }); } break;
      case 'toggle-table': {
        const t = document.getElementById(el.dataset.target); if (!t) break;
        t.hidden = !t.hidden; el.setAttribute('aria-expanded', String(!t.hidden)); el.textContent = t.hidden ? 'Show as table' : 'Hide table'; break;
      }
    }
  });

  document.addEventListener('submit', ev => {
    const f = ev.target.closest('[data-form]'); if (!f) return;
    ev.preventDefault();
    if (f.dataset.form === 'login') { submitLogin(f); return; }
    const inp = f.querySelector('input'); const q = inp.value; inp.value = '';
    if (f.dataset.form === 'ask' && !q.trim()) { openChat(); return; }
    sendChat(q);
  });
  document.addEventListener('keydown', ev => { if (ev.key === 'Escape' && !$('#drawer').hidden) closeDrawer(); });

  /* chart tooltips */
  document.addEventListener('mouseover', ev => {
    const h = ev.target.closest('[data-tip]'); if (!h) return;
    const chart = h.closest('.chart'), tip = chart && chart.querySelector('.tip'); if (!tip) return;
    const cr = chart.getBoundingClientRect(), hr = h.getBoundingClientRect();
    tip.innerHTML = h.getAttribute('data-tip');
    tip.style.left = (hr.left - cr.left + hr.width / 2) + 'px'; tip.style.top = (hr.top - cr.top + 18) + 'px'; tip.style.opacity = 1;
  });
  document.addEventListener('mouseout', ev => {
    const h = ev.target.closest('[data-tip]'); if (!h) return;
    const tip = h.closest('.chart').querySelector('.tip'); if (tip) tip.style.opacity = 0;
  });

  /* ---------------- Small drawers ---------------- */
  function callsDrawer() {
    S.drawerKind = 'calls';
    const people = [
      { n: 'Tom W.', t: 'Implant', w: '2 h 40 m', note: 'Asked about paying monthly.' },
      { n: 'Grace L.', t: 'Whitening', w: '3 h', note: 'Wants it done before a wedding on 12 Dec.' },
      { n: 'Ravi D.', t: 'Invisalign', w: '2 h 15 m', note: 'Took the smile quiz twice.' },
      { n: 'Sophie B.', t: 'Implant', w: '2 h 5 m', note: 'Existing patient’s partner.' },
    ];
    const html = `<span class="eyebrow">${deskTag('lead')}</span><h2 id="drawer-title" style="margin-top:6px">Call these 4 before 5pm</h2>
      <p class="small muted" style="margin-top:8px">They’ve all had our automatic text. People called within the hour are twice as likely to book. Phone numbers are hidden in this demo.</p>
      <div class="needs" style="margin-top:18px">${people.map(p => `<div class="need"><div class="row between"><span class="need-title">${esc(p.n)} · ${esc(p.t)}</span><span class="small late-note">${esc(p.w)}</span></div>
        <span class="need-why">${esc(p.note)}</span><div class="need-actions">${S.called[p.n] ? `<span class="status"><i class="dot dot-always"></i>Called</span>` : `<button class="btn btn-line btn-sm" type="button" data-action="mark-called" data-name="${esc(p.n)}">Mark as called</button>`}</div></div>`).join('')}</div>`;
    if ($('#drawer').hidden) openDrawer(html); else $('#drawer-body').innerHTML = html;
  }
  function uploadDrawer() {
    S.drawerKind = 'upload';
    openDrawer(`<span class="eyebrow">${deskTag('social')}</span><h2 id="drawer-title" style="margin-top:6px">Upload the team shoot photos</h2>
      <p class="small muted" style="margin-top:8px">Straight off your phone is fine. The designer picks the best ones and tidies them up. Anyone in the photos needs to have signed the consent form.</p>
      <div style="margin-top:20px;border:1.5px dashed var(--line-3);border-radius:14px;padding:40px 20px;text-align:center;background:var(--soft)">
        <b>Drop photos or videos here</b><p class="small muted" style="margin-top:4px">or</p>
        <button class="btn btn-dark" type="button" data-action="do-upload" style="margin-top:8px">Choose files (demo)</button></div>`);
  }
  function changesDrawer(id) {
    const e = S.calendar.find(x => x.id === id); if (!e) return;
    S.drawerKind = 'changes';
    openDrawer(`<span class="eyebrow">${deskTag(e.desk)}</span><h2 id="drawer-title" style="margin-top:6px">What would you change?</h2>
      <p class="small muted" style="margin-top:8px">${esc(e.title)}</p>
      <textarea id="changes-text" rows="5" style="width:100%;margin-top:16px;border:1px solid var(--line-3);border-radius:12px;padding:12px;font:inherit;resize:vertical" placeholder="e.g. Make slide 3 friendlier and say we’re open on Saturdays"></textarea>
      <div class="drawer-actions"><button class="btn btn-dark" type="button" data-action="send-changes" data-id="${id}">Send to the team</button></div>`, { focus: '#changes-text' });
  }

  /* drag tiles between days on the Creative wall */
  document.addEventListener('dragstart', ev => {
    const t = ev.target.closest && ev.target.closest('.wall .tile[draggable="true"]'); if (!t) return;
    ev.dataTransfer.setData('text/plain', t.dataset.id); ev.dataTransfer.effectAllowed = 'move'; t.classList.add('dragging');
  });
  document.addEventListener('dragend', ev => { const t = ev.target.closest && ev.target.closest('.tile'); if (t) t.classList.remove('dragging'); });
  document.addEventListener('dragover', ev => { const d = ev.target.closest && ev.target.closest('[data-drop]'); if (!d) return; ev.preventDefault(); d.classList.add('over'); });
  document.addEventListener('dragleave', ev => { const d = ev.target.closest && ev.target.closest('[data-drop]'); if (d && !d.contains(ev.relatedTarget)) d.classList.remove('over'); });
  document.addEventListener('drop', ev => {
    const d = ev.target.closest && ev.target.closest('[data-drop]'); if (!d) return;
    ev.preventDefault();
    const e = S.calendar.find(x => x.id === ev.dataTransfer.getData('text/plain'));
    if (!e || e.date === d.dataset.day) { d.classList.remove('over'); return; }
    e.date = d.dataset.day; render();
    toast(`Moved to ${fmtShort(e.date)}. The ${deskName(e.desk)} desk will reschedule it.`);
  });

  document.addEventListener('input', ev => {
    if (ev.target.dataset && ev.target.dataset.field === 'budget') { const o = $('#budget-out'); if (o) o.textContent = '£' + n(Number(ev.target.value)); }
    if (ev.target.dataset && ev.target.dataset.field === 'dailyCap') { const o = $('#cap-out'); if (o) o.textContent = '£' + n(Number(ev.target.value)); }
    if (ev.target.id !== 'skill-q') return;
    S.skillQuery = ev.target.value; render();
    const i = $('#skill-q'); if (i) { i.focus(); i.setSelectionRange(i.value.length, i.value.length); }
  });
  import('./agents/knowledge.js').then(m => { S.K = m; if (route() === 'team') render(); }).catch(() => { S.K = { KNOWLEDGE: {}, SOURCES: {} }; });

  S.profile = loadProfile() || JSON.parse(JSON.stringify(SEED_PROFILE));
  applyProfile();
  render();
  initAuth().then(render);
  checkApi();
  updateBell();
  setTimeout(() => {
    if (!signedIn()) return;
    let seen = false; try { seen = sessionStorage.getItem('marquee_alert_seen') === '1'; sessionStorage.setItem('marquee_alert_seen', '1'); } catch (e) { /* ignore */ }
    if (!seen && !S.alertShown.u1) showAlert('u1');
  }, 2500);
})();
