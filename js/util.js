/* ============ McCorvey portal — shared helpers & job math ============ */

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

/* ---- sparkline SVG: deterministic pseudo-trend seeded by label ---- */
function sparkSVG(seed, opts = {}) {
  const w = opts.w || 120, h = opts.h || 26, n = opts.n || 14;
  const up = opts.up !== false;
  let s = 0; for (let i = 0; i < seed.length; i++) s = (s * 31 + seed.charCodeAt(i)) % 9973;
  const pts = [];
  let v = 0.45 + (s % 20) / 100;
  for (let i = 0; i < n; i++) {
    s = (s * 137 + 71) % 9973;
    v += ((s % 100) / 100 - (up ? 0.42 : 0.58)) * 0.16;
    v = Math.max(0.08, Math.min(0.95, v));
    pts.push(v);
  }
  const step = w / (n - 1);
  const line = pts.map((p, i) => `${(i * step).toFixed(1)},${(h - p * h).toFixed(1)}`).join(' ');
  const col = opts.color || (up ? '#2f9e6e' : '#c8102e');
  const fill = pts.map((p, i) => `${(i * step).toFixed(1)},${(h - p * h).toFixed(1)}`).join(' ') + ` ${w},${h} 0,${h}`;
  return `<svg class="spark" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" aria-hidden="true">
    <polygon points="${fill}" fill="${col}18"></polygon>
    <polyline points="${line}" fill="none" stroke="${col}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"></polyline>
    <circle cx="${w}" cy="${(h - pts[n - 1] * h).toFixed(1)}" r="2.2" fill="${col}"></circle>
  </svg>`;
}

/* photo card */
const photoCard = (p) => `
  <div class="yphoto"><img src="${p.src}" alt="${esc(p.cap)}" loading="lazy">
  <div class="cap"><b>${esc(p.cap)}</b><span>${fmtDate(p.date)} · ${p.tag}</span></div></div>`;

/* =========================================================
   INSTITUTIONAL CONTROLS — personas, approval chains, data-source chips
   ========================================================= */

/* ---- MSM user directory (user-based role access, demo) ---- */
const PERSONAS = [
  { id: 'owner',      name: 'Tony McCorvey Sr.', title: 'Chief Executive Officer & Owner', perms: { fin: 1, margins: 1, bids: 1 } },
  { id: 'cfo',        name: 'Kristal McCorvey Crites', title: 'Chief Financial Officer', perms: { fin: 1, margins: 1, bids: 1 } },
  { id: 'controller', name: 'Tony McCorvey Jr.', title: 'Executive VP — Operations',   perms: { fin: 1, margins: 1, bids: 1 } },
  { id: 'office',     name: 'Gloria Simmons',    title: 'Office Manager — Billing & Payroll', perms: { fin: 1, margins: 0, bids: 0 } },
  { id: 'conmgr',     name: 'Travis Boone',      title: 'Senior Project Manager',      perms: { fin: 0, margins: 0, bids: 1 } },
  { id: 'svcmgr',     name: 'Charlie McCorvey',  title: 'VP — Manufacturing',          perms: { fin: 0, margins: 0, bids: 0 } },
  { id: 'eng',        name: 'Sam Nguyen',        title: 'VDC / BIM Manager',           perms: { fin: 0, margins: 0, bids: 1 } },
  { id: 'est',        name: 'Rick Alvarez',      title: 'Chief Estimator',             perms: { fin: 0, margins: 0, bids: 1 } },
  { id: 'field',      name: 'Zane Maddux',       title: 'Executive Field Superintendent', perms: { fin: 0, margins: 0, bids: 0 } },
  { id: 'safety',     name: 'Josh Bernard',      title: 'Safety Director',             perms: { fin: 0, margins: 0, bids: 0 } },
  { id: 'client',     name: 'GC Partner',        title: 'General Contractor — External View', perms: { fin: 0, margins: 0, bids: 0, external: 1 } },
];
function currentRole() { try { return localStorage.getItem('msm-role') || ''; } catch (e) { return ''; } }
function currentPersona() { return PERSONAS.find(p => p.id === currentRole()) || null; }
function can(perm) { const p = currentPersona(); return !!(p && p.perms[perm]); }
function isSignedIn() { return !!currentPersona(); }
function setRole(id) {
  try {
    localStorage.setItem('msm-role', id);
    const p = PERSONAS.find(x => x.id === id);
    localStorage.setItem('msm-mode', p && p.perms.external ? 'client' : 'internal');
  } catch (e) {}
  window.location.reload();
}
function signOutUser() { try { localStorage.removeItem('msm-role'); } catch (e) {} window.location.reload(); }

