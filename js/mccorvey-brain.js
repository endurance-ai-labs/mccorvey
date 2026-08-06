/* ============================================================
   MCCORVEY SHEET METAL — Operating Brain (DEMO)
   Floating bottom-right assistant, same pattern as the Blackwater
   operating brain: client-side, answers generated from the live
   job register. Illustrative demo output — fictional data.
   ============================================================ */
(function () {
  if (window.__mccorveyBrain) return;
  window.__mccorveyBrain = true;

  var ACCENT = '#c8102e', HERO = '#14283c', RED = '#c8102e';

  var css = document.createElement('style');
  css.textContent = [
    '.bw-fab{position:fixed;right:22px;bottom:22px;height:44px;padding:0 20px;border-radius:999px;border:none;cursor:pointer;z-index:2147482000;',
    'background:' + HERO + ';box-shadow:0 10px 26px rgba(0,56,92,.38),0 1px 0 rgba(255,255,255,.10) inset;transition:transform .15s,box-shadow .15s;display:flex;align-items:center;justify-content:center;gap:9px;}',
    '.bw-fab:hover{transform:translateY(-2px);box-shadow:0 16px 34px rgba(0,56,92,.46);}',
    '.bw-fab.open{background:#0b1520;}',
    '.bw-fab .bw-dot{width:9px;height:9px;border-radius:50%;background:' + RED + ';box-shadow:0 0 0 3px rgba(198,151,17,.22);animation:bwpulse 2.2s ease-in-out infinite;}',
    '.bw-fab .bw-lbl{color:#fff;font-family:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;font-size:12.5px;font-weight:800;letter-spacing:.14em;}',
    '.bw-panel{position:fixed;right:22px;bottom:92px;width:384px;max-width:calc(100vw - 32px);height:560px;max-height:calc(100vh - 130px);z-index:2147482000;',
    'background:#fff;border:1px solid rgba(0,56,92,.14);border-radius:14px;box-shadow:0 24px 60px rgba(0,56,92,.28);display:none;flex-direction:column;overflow:hidden;',
    'font-family:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;}',
    '.bw-panel.open{display:flex;}',
    '.bw-head{background:linear-gradient(135deg,' + HERO + ',' + ACCENT + ');color:#fff;padding:14px 16px;}',
    '.bw-head .t{font-weight:800;font-size:15px;letter-spacing:-.01em;display:flex;align-items:center;gap:8px;}',
    '.bw-head .s{font-size:11px;color:#f3d6da;margin-top:2px;}',
    '.bw-head .dot{width:7px;height:7px;border-radius:50%;background:#6ee7a8;box-shadow:0 0 0 3px rgba(110,231,168,.25);}',
    '.bw-disc{background:#fff7ed;color:#9a6212;font-size:10.5px;line-height:1.4;padding:7px 14px;border-bottom:1px solid #f0e6d4;}',
    '.bw-body{flex:1;overflow-y:auto;padding:16px 14px;background:#f7f8fa;display:flex;flex-direction:column;gap:12px;}',
    '.bw-msg{max-width:86%;font-size:13px;line-height:1.5;padding:10px 12px;border-radius:12px;white-space:pre-wrap;}',
    '.bw-msg.u{align-self:flex-end;background:' + ACCENT + ';color:#fff;border-bottom-right-radius:4px;}',
    '.bw-msg.a{align-self:flex-start;background:#fff;color:#1b2230;border:1px solid rgba(0,56,92,.09);border-bottom-left-radius:4px;}',
    '.bw-msg.a b{color:' + HERO + ';}',
    '.bw-sugg{display:flex;flex-wrap:wrap;gap:7px;margin-top:2px;}',
    '.bw-sugg button{font-size:11.5px;color:' + HERO + ';background:#faeaec;border:1px solid #f0cdd2;border-radius:999px;padding:6px 11px;cursor:pointer;}',
    '.bw-sugg button:hover{background:#f5dade;}',
    '.bw-empty{color:#5b6472;font-size:13px;line-height:1.55;}',
    '.bw-row{display:flex;gap:8px;padding:10px;border-top:1px solid rgba(0,56,92,.10);background:#fff;}',
    '.bw-in{flex:1;border:1px solid rgba(0,56,92,.16);border-radius:9px;padding:9px 11px;font:inherit;font-size:13px;resize:none;outline:none;max-height:90px;}',
    '.bw-in:focus{border-color:' + ACCENT + ';}',
    '.bw-send{border:none;background:' + ACCENT + ';color:#fff;border-radius:9px;width:40px;cursor:pointer;font-size:16px;}',
    '.bw-send:hover{background:#a30d26;}',
    '.bw-foot{font-size:9.5px;color:#97a0ad;text-align:center;padding:6px 10px 9px;background:#fff;}',
    '@keyframes bwpulse{0%,100%{opacity:1}50%{opacity:.35}}',
    '.bw-typing{align-self:flex-start;color:#8a93a1;font-size:12px;padding:4px 12px;animation:bwpulse 1.1s ease-in-out infinite;}',
  ].join('');
  document.head.appendChild(css);

  var fab = document.createElement('button');
  fab.className = 'bw-fab'; fab.title = 'Open the McCorvey Operating Brain'; fab.setAttribute('aria-label', 'Open the McCorvey Operating Brain');
  fab.innerHTML = '<img src="/mccorvey/assets/brand/mccorvey-mark.png" alt="MSM" style="height:22px;width:auto;display:block">' +
    '<svg width=\"20\" height=\"20\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#e8b23a\" stroke-width=\"1.7\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M9.5 2.5a2.6 2.6 0 0 0-2.6 2.6c-1.4.2-2.5 1.3-2.5 2.8 0 .5.1 1 .4 1.4A3 3 0 0 0 3 12c0 1 .5 1.9 1.2 2.4-.2.4-.3.9-.3 1.4a2.9 2.9 0 0 0 2.9 2.9c.2 1.3 1.3 2.3 2.7 2.3 1.1 0 2-.6 2.5-1.5V4.3a2.6 2.6 0 0 0-2.5-1.8Z\"/><path d=\"M14.5 2.5a2.6 2.6 0 0 1 2.6 2.6c1.4.2 2.5 1.3 2.5 2.8 0 .5-.1 1-.4 1.4A3 3 0 0 1 21 12c0 1-.5 1.9-1.2 2.4.2.4.3.9.3 1.4a2.9 2.9 0 0 1-2.9 2.9c-.2 1.3-1.3 2.3-2.7 2.3-1.1 0-2-.6-2.5-1.5V4.3a2.6 2.6 0 0 1 2.5-1.8Z\"/><path d=\"M12 4.3v15.2\"/><path d=\"M7 9h2M15 9h2M7.5 13.5H10M14 13.5h2.5\"/></svg>';

  var panel = document.createElement('div');
  panel.className = 'bw-panel';
  panel.innerHTML =
    '<div class="bw-head"><div class="t"><svg width=\"17\" height=\"17\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#e8b23a\" stroke-width=\"1.7\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M9.5 2.5a2.6 2.6 0 0 0-2.6 2.6c-1.4.2-2.5 1.3-2.5 2.8 0 .5.1 1 .4 1.4A3 3 0 0 0 3 12c0 1 .5 1.9 1.2 2.4-.2.4-.3.9-.3 1.4a2.9 2.9 0 0 0 2.9 2.9c.2 1.3 1.3 2.3 2.7 2.3 1.1 0 2-.6 2.5-1.5V4.3a2.6 2.6 0 0 0-2.5-1.8Z\"/><path d=\"M14.5 2.5a2.6 2.6 0 0 1 2.6 2.6c1.4.2 2.5 1.3 2.5 2.8 0 .5-.1 1-.4 1.4A3 3 0 0 1 21 12c0 1-.5 1.9-1.2 2.4.2.4.3.9.3 1.4a2.9 2.9 0 0 1-2.9 2.9c-.2 1.3-1.3 2.3-2.7 2.3-1.1 0-2-.6-2.5-1.5V4.3a2.6 2.6 0 0 1 2.5-1.8Z\"/><path d=\"M12 4.3v15.2\"/><path d=\"M7 9h2M15 9h2M7.5 13.5H10M14 13.5h2.5\"/></svg>MSM — Operating Brain<a href="/mccorvey/brain/" style="margin-left:auto;font-size:10px;color:#f3d6da;text-decoration:none;font-weight:600" title="Open full page">FULL PAGE ↗</a></div>' +
      '<div class="s">Every job, bid set, pay app and plant release — synthesized live</div></div>' +
    '<div class="bw-disc">⚠ Demo assistant. Responses are illustrative and <b>entirely fictional</b> — not factual, not advice, and should not be relied upon.</div>' +
    '<div class="bw-body" id="bw-body"></div>' +
    '<div class="bw-row"><textarea class="bw-in" id="bw-in" rows="1" placeholder="Ask about a job, margin, billing, schedule…"></textarea>' +
      '<button class="bw-send" id="bw-send" aria-label="Send">→</button></div>' +
    '<div class="bw-foot">Illustrative demo output · fictional data · do not rely on these answers</div>';

  document.body.appendChild(fab);
  document.body.appendChild(panel);

  var body = panel.querySelector('#bw-body');
  var input = panel.querySelector('#bw-in');

  function open() { panel.classList.add('open'); fab.classList.add('open'); if (!body.dataset.init) { greet(); body.dataset.init = '1'; } input.focus(); }
  function close() { panel.classList.remove('open'); fab.classList.remove('open'); }
  fab.addEventListener('click', function () { panel.classList.contains('open') ? close() : open(); });
  panel.querySelector('.bw-head').addEventListener('dblclick', close);

  function escq(s) { return String(s).replace(/[&<>]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]; }); }
  function addMsg(role, html) {
    var el = document.createElement('div');
    el.className = 'bw-msg ' + (role === 'user' ? 'u' : 'a');
    el.innerHTML = role === 'user' ? escq(html) : html;
    body.appendChild(el); body.scrollTop = body.scrollHeight; return el;
  }
  function greet() {
    var e = document.createElement('div'); e.className = 'bw-empty';
    e.innerHTML = 'I\'m the McCorvey Operating Brain — I read every bid set, job ledger, pay application and plant release in real time. Ask me anything about the book of work or the bid queue.' +
      '<div class="bw-sugg">' +
      ['What did document review catch this week?', 'Which jobs need attention?', 'How is billing tracking?', 'Status of the Convention Center job?']
        .map(function (q) { return '<button>' + q + '</button>'; }).join('') + '</div>';
    body.appendChild(e);
    e.querySelectorAll('button').forEach(function (b) { b.addEventListener('click', function () { ask(b.textContent); }); });
  }

  /* ---------- answer engine over the live job register ---------- */
  var money = function (n) { return '$' + Math.round(n).toLocaleString(); };
  var moneyK = function (n) { return Math.abs(n) >= 1e6 ? '$' + (n / 1e6).toFixed(2) + 'M' : '$' + Math.round(n / 1e3) + 'K'; };
  var pct = function (n) { return (isFinite(n) ? n.toFixed(1) : '0') + '%'; };

  function J() { return window.JOBS || []; }
  function met(j) { return window.jobMetrics ? window.jobMetrics(j) : null; }
  function withM() { return J().map(function (j) { return { j: j, m: met(j) }; }); }
  function jobLabel(j) { return '<b>' + j.name.split('—')[0].trim() + '</b> (' + j.id + ')'; }

  function answer(q) {
    var s = q.toLowerCase();
    var all = withM();
    if (!all.length) return 'The job register hasn\'t loaded on this page yet — try again in a second.';
    var backlog = all.reduce(function (a, x) { return a + x.j.contract; }, 0);
    var earned = all.reduce(function (a, x) { return a + x.m.earned; }, 0);
    var billed = all.reduce(function (a, x) { return a + x.m.billedAll; }, 0);
    var cost = all.reduce(function (a, x) { return a + x.m.cost; }, 0);
    var projM = all.reduce(function (a, x) { return a + x.m.projMargin; }, 0);

    // job name / id match first
    for (var i = 0; i < all.length; i++) {
      var j = all[i].j, m = all[i].m;
      var key = j.name.split('—')[0].trim().toLowerCase();
      if (s.indexOf(j.id.toLowerCase()) !== -1 || s.indexOf(key.split(' ')[0]) !== -1 && key.split(' ')[0].length > 4 || s.indexOf(key) !== -1) {
        return jobLabel(j) + ' — ' + j.status + ', ' + pct(m.pct) + ' complete on a ' + moneyK(j.contract) + ' contract. ' +
          'Earned ' + moneyK(m.earned) + ', billed ' + moneyK(m.billedAll) + ' (' + (m.overUnder >= 0 ? 'over' : 'under') + '-billed ' + moneyK(Math.abs(m.overUnder)) + '). ' +
          'PM is ' + j.pm + ' with ' + j.sub.split('(')[0].trim() + ' leading the field. ' +
          'Projected margin at completion: <b>' + moneyK(m.projMargin) + ' (' + pct(m.projMarginPct) + ')</b>. Target finish ' + j.finish + '.';
      }
    }

    if (/doc|document|review|spec|addend|itb|bid set|trap|drawings/.test(s)) {
      var dr = window.DOCREVIEW;
      if (dr) {
        var done = dr.queue.filter(function (x) { return x.status === 'Review Complete'; });
        var hi = 0; done.forEach(function (x) { x.findings.forEach(function (f) { if (f.sev === 'high') hi++; }); });
        return 'Document review this cycle: <b>' + dr.queue.length + ' bid sets in the queue</b>, ' + done.length + ' reviews complete, <b>' + hi + ' high-severity flags</b> raised. Standouts: the Memorial City set replaced its entire gauge schedule in Addendum 2 (+6.2% tonnage — competitors bidding the original manual will be light), and Galveston\'s Addendum 4 quietly added two kitchen exhaust systems 6 days before bid. YTD: ' + dr.ytd.itbProcessed + ' ITBs machine-read, ' + Math.round(dr.ytd.pagesRead / 1000) + 'K pages, <b>$' + (dr.ytd.runRateSavings / 1e6).toFixed(2) + 'M run-rate savings</b> against the $3M annual review spend. Full detail on the AI Bid & Document Review page.';
      }
    }

    if (/hello|hi\b|hey|help|what can you/.test(s))
      return 'I continuously synthesize the SOV, pay applications, cost ledgers, schedules and the bid-document queue across all ' + all.length + ' jobs. Ask me about <b>document review</b>, <b>billing</b>, <b>margin</b>, <b>schedule risk</b>, <b>backlog</b>, <b>retention</b>, or any job by name.';

    if (/attention|watch|risk|worst|concern|problem|weak|behind/.test(s)) {
      var w = all.slice().sort(function (a, b) { return a.m.overUnder - b.m.overUnder; })[0];
      return 'Top watch item: ' + jobLabel(w.j) + ' — under-billed ' + moneyK(Math.abs(w.m.overUnder)) + ' against earned work. I\'d push the next pay application out this week. Everything else is inside billing and margin guardrails.';
    }

    if (/bill|invoice|pay app|receivab|collect|cash/.test(s)) {
      var open = all.reduce(function (a, x) { return a + x.j.payApps.filter(function (p) { return p.status !== 'Paid'; }).reduce(function (b, p) { return b + p.certified; }, 0); }, 0);
      return 'Certified billings stand at <b>' + moneyK(billed) + '</b> against ' + moneyK(earned) + ' earned — the book is net ' + (billed - earned >= 0 ? 'over' : 'under') + '-billed ' + moneyK(Math.abs(billed - earned)) + '. Open receivable (submitted / pending / draft) is <b>' + moneyK(open) + '</b>. The billing register has the app-by-app detail.';
    }

    if (/margin|profit|fee|ebitda/.test(s)) {
      var best = all.slice().sort(function (a, b) { return b.m.projMarginPct - a.m.projMarginPct; })[0];
      return 'Projected gross margin across the book is <b>' + moneyK(projM) + ' (' + pct(projM / backlog * 100) + ' blended)</b>; margin-to-date is ' + moneyK(earned - cost) + '. ' + jobLabel(best.j) + ' carries the strongest projected margin at ' + pct(best.m.projMarginPct) + '. Cost-to-complete forecasts live in each job\'s Budget & Forecast tab.';
    }

    if (/backlog|pipeline|revenue|book/.test(s)) {
      var remaining = all.reduce(function (a, x) { return a + x.m.remaining; }, 0);
      return 'Active contract backlog is <b>' + moneyK(backlog) + '</b> across the top ' + all.length + ' packages (of ~250 active projects company-wide), with ' + moneyK(remaining) + ' still unearned. That covers a meaningful share of the Year-1 revenue forecast — the CFO forecast console shows the coverage math and the new-award growth needed to close the gap.';
    }

    if (/retention|retainage/.test(s)) {
      var ret = all.reduce(function (a, x) { return a + (x.j.payApps.some(function (p) { return p.num.indexOf('RET') !== -1; }) ? 0 : x.m.earned * x.j.retainagePct / 100); }, 0);
      return 'Owners are currently holding about <b>' + moneyK(ret) + '</b> of retention across the book (5–10% by contract). The Gulf Coast Medical Tower retention released with final completion — the rest releases at each job\'s closeout.';
    }

    if (/schedule|late|delay|finish|complete|when/.test(s)) {
      var act = all.filter(function (x) { return x.m.pct < 100; });
      var act8 = act.slice(0, 8);
      return act8.map(function (x) { return jobLabel(x.j) + ' — ' + pct(x.m.pct) + ' complete, target finish ' + x.j.finish; }).join('. ') + '. No critical-path slips flagged this week; hoist-window availability at the hotel tower is the main schedule variable.';
    }

    if (/safety|incident|osha/.test(s))
      return 'The field division is at <b>296 consecutive days without a lost-time incident</b>. Monday-morning toolbox talks ran at both plants and every jobsite this week — safety is a value here, not a priority. Two near-miss reports were logged and closed at the Convention Center (hoist staging relocation).';

    if (/crew|labor|sub|workforce/.test(s))
      return 'Field crews are running ~87% utilization and both plants are above 87% machine utilization. Self-perform crews carry the field; the Houston plant (214,000 sf) and Orlando plant (93,000 sf) feed the install schedule with JIT spool releases. No labor shortfalls flagged for the next 30-day look-ahead.';

    if (/best|top|strong|winner|outperform/.test(s)) {
      var t = all.slice().sort(function (a, b) { return b.m.marginToDate - a.m.marginToDate; })[0];
      return jobLabel(t.j) + ' is the standout — ' + moneyK(t.m.marginToDate) + ' of margin earned to date at ' + pct(t.m.pct) + ' complete, billing current, zero open punch items.';
    }

    return 'Across the book: backlog ' + moneyK(backlog) + ', earned ' + moneyK(earned) + ', projected margin ' + moneyK(projM) + ' (' + pct(projM / backlog * 100) + ' blended). Billing is ' + (billed - earned >= 0 ? 'ahead of' : 'behind') + ' production by ' + moneyK(Math.abs(billed - earned)) + '. Ask me to drill into any job by name — e.g. "Status of the Medical City job?" — or ask what <b>document review</b> caught this week.';
  }

  function ask(q) {
    q = (q || '').trim(); if (!q) return;
    var empty = body.querySelector('.bw-empty'); if (empty) empty.remove();
    addMsg('user', q);
    input.value = '';
    var typing = document.createElement('div'); typing.className = 'bw-typing'; typing.textContent = 'Operating Brain is thinking…';
    body.appendChild(typing); body.scrollTop = body.scrollHeight;
    setTimeout(function () { typing.remove(); addMsg('assistant', answer(q)); }, 450 + Math.random() * 500);
  }
  window.__mccorveyBrainAsk = ask;
  window.__mccorveyBrainOpen = open;
  window.__mccorveyBrainAnswer = answer;

  panel.querySelector('#bw-send').addEventListener('click', function () { ask(input.value); });
  input.addEventListener('keydown', function (e) { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); ask(input.value); } });
})();
