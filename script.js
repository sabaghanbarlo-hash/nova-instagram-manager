/* ============================================================
   Nova Café — Instagram Studio
   100% local, free, vanilla JS. No Instagram/Meta API, no paid
   services. All data lives in localStorage on this device.
   ============================================================ */

const LS = {
  posts: 'novaig_posts',
  threads: 'novaig_threads',
  campaigns: 'novaig_campaigns',
  seeded: 'novaig_seeded_v1'
};

const CONTENT_TYPES = ['Reel', 'Carousel', 'Image', 'Story', 'Promotional post'];
const STATUSES = ['Draft', 'Scheduled', 'Published'];

const TYPE_CLASS = {
  'Reel': 'chip-reel', 'Carousel': 'chip-carousel', 'Image': 'chip-image',
  'Story': 'chip-story', 'Promotional post': 'chip-promotional'
};
const STATUS_CLASS = { 'Draft': 'chip-draft', 'Scheduled': 'chip-scheduled', 'Published': 'chip-published' };

function uid(prefix) { return prefix + '_' + Math.random().toString(36).slice(2, 9); }
function todayISO() { return new Date().toISOString().slice(0, 10); }
function pad(n) { return String(n).padStart(2, '0'); }
function fmtDate(d) { return new Date(d + 'T00:00:00').toLocaleDateString(undefined, { month: 'short', day: 'numeric' }); }
function fmtTime(t) { if (!t) return ''; const [h, m] = t.split(':'); const hh = ((+h + 11) % 12) + 1; return `${hh}:${m} ${+h < 12 ? 'AM' : 'PM'}`; }

/* ---------------- Storage helpers ---------------- */
function load(key, fallback) {
  try { const v = JSON.parse(localStorage.getItem(key)); return v || fallback; }
  catch (e) { return fallback; }
}
function save(key, val) { localStorage.setItem(key, JSON.stringify(val)); }

function getPosts() { return load(LS.posts, []); }
function setPosts(p) { save(LS.posts, p); }
function getThreads() { return load(LS.threads, []); }
function setThreads(t) { save(LS.threads, t); }
function getCampaigns() { return load(LS.campaigns, []); }
function setCampaigns(c) { save(LS.campaigns, c); }

