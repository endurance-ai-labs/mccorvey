/* ============================================================
   YATES CONSTRUCTION — Operations Portal nav
   Same framework as the CFP/Margins portal: sticky marquee +
   market ticker + topbar with grouped nav + section subnav +
   theme toggle. Adds a global Internal / Client mode toggle.
   ============================================================ */

/* ---- Theme: every load starts light (Margins profile) ---- */
(function () {
  document.documentElement.setAttribute('data-theme', 'light');
  try { localStorage.setItem('yates-theme', 'light'); } catch (e) {}
})();

/* ---- Global view mode: internal (full financials) vs client (external-safe) ---- */
const YatesMode = (function () {
  const KEY = 'yates-mode';
  function get() { try { return localStorage.getItem(KEY) === 'client' ? 'client' : 'internal'; } catch (e) { return 'internal'; } }
  function set(m) { try { localStorage.setItem(KEY, m); } catch (e) {} window.location.reload(); }
  return { get, set, isInternal: () => get() === 'internal' };
})();
window.YatesMode = YatesMode;

const NAV_GROUPS = [
  { id: 'home', label: 'Home', href: '/yates/', items: [] },
  {
    id: 'jobs',
    label: 'Jobs',
    items: [
      { href: '/yates/jobs/',    label: 'All Jobs', jobFlyout: true },
      { href: '/yates/reports/', label: 'Progress Reports' },
      { href: '/yates/photos/',  label: 'Photo Documentation' },
    ],
  },
  { id: 'service', label: 'Service', href: '/yates/service/', items: [] },
  {
    id: 'bids',
    label: 'Preconstruction',
    items: [
      { href: '/yates/bids/',     label: 'Bid Builder' },
      { href: '/yates/pipeline/', label: 'Bid Pipeline & Win/Loss' },
    ],
  },
  {
    id: 'finance',
    label: 'Financial',
    internalOnly: true,
    items: [
      { href: '/yates/budget/',   label: 'Monthly Budget vs Actual' },
      { href: '/yates/workbook/', label: 'Forecast Workbook' },
      { href: '/yates/forecast/', label: '5-Year Growth Model' },
      { href: '/yates/manpower/', label: 'Manpower & EAC' },
      { href: '/yates/billing/',  label: 'AIA Billing' },
      { href: '/yates/timesheets/', label: 'Timesheets' },
    ],
  },
];

function _normalizePath(p) {
  if (!p) return '/';
  p = p.replace(/\/index\.html$/, '/');
  if (p === '/yates') return '/';
  if (p.startsWith('/yates/')) p = p.slice(6);
  return p || '/';
}

function _activeGroup(path) {
  path = _normalizePath(path);
  if (path === '/') return 'home';
  if (path.startsWith('/jobs/')) return 'jobs';
  if (path.startsWith('/reports/')) return 'jobs';
  if (path.startsWith('/photos/')) return 'jobs';
  if (path.startsWith('/service/')) return 'service';
  if (path.startsWith('/bids/')) return 'bids';
  if (path.startsWith('/pipeline/')) return 'bids';
  if (path.startsWith('/forecast/')) return 'finance';
  if (path.startsWith('/budget/')) return 'finance';
  if (path.startsWith('/workbook/')) return 'finance';
  if (path.startsWith('/manpower/')) return 'finance';
  if (path.startsWith('/billing/')) return 'finance';
  if (path.startsWith('/timesheets/')) return 'finance';
  if (path.startsWith('/brain/')) return 'brain';
  return 'home';
}

/* ---- Static demo ticker: construction market inputs ---- */
const TICKER = [
  ['COPPER', '$4.52/lb', '+2.1%', 'up'],
  ['CAT6 / LV CABLE', '$142/box', '-0.6%', 'down'],
  ['DDC CONTROLLER LEAD TIME', '9 wks', '-1 wk', 'up'],
  ['ERCOT PEAK (T-1)', '78.4 GW', '+3.2%', 'up'],
  ['DIESEL (DOE)', '$3.61/gal', '+0.4%', 'up'],
  ['TECH UTILIZATION (SERVICETITAN)', '87.3%', '+1.1%', 'up'],
  ['AR SYNC (QUICKBOOKS)', 'LIVE', '4 min ago', 'up'],
  ['OPEN SERVICE CALLS', '23', '-4', 'up'],
];
const MARQUEE = [
  ['Y8S', 'Best Place to Work in San Marcos, TX 2026 — thank you to the whole team'],
  ['ERCOT', 'Summer peak demand programs open — commercial curtailment enrollment closes Aug 15'],
  ['ASHRAE', 'Guideline 36 high-performance sequences gaining adoption across Texas K-12 retrofits'],
  ['CPS', 'Utility rebate window for smart-building controls extended through Q4 — applications trending up'],
  ['TEXAS ISD', 'School bond packages across Central Texas fund HVAC & controls modernization at record pace'],
  ['Y8S', 'Established 2011 · Carrier i-Vu, Innotech & Lynxspring lines · engineering, construction & 24/7 service'],
  ['AIA', 'Construction billings index positive for institutional work a sixth straight month'],
];

