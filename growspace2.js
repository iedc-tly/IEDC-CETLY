

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyuReZ1-8RGxYGXWAm2AOmqFVn7vupx1S8OPiErPXeLVBRAiqrX2G2coYfq6oIN7_LmYg/exec";
const SHEET_ID   = "1GIyxyBwqo2ymGv2ud5oguk4H4_jHqWn9Fg2TtsTQI4E";
const LS_KEY     = "gs2_pending";

function g(id) { return document.getElementById(id); }

/* Live clock */
(function() {
  const te = g('clock-time'), de = g('clock-date');
  function tick() {
    const n = new Date();
    te.textContent = n.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit', second:'2-digit', hour12:true});
    de.textContent = n.toLocaleDateString([], {weekday:'long', year:'numeric', month:'long', day:'numeric'}).toUpperCase();
  }
  tick(); setInterval(tick, 1000);
})();

/*  Toast */
let toastTimer;
function showToast(msg) {
  const el = g('toast');
  clearTimeout(toastTimer);
  el.textContent = msg || '✓ ENTRY SUCCESSFUL';
  el.classList.add('show');
  toastTimer = setTimeout(() => el.classList.remove('show'), 3500);
}

/*  Flash animation */
function triggerFlash() {
  const el = g('flash-overlay');
  el.classList.remove('go');
  void el.offsetWidth;
  el.classList.add('go');
}

/*   Offline / pending queue   */
function getPending() {
  try { return JSON.parse(localStorage.getItem(LS_KEY) || '[]'); } catch { return []; }
}
function setPending(arr) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(arr)); } catch {}
}
function updateOfflineBadge() {
  const q = getPending();
  const badge = g('offline-badge');
  const online = navigator.onLine;
  if (!online || q.length > 0) {
    badge.classList.add('visible');
    g('pending-count').textContent = q.length + ' PENDING';
  } else {
    badge.classList.remove('visible');
  }
}
async function flushPending() {
  const q = getPending();
  if (!q.length || !navigator.onLine) return;
  const remaining = [];
  for (const rec of q) {
    try {
      await fetch(SCRIPT_URL, { method:'POST', headers:{'Content-Type':'text/plain;charset=utf-8'}, body: JSON.stringify(rec) });
    } catch { remaining.push(rec); }
  }
  setPending(remaining);
  updateOfflineBadge();
  if (remaining.length < q.length) {
    const synced = q.length - remaining.length;
    showToast('◎ SYNCED ' + synced + ' OFFLINE ENTR' + (synced === 1 ? 'Y' : 'IES') + '.');
  }
}
window.addEventListener('online',  () => { updateOfflineBadge(); flushPending(); });
window.addEventListener('offline', updateOfflineBadge);
updateOfflineBadge();