/* ---------------- Seed sample data ---------------- */
function seedIfNeeded(force) {
  if (!force && localStorage.getItem(LS.seeded)) return;

  const today = new Date();
  const iso = (offset) => {
    const d = new Date(today); d.setDate(d.getDate() + offset);
    return d.toISOString().slice(0, 10);
  };

  const posts = [
    { id: uid('post'), caption: 'New season, new sips ☕️ Our Pumpkin Spice Nova Latte is back for a limited time.', hashtags: '#novacafe #pumpkinspice #coffeetime #karajcafe', type: 'Reel', date: iso(1), time: '09:00', campaign: 'Autumn Launch', notes: 'Film at 8am, golden light', status: 'Scheduled' },
    { id: uid('post'), caption: 'Behind the counter: how we roast our house blend. Swipe to see the whole process →', hashtags: '#coffeeroasting #baristalife #specialtycoffee', type: 'Carousel', date: iso(2), time: '13:00', campaign: 'Brand Story', notes: '', status: 'Scheduled' },
    { id: uid('post'), caption: 'Cozy corner, warm cup, good book. This is your sign to take a break today.', hashtags: '#cafevibes #selfcare #novacafe', type: 'Image', date: iso(3), time: '11:30', campaign: '', notes: '', status: 'Draft' },
    { id: uid('post'), caption: 'Ask us anything! Drop your coffee questions in our story poll.', hashtags: '#askus #coffeelovers', type: 'Story', date: iso(0), time: '10:00', campaign: 'Community Q&A', notes: '', status: 'Published' },
    { id: uid('post'), caption: '20% off all pastries this weekend only. Tag a friend who needs a croissant emergency 🥐', hashtags: '#promo #weekendtreat #novacafe', type: 'Promotional post', date: iso(5), time: '08:30', campaign: 'Weekend Promo', notes: 'Coordinate with in-store signage', status: 'Scheduled' },
    { id: uid('post'), caption: 'Meet Sara, our head barista of 3 years. Her go-to order? A dirty chai, always.', hashtags: '#meettheteam #baristalife', type: 'Reel', date: iso(-2), time: '12:00', campaign: 'Brand Story', notes: '', status: 'Published' },
    { id: uid('post'), caption: 'Rainy day = the best day for our spiced cocoa. Who else is cozied up right now?', hashtags: '#rainyday #cocoa #novacafe', type: 'Image', date: iso(7), time: '15:00', campaign: '', notes: '', status: 'Draft' },
    { id: uid('post'), caption: 'Our new loyalty card is here! Every 9th coffee is on us.', hashtags: '#loyaltyprogram #novacafe #freecoffee', type: 'Promotional post', date: iso(9), time: '09:30', campaign: 'Loyalty Launch', notes: '', status: 'Scheduled' }
  ];

  const threads = [
    {
      id: uid('th'), name: 'Elena R.', unread: true, lead: 'Warm', note: '',
      messages: [
        { from: 'customer', text: 'Hi! Do you guys do birthday party bookings for small groups?', t: '09:12' },
      ]
    },
    {
      id: uid('th'), name: 'kian_moves', unread: true, lead: 'Hot', note: 'Asked about catering twice this week',
      messages: [
        { from: 'customer', text: 'What are your hours on Fridays?', t: 'Mon' },
        { from: 'business', text: 'Hey! We\'re open 8am–10pm on Fridays 😊', t: 'Mon' },
        { from: 'customer', text: 'Perfect, and what\'s the price for a catering order of 20 coffees?', t: '10:45' }
      ]
    },
    {
      id: uid('th'), name: 'Maryam T.', unread: false, lead: 'Cold', note: '',
      messages: [
        { from: 'customer', text: 'Where are you located exactly? Google Maps is being weird lol', t: 'Sat' },
        { from: 'business', text: 'We\'re at 14 Azadi St, right next to the bookstore! Here\'s the map link: novacafe.example/map', t: 'Sat' },
        { from: 'customer', text: 'Found it, thank you!', t: 'Sat' }
      ]
    },
    {
      id: uid('th'), name: 'roast_reviews', unread: false, lead: 'Warm', note: 'Local food blogger — good for a feature swap',
      messages: [
        { from: 'customer', text: 'Loved the new autumn menu! Featuring you in my next reel 🎥', t: 'Yesterday' },
        { from: 'business', text: 'That means so much, thank you!! Tag us so we can share it 🙌', t: 'Yesterday' }
      ]
    },
    {
      id: uid('th'), name: 'Pouya A.', unread: true, lead: 'New', note: '',
      messages: [
        { from: 'customer', text: 'Is the almond milk latte actually good or just trendy 😂', t: '2h' }
      ]
    }
  ];

  const campaigns = [
    { id: uid('camp'), name: 'Autumn Launch', reach: 8400, engagement: 6.1, leads: 14, posts: 3, status: 'Active' },
    { id: uid('camp'), name: 'Weekend Promo', reach: 5200, engagement: 4.8, leads: 9, posts: 2, status: 'Active' },
    { id: uid('camp'), name: 'Brand Story', reach: 11200, engagement: 7.4, leads: 6, posts: 4, status: 'Active' },
    { id: uid('camp'), name: 'Loyalty Launch', reach: 3100, engagement: 3.9, leads: 21, posts: 1, status: 'Planning' }
  ];

  setPosts(posts);
  setThreads(threads);
  setCampaigns(campaigns);
  localStorage.setItem(LS.seeded, '1');
}

/* ============================================================
   VIEW ROUTER
   ============================================================ */
const VIEW_META = {
  overview: { title: 'Overview', sub: 'Everything happening on @nova.cafe, at a glance.' },
  calendar: { title: 'Content Calendar', sub: 'Plan, schedule, and manage every post in one place.' },
  captions: { title: 'AI Caption Assistant', sub: 'Local template engine — generates caption options instantly, no API needed.' },
  hashtags: { title: 'Hashtag Tool', sub: 'Build a balanced hashtag set from a local dataset by category.' },
  inbox: { title: 'Inbox', sub: 'Simulated DMs with keyword-based automated replies.' },
  analytics: { title: 'Analytics', sub: 'Demo performance metrics for portfolio illustration.' }
};

function switchView(view) {
  document.querySelectorAll('.view').forEach(v => v.classList.add('hidden'));
  document.getElementById('view-' + view).classList.remove('hidden');
  document.querySelectorAll('.nav-item').forEach(n => n.classList.toggle('active', n.dataset.view === view));
  document.getElementById('viewTitle').textContent = VIEW_META[view].title;
  document.getElementById('viewSubtitle').textContent = VIEW_META[view].sub;
  if (view === 'overview') renderOverview();
  if (view === 'calendar') renderCalendar();
  if (view === 'inbox') renderInbox();
  if (view === 'analytics') renderAnalytics();
  if (view === 'hashtags') renderHashtagCategories();
}

document.querySelectorAll('.nav-item').forEach(btn => {
  btn.addEventListener('click', () => switchView(btn.dataset.view));
});
document.querySelectorAll('[data-goto]').forEach(btn => {
  btn.addEventListener('click', () => switchView(btn.dataset.goto));
});

/* ============================================================
   OVERVIEW
   ============================================================ */
