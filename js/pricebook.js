/* =====================================================================
   PRICEBOOK — demo MSM Unit Price Book. Rates are illustrative, not
   McCorvey's: swap this file for their real price book and every spec
   adder reprices. Unit cost = material/sub $ + labor hours x crew rate.
   Quantities for the sample book come from its base takeoff (specbook.js)
   or the counts printed in the book itself.
   ===================================================================== */
(function () {
  const RATES = {
    field: { label: 'Field labor (blended journeyman)', rate: 94.50 },
    shop: { label: 'Shop labor (fabrication)', rate: 72.00 },
    pm: { label: 'PM / superintendent', rate: 145.00 },
    none: { label: 'Material, sub or fee only', rate: 0 },
  };

  /* code, item, unit, material/sub $ per unit, labor hrs per unit, crew */
  const ITEMS = [
    ['ENG-SEIS', 'Seismic restraint design, PE-sealed calcs + submittals', 'bldg', 26000, 0, 'none'],
    ['FW-HOT', 'Fire watch + hot-work permit, per welding shift', 'shift', 18, 2.25, 'field'],
    ['PM-MTG', 'PM / super attendance at a standing meeting', 'mtg', 0, 1.75, 'pm'],
    ['TMP-OPS', 'Temporary HVAC operation: tech time + filters', 'wk', 1850, 60, 'field'],
    ['SU-2ND', 'Second factory start-up', 'unit', 1450, 0, 'none'],
    ['FLT-MERV8', 'MERV 8 construction filter set, 3 changes', 'opening', 21.5, 0.12, 'field'],
    ['TST-SMK', 'Smoke-control duct leak test + inspector standby', 'shaft', 650, 20, 'field'],
    ['CX-RETEST', 'Commissioning retest allowance', 'system', 420, 3.5, 'field'],
    ['LEED-DOC', 'LEED documentation + IAQ duct protection', '10k SF', 20, 0.83, 'pm'],
    ['PL-CI-CD', 'Cast iron condensate drain, delta over PVC', 'LF', 26.8, 0.08, 'field'],
    ['PL-SEIS', 'Plumbing seismic brace, engineered', 'brace', 48, 0.6, 'field'],
    ['PL-STL', 'Supplemental steel + mechanical anchor, plumbing', 'ea', 34, 0.55, 'field'],
    ['WTY-CMP', 'Extended compressor warranty to 2 years', 'ea', 4500, 0, 'none'],
    ['TST-LEG', 'Legionella swab + lab, incl. retest', 'fixture', 145, 0.35, 'field'],
    ['DUCT-10WG', '10 in. wg construction upgrade: gauge + reinforcement', 'lb', 0.42, 0.0055, 'shop'],
    ['SEAL-A', 'Seal Class A premium on low-pressure duct', 'lb', 0.04, 0.0018, 'field'],
    ['HNG-SUPP', 'Supplemental angle at hanger attachment (no deck hangers)', 'point', 41.5, 0.94, 'field'],
    ['HNG-TRAP', 'Angle trapeze + sway bracing at drops over 36 in.', 'drop', 96, 1.6, 'field'],
    ['TST-LEAK', 'Duct leakage test section incl. rig + retest', 'section', 140, 5.5, 'field'],
    ['FTG-CONIC', 'Conical / bellmouth takeoff in lieu of spin-in', 'takeoff', 24, 0.14, 'field'],
    ['SEAM-PGH', 'Pittsburgh seam in lieu of snaplock', 'lb', 0, 0.00085, 'shop'],
    ['AD-FACT', 'Factory double-wall access door premium', 'door', 74, 0.2, 'field'],
    ['FLX-HARD', 'Hard duct extension in lieu of flex', 'diffuser', 18, 0.25, 'field'],
    ['INS-OUT', 'Outdoor duct insulation: 3 in. board + metal-clad jacket (sub)', 'SF', 6.05, 0, 'none'],
    ['INS-PROD', 'Production-area OA / return / relief insulation (sub)', 'SF', 3.35, 0, 'none'],
    ['VFD-HARM', 'Harmonic filter to 3% THD, per fan drive', 'drive', 1850, 2, 'field'],
    ['PAD-EQ', 'Equipment housekeeping pad incl. pad drawings', 'pad', 640, 6, 'field'],
    ['CURB-DB', 'Cantilever curb + screen frame, design-build', 'RTU', 5650, 14, 'field'],
    ['CD-INST', 'Install Div 25 control damper / airflow station', 'ea', 22, 1.65, 'field'],
    ['REF-RECHK', 'First-summer refrigerant recheck + recharge', 'system', 45, 2, 'field'],
    ['ENG-DD', 'Delegated design by our PE: sealed calcs + submittal cycle', 'package', 9500, 0, 'none'],
    ['ANC-MECH', 'Mechanical anchor in lieu of powder-actuated / adhesive', 'anchor', 3.1, 0.12, 'field'],
  ].map(([code, item, unit, mat, hrs, crew]) => {
    const unitCost = Math.round((mat + hrs * RATES[crew].rate) * 10000) / 10000;
    return { code, item, unit, mat, hrs, crew, unitCost };
  });
  const BY = Object.fromEntries(ITEMS.map(i => [i.code, i]));

  /* sample-book finding -> price book line + quantity and where it came from */
  const MAP = {
    F01: ['ENG-SEIS', 3, 'Buildings A, B and C (01 1000)'],
    F04: ['FW-HOT', 280, 'Welded scope: 1,400 LF stainless + grease duct at ~5 LF per shift'],
    F08: ['PM-MTG', 186, '3 standing meetings x 62-week schedule (01 3100)'],
    F14: ['TMP-OPS', 16, 'Weeks from unit setting to substantial completion'],
    F15: ['SU-2ND', 64, 'Units on the equipment schedules'],
    F16: ['FLT-MERV8', 850, 'Return openings from takeoff (~43% of 1,960 GRDs)'],
    F18: ['TST-SMK', 9, 'Stair-pressurization shafts, Building C'],
    F20: ['CX-RETEST', 46, 'Air systems, one retest each'],
    F22: ['LEED-DOC', 129, '1,286,000 SF across three buildings'],
    P01: ['PL-CI-CD', 3100, 'Condensate drain LF from plumbing takeoff'],
    P05: ['PL-SEIS', 520, 'Brace points on compressed-air and domestic mains'],
    P06: ['PL-STL', 440, 'Plumbing hanger points needing supplemental steel'],
    P09: ['WTY-CMP', 2, 'Compressors scheduled in 22 1519'],
    P10: ['TST-LEG', 101, '10% of ~1,010 faucets'],
    H01: ['DUCT-10WG', 201000, 'AHU discharge to first fire/smoke damper: ~17% of 1,180,000 lbs rect duct'],
    H02: ['SEAL-A', 1000000, 'Low-pressure duct lbs from takeoff'],
    H03: ['HNG-SUPP', 7200, '1,180,000 lbs rect duct / 164 lbs per attachment point'],
    H04: ['HNG-TRAP', 1160, 'Building C high-bay drops over 36 in.'],
    H05: ['TST-LEAK', 224, 'Med/high-pressure sections + 2 LP per system x 46 systems + shafts'],
    H06: ['FTG-CONIC', 2400, 'Branch takeoffs from takeoff'],
    H07: ['SEAM-PGH', 1180000, 'Rectangular duct lbs from takeoff'],
    H09: ['AD-FACT', 640, 'Access doors from takeoff'],
    H10: ['FLX-HARD', 820, 'Diffusers where 72 in. max flex runs short'],
    H14: ['INS-OUT', 38000, 'Outdoor duct surface area'],
    H15: ['INS-PROD', 52500, 'Production-area OA, return and relief duct surface area'],
    H18: ['VFD-HARM', 47, 'Fan drives on VFD schedules'],
    H19: ['PAD-EQ', 35, 'Pads on equipment schedules'],
    H21: ['CURB-DB', 42, 'RTUs on the roof plan'],
    H22: ['CD-INST', 310, 'Control dampers + airflow stations on controls drawings'],
    H23: ['REF-RECHK', 52, 'Refrigerant systems'],
  };

  /* your own book: engine rule -> price book line + what to count. A real spec
     book carries no quantities, so the estimator enters the count from the
     takeoff and the amount computes (qty x unit cost). */
  const RULE_MAP = {
    deck: ['HNG-SUPP', 'Hanger attachment points in the duct takeoff'],
    drops: ['HNG-TRAP', 'Drops longer than the limit in the clause'],
    sealA: ['SEAL-A', 'Low-pressure duct lbs in the takeoff'],
    wg10: ['DUCT-10WG', 'Duct lbs in the high-pressure class'],
    leak: ['TST-LEAK', 'Test sections: med/high-pressure runs + shafts'],
    spin: ['FTG-CONIC', 'Branch takeoffs in the takeoff'],
    snap: ['SEAM-PGH', 'Rectangular duct lbs in the takeoff'],
    door: ['AD-FACT', 'Access doors in the takeoff'],
    flex: ['FLX-HARD', 'Diffusers where the flex limit runs short'],
    outins: ['INS-OUT', 'Outdoor duct surface area, SF'],
    castiron: ['PL-CI-CD', 'Condensate drain LF'],
    legion: ['TST-LEG', 'Fixtures sampled'],
    thd: ['VFD-HARM', 'Fan drives on the VFD schedules'],
    pads: ['PAD-EQ', 'Pads on the equipment schedules'],
    curb: ['CURB-DB', 'Rooftop units on the roof plan'],
    flame: ['FW-HOT', 'Welding shifts (welded duct LF / ~5 LF per shift)'],
    pe: f => /seismic|restraint/i.test(f.title + ' ' + f.says) ? ['ENG-SEIS', 'Buildings needing restraint design'] : ['ENG-DD', 'Delegated-design packages'],
    perdiem: ['CX-RETEST', 'Systems carrying one retest'],
    temp: ['TMP-OPS', 'Weeks of temporary operation'],
    startup: ['SU-2ND', 'Units started up twice'],
    anchors: ['ANC-MECH', 'Anchors at hanger and support points'],
    leed: ['LEED-DOC', 'Building area in 10,000 SF (1.2M SF = 120)'],
  };
  /* the price book line behind a finding: fixed qty on the sample, typed qty on your own book */
  function lineFor(f) {
    if (!f) return null;
    if (f.pb) return BY[f.pb.code] ? { it: BY[f.pb.code], qty: f.pb.qty, hint: f.pb.qtyNote, fixed: true } : null;
    let m = f.rule && RULE_MAP[f.rule];
    if (typeof m === 'function') m = m(f);
    return m && BY[m[0]] ? { it: BY[m[0]], qty: null, hint: m[1], fixed: false } : null;
  }

  const NAME = 'MSM Unit Price Book', EDITION = '2026 Q4 · demo rates';
  window.PRICEBOOK = { NAME, EDITION, RATES, ITEMS, BY, MAP, RULE_MAP, lineFor };

  /* price the sample book: amount = qty x unit cost, with the trail kept on the finding */
  const B = window.SPECBOOK;
  if (!B) return;
  const was = {};
  B.findings.forEach(f => {
    const m = MAP[f.id]; if (!m) return;
    const it = BY[m[0]];
    was[f.id] = f.amt;
    f.pb = { code: it.code, qty: m[1], qtyNote: m[2], unit: it.unit, unitCost: it.unitCost };
    f.amt = Math.round(m[1] * it.unitCost);
  });
  /* a change that is the whole finding carries the same price */
  B.diffs.forEach(d => d.changes.forEach(c => {
    const f = c.find && B.findings.find(x => x.id === c.find);
    if (f && f.pb && c.amt === was[f.id]) c.amt = f.amt;
  }));
})();