/*  Today's entry counter  */
async function fetchTodayCount() {
  const today = new Date().toLocaleDateString([], {month:'short', day:'numeric', year:'numeric'}).toUpperCase();
  g('counter-date').textContent = today;
  try {
    const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json`;
    const res = await fetch(url);
    const text = await res.text();
    const json = JSON.parse(text.replace(/^[^{]+/, '').replace(/[^}]+$/, ''));
    const rows = json?.table?.rows || [];
    const todayStr = new Date().toLocaleDateString();
    let count = 0;
    rows.forEach(row => {
      const cell = row?.c?.[0]?.v;
      if (cell && new Date(cell).toLocaleDateString() === todayStr) count++;
    });
    animateCounter(count);
    g('counter-sub').textContent = count === 1 ? 'STUDENT IN WORKSPACE' : 'STUDENTS IN WORKSPACE TODAY';
  } catch {
    g('counter-value').textContent = '—';
    g('counter-sub').textContent = 'UNAVAILABLE';
  }
}
function animateCounter(n) {
  const el = g('counter-value');
  el.textContent = n;
  el.classList.remove('bump');
  void el.offsetWidth;
  el.classList.add('bump');
  setTimeout(() => el.classList.remove('bump'), 400);
}
fetchTodayCount();

/*  Guidelines toggle  */
g('guidelines-toggle').addEventListener('click', () => {
  const card = g('guidelines-card');
  const body = g('guidelines-body');
  const isOpen = card.classList.contains('open');
  card.classList.toggle('open', !isOpen);
  body.hidden = isOpen;
  g('guidelines-toggle').setAttribute('aria-expanded', String(!isOpen));
});

/*  Duration chips  */
let hours = 1;
g('dur-chips').addEventListener('click', e => {
  const chip = e.target.closest('.chip');
  if (!chip) return;
  g('dur-chips').querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
  chip.classList.add('active');
  if (chip.dataset.h === 'custom') {
    g('custom-dur-wrap').style.display = 'flex';
    g('custom-dur-wrap').style.alignItems = 'center';
    g('f-custom-hours').focus();
    const v = parseFloat(g('f-custom-hours').value);
    hours = (v > 0) ? v : 1;
  } else {
    g('custom-dur-wrap').style.display = 'none';
    hours = parseFloat(chip.dataset.h);
  }
  updatePreview();
});
g('f-custom-hours').addEventListener('input', () => {
  const v = parseFloat(g('f-custom-hours').value);
  if (v > 0) { hours = v; updatePreview(); }
});

/* Purpose chips  */
g('purpose-chips').addEventListener('click', e => {
  const chip = e.target.closest('.chip');
  if (!chip) return;
  const wasActive = chip.classList.contains('active');
  g('purpose-chips').querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
  if (!wasActive) { chip.classList.add('active'); g('f-purpose').value = chip.dataset.purpose; }
  else { g('f-purpose').value = ''; }
});
g('f-purpose').addEventListener('input', () => {
  g('purpose-chips').querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
});

/*Time helpers  */
function fmt(d)     { return d.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit', hour12:true}); }
function fmtFull(d) { return d.toLocaleString([], {month:'short', day:'numeric', year:'numeric', hour:'2-digit', minute:'2-digit', hour12:true}); }

function updatePreview() {
  const now  = new Date();
  const exit = new Date(now.getTime() + hours * 3600000);
  g('cp-entry').textContent     = fmt(now).toUpperCase();
  g('cp-exit').textContent      = fmt(exit).toUpperCase();
  g('cp-dur').textContent       = hours + (hours === 1 ? ' HR' : ' HRS');
  g('cp-dur-label').textContent = hours < 1 ? (hours * 60) + ' MIN SESSION' : hours + ' HR SESSION';
}
updatePreview();
setInterval(updatePreview, 60000);

/*  Validation */
function setErr(fid, eid, msg) { g(fid).classList.add('invalid'); g(eid).textContent = msg; return false; }
function clrErr(fid, eid)       { g(fid).classList.remove('invalid'); g(eid).textContent = ''; }
['f-name', 'f-dept', 'f-roll', 'f-sem'].forEach(id => {
  g(id).addEventListener('input', () => {
    g(id).classList.remove('invalid');
    const e = g(id).closest('.field').querySelector('.field-err');
    if (e) e.textContent = '';
  });
});

/* Submit  */
g('logbook-form').addEventListener('submit', async e => {
  e.preventDefault();
  g('submit-status').innerHTML = '';

  const name       = g('f-name').value.trim();
  const department = g('f-dept').value;
  const rollNo     = g('f-roll').value.trim().toUpperCase();
  const semester   = g('f-sem').value;
  const classBatch = g('f-class').value.trim().toUpperCase();
  const purpose    = g('f-purpose').value.trim();

  let ok = true;
  if (!name)       ok = setErr('f-name', 'err-name', 'Name is required')       && ok; else clrErr('f-name',  'err-name');
  if (!department) ok = setErr('f-dept', 'err-dept', 'Select a department')     && ok; else clrErr('f-dept',  'err-dept');
  if (!rollNo)     ok = setErr('f-roll', 'err-roll', 'Roll number is required') && ok; else clrErr('f-roll',  'err-roll');
  if (!semester)   ok = setErr('f-sem',  'err-sem',  'Select a semester')       && ok; else clrErr('f-sem',   'err-sem');
  clrErr('f-class', 'err-class');
  if (!ok) return;

  const btn = g('btn-submit');
  btn.disabled = true;
  btn.textContent = 'SAVING...';

  const now  = new Date();
  const exit = new Date(now.getTime() + hours * 3600000);

  const record = {
    timestamp:     now.toISOString(),
    name, department, rollNo,
    classSemester: semester + (classBatch ? ' ' + classBatch : ''),
    entryTime:     fmtFull(now),
    exitTime:      fmtFull(exit),
    hoursStayed:   hours,
    purpose:       purpose || 'General Workspace'
  };

  if (!navigator.onLine) {
    const q = getPending(); q.push(record); setPending(q);
    updateOfflineBadge(); triggerFlash();
    showToast('◎ SAVED OFFLINE — WILL SYNC WHEN RECONNECTED.');
    setTimeout(() => showReceipt(record, fmt(now), fmt(exit), true), 300);
    return;
  }

  try {
    await fetch(SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(record)
    });
    triggerFlash();
    showToast();
    animateCounter((parseInt(g('counter-value').textContent) || 0) + 1);
    setTimeout(() => showReceipt(record, fmt(now), fmt(exit), false), 300);
  } catch {
    const q = getPending(); q.push(record); setPending(q);
    updateOfflineBadge(); triggerFlash();
    showToast('◎ SAVED LOCALLY — WILL SYNC SHORTLY.');
    setTimeout(() => showReceipt(record, fmt(now), fmt(exit), true), 300);
  }
});

/* Receipt */
function showReceipt(rec, entryFmt, exitFmt, offline) {
  g('form-card').hidden = true;
  const rc = g('receipt-card');
  rc.hidden = false;
  g('r-name').textContent    = rec.name;
  g('r-dept').textContent    = rec.department;
  g('r-roll').textContent    = rec.rollNo;
  g('r-class').textContent   = rec.classSemester || '—';
  g('r-entry').textContent   = entryFmt.toUpperCase();
  g('r-exit').textContent    = exitFmt.toUpperCase();
  g('r-dur').textContent     = rec.hoursStayed + (rec.hoursStayed === 1 ? ' HOUR' : ' HOURS');
  g('r-purpose').textContent = rec.purpose;
  const sub = rc.querySelector('.success-sub');
  sub.innerHTML = offline
    ? `<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#ffc107;margin-right:6px;"></span>SAVED OFFLINE — WILL SYNC WHEN ONLINE`
    : `<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:var(--green);margin-right:6px;"></span>SAVED TO GROWSPACE LOGBOOK`;
  rc.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* Log again  */
g('btn-again').addEventListener('click', () => {
  g('receipt-card').hidden = true;
  const fc = g('form-card');
  fc.hidden = false;
  g('logbook-form').reset();
  g('dur-chips').querySelectorAll('.chip').forEach(c => c.classList.toggle('active', c.dataset.h === '1'));
  g('purpose-chips').querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
  g('custom-dur-wrap').style.display = 'none';
  hours = 1;
  g('submit-status').innerHTML = '';
  updatePreview();
  const btn = g('btn-submit');
  btn.disabled = false;
  btn.textContent = 'RECORD LOGBOOK ENTRY →';
  g('f-name').focus();
  fc.scrollIntoView({ behavior: 'smooth', block: 'start' });
});