function renderOverview() {
  const posts = getPosts();
  const threads = getThreads();
  const campaigns = getCampaigns();

  const scheduled = posts.filter(p => p.status === 'Scheduled').length;
  const published = posts.filter(p => p.status === 'Published').length;
  const unread = threads.filter(t => t.unread).length;
  const leads = threads.filter(t => ['Hot', 'Warm', 'New'].includes(t.lead)).length;

  document.getElementById('overviewStats').innerHTML = [
    statCard('Scheduled posts', scheduled, ''),
    statCard('Published this month', published, ''),
    statCard('Unread messages', unread, unread > 0 ? `${unread} need a reply` : 'all caught up', unread > 0 ? 'down' : 'up'),
    statCard('Active leads', leads, '')
  ].join('');

  const upcoming = posts
    .filter(p => p.status !== 'Published')
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))
    .slice(0, 5);

  document.getElementById('upcomingList').innerHTML = upcoming.length ? upcoming.map(p => `
    <div class="mini-row">
      <span>${fmtDate(p.date)} · ${fmtTime(p.time)} — ${escapeHtml(truncate(p.caption, 42))}</span>
      <span class="tag chip ${TYPE_CLASS[p.type]}">${p.type}</span>
    </div>`).join('') : '<p class="muted small">No upcoming posts yet.</p>';

  document.getElementById('inboxSnapshot').innerHTML = threads.slice(0, 5).map(t => `
    <div class="mini-row">
      <span>${t.unread ? '●' : '○'} ${escapeHtml(t.name)} — ${escapeHtml(truncate(lastMsg(t), 34))}</span>
      <span class="tag chip ${leadClass(t.lead)}">${t.lead}</span>
    </div>`).join('');

  document.getElementById('campaignTable').innerHTML = campaignTableHTML(campaigns);
}

function statCard(label, value, delta, dir) {
  return `<div class="stat-card">
    <div class="stat-label">${label}</div>
    <div class="stat-value">${value}</div>
    ${delta ? `<div class="stat-delta ${dir || ''}">${delta}</div>` : ''}
  </div>`;
}

function leadClass(lead) {
  return { Hot: 'chip-promotional', Warm: 'chip-story', Cold: 'chip-draft', New: 'chip-scheduled' }[lead] || 'chip-draft';
}
function lastMsg(t) { return t.messages.length ? t.messages[t.messages.length - 1].text : ''; }
function truncate(s, n) { return s && s.length > n ? s.slice(0, n - 1) + '…' : (s || ''); }
function escapeHtml(s) { const d = document.createElement('div'); d.textContent = s || ''; return d.innerHTML; }

function campaignTableHTML(campaigns) {
  return `<thead><tr><th>Campaign</th><th>Posts</th><th>Reach</th><th>Engagement</th><th>Leads</th><th>Status</th></tr></thead>
  <tbody>${campaigns.map(c => `
    <tr>
      <td><strong>${escapeHtml(c.name)}</strong></td>
      <td>${c.posts}</td>
      <td>${c.reach.toLocaleString()}</td>
      <td>${c.engagement}%</td>
      <td>${c.leads}</td>
      <td><span class="chip ${c.status === 'Active' ? 'chip-scheduled' : 'chip-draft'}">${c.status}</span></td>
    </tr>`).join('')}</tbody>`;
}

/* ============================================================
   CONTENT CALENDAR
   ============================================================ */
let calState = { mode: 'month', cursor: new Date() };

document.getElementById('calModeToggle').addEventListener('click', (e) => {
  const btn = e.target.closest('.seg-btn'); if (!btn) return;
  calState.mode = btn.dataset.mode;
  document.querySelectorAll('#calModeToggle .seg-btn').forEach(b => b.classList.toggle('active', b === btn));
  renderCalendar();
});
document.getElementById('calPrev').addEventListener('click', () => { shiftCal(-1); });
document.getElementById('calNext').addEventListener('click', () => { shiftCal(1); });
document.getElementById('calToday').addEventListener('click', () => { calState.cursor = new Date(); renderCalendar(); });

function shiftCal(dir) {
  const d = new Date(calState.cursor);
  if (calState.mode === 'month') d.setMonth(d.getMonth() + dir);
  else d.setDate(d.getDate() + dir * 7);
  calState.cursor = d;
  renderCalendar();
}

function renderCalendar() {
  document.getElementById('calLegend').innerHTML = CONTENT_TYPES.map(t =>
    `<span><i style="background:${legendColor(t)}"></i>${t}</span>`).join('');

  if (calState.mode === 'month') renderMonth();
  else renderWeek();
}

function legendColor(type) {
  return { Reel: '#7a2ea3', Carousel: '#2e51c9', Image: '#2c8a4f', Story: '#c46a12', 'Promotional post': '#c22459' }[type];
}