function renderTopbar(opts = {}) {
  const target = document.getElementById('topbar');
  if (!target) return;
  const subtitle = opts.subtitle || 'Operations Portal';
  const path = _normalizePath(window.location.pathname);
  const activeGroupId = _activeGroup(path);
  if (typeof isSignedIn === 'function' && !isSignedIn()) { renderSignIn(); target.outerHTML = ''; return; }
  const me = currentPersona();
  const internal = YatesMode.isInternal() && !me.perms.external;
  const groups = NAV_GROUPS.filter(g => !g.internalOnly || (internal && me.perms.fin));
  const activeGroup = groups.find(g => g.id === activeGroupId);

  const groupLinks = groups.map(g => {
    const active = g.id === activeGroupId;
    const href = g.items.length === 0 ? g.href : g.items[0].href;
    if (g.items.length === 0) {
      if (g.cta) {
        return `<div class="nav-item"><a href="${href}" data-group="${g.id}" class="nav-cta${active ? ' active' : ''}" style="display:inline-flex;align-items:center;gap:5px;color:#fff;padding:6px 15px;border-radius:999px;font-weight:700;">🧠 ${g.label}</a></div>`;
      }
      return `<div class="nav-item"><a href="${href}" data-group="${g.id}" class="${active ? 'active' : ''}">${g.label}</a></div>`;
    }
    const dropdownItems = g.items.map(it => {
      const itemActive = path === it.href || (it.href !== '/' && path.startsWith(it.href));
      if (it.jobFlyout) {
        return `<div class="nav-dd-fly-parent">
          <a href="${it.href}" class="nav-dropdown-item ${itemActive ? 'active' : ''}">${it.label} <span class="nav-caret" style="float:right">▸</span></a>
          <div class="nav-flyout" data-job-flyout></div>
        </div>`;
      }
      return `<a href="${it.href}" class="nav-dropdown-item ${itemActive ? 'active' : ''}">${it.label}</a>`;
    }).join('');
    return `
      <div class="nav-item nav-item-with-dropdown">
        <a href="${href}" data-group="${g.id}" class="${active ? 'active' : ''}">${g.label} <span class="nav-caret">▾</span></a>
        <div class="nav-dropdown">${dropdownItems}</div>
      </div>`;
  }).join('');

  const allGroupLinks = groups.map(g => {
    const active = g.id === activeGroupId;
    const href = g.items.length === 0 ? g.href : g.items[0].href;
    if (!g.items || g.items.length === 0) {
      return `<div class="nav-item"><a href="${href}" data-group="${g.id}" class="${active ? 'active' : ''}">${g.label}</a></div>`;
    }
    const dropdownItems = g.items.map(it => {
      const itemActive = path === it.href || (it.href !== '/' && path.startsWith(it.href));
      return `<a href="${it.href}" class="nav-dropdown-item ${itemActive ? 'active' : ''}">${it.label}</a>`;
    }).join('');
    return `
      <div class="nav-item nav-item-with-dropdown">
        <a href="${href}" data-group="${g.id}" class="${active ? 'active' : ''}">${g.label} <span class="nav-caret">▾</span></a>
        <div class="nav-dropdown">${dropdownItems}</div>
      </div>`;
  }).join('');

  let subBar = '';
  const hasSubnav = activeGroup && activeGroup.items.length > 1;
  if (hasSubnav) {
    const subItems = activeGroup.items.map(it => {
      const itemActive = path === it.href || (it.href !== '/' && path.startsWith(it.href));
      if (it.jobFlyout) {
        return `<span class="subnav-fly-parent">
          <a href="${it.href}" class="section-subnav-item ${itemActive ? 'active' : ''}">${it.label} <span class="nav-caret">▾</span></a>
          <div class="nav-flyout subnav-flyout" data-job-flyout></div>
        </span>`;
      }
      return `<a href="${it.href}" class="section-subnav-item ${itemActive ? 'active' : ''}">${it.label}</a>`;
    }).join('');
    subBar = `
      <nav class="section-subnav" id="section-subnav" aria-label="${activeGroup.label} sub-navigation">
        <div class="section-subnav-inner">
          <span class="section-subnav-label">${activeGroup.label}</span>
          <div class="section-subnav-items">${subItems}</div>
        </div>
      </nav>`;
  } else {
    subBar = `
      <div class="section-subnav section-subnav--empty" id="section-subnav" aria-hidden="true">
        <div class="section-subnav-inner">
          <span class="section-subnav-label">&nbsp;</span>
          <div class="section-subnav-items"><span class="section-subnav-item">&nbsp;</span></div>
        </div>
      </div>`;
  }

  const tickerHtml = TICKER.map(t =>
    `<span class="ticker-item"><span class="ticker-label">${t[0]}</span><span class="ticker-value">${t[1]}</span><span class="ticker-change ${t[3]}">${t[2]}</span></span>`
  ).join('<span class="ticker-sep">·</span>');

  const marqueeItems = MARQUEE.map(m =>
    `<span class="news-marquee-item"><span class="news-marquee-source">${m[0]}</span><span class="news-marquee-text">${m[1]}</span><span class="news-marquee-sep">—</span></span>`
  ).join('');

  target.outerHTML = `
    <div class="news-marquee" id="news-marquee"><div class="news-marquee-track">${marqueeItems}${marqueeItems}</div></div>
    <div class="market-ticker" id="market-ticker">${tickerHtml}</div>
    <div class="portal-topbar">
      <a class="brand" href="/yates/" style="cursor:pointer;text-decoration:none">
        <img src="/yates/assets/brand/y8s-logo.png" alt="Y8S — YATES Company, LLC" class="y8s-logo">
        <div class="y8s-brand-text">
          <div class="y8s-name">YATES Company, LLC</div>
          <div class="yates-sub">${subtitle}</div>
        </div>
      </a>
      <nav class="nav nav-desktop">${groupLinks}</nav>
      <div class="portal-topbar-right">
        <div class="mode-toggle" title="Switch between internal (full financials) and client-facing views" style="${me.perms.external ? 'display:none' : ''}">
          <button id="ymode-int" class="${internal ? 'on' : ''}"><span class="mt-lbl">INTERNAL</span>${internal ? '' : ''}</button>
          <button id="ymode-ext" class="${internal ? '' : 'on'}"><span class="mt-lbl">CLIENT</span></button>
        </div>
        <button class="nav-icon-btn theme-toggle" id="theme-toggle" title="Toggle light / dark mode" aria-label="Toggle theme">
          <svg class="theme-icon-moon" xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
          <svg class="theme-icon-sun" xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:none"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
        </button>
        <div class="nav-item nav-item-with-dropdown nav-user-btn" id="nav-user-btn" title="Account & role">
          <a href="#" class="nav-icon-btn nav-user-trigger" aria-label="Account" onclick="event.preventDefault()">
            <span class="nav-user-avatar">${me.perms && me.perms.external ? '◇' : me.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}</span>
            <span class="nav-user-label">${me.name.split(' ')[0]}</span>
            <span class="nav-caret">▾</span>
          </a>
          <div class="nav-dropdown nav-dropdown-right">
            <div class="nav-user-card">
              <div class="nav-user-card-title">${me.name} <span class="nav-user-badge">DEMO</span></div>
              <div class="nav-user-card-sub">${me.title}</div>
              <div class="nav-user-card-meta">${me.perms.external ? 'EXTERNAL — CLIENT VIEW' : me.perms.fin ? (me.perms.margins ? 'FULL FINANCIAL ACCESS · SIGN-OFF RIGHTS' : 'BILLING & PAYROLL ACCESS') : 'OPERATIONS ACCESS'}</div>
            </div>
            <div class="nav-user-card" style="padding-top:6px">
              <div class="nav-user-card-meta" style="margin-bottom:4px">SWITCH USER (DEMO)</div>
              ${PERSONAS.map(p => `<a href="#" class="nav-dropdown-item" style="padding:6px 0;${p.id === me.id ? 'color:var(--color-blue);font-weight:700' : ''}" onclick="event.preventDefault();setRole('${p.id}')">${p.id === me.id ? '● ' : '○ '}${p.name} — ${p.title}</a>`).join('')}
            </div>
            <div class="nav-dropdown-divider"></div>
            <a href="#" class="nav-dropdown-item" onclick="event.preventDefault();signOutUser()">Sign out</a>
          </div>
        </div>
      </div>
    </div>
    <button class="nav-toggle" id="nav-toggle" aria-label="Open menu" aria-expanded="false" aria-controls="nav-menu">
      <span class="nav-toggle-bar"></span><span class="nav-toggle-bar"></span><span class="nav-toggle-bar"></span>
    </button>
    <nav class="nav nav-mobile" id="nav-menu" aria-hidden="true">${allGroupLinks}</nav>
    <div class="nav-scrim" id="nav-scrim" hidden></div>
    ${subBar}`;

  document.body.classList.remove('has-sidenav', 'has-sidenav-collapsed');

  // demo watermark on every page
  if (!document.querySelector('.demo-watermark')) {
    const wm = document.createElement('div');
    wm.className = 'demo-watermark';
    wm.textContent = 'Demo environment · fictional data';
    document.body.appendChild(wm);
  }

  _wireMobileNav();
  _wireThemeToggle();
  _wireModeToggle();
  _fillJobFlyouts();
}