/* ---- access gate: portal code required before the user picker ---- */
function gateOK() { try { return localStorage.getItem('msm-gate') === 'ok'; } catch (e) { return false; } }
function tryGate(ev) {
  ev.preventDefault();
  const inp = document.getElementById('gate-code');
  if (inp && inp.value.trim().toLowerCase() === 'enduranceportal') {
    try { localStorage.setItem('msm-gate', 'ok'); } catch (e) {}
    const ov = document.querySelector('.login-overlay'); if (ov) ov.remove();
    renderSignIn();
  } else {
    const err = document.getElementById('gate-err');
    if (err) err.style.display = 'block';
    if (inp) { inp.value = ''; inp.focus(); }
  }
  return false;
}

/* ---- sign-in overlay: access code, then pick your user ---- */
function renderSignIn() {
  if (!gateOK()) {
    const ov = document.createElement('div');
    ov.className = 'login-overlay';
    ov.innerHTML = `
      <div class="login-box" style="max-width:420px">
        <img src="/mccorvey/assets/brand/mccorvey-logo.png" alt="MSM — McCorvey Sheet Metal Works, L.P." class="login-logo">
        <div class="login-title">Operations Portal</div>
        <div class="login-sub">Leaders in the HVAC Industry · private demo</div>
        <div class="login-note">Enter the access code to continue.</div>
        <form onsubmit="return tryGate(event)" style="display:flex;flex-direction:column;gap:10px;margin:14px 0 4px">
          <input id="gate-code" type="password" autocomplete="off" placeholder="Access code" autofocus
            style="font:inherit;font-size:14px;padding:11px 14px;border-radius:9px;border:1px solid var(--color-border);background:var(--color-bg-3);color:var(--color-cloud-whisper);outline:none;text-align:center;letter-spacing:.08em">
          <div id="gate-err" style="display:none;font-size:11.5px;color:#c8102e;font-weight:700;text-align:center">Incorrect code — try again.</div>
          <button type="submit" style="font:inherit;font-size:12.5px;font-weight:800;letter-spacing:.08em;padding:11px;border-radius:9px;border:none;background:#c8102e;color:#fff;cursor:pointer">ENTER PORTAL</button>
        </form>
        <div class="login-foot">Demo environment · fictional data · concept build by Endurance AI Labs<br>
          <a href="/mccorvey/welcome/" style="color:var(--color-blue);font-weight:700;text-decoration:none">New here? Read about the platform →</a></div>
      </div>`;
    document.body.appendChild(ov);
    setTimeout(() => { const i = document.getElementById('gate-code'); if (i) i.focus(); }, 60);
    return;
  }
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
      <img src="/mccorvey/assets/brand/mccorvey-logo.png" alt="MSM — McCorvey Sheet Metal Works, L.P." class="login-logo">
      <div class="login-title">Operations Portal</div>
      <div class="login-sub">Leaders in the HVAC Industry · single source of truth demo</div>
      <div class="login-note">Select your user — every module, approval right and financial view is scoped to your role.</div>
      <div class="login-grid">${cards}</div>
      <div class="login-foot">Demo environment · fictional data · concept build by Endurance AI Labs<br>
        <a href="/mccorvey/welcome/" style="color:var(--color-blue);font-weight:700;text-decoration:none">New here? Read about the platform →</a></div>
    </div>`;
  document.body.appendChild(ov);
}

/* ---- data-source chips (integration attribution) ---- */
function srcChip(kind) {
  const map = {
    qb:   ['VIEWPOINT VISTA', '#0e7a4f', 'Financial actuals synced from Viewpoint Vista via API'],
    st:   ['GTP STRATUS', '#f04e23', 'Fabrication, spooling & field production synced from STRATUS via API'],
    prop: ['MSM PROPRIETARY', '#c8102e', 'Proprietary McCorvey modeling engine — internal only'],
    brain: ['MSM BRAIN — AI DOC REVIEW', '#c8102e', 'Machine-read specs, drawings & addenda — AI extraction with estimator sign-off'],
  };
  const m = map[kind]; if (!m) return '';
  return `<span title="${m[2]}" style="display:inline-flex;align-items:center;gap:5px;font-size:8.5px;font-weight:800;letter-spacing:0.1em;padding:2px 8px;border-radius:3px;border:1px solid ${m[1]}44;color:${m[1]};background:${m[1]}12;white-space:nowrap"><span style="width:5px;height:5px;border-radius:99px;background:${m[1]}"></span>${m[0]}</span>`;
}

/* ---- approval chains ----
   key: artifact id ("fc-division", "bid-Y-2024-0418", "pa-LKV-2410-410-03", ...)
   steps: [{ role, label, doneLabel }] — sequential; a step unlocks when the prior is approved.
   State in localStorage "msm-appr:<key>" = [{ by, title, at } | null, ...]           */
function apprState(key, n) {
  try {
    const raw = localStorage.getItem('msm-appr:' + key);
    const arr = raw ? JSON.parse(raw) : [];
    while (arr.length < n) arr.push(null);
    return arr;
  } catch (e) { return new Array(n).fill(null); }
}
function apprSave(key, arr) { try { localStorage.setItem('msm-appr:' + key, JSON.stringify(arr)); } catch (e) {} }
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
    const nudgedAt = (() => { try { return localStorage.getItem('msm-nudge:' + key + ':' + i); } catch (e) { return null; } })();
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
  try { localStorage.removeItem('msm-appr:' + key); } catch (e) {}
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
  const me = currentPersona() || { name: 'MSM Portal', title: 'Automated reminder' };
  const first = p.name.split(' ')[0];
  const init = (n) => n.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  const page = (document.title || 'MSM Portal').split('—')[0].trim();
  const link = location.pathname;
  const now = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  const msg = `Hi ${first} — “${s.label.replace(/["“”]/g, '')}” is next in the queue and waiting on you in the MSM Operations Portal (${page}). Everything ahead of it is signed off. One click when you're ready: ${link}`;

  const ov = document.createElement('div');
  ov.className = 'slk-ov';
  ov.innerHTML = `
    <div class="slk-card" onclick="event.stopPropagation()">
      <div class="slk-head">${SLACK_MARK}<b>Slack</b><span class="slk-dm-label">Direct message</span><button class="slk-x" aria-label="Close">✕</button></div>
      <div class="slk-peer">
        <span class="slk-ava peer">${init(p.name)}</span>
        <div><b>${esc(p.name)}</b><span class="slk-pres"><i></i> Active</span><div class="slk-title">${esc(p.title)} · McCorvey Sheet Metal</div></div>
      </div>
      <div class="slk-body">
        <div class="slk-day"><span>Today</span></div>
        <div class="slk-msg">
          <span class="slk-ava me">${init(me.name)}</span>
          <div class="slk-msg-main">
            <div class="slk-msg-head"><b>${esc(me.name)}</b><span class="slk-app">APP · MSM Portal</span><span class="slk-time">${now}</span></div>
            <div class="slk-text">${esc(msg)}</div>
            <div class="slk-reacts" style="display:none"><span class="slk-react">👀 1</span></div>
          </div>
        </div>
        <div class="slk-status sending"><span class="slk-spin"></span> Sending via Slack…</div>
      </div>
      <div class="slk-composer"><span>Sent automatically by the MSM Operations Portal</span></div>
    </div>`;
  const close = () => ov.remove();
  ov.addEventListener('click', close);
  ov.querySelector('.slk-x').addEventListener('click', close);
  document.body.appendChild(ov);

  setTimeout(() => {
    const stEl = ov.querySelector('.slk-status');
    if (stEl) { stEl.className = 'slk-status ok'; stEl.innerHTML = '✓ Delivered to ' + esc(first) + ' · just now'; }
    const stamp = new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
    try { localStorage.setItem('msm-nudge:' + key + ':' + idx, stamp); } catch (e) {}
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

/* =========================================================
   PEOPLE CHIPS — message any employee via Slack or Teams.
   Scans rendered text for roster names, wraps them in a chip;
   click → platform picker → simulated DM composer (demo).
   ========================================================= */
const TEAMS_MARK = '<svg viewBox="0 0 24 24" width="13" height="13" aria-hidden="true"><rect x="3" y="6" width="12" height="12" rx="2.4" fill="#6264A7"/><text x="9" y="15.5" font-size="9" font-weight="800" fill="#fff" text-anchor="middle" font-family="Inter,system-ui">T</text><circle cx="18.2" cy="9" r="2.6" fill="#7B83EB"/><path d="M14.8 12.6h6.0a0 0 0 0 1 0 0v3.2a3 3 0 0 1-3 3 3 3 0 0 1-3-3z" fill="#7B83EB"/></svg>';

const MSM_ROSTER = (() => {
  const map = {};
  try {
    PERSONAS.filter(p => !p.perms.external).forEach(p => { map[p.name] = p.title; });
    ((window.PEOPLE && PEOPLE.pms) || []).forEach(n => { if (!map[n]) map[n] = 'Project Manager'; });
    ((window.PEOPLE && PEOPLE.supers) || []).forEach(n => { if (!map[n]) map[n] = 'Field Superintendent'; });
    ['Dana Kowalski', 'Priya Shah', 'Joe Herrera'].forEach(n => { if (!map[n]) map[n] = 'Estimator'; });
  } catch (e) {}
  return map;
})();
const _rosterNames = Object.keys(MSM_ROSTER).sort((a, b) => b.length - a.length);
const _rosterRe = _rosterNames.length ? new RegExp('(' + _rosterNames.map(n => n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|') + ')', 'g') : null;

let _pplBusy = false;
function enhancePeople(root) {
  if (!_rosterRe || _pplBusy) return;
  _pplBusy = true;
  try {
    const walker = document.createTreeWalker(root || document.body, NodeFilter.SHOW_TEXT, {
      acceptNode(n) {
        if (!n.nodeValue || n.nodeValue.length < 4) return NodeFilter.FILTER_REJECT;
        _rosterRe.lastIndex = 0;
        if (!_rosterRe.test(n.nodeValue)) return NodeFilter.FILTER_REJECT;
        const p = n.parentElement;
        if (!p) return NodeFilter.FILTER_REJECT;
        if (p.closest('script,style,select,option,textarea,input,svg,a,button,.ppl,.ppl-pop,.slk-ov,.bw-panel,.login-overlay,.nav-user-card')) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      },
    });
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(node => {
      const frag = document.createDocumentFragment();
      let last = 0; const s = node.nodeValue;
      _rosterRe.lastIndex = 0;
      let m;
      while ((m = _rosterRe.exec(s)) !== null) {
        if (m.index > last) frag.appendChild(document.createTextNode(s.slice(last, m.index)));
        const who = m[1];
        const chip = document.createElement('span');
        chip.className = 'ppl';
        chip.textContent = who;
        chip.title = 'Message ' + who;
        chip.addEventListener('click', ev => { ev.stopPropagation(); ev.preventDefault(); pplPicker(ev, who); });
        frag.appendChild(chip);
        last = m.index + who.length;
      }
      if (last < s.length) frag.appendChild(document.createTextNode(s.slice(last)));
      node.parentNode.replaceChild(frag, node);
    });
  } finally { _pplBusy = false; }
}

function pplPicker(ev, name) {
  document.querySelectorAll('.ppl-pop').forEach(el => el.remove());
  const pop = document.createElement('div');
  pop.className = 'ppl-pop';
  pop.innerHTML = '<div class="who">' + esc(name) + '</div><div class="ttl">' + esc(MSM_ROSTER[name] || 'McCorvey Sheet Metal') + '</div>' +
    '<button data-p="slack">' + SLACK_MARK + ' Message on Slack</button>' +
    '<button data-p="teams">' + TEAMS_MARK + ' Message on Teams</button>';
  document.body.appendChild(pop);
  const x = Math.min(ev.clientX, window.innerWidth - 232), y = Math.min(ev.clientY + 10, window.innerHeight - 130);
  pop.style.left = Math.max(8, x) + 'px'; pop.style.top = Math.max(8, y) + 'px';
  pop.querySelectorAll('button').forEach(b => b.addEventListener('click', e2 => { e2.stopPropagation(); pop.remove(); openDM(b.dataset.p, name); }));
  setTimeout(() => document.addEventListener('click', function h() { pop.remove(); document.removeEventListener('click', h); }, { once: true }), 0);
}

function openDM(platform, name) {
  const teams = platform === 'teams';
  const me = currentPersona() || { name: 'MSM Portal', title: 'Automated' };
  const title = MSM_ROSTER[name] || 'McCorvey Sheet Metal';
  const first = name.split(' ')[0];
  const init = n => n.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  const now = () => new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  const ov = document.createElement('div');
  ov.className = 'slk-ov';
  ov.innerHTML =
    '<div class="slk-card ' + (teams ? 'teams' : '') + '" onclick="event.stopPropagation()">' +
      '<div class="slk-head">' + (teams ? TEAMS_MARK : SLACK_MARK) + '<b>' + (teams ? 'Microsoft Teams' : 'Slack') + '</b><span class="slk-dm-label">Direct message</span><button class="slk-x" aria-label="Close">✕</button></div>' +
      '<div class="slk-peer">' +
        '<span class="slk-ava peer">' + init(name) + '</span>' +
        '<div><b>' + esc(name) + '</b><span class="slk-pres"><i></i> Active</span><div class="slk-title">' + esc(title) + ' · McCorvey Sheet Metal</div></div>' +
      '</div>' +
      '<div class="slk-body" id="dm-body"><div class="slk-day"><span>Today</span></div></div>' +
      '<div class="slk-compose"><input id="dm-in" placeholder="Message ' + esc(first) + '…" autocomplete="off"><button id="dm-send">Send</button></div>' +
    '</div>';
  const close = () => ov.remove();
  ov.addEventListener('click', close);
  ov.querySelector('.slk-x').addEventListener('click', close);
  document.body.appendChild(ov);
  const body = ov.querySelector('#dm-body'), inp = ov.querySelector('#dm-in');
  const send = () => {
    const txt = inp.value.trim(); if (!txt) return;
    inp.value = '';
    const msg = document.createElement('div');
    msg.className = 'slk-msg';
    msg.innerHTML = '<span class="slk-ava me">' + init(me.name) + '</span>' +
      '<div class="slk-msg-main"><div class="slk-msg-head"><b>' + esc(me.name) + '</b><span class="slk-app">' + (teams ? 'MSM PORTAL' : 'APP · MSM Portal') + '</span><span class="slk-time">' + now() + '</span></div>' +
      '<div class="slk-text">' + esc(txt) + '</div>' +
      '<div class="slk-status sending" style="position:static;margin-top:6px"><span class="slk-spin"></span> Sending…</div></div>';
    body.appendChild(msg); body.scrollTop = body.scrollHeight;
    setTimeout(() => { const st = msg.querySelector('.slk-status'); if (st) { st.className = 'slk-status ok'; st.style.position = 'static'; st.style.marginTop = '6px'; st.innerHTML = '✓ Delivered to ' + esc(first) + ' · just now'; } }, 700);
    setTimeout(() => {
      const r = document.createElement('div');
      r.className = 'slk-msg';
      r.innerHTML = '<span class="slk-ava peer">' + init(name) + '</span>' +
        '<div class="slk-msg-main"><div class="slk-msg-head"><b>' + esc(name) + '</b><span class="slk-time">' + now() + '</span></div>' +
        '<div class="slk-text">👍 On it — will circle back shortly. <span style="opacity:.55">(simulated reply — demo)</span></div></div>';
      body.appendChild(r); body.scrollTop = body.scrollHeight;
    }, 1900);
  };
  ov.querySelector('#dm-send').addEventListener('click', send);
  inp.addEventListener('keydown', e => { if (e.key === 'Enter') send(); });
  setTimeout(() => inp.focus(), 60);
}

/* auto-enhance after each render: initial load + observe #app re-renders */
(function () {
  const kick = () => setTimeout(() => enhancePeople(document.getElementById('app') || document.body), 120);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', kick); else kick();
  const app = () => document.getElementById('app');
  const obs = new MutationObserver(muts => {
    if (_pplBusy) return;
    if (muts.some(m => m.addedNodes.length)) { clearTimeout(obs._t); obs._t = setTimeout(() => enhancePeople(app() || document.body), 200); }
  });
  const arm = () => { const a = app(); if (a) obs.observe(a, { childList: true, subtree: true }); };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', arm); else arm();
})();