function renderMonth() {
  const d = calState.cursor;
  const year = d.getFullYear(), month = d.getMonth();
  document.getElementById('calLabel').textContent = d.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });

  const firstOfMonth = new Date(year, month, 1);
  const startOffset = firstOfMonth.getDay();
  const gridStart = new Date(year, month, 1 - startOffset);

  const posts = getPosts();
  const todayStr = todayISO();

  let html = `<div class="cal-weekdays">${['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(w => `<div>${w}</div>`).join('')}</div><div class="cal-month-grid">`;

  for (let i = 0; i < 42; i++) {
    const cellDate = new Date(gridStart); cellDate.setDate(gridStart.getDate() + i);
    const iso = cellDate.toISOString().slice(0, 10);
    const isOther = cellDate.getMonth() !== month;
    const dayPosts = posts.filter(p => p.date === iso).sort((a,b)=>a.time.localeCompare(b.time));
    const shown = dayPosts.slice(0, 3);

    html += `<div class="cal-cell ${isOther ? 'other-month' : ''}" data-date="${iso}">
      <span class="cal-daynum ${iso === todayStr ? 'today' : ''}">${cellDate.getDate()}</span>
      ${shown.map(p => `<div class="cal-post-chip" data-id="${p.id}" style="background:${legendColor(p.type)}22;color:${legendColor(p.type)}">${fmtTime(p.time)} ${escapeHtml(truncate(p.caption, 16))}</div>`).join('')}
      ${dayPosts.length > 3 ? `<div class="cal-more">+${dayPosts.length - 3} more</div>` : ''}
    </div>`;
  }
  html += '</div>';
  document.getElementById('calendarGrid').innerHTML = html;

  document.querySelectorAll('.cal-cell').forEach(cell => {
    cell.addEventListener('click', (e) => {
      if (e.target.closest('.cal-post-chip')) return;
      openPostModal(null, cell.dataset.date);
    });
  });
  document.querySelectorAll('.cal-post-chip').forEach(chip => {
    chip.addEventListener('click', (e) => { e.stopPropagation(); openPostModal(chip.dataset.id); });
  });
}

function renderWeek() {
  const d = calState.cursor;
  const startOfWeek = new Date(d); startOfWeek.setDate(d.getDate() - d.getDay());
  const days = Array.from({ length: 7 }, (_, i) => { const dd = new Date(startOfWeek); dd.setDate(startOfWeek.getDate() + i); return dd; });

  document.getElementById('calLabel').textContent = `${days[0].toLocaleDateString(undefined,{month:'short',day:'numeric'})} – ${days[6].toLocaleDateString(undefined,{month:'short',day:'numeric'})}`;

  const posts = getPosts();
  const todayStr = todayISO();

  let html = `<div class="cal-week-grid"><div class="cal-week-head"></div>`;
  days.forEach(dd => {
    const iso = dd.toISOString().slice(0, 10);
    html += `<div class="cal-week-head" style="${iso===todayStr?'color:var(--accent1)':''}">${dd.toLocaleDateString(undefined,{weekday:'short'})}<br>${dd.getDate()}</div>`;
  });
  html += `<div class="cal-hour-label"></div>`;
  days.forEach(dd => {
    const iso = dd.toISOString().slice(0, 10);
    const dayPosts = getPosts().filter(p => p.date === iso).sort((a,b)=>a.time.localeCompare(b.time));
    html += `<div class="cal-week-day-col" data-date="${iso}">
      ${dayPosts.map(p => `<div class="cal-week-post" data-id="${p.id}" style="background:${legendColor(p.type)}22;color:${legendColor(p.type)}">
        <strong>${fmtTime(p.time)}</strong> · ${p.type}<br>${escapeHtml(truncate(p.caption, 40))}
      </div>`).join('') || ''}
    </div>`;
  });
  html += '</div>';
  document.getElementById('calendarGrid').innerHTML = html;

  document.querySelectorAll('.cal-week-day-col').forEach(col => {
    col.addEventListener('click', (e) => { if (e.target.closest('.cal-week-post')) return; openPostModal(null, col.dataset.date); });
  });
  document.querySelectorAll('.cal-week-post').forEach(chip => {
    chip.addEventListener('click', (e) => { e.stopPropagation(); openPostModal(chip.dataset.id); });
  });
}

/* ---------------- Post Builder Modal ---------------- */
const modalBackdrop = document.getElementById('postModalBackdrop');
function openPostModal(id, presetDate) {
  const posts = getPosts();
  const post = id ? posts.find(p => p.id === id) : null;

  document.getElementById('postModalTitle').textContent = post ? 'Edit post' : 'New post';
  document.getElementById('postId').value = post ? post.id : '';
  document.getElementById('postCaption').value = post ? post.caption : '';
  document.getElementById('postHashtags').value = post ? post.hashtags : '';
  document.getElementById('postType').value = post ? post.type : 'Image';
  document.getElementById('postStatus').value = post ? post.status : 'Draft';
  document.getElementById('postDate').value = post ? post.date : (presetDate || todayISO());
  document.getElementById('postTime').value = post ? post.time : '10:00';
  document.getElementById('postCampaign').value = post ? post.campaign : '';
  document.getElementById('postNotes').value = post ? post.notes : '';
  document.getElementById('deletePostBtn').classList.toggle('hidden', !post);

  modalBackdrop.classList.remove('hidden');
}
function closePostModal() { modalBackdrop.classList.add('hidden'); }

