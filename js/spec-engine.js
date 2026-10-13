/* =====================================================================
   SPEC ENGINE — reads a spec book PDF entirely in this browser.
   Nothing is uploaded: pdf.js (library only) loads from cdnjs, the file
   is read with FileReader, and extracted text lives in memory. Only the
   derived findings (rule titles + short cites) are kept in
   sessionStorage so the RFI page can use them in the same tab.
   Deterministic: section map from page headers, issue stamps, a rule
   library of known spec traps, stale-reference + template-text checks,
   responsibility statements, and a sentence-level diff between issues.
   ===================================================================== */
(function () {
  const PDFJS = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/';
  const DIV_NAMES = {
    '00': 'Procurement & Contracting', '01': 'General Requirements', '02': 'Existing Conditions', '03': 'Concrete', '04': 'Masonry',
    '05': 'Metals', '06': 'Wood & Plastics', '07': 'Thermal & Moisture', '08': 'Openings', '09': 'Finishes', '10': 'Specialties',
    '11': 'Equipment', '12': 'Furnishings', '13': 'Special Construction', '14': 'Conveying', '21': 'Fire Suppression', '22': 'Plumbing',
    '23': 'HVAC', '25': 'Integrated Automation', '26': 'Electrical', '27': 'Communications', '28': 'Electronic Safety & Security',
    '31': 'Earthwork', '32': 'Exterior Improvements', '33': 'Utilities', '40': 'Process Interconnections',
  };
  const YOURS = ['00', '01', '22', '23'];             /* Jerry's read: project requirements + 22 + 23 */
  const HOOKS = ['21', '25', '26', '28', '40'];        /* scanned for cross-division hooks */

  /* ---------------- lenses ---------------- */
  function lensOf(secId) {
    const d = String(secId).slice(0, 2);
    if (d === '00' || d === '01') return 'all';
    if (d === '22') return 'plumb';
    if (d === '23') return /^23 (3|07)/.test(secId) ? 'sm' : 'hvac';
    if (d === '25') return 'hvac';
    if (d === '21' || d === '40') return 'plumb';
    return 'other';
  }
  const LENSES = {
    all:   { label: 'All trades', show: ['all', 'sm', 'hvac', 'plumb', 'other'] },
    sm:    { label: 'Sheet Metal (duct)', show: ['all', 'sm'] },
    hvac:  { label: 'HVAC — Div 23', show: ['all', 'sm', 'hvac'] },
    plumb: { label: 'Plumbing — Div 22', show: ['all', 'plumb'] },
  };
  const inLens = (itemLens, lens) => (LENSES[lens] || LENSES.all).show.includes(itemLens || 'other');

  /* ---------------- rule library (known spec traps) ---------------- */
  const RULES = [
    { id: 'deck', lens: 'sm', sev: 'high', cat: 'Hangers', title: 'Hangers restricted from metal deck — supplemental steel', rx: /(no hangers?[^.]{0,80}metal deck|(attach|suspend)\w*[^.]{0,40}(to|from)[^.]{0,30}metal deck)/i, impact: 'Every attachment may need added steel to structure. Price supplemental steel per hanger point.', act: 'price' },
    { id: 'drops', lens: 'sm', sev: 'high', cat: 'Hangers', title: 'Long drops must be angle/channel — no rods or straps', rx: /(do not use (straps|rods)|drops?[^.]{0,60}(exceed|over|greater than)[^.]{0,30}\d+\s*(inch|in\.|")[^.]{0,80}(angle|channel))/i, impact: 'High-bay drops become trapeze and bracing work.', act: 'price' },
    { id: 'sealA', lens: 'sm', sev: 'high', cat: 'Sealing', title: 'Seal Class A required', rx: /seal(ing)?\s+class\s*[:\-]?\s*A\b/i, impact: 'Sealing labor premium — check whether it applies to low-pressure systems too.', act: 'price' },
    { id: 'wg10', lens: 'sm', sev: 'high', cat: 'Pressure class', title: 'High-pressure duct class (≥ 6" wg)', rx: /\b(6|8|10)[- ]?(inch|in\.?|")\s*(w\.?g|water gauge)\.?\s*(positive|\+)/i, impact: 'Heavier gauge, tighter reinforcement, full leak testing.', act: 'price' },
    { id: 'leak', lens: 'sm', sev: 'high', cat: 'Testing', title: 'Duct leakage testing scope', rx: /(test all (high|medium)[^.]{0,40}duct|leakage test[^.]{0,120}(medium|high|shaft|witness))/i, impact: 'Test crew, rigs, retests and an inspection hold before insulation.', act: 'price' },
    { id: 'spin', lens: 'sm', sev: 'med', cat: 'Fittings', title: 'Spin-in / cinch-lock fittings restricted', rx: /spin[- ]?in[^.]{0,60}(not (allowed|permitted|acceptable)|prohibit)/i, impact: 'Takeoffs become conical tees, bellmouths or boots.', act: 'price' },
    { id: 'snap', lens: 'sm', sev: 'med', cat: 'Shop', title: 'Snaplock / button-punch seams prohibited', rx: /(snap\s?lock|button[- ]punch|pocket lock)[^.]{0,60}not (be )?(permitted|allowed|acceptable)/i, impact: 'Pittsburgh seams only — coil-line setup and seam labor.', act: 'price' },
    { id: 'door', lens: 'sm', sev: 'med', cat: 'Accessories', title: 'Factory access doors only — no shop-built', rx: /(shop|field)[- ]fabricated access doors?[^.]{0,40}not/i, impact: 'Buy every access door.', act: 'price' },
    { id: 'flex', lens: 'sm', sev: 'med', cat: 'Flex', title: 'Flex duct length limit', rx: /(flex(ible)? duct[^.]{0,140}(maximum|max\.?)[^.]{0,30}\d+\s*(inch|in\.?|"|feet|ft))|(maximum length of \d+\s*(inch|in))/i, impact: 'More hard duct to the diffusers than the plans suggest.', act: 'price' },
    { id: 'grease', lens: 'sm', sev: 'med', cat: 'Grease duct', title: 'Grease duct construction / test requirements', rx: /grease duct[^.]{0,120}(UL|welded|liquid[- ]tight|light test|NFPA 96)/i, impact: 'Confirm factory-built vs field-welded and who tests.', act: 'clarify' },
    { id: 'outins', lens: 'sm', sev: 'high', cat: 'Insulation', title: 'Outdoor duct insulation + jacket', rx: /(outdoor|exterior|exposed to (the )?weather)[^.]{0,80}duct[^.]{0,120}(jacket|cladding|\d\s*(inch|in\.?|")\s*(thick|board))/i, impact: 'Rooftop duct finish is a large insulation-sub number.', act: 'price' },
    { id: 'castiron', lens: 'plumb', sev: 'high', cat: 'Material', title: 'Cast iron condensate drain', rx: /(condensate[^.]{0,100}cast[- ]iron|cast[- ]iron[^.]{0,100}condensate)/i, impact: 'Unusual and expensive vs PVC/copper — confirm intent.', act: 'price' },
    { id: 'legion', lens: 'plumb', sev: 'med', cat: 'Testing', title: 'Legionella testing required', rx: /legionella/i, impact: 'Lab fees plus disinfection/retest risk.', act: 'price' },
    { id: 'oilfree', lens: 'plumb', sev: 'med', cat: 'Conflict', title: 'Oil-free air requirement — check against compressor type', rx: /oil[- ]free/i, impact: 'Oil-free machines cost roughly double — confirm the basis of design matches.', act: 'rfi' },
    { id: 'oakum', lens: 'plumb', sev: 'med', cat: 'Means & methods', title: 'Lead-and-oakum joints', rx: /oakum/i, impact: 'Labor-heavy, and hot work where open flame is restricted.', act: 'note' },
    { id: 'pex', lens: 'plumb', sev: 'info', cat: 'Material', title: 'PEX restricted / copper type mandated', rx: /(PEX[^.]{0,40}not (permitted|allowed)|type\s+L[^.]{0,40}(only|copper))/i, impact: 'Material basis for domestic water.', act: 'note' },
    { id: 'vfd', lens: 'hvac', sev: 'med', cat: 'Scope split', title: 'VFDs furnished by the mechanical/plumbing trade', rx: /(variable[- ]frequency (drives?|motor controllers?)|VFDs?)[^.]{0,120}(furnished|provided) (by|under) Division 2[23]/i, impact: 'Drive purchase lands in your number.', act: 'clarify' },
    { id: 'thd', lens: 'hvac', sev: 'high', cat: 'Electrical', title: 'Harmonic distortion limit on drives', rx: /(\d(\.\d)?\s*%\s*(total )?harmonic|THD[^.]{0,40}\d\s*%)/i, impact: 'Filters or active front ends on every drive.', act: 'price' },
    { id: 'pads', lens: 'hvac', sev: 'med', cat: 'Scope', title: 'Equipment pads by the mechanical trade', rx: /(provide|furnish)[^.]{0,30}(reinforced )?concrete (equipment )?(pads|bases|housekeeping)/i, impact: 'Concrete scope inside the mechanical number.', act: 'price' },
    { id: 'curb', lens: 'hvac', sev: 'high', cat: 'Delegated design', title: 'Structural curbs / screens with delegated design', rx: /(curbs?|screen frames?)[^.]{0,140}(wind|seismic)[^.]{0,60}(load|design)/i, impact: 'Structural design-build hidden in an equipment section.', act: 'price' },
    { id: 'subs', lens: 'all', sev: 'high', cat: 'Closed spec', title: 'Substitutions restricted', rx: /(no substitutions?|substitutions? (for convenience )?(are|is|will) not (be )?(permitted|considered|accepted|allowed)|comparable products? will not be considered)/i, impact: 'Price only the listed manufacturers.', act: 'note' },
    { id: 'nocost', lens: 'all', sev: 'high', cat: 'Cost shift', title: 'Cost shifted to the trade — "no additional cost"', rx: /(at no (additional|extra) cost to (the )?owner|no change orders? (will|shall) be (accepted|considered|issued))/i, impact: 'Read each one — these are where margin quietly leaves.', act: 'clarify' },
    { id: 'flame', lens: 'all', sev: 'high', cat: 'Means & methods', title: 'Open flame / hot work restricted', rx: /(open[- ]flame[^.]{0,60}not (be )?permitted|hot[- ]work permit|fire watch)/i, impact: 'Press fittings, fire-watch labor and permit lead time on welded work.', act: 'price' },
    { id: 'pe', lens: 'all', sev: 'high', cat: 'Delegated design', title: 'Delegated design — contractor-retained engineer', rx: /((engage|employ|retain)[^.]{0,40}(professional|licensed|registered) engineer|delegated[- ]design)/i, impact: 'PE fees, sealed calcs and a submittal cycle at the front of detailing.', act: 'price' },
    { id: 'perdiem', lens: 'all', sev: 'high', cat: 'Cost shift', title: 'Back-charge for retests (per diem)', rx: /(per[- ]diem|back[- ]?charged?)/i, impact: 'Carry a retest allowance.', act: 'price' },
    { id: 'paycoord', lens: 'all', sev: 'high', cat: 'Payment', title: 'Payment held for coordination drawings', rx: /prerequisite for (any )?(progress )?payment/i, impact: 'Cash-flow hold until coordination is signed — carry it as an SOV line.', act: 'clarify' },
    { id: 'risk', lens: 'all', sev: 'high', cat: 'Coordination', title: 'Pre-coordination work at your risk', rx: /(at (the )?(sub)?contractor'?s risk|regardless of which (was|trade) installed first|will not be considered (a )?changes?)/i, impact: 'No relief for field relocations.', act: 'clarify' },
    { id: 'temp', lens: 'all', sev: 'high', cat: 'Cost shift', title: 'Installer operates permanent systems during temporary use', rx: /(installer of each permanent service|temporary (use|heating|cooling|hvac)[^.]{0,140}(installer|operat))/i, impact: 'You run temporary conditioning — labor, filters, protection.', act: 'price' },
    { id: 'startup', lens: 'all', sev: 'med', cat: 'Cost shift', title: 'Repeat start-up before Substantial Completion', rx: /start[- ]?up[^.]{0,140}(prior to|before|one month)[^.]{0,30}substantial completion/i, impact: 'A second factory start-up per unit.', act: 'price' },
    { id: 'sampling', lens: 'all', sev: 'high', cat: 'Testing', title: '100% functional-test sampling', rx: /100\s*(%|percent)[^.]{0,80}(sampl|functional|tested)/i, impact: 'Staffing at the end of the job; failures redo reports.', act: 'note' },
    { id: 'clock', lens: 'all', sev: 'med', cat: 'Cx clock', title: 'Deficiency turnaround clock', rx: /within (one|two|three|five|\d+|\(\d+\))\s*(\(\d+\)\s*)?(work(ing)?\s*)?days?[^.]{0,100}(deficienc|correct|resolv|acknowledg)/i, impact: 'Closeout crew availability.', act: 'note' },
    { id: 'warr', lens: 'all', sev: 'med', cat: 'Warranty', title: 'Extended warranty term', rx: /warrant\w*[^.]{0,80}\b(two|three|five|ten|fifteen|twenty|\d{1,2})[- ]?(\(\d+\)\s*)?[- ]?years?\b/i, impact: 'Confirm the manufacturer passes it through or qualify.', act: 'clarify' },
    { id: 'anchors', lens: 'all', sev: 'med', cat: 'Means & methods', title: 'Powder-actuated / adhesive anchors restricted', rx: /(powder[- ]actuated|adhesive anchors?)[^.]{0,60}(not|prohibit)/i, impact: 'Hanger labor goes up.', act: 'price' },
    { id: 'lds', lens: 'all', sev: 'high', cat: 'Commercial', title: 'Liquidated damages', rx: /liquidated damages/i, impact: 'Schedule exposure — confirm amount and flow-down.', act: 'clarify' },
    { id: 'retain', lens: 'all', sev: 'med', cat: 'Commercial', title: 'Retainage terms', rx: /retainage/i, impact: 'Cash-flow terms.', act: 'note' },
    { id: 'leed', lens: 'all', sev: 'med', cat: 'LEED', title: 'LEED documentation / IAQ requirements', rx: /(product data reporting form|IAQ (air )?test|indoor air quality[^.]{0,60}(test|photo))/i, impact: 'Admin hours plus corrective-action exposure.', act: 'price' },
  ];

  /* ---------------- pdf.js ---------------- */
  let pdfReady = null;
  function loadPdfJs() {
    if (window.pdfjsLib) return Promise.resolve();
    if (pdfReady) return pdfReady;
    pdfReady = new Promise((res, rej) => {
      const s = document.createElement('script');
      s.src = PDFJS + 'pdf.min.js';
      s.onload = () => { window.pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS + 'pdf.worker.min.js'; res(); };
      s.onerror = () => rej(new Error('Could not load the PDF reader'));
      document.head.appendChild(s);
    });
    return pdfReady;
  }
  async function extract(file, onProgress) {
    await loadPdfJs();
    const buf = await file.arrayBuffer();
    const pdf = await window.pdfjsLib.getDocument({ data: buf }).promise;
    const N = pdf.numPages, pages = new Array(N);
    let next = 1, done = 0;
    async function worker() {
      while (next <= N) {
        const i = next++;
        const page = await pdf.getPage(i);
        const tc = await page.getTextContent();
        pages[i - 1] = tc.items.map(it => it.str + (it.hasEOL ? '\n' : ' ')).join('');
        page.cleanup();
        done++;
        if (done % 10 === 0 || done === N) onProgress && onProgress(done, N);
      }
    }
    await Promise.all(Array.from({ length: 6 }, worker));
    pdf.destroy();
    return pages;
  }

  /* ---------------- section map from page headers ---------------- */
  /* "23 3000 - 1 of 30", "23 05   00 - 1 of 31", "23 7   313 - 1 of 16", "40 05 03.21 - 1 of 9" */
  const ID_RX = /((?:\d\s{0,4}){5}\d)(?:\s{0,3}\.\s{0,3}(\d{2}))?\s*[-–]\s*\d+\s*of\s*\d+/;
  const SEC_RX = /SECTION\s+(\d{2})\s{0,4}(\d{2})\s{0,4}(\d{2})(?:\s{0,3}\.\s{0,3}(\d{2}))?/;
  const fmtId = m => `${m[1]} ${m[2]}${m[3]}` + (m[4] ? '.' + m[4] : '');
  const fmtHead = m => { const d = m[1].replace(/\s/g, ''); return d.slice(0, 2) + ' ' + d.slice(2) + (m[2] ? '.' + m[2] : ''); };
  const titleCase = t => t.toLowerCase().replace(/\b([a-z])/g, c => c.toUpperCase()).replace(/\b(And|Of|For|The|To|In|With|Or)\b/g, w => w.toLowerCase()).replace(/^./, c => c.toUpperCase()).replace(/\bHvac\b/g, 'HVAC').replace(/\bLeed\b/g, 'LEED');
  function parseHeader(text) {
    const head = text.slice(0, 900);
    let m = head.match(ID_RX), bodyFrom = 0, title = '';
    if (m) {
      bodyFrom = m.index + m[0].length;
      const before = head.slice(0, m.index).split('\n').map(s => s.trim()).filter(s => s && /[A-Z]{3}/.test(s) && s === s.toUpperCase() && !/^\d/.test(s));
      title = before.length ? before[before.length - 1] : '';
    } else {
      m = text.slice(0, 1500).match(SEC_RX);
    }
    const im = head.match(/Issue\s*[-–]?\s*(?:No\.?\s*)?(\d)\s*(\d)/i);
    const dm = head.match(/(20\d\d)[.\/-](\d{2})[.\/-](\d{2})/) || head.match(/(\d{2})\s*\/\s*(\d{2})\s*\/\s*(20\d\d)/);
    let date = '';
    if (dm) date = dm[1].length === 4 ? `${dm[1]}-${dm[2]}-${dm[3]}` : `${dm[3]}-${dm[1]}-${dm[2]}`;
    let id = null;
    if (m) id = bodyFrom ? fmtHead(m) : fmtId(m);
    if (!title) { const st = text.slice(0, 1500).match(/SECTION\s+[\d\s.]{6,16}\s*[-–—]\s*([A-Z][A-Z0-9 ,&\/()'.-]{3,90}?)\s*(?:\n|PART\s+1)/); if (st) title = st[1].trim(); }
    return { id, title, issue: im ? +(im[1] + im[2]) : null, date, body: text.slice(bodyFrom) };
  }

  function buildSections(pages) {
    const secs = [], pageSec = [], bodies = [];
    let cur = null;
    pages.forEach((t, i) => {
      const h = parseHeader(t || '');
      bodies.push(h.body);
      if (h.id && (!cur || cur.id !== h.id)) {
        cur = { id: h.id, title: h.title ? titleCase(h.title.replace(/\s+/g, ' ').trim()) : '', start: i + 1, end: i + 1, issue: h.issue, date: h.date, div: h.id.slice(0, 2) };
        secs.push(cur);
      } else if (!cur) {
        cur = { id: '00 0000', title: 'Front matter', start: i + 1, end: i + 1, issue: h.issue, date: h.date, div: '00' };
        secs.push(cur);
      } else {
        cur.end = i + 1;
        if (!cur.title && h.title) cur.title = titleCase(h.title);
        if (cur.issue == null && h.issue != null) cur.issue = h.issue;
      }
      pageSec.push(cur.id);
    });
    /* merge duplicates (same id split by a stray page) */
    const seen = {};
    const out = [];
    secs.forEach(s => {
      if (seen[s.id] && seen[s.id].end >= s.start - 2) { seen[s.id].end = s.end; return; }
      seen[s.id] = s; out.push(s);
    });
    out.forEach(s => { s.pages = s.end - s.start + 1; if (!s.title) s.title = DIV_NAMES[s.div] || 'Section'; });
    return { sections: out, pageSec, bodies };
  }

  /* ---------------- findings ---------------- */
  const norm = s => s.replace(/­/g, '').replace(/\s+/g, ' ');
  function sentenceAt(t, idx) {
    let a = Math.max(0, t.lastIndexOf('. ', idx) + 2), b = t.indexOf('. ', idx);
    if (idx - a > 220) a = idx - 160;
    if (b < 0 || b - idx > 240) b = idx + 200;
    return t.slice(a, b + 1).trim();
  }
  const scanDiv = d => YOURS.includes(d) || HOOKS.includes(d);

  function runRules(pages, pageSec, secById) {
    const hits = {};
    pages.forEach((raw, i) => {
      const sec = pageSec[i], s = secById[sec];
      if (!s || !scanDiv(s.div)) return;
      const t = norm(raw || '');
      RULES.forEach(r => {
        const ok = r.lens === 'all' || s.div === '01' ||
          ((r.lens === 'sm' || r.lens === 'hvac') && ['23', '25', '26'].includes(s.div)) ||
          (r.lens === 'plumb' && ['22', '21', '40'].includes(s.div));
        if (!ok) return;
        const m = t.match(r.rx); if (!m) return;
        const k = r.id + '|' + sec;
        if (hits[k]) { hits[k].count++; return; }
        hits[k] = { rule: r, sec, page: i + 1, count: 1, says: sentenceAt(t, m.index) };
      });
    });
    let n = 0;
    return Object.values(hits).map(h => {
      const sl = lensOf(h.sec);
      return { id: 'R' + String(++n).padStart(3, '0'), rule: h.rule.id, sec: h.sec, page: h.page, para: '', sev: h.rule.sev, cat: h.rule.cat,
        title: h.rule.title, says: h.says, impact: h.rule.impact + (h.count > 1 ? ` Appears on ${h.count} pages of this section.` : ''),
        act: h.rule.act, amt: 0, basis: '', lens: sl === 'all' ? 'all' : (sl === 'other' ? h.rule.lens : sl) };
    }).sort((a, b) => a.page - b.page);
  }

  /* stale cross-references + unedited template text → RFIs */
  function runChecks(pages, pageSec, secById, sections) {
    const ids = new Set(sections.map(s => s.id)), base = new Set(sections.map(s => s.id.slice(0, 7)));
    const missing = {}, template = {};
    const REF = /Section\s+(\d{2})\s{0,3}(\d{2})\s{0,3}(\d{2})(?:\s{0,2}\.\s{0,2}(\d{2}))?/g;
    const OLD = /Section\s+(1[5-6]\d{3})\b/g;
    const TPL = /(<\s*Insert[^>]{0,60}>?|\[\s*OR\s*\]|\*{3,}\s*\[?\s*OR\s*\]?\s*\*{3,}|\bTBD\b|Retain (?:the )?(?:following|paragraph|subparagraph)[^.]{0,60})/g;
    pages.forEach((raw, i) => {
      const sec = pageSec[i], s = secById[sec];
      if (!s || !(YOURS.includes(s.div) || s.div === '25')) return;
      const t = norm(raw || '');
      let m;
      REF.lastIndex = 0;
      while ((m = REF.exec(t))) {
        const id = fmtId(m);
        if (ids.has(id) || base.has(id.slice(0, 7)) || id.slice(0, 2) === sec.slice(0, 2) && id === sec) continue;
        (missing[id] = missing[id] || []).push({ sec, page: i + 1 });
      }
      OLD.lastIndex = 0;
      while ((m = OLD.exec(t))) (missing['Section ' + m[1] + ' (pre-2004 numbering)'] = missing['Section ' + m[1] + ' (pre-2004 numbering)'] || []).push({ sec, page: i + 1 });
      TPL.lastIndex = 0;
      while ((m = TPL.exec(t))) { const k = sec; (template[k] = template[k] || []).push({ sec, page: i + 1, txt: m[0].slice(0, 60) }); }
    });
    const out = [];
    let n = 0;
    Object.entries(missing).sort((a, b) => b[1].length - a[1].length).slice(0, 30).forEach(([id, refs]) => {
      const uniq = refs.filter((r, i, a) => a.findIndex(x => x.sec === r.sec) === i);
      out.push({ id: 'X' + String(++n).padStart(2, '0'), kind: 'missing', lens: lensOf(uniq[0].sec), sev: refs.length > 2 ? 'high' : 'med',
        title: `${/^\d/.test(id) ? 'Section ' + id : id} is referenced ${refs.length}× but is not in the book`,
        a: { sec: uniq[0].sec, page: uniq[0].page, para: '', says: `Cites ${/^\d/.test(id) ? 'Section ' + id : id}.` },
        b: uniq[1] ? { sec: uniq[1].sec, page: uniq[1].page, para: '', says: `Also cites it${uniq.length > 2 ? ' (+' + (uniq.length - 2) + ' more sections)' : ''}.` } : { sec: '—', page: null, para: '', says: 'No section with this number exists in the issued book.' },
        q: `${/^\d/.test(id) ? 'Section ' + id : id} is referenced (${uniq.map(r => r.sec + ' p.' + r.page).slice(0, 4).join('; ')}) but is not included in the issued specifications. Provide the section or confirm the governing requirement. Bid assumes requirements of the referenced section are not included.`,
        cost: 'Undefined requirement — excluded until issued.' });
    });
    Object.entries(template).slice(0, 25).forEach(([sec, refs]) => {
      const s = secById[sec];
      out.push({ id: 'X' + String(++n).padStart(2, '0'), kind: 'template', lens: lensOf(sec), sev: refs.some(r => /TBD|Insert/i.test(r.txt)) ? 'med' : 'info',
        title: `Unedited template text in ${sec} ${s ? s.title : ''} (${refs.length}×)`,
        a: { sec, page: refs[0].page, para: '', says: `"${refs[0].txt}"` },
        b: refs[1] ? { sec, page: refs[1].page, para: '', says: `"${refs[1].txt}"` } : { sec: '—', page: null, para: '', says: 'Placeholder or bracketed option never resolved.' },
        q: `Section ${sec} contains unresolved template text (${refs.slice(0, 3).map(r => '"' + r.txt + '" p.' + r.page).join('; ')}). Confirm the intended requirement. Bid is based on the least-cost reasonable interpretation.`,
        cost: 'Open option in the contract documents.' });
    });
    return out;
  }

  /* responsibility statements */
  function runMatrix(pages, pageSec, secById) {
    const RX = /[^.]{0,140}\b(furnished|provided|installed|wired|connected|performed|engaged)\s+(and installed\s+)?(by|under)\s+(Division|Section)\s+\d{2}[^.]{0,120}\./gi;
    const rows = [], seen = new Set();
    pages.forEach((raw, i) => {
      const sec = pageSec[i], s = secById[sec];
      if (!s || !(YOURS.includes(s.div) || s.div === '25')) return;
      const t = norm(raw || '');
      let m; RX.lastIndex = 0;
      while ((m = RX.exec(t)) && rows.length < 80) {
        const txt = m[0].trim().replace(/^[^A-Z]*/, '');
        const k = txt.slice(0, 60);
        if (txt.length < 30 || seen.has(k)) continue;
        seen.add(k);
        rows.push({ item: txt.length > 230 ? txt.slice(0, 227) + '…' : txt, lens: lensOf(sec), src: sec, page: i + 1 });
      }
    });
    return rows;
  }

  /* ---------------- sentence diff between two issues ---------------- */
  function sentences(text) {
    return norm(text).split(/(?<=[.;:])\s+(?=[A-Z0-9])/).map(s => s.trim()).filter(s => s.length > 24 && !/\b\d+\s*of\s*\d+\b/.test(s.slice(0, 40)));
  }
  function lcsDiff(a, b) {
    const n = a.length, m = b.length;
    if (n * m > 9e6) { const A = new Set(a), B = new Set(b); return { del: a.filter(x => !B.has(x)), add: b.filter(x => !A.has(x)) }; }
    const L = Array.from({ length: n + 1 }, () => new Uint16Array(m + 1));
    for (let i = n - 1; i >= 0; i--) for (let j = m - 1; j >= 0; j--) L[i][j] = a[i] === b[j] ? L[i + 1][j + 1] + 1 : Math.max(L[i + 1][j], L[i][j + 1]);
    const del = [], add = [], seq = [];
    let i = 0, j = 0;
    while (i < n && j < m) {
      if (a[i] === b[j]) { i++; j++; seq.push(null); }
      else if (L[i + 1][j] >= L[i][j + 1]) { seq.push({ k: 'del', t: a[i++] }); }
      else seq.push({ k: 'add', t: b[j++] });
    }
    while (i < n) seq.push({ k: 'del', t: a[i++] });
    while (j < m) seq.push({ k: 'add', t: b[j++] });
    return { seq: seq.filter(Boolean) };
  }
  function diffBooks(cur, prior, lensSecs) {
    const out = [];
    const secText = (bk, s) => bk.bodies.slice(s.start - 1, s.end).join(' ');
    const pIdx = Object.fromEntries(prior.sections.map(s => [s.id, s]));
    cur.sections.forEach(s => {
      if (!lensSecs(s)) return;
      const ps = pIdx[s.id];
      if (!ps) { out.push({ sec: s.id, from: 0, to: s.issue || 0, isNew: true, lens: lensOf(s.id), changes: [{ para: '', kind: 'add', page: s.start, before: '', after: 'Section added since the prior issue (' + s.pages + ' pages).', amt: 0 }] }); return; }
      const A = sentences(secText(prior, ps)), B = sentences(secText(cur, s));
      if (A.join('|') === B.join('|')) return;
      const r = lcsDiff(A, B);
      const changes = [];
      const seq = r.seq || [...r.del.map(t => ({ k: 'del', t })), ...r.add.map(t => ({ k: 'add', t }))];
      for (let x = 0; x < seq.length && changes.length < 30; x++) {
        const c = seq[x], nx = seq[x + 1];
        if (c.k === 'del' && nx && nx.k === 'add') { changes.push({ kind: 'mod', before: c.t, after: nx.t }); x++; }
        else changes.push({ kind: c.k, before: c.k === 'del' ? c.t : '', after: c.k === 'add' ? c.t : '' });
      }
      changes.forEach(ch => {
        const probe = (ch.after || ch.before).slice(0, 40);
        const bodies = ch.after ? cur.bodies : prior.bodies, sec = ch.after ? s : ps;
        let pg = sec.start;
        for (let p = sec.start; p <= sec.end; p++) if (norm(bodies[p - 1] || '').includes(probe)) { pg = p; break; }
        ch.page = ch.after ? pg : null; ch.priorPage = ch.after ? null : pg; ch.para = ''; ch.amt = 0;
      });
      if (changes.length) out.push({ sec: s.id, from: ps.issue || 0, to: s.issue || 0, lens: lensOf(s.id), changes, more: seq.length > 30 });
    });
    return out;
  }

  /* ---------------- analyze a whole book ---------------- */
  async function analyze(file, onProgress) {
    const pages = await extract(file, (d, n) => onProgress && onProgress('Reading page ' + d.toLocaleString() + ' of ' + n.toLocaleString(), d / n * 0.85));
    onProgress && onProgress('Mapping sections and issue stamps', 0.88);
    const { sections, pageSec, bodies } = buildSections(pages);
    const secById = Object.fromEntries(sections.map(s => [s.id, s]));
    onProgress && onProgress('Running spec-trap rules', 0.92);
    const findings = runRules(pages, pageSec, secById);
    onProgress && onProgress('Checking cross-references and template text', 0.96);
    const conflicts = runChecks(pages, pageSec, secById, sections);
    const matrix = runMatrix(pages, pageSec, secById);
    const cover = (pages[0] || '').match(/Issue\s*(?:No\.?)?\s*0?(\d+)/i);
    const issues = sections.map(s => s.issue).filter(x => x != null);
    const bookIssue = cover ? +cover[1] : Math.max(0, ...issues);
    const core = sections.filter(s => ['01', '22', '23'].includes(s.div) && s.issue != null).map(s => s.issue);
    const mode = core.length ? +Object.entries(core.reduce((a, x) => (a[x] = (a[x] || 0) + 1, a), {})).sort((a, b) => b[1] - a[1])[0][0] : bookIssue;
    const hash = (file.name + pages.length).split('').reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7).toString(36);
    const book = {
      key: 'local-' + hash, sample: false, local: true,
      name: file.name.replace(/\.pdf$/i, ''), sub: 'Your spec book · read in this browser · nothing uploaded',
      cm: 'Construction Manager', bookIssue, bookDate: '', pricedIssue: mode, pricedDate: '',
      bid: { gc: '', bidNo: '', due: '' }, issues: {},
      sections, findings, conflicts, diffs: [], matrix, matrixMode: 'extracted', takeoff: null, totalPages: pages.length,
    };
    book.diffs = stampDiffs(book);
    onProgress && onProgress('Done', 1);
    return { book, raw: { sections, bodies } };
  }
  function stampDiffs(book) {
    return book.sections.filter(s => s.id !== '00 0000' && s.issue != null && s.issue > book.pricedIssue && (YOURS.includes(s.div) || HOOKS.includes(s.div)))
      .map(s => ({ sec: s.id, from: book.pricedIssue, to: s.issue, lens: lensOf(s.id), stampOnly: true, changes: [] }));
  }

  /* ---------------- shared helpers for the hub + RFI pages ---------------- */
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} },
    sget(k, d) { try { const v = sessionStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    sset(k, v) { try { sessionStorage.setItem(k, JSON.stringify(v)); } catch (e) {} },
  };
  function activeBook() {
    if (store.sget('msm-spec-active', 'sample') === 'local') { const b = store.sget('msm-spec-local', null); if (b) return b; }
    return window.SPECBOOK;
  }
  function decisions(book) { return store.get('msm-spec-dec-' + book.key, {}); }
  function saveDecisions(book, d) { store.set('msm-spec-dec-' + book.key, d); }
  function decOf(book, f, D) { D = D || decisions(book); const d = D[f.id] || {}; return { act: d.act || f.act, amt: d.amt != null ? d.amt : (f.amt || 0) }; }
  function secTitle(book, id) { const s = book.sections.find(x => x.id === id); return s ? s.title : ''; }
  const cite = (sec, para, page) => `${sec}${para ? ' ¶' + para : ''}${page ? ' · p.' + Number(page).toLocaleString() : ''}`;
  function rfiNo(n) { return 'RFI-MSM-' + String(n).padStart(3, '0'); }
  function rfiText(book, c, n) {
    const refs = ['a', 'b', 'c'].map(k => c[k]).filter(x => x && x.sec && x.sec !== '—').map(x => cite(x.sec, x.para, x.page)).join('; ');
    const assume = (c.q.match(/(Bid (assumes|excludes|includes|is based)[^.]*\.)/) || [])[1] || '';
    const q = assume ? c.q.replace(assume, '').trim() : c.q;
    const today = new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
    return [
      `REQUEST FOR INFORMATION  ${rfiNo(n)}`,
      `To: ${book.cm || 'Construction Manager'} (route via CM per Section 01 3100)`,
      `From: McCorvey Sheet Metal Works — Preconstruction`,
      `Project: ${book.name}${book.bid && book.bid.bidNo ? '   Bid: ' + book.bid.bidNo : ''}`,
      `Date: ${today}`,
      `Subject: ${c.title}`,
      `References: ${refs}`,
      ``,
      `Question: ${q}`,
      assume ? `Bid assumption pending response: ${assume}` : '',
      `Impact: ${c.cost || 'To be determined.'} McCorvey reserves the right to submit cost and schedule impact within the notice period of Section 01 3100.`,
    ].filter(x => x !== '').join('\n');
  }

  window.SpecEngine = { analyze, extract, buildSections, diffBooks, stampDiffs, lensOf, inLens, LENSES, DIV_NAMES, YOURS, HOOKS, RULES,
    store, activeBook, decisions, saveDecisions, decOf, secTitle, cite, rfiNo, rfiText };
})();
