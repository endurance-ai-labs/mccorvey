/* =====================================================================
   ILLUSTRATIVE — issue history and simulated redlines for a loaded book
   when the prior issue PDF is not available. FOR ILLUSTRATION ONLY.
   Runs in the browser at load time, on the book's own text; nothing is
   exported. Real facts kept: which sections were reissued (their header
   stamps) and the current wording. Simulated: issue labels/dates for
   Issues 01..N and the earlier wording of changed sentences, made by
   relaxing a requirement found in the current sentence (e.g. 3% -> 5%,
   Seal Class A -> C, a new prohibition -> "not in prior issue").
   ===================================================================== */
(function () {
  const pad = n => String(n).padStart(2, '0');
  const KIND = n => n === 1 ? 'IFR (review set)' : n === 2 ? 'IFR' : n === 3 ? 'IFP (bid set)' : 'Bulletin ' + (n - 3);
  const WORD = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, ten: 10 };
  const NUMW = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];

  function hash(s) { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }

  /* Issues 01..N with illustrative labels and dates, 3 weeks apart, ending at the book date */
  function issues(book) {
    const top = Math.max(book.bookIssue || 0, ...book.sections.map(s => s.issue || 0), 1);
    const m = String(book.bookDate || book.name || '').match(/(20\d\d)-(\d\d)-(\d\d)/);
    const end = m ? new Date(`${m[1]}-${m[2]}-${m[3]}T12:00:00`) : new Date();
    const out = {};
    for (let n = 1; n <= top; n++) out[n] = { label: `Issue ${pad(n)} — ${KIND(n)}`, date: new Date(end - (top - n) * 21 * 864e5).toISOString().slice(0, 10), illustrative: true };
    return out;
  }

  /* each rule relaxes one requirement in the current sentence to simulate the earlier wording */
  const RELAX = [
    { why: 'pressure class raised', re: /(\d+(?:\.\d+)?)(\s*(?:-|\s)?(?:inch|in\.?|")\s*(?:wg|w\.g\.|water gauge))/i, f: m => { const v = +m[1], b = v >= 10 ? 4 : v >= 6 ? 4 : v >= 4 ? 2 : v >= 3 ? 2 : 1; return b === v ? null : b + m[2]; } },
    /* a ceiling was looser before (higher); a floor was looser before (lower) */
    { why: 'limit tightened', re: /(\d+(?:\.\d+)?)(\s*(?:%|percent))/i, f: (m, snt) => { const v = +m[1], floor = /\b(at least|minimum|not less than|no less than)\b/i.test(snt), b = floor ? Math.max(1, v - 5) : v <= 5 ? v + 2 : Math.min(100, v + 5); return b === v ? null : b + m[2]; } },
    { why: 'seal class raised', re: /(Seal Class\s+)([ABC])\b/i, f: m => m[2].toUpperCase() === 'C' ? null : m[1] + 'C' },
    { why: 'filtration raised', re: /(MERV\s*)(\d+)/i, f: m => +m[2] > 6 ? m[1] + (+m[2] >= 13 ? 8 : 6) : null },
    { why: 'gauge made heavier', re: /\b(1[468]|2[024])(\s*(?:ga\b|gauge))/i, f: m => m[1] === '24' ? null : (+m[1] + 2) + m[2] },
    { why: 'test pressure raised', re: /(\d{2,4})(\s*psig)/i, f: m => Math.round(+m[1] * 0.8 / 25) * 25 + m[2] },
    { why: 'term extended', re: /\b(two|three|five|[2-9])(\s*(?:\(\d\)\s*)?years?)\b/i, f: m => { const v = WORD[m[1].toLowerCase()] || +m[1]; const b = Math.max(1, v - 1); return (isNaN(+m[1]) ? NUMW[b] : b) + (b === 1 ? m[2].replace(/years/i, 'year') : m[2]); } },
    { why: 'turnaround shortened', re: /\b(one|two|three|[1-5])(\s*(?:\(\d\)\s*)?(?:work(?:ing)?\s+)?days?)\b/i, f: m => { const v = WORD[m[1].toLowerCase()] || +m[1]; const b = v * 2 + 1; return (isNaN(+m[1]) ? (NUMW[b] || b) : b) + m[2].replace(/\bday\b/i, 'days'); } },
    { why: 'responsibility moved to you', re: /(by\s+)(Division\s+23)\b/i, f: m => m[1] + 'Division 25' },
    { why: 'length limit tightened', re: /(maximum (?:length )?of\s+)(\d{2,3})(\s*inches)/i, f: m => m[1] + Math.round(+m[2] * 1.5) + m[3] },
  ];
  const NEW = /\b(not (?:be )?permitted|prohibited|shall not|no (?:hangers?|substitutions?|change orders?))\b/i;

  function sentences(text) {
    return String(text || '').replace(/\s+/g, ' ').replace(/\s+([.,;:)])/g, '$1').replace(/([A-Za-z]) - ([a-z])/g, '$1-$2').split(/(?<=[.;:])\s+(?=[A-Z0-9])/).map(s => s.trim()).filter(s => s.length >= 45 && s.length <= 280 && /[a-z]/.test(s) && !/^(SECTION|END OF|PART \d|Page \d)/i.test(s));
  }
  function paraNear(pageText, sentence) {
    const i = pageText.indexOf(sentence.slice(0, 30));
    const before = i > 0 ? pageText.slice(Math.max(0, i - 400), i) : '';
    const all = before.match(/\b\d\.\d{1,2}(?:\.[A-Z](?:\.\d{1,2})?)?\b/g);
    return all ? all[all.length - 1] : '';
  }

  /* simulate up to 3 changed sentences per section, preferring pages that carry findings */
  function prepare(book, raw, buildups) {
    if (!raw || !raw.bodies) return book;
    if (!book.issues || !Object.keys(book.issues).length) book.issues = issues(book);
    const yours = s => /^(00|01|2[1-8]|40)/.test(s.id) && s.id !== '00 0000';
    const illus = {}, used = new Set();   /* a finding's dollars land on one change only */
    book.sections.filter(s => yours(s) && s.issue != null && s.issue > 1).forEach(s => {
      const fPages = new Set(book.findings.filter(f => f.sec === s.id).map(f => f.page));
      const cands = [];
      for (let p = s.start; p <= s.end; p++) {
        const body = raw.bodies[p - 1] || '';
        sentences(body).forEach(snt => {
          const r = RELAX.find(x => x.re.test(snt));
          const isNew = !r && NEW.test(snt);
          if (r || isNew) cands.push({ p, snt, r, isNew, body, w: (fPages.has(p) ? 2 : 0) + (r ? 1 : 0) });
        });
      }
      if (!cands.length) return;
      const seed = hash(s.id);
      cands.sort((a, b) => b.w - a.w || ((hash(a.snt) ^ seed) % 997) - ((hash(b.snt) ^ seed) % 997));
      const pick = [], seen = new Set();
      for (const c of cands) { const k = c.snt.slice(0, 40); if (seen.has(k)) continue; seen.add(k); pick.push(c); if (pick.length >= 3) break; }
      illus[s.id] = pick.map(c => {
        const f = book.findings.find(x => x.sec === s.id && Math.abs(x.page - c.p) <= 1);
        const rec = f && !used.has(f.id) && buildups && buildups.has(f) ? buildups.recommend(f) : 0;
        if (rec) used.add(f.id);
        let before = '', why = 'requirement added in this issue';
        if (c.r) { const m = c.snt.match(c.r.re), rep = m && c.r.f(m, c.snt); if (rep) { before = c.snt.replace(m[0], rep); why = c.r.why; } }
        const kind = before ? 'mod' : 'add';
        const amt = rec ? Math.round(rec * (kind === 'add' ? 1 : 0.5) / 100) * 100 : 0;
        return { para: paraNear(c.body.replace(/\s+/g, ' '), c.snt), kind, page: c.p, before, after: c.snt, amt, find: f ? f.id : null, note: 'Illustrative: ' + why + '.', illustrative: true };
      });
    });
    book.illus = illus;
    return book;
  }

  /* diffs for the issue you priced against, from the prepared simulation */
  function diffs(book, lensOf, YOURS) {
    const yours = s => YOURS ? YOURS.includes(s.div) : /^2[23]/.test(s.id);
    return book.sections.filter(s => s.id !== '00 0000' && s.issue != null && s.issue > book.pricedIssue && book.illus && (book.illus[s.id] || yours(s)))
      .map(s => {
        const ch = (book.illus && book.illus[s.id]) || [];
        return { sec: s.id, from: book.pricedIssue, to: s.issue, lens: lensOf ? lensOf(s.id) : 'all', crossDiv: YOURS ? !YOURS.includes(s.div) && !/^0[01]/.test(s.id) : false, stampOnly: !ch.length, changes: ch, illustrative: true };
      });
  }

  /* building area stated in the Summary, if the book gives one (used to scale illustrative quantities) */
  function projectSF(book, raw) {
    if (!raw || !raw.bodies) return 0;
    const s = book.sections.find(x => x.id === '01 1000');
    if (!s) return 0;
    let best = 0;
    for (let p = s.start; p <= s.end; p++) {
      const t = raw.bodies[p - 1] || '';
      (t.match(/\b(?:\d{1,3},)?\d{2,3},\d{3}\s*(?:gross\s+)?(?:square feet|sq\.?\s*ft\.?|GSF|SF)\b/gi) || []).forEach(x => { const v = +x.replace(/[^\d]/g, ''); if (v > best && v < 5e6) best = v; });
    }
    return best;
  }

  window.Illustrative = { issues, prepare, diffs, projectSF };
})();