document.getElementById('newPostBtn').addEventListener('click', () => openPostModal(null));
document.getElementById('closePostModal').addEventListener('click', closePostModal);
document.getElementById('cancelPostBtn').addEventListener('click', closePostModal);
modalBackdrop.addEventListener('click', (e) => { if (e.target === modalBackdrop) closePostModal(); });

document.getElementById('savePostBtn').addEventListener('click', () => {
  const posts = getPosts();
  const id = document.getElementById('postId').value;
  const data = {
    caption: document.getElementById('postCaption').value.trim(),
    hashtags: document.getElementById('postHashtags').value.trim(),
    type: document.getElementById('postType').value,
    status: document.getElementById('postStatus').value,
    date: document.getElementById('postDate').value || todayISO(),
    time: document.getElementById('postTime').value || '09:00',
    campaign: document.getElementById('postCampaign').value.trim(),
    notes: document.getElementById('postNotes').value.trim()
  };
  if (!data.caption) { alert('Give the post a caption before saving.'); return; }

  if (id) {
    const idx = posts.findIndex(p => p.id === id);
    posts[idx] = { ...posts[idx], ...data };
  } else {
    posts.push({ id: uid('post'), ...data });
  }
  setPosts(posts);
  closePostModal();
  refreshCurrentView();
});

document.getElementById('deletePostBtn').addEventListener('click', () => {
  const id = document.getElementById('postId').value;
  if (!id) return;
  if (!confirm('Delete this post?')) return;
  setPosts(getPosts().filter(p => p.id !== id));
  closePostModal();
  refreshCurrentView();
});

function refreshCurrentView() {
  const active = document.querySelector('.nav-item.active').dataset.view;
  switchView(active);
}

/* ============================================================
   AI CAPTION ASSISTANT (local template engine)
   ============================================================ */
const TONE_OPENERS = {
  Friendly: ['Hey friends! 👋', 'Good morning, lovely people!', 'Quick hello from all of us here 💛'],
  Professional: ['We\'re pleased to share', 'An update from our team:', 'Here\'s what\'s new at'],
  Funny: ['Okay, hear us out —', 'Plot twist:', 'Breaking news from behind the counter 😂'],
  'Gen Z': ['ok but this is actually so real —', 'not us obsessing over', 'this is your sign to'],
  Luxury: ['An invitation to indulge.', 'Crafted, curated, unforgettable.', 'Some things deserve to be savored.'],
  Educational: ['Did you know?', 'Here\'s a little behind-the-scenes:', 'Let\'s talk about']
};
const TONE_CLOSERS = {
  Friendly: ['We\'d love to see you soon! 💛', 'Can\'t wait to catch up with you.', 'See you at the counter!'],
  Professional: ['Thank you for being part of our journey.', 'We appreciate your continued support.', 'Learn more via the link in our bio.'],
  Funny: ['No notes. 10/10. Would recommend.', 'You know what to do 😉', 'Iconic behavior, honestly.'],
  'Gen Z': ['say less.', 'main character energy fr.', 'this is not a drill.'],
  Luxury: ['We look forward to welcoming you.', 'Reserve your moment of indulgence.', 'Elegance, one visit at a time.'],
  Educational: ['Now you know! Save this for later.', 'Hope that was helpful 🌱', 'Drop your questions below.']
};
const CTA_TEXT = {
  'Visit us today': 'Come say hi — we\'re open now!',
  'Tag a friend': 'Tag someone who needs to see this 👇',
  'Order now / link in bio': 'Order online — link in bio!',
  'Comment below': 'Tell us your thoughts in the comments!',
  'Save this post': 'Save this post for later 📌',
  'DM us to book': 'DM us to book your spot!'
};

function generateCaptions() {
  const business = document.getElementById('capBusiness').value;
  const topic = document.getElementById('capTopic').value.trim() || 'what we\'ve got going on today';
  const tone = document.getElementById('capTone').value;
  const audience = document.getElementById('capAudience').value.trim();
  const cta = document.getElementById('capCTA').value;

  const openers = TONE_OPENERS[tone];
  const closers = TONE_CLOSERS[tone];
  const audienceLine = audience ? ` Perfect for ${audience}.` : '';

  const templates = [
    () => `${pick(openers)} ${topic} is here at ${business.toLowerCase()}.${audienceLine} ${CTA_TEXT[cta]}`,
    () => `${pick(openers)} Let's talk about ${topic}.${audienceLine} ${pick(closers)} ${CTA_TEXT[cta]}`,
    () => `${topic.charAt(0).toUpperCase() + topic.slice(1)} — need we say more? ${pick(openers)}${audienceLine} ${pick(closers)}`,
    () => `${pick(openers)} We poured a little extra love into ${topic} this week.${audienceLine} ${CTA_TEXT[cta]} ${pick(closers)}`
  ];

  const results = shuffle(templates).slice(0, 4).map(fn => fn());
  const box = document.getElementById('captionResults');
  box.innerHTML = results.map((text, i) => `
    <div class="caption-card">
      <div class="cc-tone">${tone} · Option ${i + 1}</div>
      <p>${escapeHtml(text)}</p>
      <div class="cc-actions">
        <button class="btn btn-ghost btn-sm cc-copy" data-text="${encodeURIComponent(text)}">Copy</button>
        <button class="btn btn-secondary btn-sm cc-use" data-text="${encodeURIComponent(text)}">Use in Post Builder</button>
      </div>
    </div>`).join('');

  box.querySelectorAll('.cc-copy').forEach(b => b.addEventListener('click', () => {
    const text = decodeURIComponent(b.dataset.text);
    navigator.clipboard && navigator.clipboard.writeText(text).catch(() => {});
    b.textContent = 'Copied!'; setTimeout(() => b.textContent = 'Copy', 1200);
  }));
  box.querySelectorAll('.cc-use').forEach(b => b.addEventListener('click', () => {
    const text = decodeURIComponent(b.dataset.text);
    openPostModal(null);
    document.getElementById('postCaption').value = text;
  }));
}
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function shuffle(arr) { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }

document.getElementById('genCaptionsBtn').addEventListener('click', generateCaptions);

/* ============================================================
   HASHTAG TOOL (local dataset)
   ============================================================ */
const HASHTAG_SETS = {
  'Coffee / Café': {
    popular: ['#coffee', '#coffeetime', '#cafe', '#coffeeaddict', '#coffeelovers', '#coffeeshop'],
    niche: ['#specialtycoffee', '#thirdwavecoffee', '#latteart', '#baristalife', '#coffeeroasters'],
    local: ['#karajcafe', '#karajcoffee', '#localcafe', '#supportlocal'],
    branded: ['#novacafe', '#novacafevibes', '#novacoffee']
  },
  Restaurant: {
    popular: ['#foodie', '#foodstagram', '#instafood', '#foodlover', '#eeeeeats'],
    niche: ['#chefslife', '#tastingmenu', '#farmtotable', '#foodphotography'],
    local: ['#karajfoodie', '#localeats', '#supportlocal'],
    branded: ['#novacafe', '#novatable']
  },
  Bakery: {
    popular: ['#bakery', '#freshbaked', '#pastry', '#dessert', '#baking'],
    niche: ['#croissant', '#sourdough', '#artisanbread', '#patisserie'],
    local: ['#localbakery', '#karajbakes'],
    branded: ['#novabakes', '#novacafe']
  },
  'Beauty Salon': {
    popular: ['#beauty', '#hairsalon', '#skincare', '#selfcare', '#glowup'],
    niche: ['#balayage', '#hairtransformation', '#estheticianlife'],
    local: ['#localsalon', '#karajbeauty'],
    branded: ['#novabeauty', '#novastudio']
  },
  'Retail Boutique': {
    popular: ['#shoplocal', '#boutique', '#ootd', '#newarrivals', '#style'],
    niche: ['#capsulewardrobe', '#slowfashion', '#curatedstyle'],
    local: ['#localboutique', '#karajshopping'],
    branded: ['#novaboutique']
  },
  'Fitness Studio': {
    popular: ['#fitness', '#workout', '#fitfam', '#gymlife', '#training'],
    niche: ['#strengthtraining', '#mobilitywork', '#functionalfitness'],
    local: ['#localgym', '#karajfitness'],
    branded: ['#novafit']
  }
};

function renderHashtagCategories() {
  const sel = document.getElementById('hashCategory');
  if (sel.options.length) return;
  Object.keys(HASHTAG_SETS).forEach(cat => {
    const opt = document.createElement('option'); opt.value = cat; opt.textContent = cat; sel.appendChild(opt);
  });
}

document.getElementById('genHashtagsBtn').addEventListener('click', () => {
  const cat = document.getElementById('hashCategory').value;
  const kw = document.getElementById('hashKeyword').value.trim().replace(/\s+/g, '').toLowerCase();
  const set = HASHTAG_SETS[cat];
  if (!set) return;

  const groups = [
    ['Popular / broad reach', set.popular],
    ['Niche / engaged audience', set.niche],
    ['Local', kw ? [...set.local, '#' + kw] : set.local],
    ['Branded', set.branded]
  ];

  document.getElementById('hashtagResults').innerHTML = groups.map(([label, tags]) => `
    <div class="hg-group">
      <h4>${label}</h4>
      <div class="hg-tags">${tags.map(t => `<span class="hg-tag">${t}</span>`).join('')}</div>
    </div>`).join('') + `
    <button class="btn btn-secondary btn-sm" id="copyAllHashtags">Copy full set</button>`;

  document.getElementById('copyAllHashtags').addEventListener('click', function () {
    const all = groups.flatMap(g => g[1]).join(' ');
    navigator.clipboard && navigator.clipboard.writeText(all).catch(() => {});
    this.textContent = 'Copied!'; setTimeout(() => this.textContent = 'Copy full set', 1200);
  });
});

