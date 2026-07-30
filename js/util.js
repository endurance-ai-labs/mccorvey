/* ============ Yates portal — shared helpers & job math ============ */

const $ = (sel, el = document) => el.querySelector(sel);
const $$ = (sel, el = document) => [...el.querySelectorAll(sel)];

const fmt$ = (n, dec = 0) =>
  (n < 0 ? "-$" : "$") + Math.abs(n).toLocaleString("en-US", { minimumFractionDigits: dec, maximumFractionDigits: dec });
const fmt$2 = (n) => fmt$(n, 2);
const fmtK = (n) => {
  const a = Math.abs(n);
  if (a >= 1e6) return (n < 0 ? "-$" : "$") + (a / 1e6).toFixed(2) + "M";
  if (a >= 1e3) return (n < 0 ? "-$" : "$") + Math.round(a / 1e3).toLocaleString() + "K";
  return fmt$(n);
};
const fmtPct = (n, dec = 1) => (isFinite(n) ? n.toLocaleString("en-US", { maximumFractionDigits: dec }) : "0") + "%";
const fmtDate = (iso) => {
  if (!iso) return "—";
  const d = new Date(iso + "T12:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};
const fmtDateShort = (iso) => {
  if (!iso) return "—";
  const d = new Date(iso + "T12:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
const qs = (k) => new URLSearchParams(window.location.search).get(k);
const todayISO = () => new Date().toISOString().slice(0, 10);
const addDays = (iso, d) => { const t = new Date(iso + "T12:00:00"); t.setDate(t.getDate() + d); return t.toISOString().slice(0, 10); };

/* ---- job math ---- */
function jobMetrics(j) {
  const earned = j.sov.reduce((s, r) => s + r.scheduled * r.pct / 100, 0);
  const cost = j.sov.reduce((s, r) => s + (r.costToDate || 0), 0);
  const budget = j.sov.reduce((s, r) => s + (r.budget || 0), 0);
  const billed = j.payApps.filter(p => p.status === "Paid").reduce((s, p) => s + p.certified, 0);
  const billedAll = j.payApps.reduce((s, p) => s + p.certified, 0);
  const coApproved = (j.changeOrders || []).filter(c => c.status === "Approved").reduce((s, c) => s + (c.amount || 0), 0);
  const pct = j.contract ? earned / j.contract * 100 : 0;
  const projMargin = j.contract - budget;
  return {
    earned, cost, budget, billed, billedAll, pct, coApproved,
    projMargin, projMarginPct: j.contract ? projMargin / j.contract * 100 : 0,
    marginToDate: earned - cost,
    overUnder: billedAll - earned,
    remaining: j.contract - earned,
    costToComplete: Math.max(0, budget - cost),
  };
}

const statusPill = (s) => {
  const map = { "In Progress": "blue", "Closeout": "green", "Just Started": "amber", "Complete": "green", "Awarded": "gray" };
  return `<span class="ypill ${map[s] || "gray"}">${s}</span>`;
};
const payPill = (s) => {
  const map = { Paid: "green", "Pending Owner": "amber", Submitted: "blue", Draft: "gray" };
  return `<span class="ypill ${map[s] || "gray"}">${s}</span>`;
};

function ganttHTML(phases) {
  const t0 = new Date(phases[0].start).getTime();
  const t1 = Math.max(...phases.map(p => new Date(p.finish).getTime()));
  const span = Math.max(1, t1 - t0);
  return phases.map(p => {
    const l = (new Date(p.start).getTime() - t0) / span * 100;
    const w = Math.max(1.2, (new Date(p.finish).getTime() - new Date(p.start).getTime()) / span * 100);
    return `
      <div class="ygantt-row">
        <div class="ygantt-lbl" title="${esc(p.name)}">${esc(p.name)}</div>
        <div class="ygantt-track">
          <div class="ygantt-bar ${p.pct >= 100 ? "done" : ""}" style="left:${l}%;width:${w}%">
            ${p.pct > 0 && p.pct < 100 ? `<i style="width:${p.pct}%"></i>` : ""}
          </div>
        </div>
        <div class="ygantt-dates">${fmtDateShort(p.start)} – ${fmtDateShort(p.finish)} · ${p.pct}%</div>
      </div>`;
  }).join("");
}

/* photo card */
const photoCard = (p) => `
  <div class="yphoto"><img src="${p.src}" alt="${esc(p.cap)}" loading="lazy">
  <div class="cap"><b>${esc(p.cap)}</b><span>${fmtDate(p.date)} · ${p.tag}</span></div></div>`;

/* =========================================================
   INSTITUTIONAL CONTROLS — personas, approval chains, data-source chips
   ========================================================= */

/* ---- Y8S user directory (user-based role access, demo) ---- */
const PERSONAS = [
  { id: 'owner',      name: 'Brett Yates',      title: 'Owner',                       perms: { fin: 1, margins: 1, bids: 1 } },
  { id: 'cfo',        name: 'Lisa Jilek',       title: 'Chief Financial Officer',     perms: { fin: 1, margins: 1, bids: 1 } },
  { id: 'controller', name: 'Lonnie Saylors',   title: 'Controller',                  perms: { fin: 1, margins: 1, bids: 1 } },
  { id: 'office',     name: 'Claudia Chavez',   title: 'Office Manager — Billing & Payroll', perms: { fin: 1, margins: 0, bids: 0 } },
  { id: 'conmgr',     name: 'Tyler Reidhead',   title: 'Construction Manager',        perms: { fin: 0, margins: 0, bids: 1 } },
  { id: 'svcmgr',     name: 'Brandon Yates',    title: 'Service Operations Manager',  perms: { fin: 0, margins: 0, bids: 0 } },
  { id: 'eng',        name: 'Jordan Felps, P.E.', title: 'Engineering Manager',       perms: { fin: 0, margins: 0, bids: 1 } },
  { id: 'est',        name: 'David Glenney',    title: 'Sales Estimating',            perms: { fin: 0, margins: 0, bids: 1 } },
  { id: 'client',     name: 'Owner Rep',        title: 'Client — External View',      perms: { fin: 0, margins: 0, bids: 0, external: 1 } },
];
function currentRole() { try { return localStorage.getItem('yates-role') || ''; } catch (e) { return ''; } }
function currentPersona() { return PERSONAS.find(p => p.id === currentRole()) || null; }
function can(perm) { const p = currentPersona(); return !!(p && p.perms[perm]); }
function isSignedIn() { return !!currentPersona(); }
function setRole(id) {
  try {
    localStorage.setItem('yates-role', id);
    const p = PERSONAS.find(x => x.id === id);
    localStorage.setItem('yates-mode', p && p.perms.external ? 'client' : 'internal');
  } catch (e) {}
  window.location.reload();
}
function signOutUser() { try { localStorage.removeItem('yates-role'); } catch (e) {} window.location.reload(); }

/* ---- sign-in overlay: pick your user (permissions flow from role) ---- */
function renderSignIn() {
  const cards = PERSONAS.map(p => `
    <button class="login-card" onclick="setRole('${p.id}')">
      <span class="avatar">${p.perms.external ? '◇' : p.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}</span>
      <span class="who"><b>${p.name}</b><i>${p.title}</i></span>
      <span class="perm">${p.perms.external ? 'External portal' : p.perms.fin ? (p.perms.margins ? 'Full financial access' : 'Billing & payroll access') : 'Operations access'}</span>
    </button>`).join('');
  const ov = document.createElement('div');
  ov.className = 'login-overlay';
  ov.innerHTML = `
    <div class="login-box">
      <img src="/yates/assets/brand/y8s-logo.png" alt="Y8S — YATES Company, LLC" class="login-logo">
      <div class="login-title">Operations Portal</div>
      <div class="login-sub">Building Automation Systems Nurtured by Experience · single source of truth demo</div>
      <div class="login-note">Select your user — every module, approval right and financial view is scoped to your role.</div>
      <div class="login-grid">${cards}</div>
      <div class="login-foot">Demo environment · fictional data · concept build by Endurance AI Labs<br>
        <a href="/yates/welcome/" style="color:var(--color-blue);font-weight:700;text-decoration:none">New here? Read about the platform →</a></div>
    </div>`;
  document.body.appendChild(ov);
}

/* ---- data-source chips (integration attribution) ---- */
function srcChip(kind) {
  const map = {
    qb:   ['QUICKBOOKS API', '#2ca01c', 'Financial actuals synced from QuickBooks Online via API'],
    st:   ['SERVICETITAN API', '#f04e23', 'Field production, schedules & photos synced from ServiceTitan via API'],
    prop: ['Y8S PROPRIETARY', '#005c97', 'Proprietary Yates modeling engine — internal only'],
  };
  const m = map[kind]; if (!m) return '';
  return `<span title="${m[2]}" style="display:inline-flex;align-items:center;gap:5px;font-size:8.5px;font-weight:800;letter-spacing:0.1em;padding:2px 8px;border-radius:3px;border:1px solid ${m[1]}44;color:${m[1]};background:${m[1]}12;white-space:nowrap"><span style="width:5px;height:5px;border-radius:99px;background:${m[1]}"></span>${m[0]}</span>`;
}

/* ---- approval chains ----
   key: artifact id ("fc-division", "bid-Y-2024-0418", "pa-LKV-2410-410-03", ...)
   steps: [{ role, label, doneLabel }] — sequential; a step unlocks when the prior is approved.
   State in localStorage "yates-appr:<key>" = [{ by, title, at } | null, ...]           */
function apprState(key, n) {
  try {
    const raw = localStorage.getItem('yates-appr:' + key);
    const arr = raw ? JSON.parse(raw) : [];
    while (arr.length < n) arr.push(null);
    return arr;
  } catch (e) { return new Array(n).fill(null); }
}
function apprSave(key, arr) { try { localStorage.setItem('yates-appr:' + key, JSON.stringify(arr)); } catch (e) {} }
window.__apprDefs = window.__apprDefs || {};

function approvalChain(key, steps, opts = {}) {
  window.__apprDefs[key] = steps;
  const st = apprState(key, steps.length);
  const me = currentPersona();
  const html = steps.map((s, i) => {
    const done = st[i];
    const prevDone = i === 0 || !!st[i - 1];
    const persona = PERSONAS.find(p => p.id === s.role);
    if (done) {
      return `<div class="appr-step done">
        <span class="tick">✓</span>
        <div><b>${esc(s.doneLabel || s.label)}</b><span>${esc(done.by)} · ${esc(done.title)} · ${esc(done.at)}</span></div>
      </div>`;
    }
    if (prevDone && currentRole() === s.role) {
      return `<div class="appr-step ready">
        <button onclick="approveStep('${key}',${i})">${esc(s.label)}</button>
        <span>signing as ${esc(me.name)}, ${esc(me.title)}</span>
      </div>`;
    }
    const nudgedAt = (() => { try { return localStorage.getItem('yates-nudge:' + key + ':' + i); } catch (e) { return null; } })();
    return `<div class="appr-step locked">
      <span class="dot"></span>
      <div><b>${esc(s.label)}</b><span class="appr-wait">${prevDone ? 'awaiting ' + esc(persona ? persona.title : s.role) : 'locked — prior approval required'}${nudgedAt ? ' · <i class="appr-nudged">⌲ Slack reminder sent ' + esc(nudgedAt) + '</i>' : ''}</span></div>
      ${prevDone && persona && !persona.perms.external ? `<button class="slack-nudge" onclick="slackNudge('${key}',${i})">${SLACK_MARK}Message ${esc(persona.name.split(' ')[0])}</button>` : ''}
    </div>`;
  }).join('<div class="appr-arrow">→</div>');
  const complete = st.every(Boolean);
  return `<div class="appr-chain ${complete ? 'complete' : ''}" data-appr="${key}">
    ${html}
    ${complete ? `<span class="ypill green" style="margin-left:6px">FULLY EXECUTED</span>` : ''}
    <button class="appr-reset" title="Reset chain (demo)" onclick="resetChain('${key}')">↺</button>
  </div>`;
}
function approveStep(key, idx) {
  const steps = window.__apprDefs[key] || [];
  const st = apprState(key, steps.length);
  if (idx > 0 && !st[idx - 1]) return;
  if (steps[idx] && currentRole() !== steps[idx].role) return;
  const me = currentPersona();
  st[idx] = { by: me.name, title: me.title, at: new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }) };
  apprSave(key, st);
  if (typeof render === 'function') render(); else window.location.reload();
}
function resetChain(key) {
  try { localStorage.removeItem('yates-appr:' + key); } catch (e) {}
  if (typeof render === 'function') render(); else window.location.reload();
}
function apprComplete(key, n) { return apprState(key, n).every(Boolean); }


/* ---- booked construction revenue spread over the next N months.
   Smoothed: minimum 3-month span, larger jobs spread longer, and a gentle
   bell weighting so no single month spikes. ---- */
function jobMonthlySpread(j, nMonths) {
  const out = new Array(nMonths).fill(0);
  const now = new Date('2026-07-15T12:00:00');
  const m = jobMetrics(j);
  const remaining = Math.max(0, j.contract - m.earned);
  if (!remaining) return out;
  const start = j.status === 'Awarded' ? new Date(j.start + 'T12:00:00') : now;
  const finish = new Date(j.finish + 'T12:00:00');
  const firstIdx = Math.max(0, Math.round((start - now) / (30.44 * 864e5)));
  let span = Math.round((finish - now) / (30.44 * 864e5)) - firstIdx + 1;
  const minSpan = remaining > 2e6 ? 8 : remaining > 500000 ? 5 : 3;
  span = Math.max(minSpan, span);
  const w = [];
  for (let i = 0; i < span; i++) w.push(1 + Math.sin(Math.PI * (i + 0.5) / span));
  const wSum = w.reduce((a, b) => a + b, 0);
  for (let i = 0; i < span; i++) {
    const idx = firstIdx + i;
    if (idx >= 0 && idx < nMonths) out[idx] += remaining * w[i] / wSum;
  }
  return out.map(v => Math.round(v));
}
function bookedMonthlySpread(nMonths) {
  const out = new Array(nMonths).fill(0);
  JOBS.forEach(j => jobMonthlySpread(j, nMonths).forEach((v, i) => out[i] += v));
  return out;
}

/* ---- Slack nudge: message whoever an approval is waiting on (demo simulation) ---- */
const SLACK_MARK = `<svg viewBox="0 0 24 24" width="13" height="13" aria-hidden="true"><rect x="2.5" y="9" width="9" height="4" rx="2" fill="#36C5F0"/><rect x="9" y="2.5" width="4" height="9" rx="2" fill="#2EB67D"/><rect x="12.5" y="11" width="9" height="4" rx="2" fill="#ECB22E"/><rect x="11" y="12.5" width="4" height="9" rx="2" fill="#E01E5A"/></svg>`;

function slackNudge(key, idx) {
  const steps = window.__apprDefs[key] || [];
  const s = steps[idx]; if (!s) return;
  const p = PERSONAS.find(x => x.id === s.role); if (!p) return;
  const me = currentPersona() || { name: 'Y8S Portal', title: 'Automated reminder' };
  const first = p.name.split(' ')[0];
  const init = (n) => n.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  const page = (document.title || 'Y8S Portal').split('—')[0].trim();
  const link = location.pathname;
  const now = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  const msg = `Hi ${first} — “${s.label.replace(/["“”]/g, '')}” is next in the queue and waiting on you in the Y8S Operations Portal (${page}). Everything ahead of it is signed off. One click when you're ready: ${link}`;

  const ov = document.createElement('div');
  ov.className = 'slk-ov';
  ov.innerHTML = `
    <div class="slk-card" onclick="event.stopPropagation()">
      <div class="slk-head">${SLACK_MARK}<b>Slack</b><span class="slk-dm-label">Direct message</span><button class="slk-x" aria-label="Close">✕</button></div>
      <div class="slk-peer">
        <span class="slk-ava peer">${init(p.name)}</span>
        <div><b>${esc(p.name)}</b><span class="slk-pres"><i></i> Active</span><div class="slk-title">${esc(p.title)} · YATES Company</div></div>
      </div>
      <div class="slk-body">
        <div class="slk-day"><span>Today</span></div>
        <div class="slk-msg">
          <span class="slk-ava me">${init(me.name)}</span>
          <div class="slk-msg-main">
            <div class="slk-msg-head"><b>${esc(me.name)}</b><span class="slk-app">APP · Y8S Portal</span><span class="slk-time">${now}</span></div>
            <div class="slk-text">${esc(msg)}</div>
            <div class="slk-reacts" style="display:none"><span class="slk-react">👀 1</span></div>
          </div>
        </div>
        <div class="slk-status sending"><span class="slk-spin"></span> Sending via Slack…</div>
      </div>
      <div class="slk-composer"><span>Sent automatically by the Y8S Operations Portal</span></div>
    </div>`;
  const close = () => ov.remove();
  ov.addEventListener('click', close);
  ov.querySelector('.slk-x').addEventListener('click', close);
  document.body.appendChild(ov);

  setTimeout(() => {
    const stEl = ov.querySelector('.slk-status');
    if (stEl) { stEl.className = 'slk-status ok'; stEl.innerHTML = '✓ Delivered to ' + esc(first) + ' · just now'; }
    const stamp = new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
    try { localStorage.setItem('yates-nudge:' + key + ':' + idx, stamp); } catch (e) {}
    /* stamp the chain in place — no page re-render needed */
    document.querySelectorAll('[data-appr="' + key + '"] .appr-step').forEach((el, j) => {
      if (j === idx) {
        const w = el.querySelector('.appr-wait');
        if (w && !w.querySelector('.appr-nudged')) w.innerHTML += ' · <i class="appr-nudged">⌲ Slack reminder sent ' + esc(stamp) + '</i>';
        const btn = el.querySelector('.slack-nudge');
        if (btn) btn.innerHTML = SLACK_MARK + 'Message again';
      }
    });
  }, 750);
  setTimeout(() => { const r = ov.querySelector('.slk-reacts'); if (r) r.style.display = 'flex'; }, 1900);
}