function _wireModeToggle() {
  const i = document.getElementById('ymode-int'), e = document.getElementById('ymode-ext');
  if (i) i.addEventListener('click', () => { if (!YatesMode.isInternal()) YatesMode.set('internal'); });
  if (e) e.addEventListener('click', () => { if (YatesMode.isInternal()) YatesMode.set('client'); });
}

function _fillJobFlyouts() {
  const hosts = document.querySelectorAll('[data-job-flyout]');
  if (!hosts.length || !window.JOBS) return;
  const html = window.JOBS.map(j =>
    `<a href="/yates/jobs/job/?id=${j.id}"><span>${j.name.split('—')[0].trim()}</span><span class="fl-meta">${j.id} · ${j.status}</span></a>`).join('');
  hosts.forEach(h => { h.innerHTML = html; });
}

function _wireMobileNav() {
  const toggle = document.getElementById('nav-toggle');
  const menu = document.getElementById('nav-menu');
  const scrim = document.getElementById('nav-scrim');
  if (!toggle || !menu) return;
  const close = () => { document.body.classList.remove('nav-open'); toggle.setAttribute('aria-expanded', 'false'); if (scrim) scrim.hidden = true; };
  const open = () => { document.body.classList.add('nav-open'); toggle.setAttribute('aria-expanded', 'true'); if (scrim) scrim.hidden = false; };
  toggle.addEventListener('click', () => { document.body.classList.contains('nav-open') ? close() : open(); });
  if (scrim) scrim.addEventListener('click', close);
  menu.querySelectorAll('.nav-item-with-dropdown > a').forEach(a => {
    a.addEventListener('click', e => {
      if (window.matchMedia('(max-width: 900px)').matches) {
        const item = a.parentElement;
        if (!item.classList.contains('open')) {
          e.preventDefault();
          menu.querySelectorAll('.nav-item-with-dropdown.open').forEach(o => o.classList.remove('open'));
          item.classList.add('open');
        }
      }
    });
  });
  menu.querySelectorAll('.nav-dropdown-item, .nav-item:not(.nav-item-with-dropdown) > a').forEach(a => {
    a.addEventListener('click', () => close());
  });
  window.addEventListener('resize', () => { if (!window.matchMedia('(max-width: 900px)').matches) close(); });
}

function _wireThemeToggle() {
  const btn = document.getElementById('theme-toggle');
  if (!btn) return;
  function _applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem('yates-theme', theme); } catch (e) {}
    const moon = btn.querySelector('.theme-icon-moon');
    const sun = btn.querySelector('.theme-icon-sun');
    if (theme === 'light') { if (moon) moon.style.display = 'none'; if (sun) sun.style.display = ''; }
    else { if (moon) moon.style.display = ''; if (sun) sun.style.display = 'none'; }
  }
  _applyTheme(document.documentElement.getAttribute('data-theme') || 'light');
  btn.addEventListener('click', () => {
    const next = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    _applyTheme(next);
  });
}

/* sticky bottom horizontal scrollbar helper (same as CFP) */
(function loadStickyHscroll() {
  if (window.__yatesStickyHscrollLoaded) return;
  window.__yatesStickyHscrollLoaded = true;
  const s = document.createElement('script');
  s.src = '/yates/js/sticky-hscroll.js';
  s.async = true;
  document.head.appendChild(s);
})();

window.YatesNav = { renderTopbar };