/* ============================================================
   INBOX SIMULATOR
   ============================================================ */
let activeThreadId = null;

const AUTOMATION_RULES = [
  { keyword: 'price', label: 'price', reply: 'Thanks for asking! Our menu starts at $4 for drinks and $3 for pastries — full pricing is on our menu highlight 💛' },
  { keyword: 'cost', label: 'cost', reply: 'Thanks for asking! Our menu starts at $4 for drinks and $3 for pastries — full pricing is on our menu highlight 💛' },
  { keyword: 'book', label: 'booking', reply: 'We\'d love to have you! You can book a table by replying here with your preferred date and party size, or call us directly.' },
  { keyword: 'reserv', label: 'booking', reply: 'We\'d love to have you! You can book a table by replying here with your preferred date and party size, or call us directly.' },
  { keyword: 'hour', label: 'hours', reply: 'We\'re open Sat–Thu 8am–10pm and Fri 8am–11pm. Hope to see you soon!' },
  { keyword: 'open', label: 'hours', reply: 'We\'re open Sat–Thu 8am–10pm and Fri 8am–11pm. Hope to see you soon!' },
  { keyword: 'location', label: 'location', reply: 'We\'re at 14 Azadi St, right next to the bookstore! Map link is in our bio 📍' },
  { keyword: 'where', label: 'location', reply: 'We\'re at 14 Azadi St, right next to the bookstore! Map link is in our bio 📍' },
  { keyword: 'address', label: 'location', reply: 'We\'re at 14 Azadi St, right next to the bookstore! Map link is in our bio 📍' }
];

function renderRuleList() {
  const seen = new Set();
  const rows = AUTOMATION_RULES.filter(r => { if (seen.has(r.label)) return false; seen.add(r.label); return true; });
  document.getElementById('ruleList').innerHTML = rows.map(r =>
    `<li>If message contains <b>"${r.label}"</b> → send ${r.label} response</li>`).join('');
}

function detectAutomation(text) {
  const lower = text.toLowerCase();
  return AUTOMATION_RULES.find(r => lower.includes(r.keyword)) || null;
}

document.getElementById('simulateBtn').addEventListener('click', () => {
  const text = document.getElementById('simulateInput').value.trim();
  const resultBox = document.getElementById('simulateResult');
  if (!text) { resultBox.innerHTML = '<p class="muted small">Type a message first.</p>'; return; }
  const rule = detectAutomation(text);
  resultBox.innerHTML = rule
    ? `<div class="sr-box"><strong>Keyword matched: "${rule.label}"</strong><br>${escapeHtml(rule.reply)}</div>`
    : `<div class="sr-box muted">No keyword rule matched — this would route to manual reply.</div>`;
});

function renderInbox() {
  renderRuleList();
  const filter = document.getElementById('inboxFilter').value;
  const threads = getThreads();
  const filtered = threads.filter(t => {
    if (filter === 'unread') return t.unread;
    if (filter === 'leads') return ['Hot', 'Warm', 'New'].includes(t.lead);
    return true;
  });

  document.getElementById('inboxBadge').textContent = threads.filter(t => t.unread).length;

  document.getElementById('threadList').innerHTML = filtered.map(t => `
    <div class="thread-item ${t.id === activeThreadId ? 'active' : ''}" data-id="${t.id}">
      <div class="avatar">${initials(t.name)}</div>
      <div class="thread-meta">
        <div class="tm-top"><span class="tm-name">${escapeHtml(t.name)}</span></div>
        <div class="tm-preview">${escapeHtml(lastMsg(t))}</div>
      </div>
      ${t.unread ? '<span class="unread-dot"></span>' : ''}
    </div>`).join('') || '<p class="muted small center-pad">No conversations match this filter.</p>';

  document.querySelectorAll('.thread-item').forEach(el => {
    el.addEventListener('click', () => { activeThreadId = el.dataset.id; openThread(activeThreadId); });
  });

  if (activeThreadId && threads.find(t => t.id === activeThreadId)) openThread(activeThreadId);
}

document.getElementById('inboxFilter').addEventListener('change', renderInbox);

function initials(name) { return name.split(/[\s_.]+/).filter(Boolean).slice(0, 2).map(s => s[0].toUpperCase()).join(''); }

