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
  const map = { "In Progress": "blue", "Closeout": "green", "Just Started": "amber", "Complete": "green" };
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

/* ---- demo personas (role-based sign-off rights) ---- */
const PERSONAS = [
  { id: 'analyst',    name: 'Jordan Ellis',     title: 'Financial Analyst' },
  { id: 'controller', name: 'Priya Natarajan',  title: 'Controller' },
  { id: 'cfo',        name: 'Alan Reece',       title: 'Chief Financial Officer' },
  { id: 'pm',         name: 'Marcus Pruitt',    title: 'Project Manager' },
  { id: 'chiefest',   name: 'Rachel Vaughn',    title: 'Chief Estimator' },
  { id: 'divmgr',     name: 'K. Yates',         title: 'Division Manager' },
];
function currentRole() { try { return localStorage.getItem('yates-role') || 'cfo'; } catch (e) { return 'cfo'; } }
function currentPersona() { return PERSONAS.find(p => p.id === currentRole()) || PERSONAS[2]; }
function setRole(id) { try { localStorage.setItem('yates-role', id); } catch (e) {} window.location.reload(); }

/* ---- data-source chips (integration attribution) ---- */
function srcChip(kind) {
  const map = {
    qb:   ['QUICKBOOKS API', '#2ca01c', 'Financial actuals synced from QuickBooks Online via API'],
    st:   ['SERVICETITAN API', '#f04e23', 'Field production, schedules & photos synced from ServiceTitan via API'],
    prop: ['YATES PROPRIETARY', '#005c97', 'Proprietary Yates modeling engine — internal only'],
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
    return `<div class="appr-step locked">
      <span class="dot"></span>
      <div><b>${esc(s.label)}</b><span>${prevDone ? 'awaiting ' + esc(persona ? persona.title : s.role) : 'locked — prior approval required'}</span></div>
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