function openThread(id) {
  const threads = getThreads();
  const t = threads.find(th => th.id === id);
  if (!t) return;
  if (t.unread) { t.unread = false; setThreads(threads); renderInbox(); }

  const panel = document.getElementById('threadPanel');
  panel.innerHTML = `
    <div class="thread-header">
      <div>
        <strong>${escapeHtml(t.name)}</strong>
        <div class="thread-tags">
          <span class="chip ${leadClass(t.lead)}">${t.lead}</span>
          ${t.note ? `<span class="chip chip-draft">📝 ${escapeHtml(t.note)}</span>` : ''}
        </div>
      </div>
      <div class="thread-actions">
        <button class="btn btn-ghost btn-sm" id="markUnreadBtn">Mark unread</button>
        <button class="btn btn-ghost btn-sm" id="addNoteBtn">Add note</button>
      </div>
    </div>
    <div class="msg-list" id="msgList">
      ${t.messages.map(m => `<div class="msg ${m.from}">${escapeHtml(m.text)}</div>`).join('')}
    </div>
    <div class="reply-row">
      <input type="text" id="replyInput" placeholder="Type a reply…">
      <button class="btn btn-primary btn-sm" id="sendReplyBtn">Send</button>
    </div>
    <div class="thread-actions" style="margin-top:10px;">
      <select id="leadSelect" class="btn btn-ghost btn-sm">
        ${['New','Cold','Warm','Hot'].map(l => `<option ${l===t.lead?'selected':''}>${l}</option>`).join('')}
      </select>
      <button class="btn btn-secondary btn-sm" id="assignLeadBtn">Assign / qualify lead</button>
    </div>
  `;

  document.getElementById('markUnreadBtn').addEventListener('click', () => {
    t.unread = true; setThreads(threads); renderInbox();
  });
  document.getElementById('addNoteBtn').addEventListener('click', () => {
    const note = prompt('Add an internal note about this contact:', t.note || '');
    if (note !== null) { t.note = note.trim(); setThreads(threads); openThread(id); }
  });
  document.getElementById('sendReplyBtn').addEventListener('click', () => sendReply(t));
  document.getElementById('replyInput').addEventListener('keydown', (e) => { if (e.key === 'Enter') sendReply(t); });
  document.getElementById('assignLeadBtn').addEventListener('click', () => {
    t.lead = document.getElementById('leadSelect').value;
    setThreads(threads);
    openThread(id);
  });
}

function sendReply(t) {
  const input = document.getElementById('replyInput');
  const text = input.value.trim();
  if (!text) return;
  const threads = getThreads();
  const thread = threads.find(th => th.id === t.id);
  thread.messages.push({ from: 'business', text, t: 'now' });

  const rule = detectAutomation(text);
  input.value = '';
  setThreads(threads);
  openThread(t.id);
}

/* ============================================================
   ANALYTICS
   ============================================================ */
function renderAnalytics() {
  const posts = getPosts();
  const campaigns = getCampaigns();

  document.getElementById('analyticsStats').innerHTML = [
    statCard('Followers', '4,812', '+3.2% this month', 'up'),
    statCard('Reach (30d)', '38.6K', '+11% this month', 'up'),
    statCard('Engagement rate', '5.4%', '+0.6pt this month', 'up'),
    statCard('Leads generated', '46', '+9 this month', 'up')
  ].join('');

  const week = [
    { d: 'Mon', v: 320 }, { d: 'Tue', v: 410 }, { d: 'Wed', v: 260 }, { d: 'Thu', v: 480 },
    { d: 'Fri', v: 610 }, { d: 'Sat', v: 720 }, { d: 'Sun', v: 540 }
  ];
  const max = Math.max(...week.map(w => w.v));
  document.getElementById('engagementChart').innerHTML = week.map(w => `
    <div class="bar-col">
      <div class="bar-value">${w.v}</div>
      <div class="bar" style="height:${(w.v / max) * 100}%"></div>
      <div class="bar-label">${w.d}</div>
    </div>`).join('');

  const typeCounts = CONTENT_TYPES.map(type => ({
    type, count: posts.filter(p => p.type === type).length, engagement: demoEngagementFor(type)
  }));
  const maxE = Math.max(...typeCounts.map(t => t.engagement), 1);
  document.getElementById('contentTypeChart').innerHTML = typeCounts.map(t => `
    <div class="bar-col">
      <div class="bar-label">${t.type}</div>
      <div class="bar" style="width:${(t.engagement / maxE) * 100}%;background:${legendColor(t.type)}"></div>
      <div class="bar-value">${t.engagement}%</div>
    </div>`).join('');

  document.getElementById('campaignTableFull').innerHTML = campaignTableHTML(campaigns);
}
function demoEngagementFor(type) {
  return { Reel: 7.8, Carousel: 6.2, Image: 4.1, Story: 5.0, 'Promotional post': 3.6 }[type];
}

document.getElementById('addCampaignBtn').addEventListener('click', () => {
  const name = prompt('Campaign name:');
  if (!name) return;
  const campaigns = getCampaigns();
  campaigns.push({ id: uid('camp'), name, reach: 0, engagement: 0, leads: 0, posts: 0, status: 'Planning' });
  setCampaigns(campaigns);
  renderAnalytics();
});

/* ============================================================
   RESET DEMO DATA
   ============================================================ */
document.getElementById('resetDemoBtn').addEventListener('click', () => {
  if (!confirm('This will restore all sample posts, messages, and campaigns. Continue?')) return;
  seedIfNeeded(true);
  activeThreadId = null;
  refreshCurrentView();
});

/* ============================================================
   INIT
   ============================================================ */
seedIfNeeded(false);
renderOverview();
