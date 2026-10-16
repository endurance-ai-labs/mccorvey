/* =====================================================================
   BUILDUPS — illustrative estimate build-ups for spec findings.
   Every number here is a DEMO assumption, not McCorvey's rates or
   quantities: an assumed project profile scaled from building area,
   demo crew rates and demo unit costs. The point is to show the depth of
   reasoning behind a recommended adder (drivers -> hours -> dollars ->
   contingency -> sanity checks), keyed by spec-engine rule id.
   Output is DIRECT COST to McCorvey; markup is applied on the bid sheet.
   ===================================================================== */
(function () {
  /* ---------- assumed project profile (illustrative) ---------- */
  const profile = { sf: 1290000, src: 'assumed' };
  const Q = () => {
    const sf = profile.sf, duct = sf * 0.915;
    return {
      sf, duct, lp: duct * 0.83, mh: duct * 0.17, rect: duct * 0.82,
      hangers: duct / 164, systems: Math.max(4, Math.round(sf / 28000)),
      grds: Math.round(sf / 650), diffusers: Math.round(sf / 650 * 0.42),
      returns: Math.round(sf / 650 * 0.43), doors: Math.round(sf / 2000), vfds: Math.max(2, Math.round(sf / 27500)),
      rtus: Math.max(1, Math.round(sf / 30700)), ahus: Math.max(1, Math.round(sf / 64500)), units: Math.max(2, Math.round(sf / 20150)),
      pads: Math.max(2, Math.round(sf / 36900)), condLF: Math.round(sf / 415), fixtures: Math.round(sf / 1280),
      outSF: Math.round(sf * 0.0295), weldLF: Math.round(sf * 0.00109), braze: Math.round(sf / 496),
      weeks: 62, tempWeeks: 16, products: 60, contract: sf * 19.5,
    };
  };

  /* ---------- demo rates (loaded, Houston) ---------- */
  const R = {
    jman: 94.50, foreman: 112.00, shop: 72.00, tech: 98.00, plumber: 96.00, det: 88.00, pm: 145.00, pe: 210.00, fire: 48.00,
    steel: 0.82, angleFt: 4.85, clamp: 7.40, deckFast: 3.10, strutFt: 6.20, rodFt: 2.45, sway: 38.00, scissorWk: 1150, boomWk: 2650,
  };
  const RATE_NOTE = 'Field journeyman $94.50/hr, foreman $112/hr, shop $72/hr, HVAC tech $98/hr, detailer $88/hr, PM $145/hr, PE $210/hr (all loaded, demo).';

  const fmt = n => Math.round(n).toLocaleString();
  const usd = n => (n < 0 ? '−$' : '$') + Math.abs(Math.round(n)).toLocaleString();
  const rate = n => n >= 100 ? '$' + Math.round(n).toLocaleString() : '$' + n.toFixed(n < 1 ? 4 : 2);

  /* line helpers: g = group, d = description, q = qty, u = unit, r = rate, how = derivation */
  const L = (g, d, q, u, r, how) => ({ g, d, q, u, r, how });
  const labor = (d, hrs, r, how) => L('Labor', d, hrs, 'hr', r, how);

  /* ---------- templates, keyed by spec-engine rule id ---------- */
  const T = {
    deck: q => {
      const pts = q.hangers, steel = pts * 0.62, direct = pts - steel;
      const lines = [
        labor('Lay out and coordinate every attachment point in the BIM model', pts * 0.12, R.jman, `${fmt(pts)} points × 0.12 hr`),
        labor('Cut, drill and bolt supplemental L2x2x¼ angle between joists', steel * 0.78, R.jman, `${fmt(steel)} points needing steel × 0.78 hr`),
        labor('Direct joist attachments: beam clamp + rod (extra over a deck fastener)', direct * 0.07, R.jman, `${fmt(direct)} points × 0.07 hr`),
        L('Material', 'Galvanized L2x2x¼ angle, 6 ft average span between joists', steel * 6, 'ft', R.angleFt, `${fmt(steel)} points × 6 ft`),
        L('Material', 'Beam clamps: 2 per steel point, 1 per direct point', steel * 2 + direct, 'ea', R.clamp, `${fmt(steel)} × 2 + ${fmt(direct)}`),
        L('Credit', 'Deck fasteners the base bid already carried', pts, 'ea', -R.deckFast, `${fmt(pts)} points no longer use one`),
      ];
      return {
        scope: 'No hanger may attach to or hang from metal deck. Every attachment goes to structure, with supplemental steel wherever duct runs between joists.',
        method: 'Count attachment points from duct weight, split them into points that land on a joist and points that need steel, then price layout, install labor, steel and clamps. Credit the deck fasteners already in the base bid, add lift time, supervision and small tools.',
        drivers: [['Duct weight', fmt(q.duct) + ' lbs', '0.915 lbs per SF of building × ' + fmt(q.sf) + ' SF'], ['Attachment points', fmt(pts), 'duct lbs ÷ 164 lbs per point (8 ft spacing, ~20.5 lbs/ft)'], ['Points needing steel', '62%', 'joists at ~5 ft o.c.; points between joists'], ['Lift', '1 scissor lift per 2-worker crew', '']],
        lines, lift: R.scissorWk, crew: 2, cont: 8, contWhy: 'Joist spacing and duct routing are not final until coordination drawings are signed; the share of points needing steel can swing ±10%.',
        changes: ['Actual hanger count from the duct takeoff', 'Joist spacing on the structural drawings', 'Whether the EOR accepts joist bridging as an attachment'],
      };
    },
    drops: q => {
      const n = q.hangers * 0.55 * 0.40, br = n * 0.5;
      return {
        scope: 'Hanger drops over the limit must be structural angle or channel with sway bracing. Rods and straps are not allowed.',
        method: 'Estimate drops over 36 in. from the high-bay share of the building, price a strut trapeze at each and sway bracing at every other one, credit the rod hangers the base bid carried, and add boom-lift time for high-bay work.',
        drivers: [['High-bay share of duct', '55%', 'distribution and light-industrial floor area'], ['Drops over 36 in. in high bay', '40%', 'typical for 30–40 ft clear height'], ['Trapezes', fmt(n), `${fmt(q.hangers)} points × 55% × 40%`], ['Sway-braced trapezes', fmt(br), 'every other trapeze, 2-way']],
        lines: [
          labor('Fabricate and hang strut trapeze at each long drop', n * 1.15, R.jman, `${fmt(n)} × 1.15 hr`),
          labor('Install 2-way sway bracing', br * 0.55, R.jman, `${fmt(br)} × 0.55 hr`),
          L('Material', 'Strut channel P1000, 4 ft per trapeze', n * 4, 'ft', R.strutFt, `${fmt(n)} × 4 ft`),
          L('Material', '½ in. threaded rod, 2 legs × 9 ft average drop', n * 18, 'ft', R.rodFt, `${fmt(n)} × 18 ft`),
          L('Material', 'Sway brace kits', br, 'ea', R.sway, ''),
          L('Credit', 'Rod/strap hangers the base bid already carried', n, 'ea', -16, ''),
        ],
        lift: R.boomWk, crew: 2, cont: 10, contWhy: 'Clear heights and the exact share of drops over 36 in. come from sections and the coordination model.',
        changes: ['Clear heights by area from the architectural sections', 'Duct elevations once coordination is signed', 'Whether a bracing manufacturer’s system is accepted'],
      };
    },
    sealA: q => {
      const base = q.lp / 42, prem = base * 0.032, rework = prem * 0.015;
      return {
        scope: 'All duct, including low-pressure systems, sealed to Seal Class A: every transverse joint, longitudinal seam and wall penetration.',
        method: 'Take base field labor on low-pressure duct, apply the Class A sealing premium over code-minimum Class C, add shop sealing of longitudinal seams, sealant, the pre-test sealing review the book requires, and a rework allowance.',
        drivers: [['Low-pressure duct', fmt(q.lp) + ' lbs', '83% of duct weight'], ['Base field labor on it', fmt(base) + ' hr', 'lbs ÷ 42 lbs per field hour'], ['Class A premium', '3.2%', 'of field labor on low-pressure duct'], ['Air systems', fmt(q.systems), '1 per ~28,000 SF']],
        lines: [
          labor('Field-seal all joints, seams and penetrations to Class A (premium over Class C)', prem, R.jman, `${fmt(base)} hr × 3.2%`),
          L('Labor', 'Shop-seal longitudinal seams before delivery', q.lp * 0.00045, 'hr', R.shop, `${fmt(q.lp)} lbs × 0.00045 hr`),
          L('Material', 'Low-VOC water-based duct sealant', q.lp / 1150, 'gal', 27.50, `${fmt(q.lp)} lbs ÷ 1,150 lbs per gallon`),
          L('Material', 'Mesh tape at problem joints', q.systems * 4, 'roll', 36, `${q.systems} systems × 4 rolls`),
          labor('Pre-test sealing review with the CM and CxA', q.systems * 3, R.foreman, `${q.systems} systems × 3 hr`),
          labor('Rework allowance after review', rework, R.jman, '1.5% of sealing labor'),
        ],
        cont: 6, contWhy: 'Reviewer expectations on “sealed” vary; first-system review sets the standard for the rest.',
        changes: ['Whether TDC/TDF flange gaskets count as sealed joints', 'Leakage test results on the first systems', 'Share of duct that is round spiral (fewer seams)'],
      };
    },
    wg10: q => {
      const add = q.mh * 0.28, reinf = q.mh * 0.045, joints = q.mh / 100;
      return {
        scope: 'Duct from each air handler to its first fire/smoke damper is built to a high-pressure class: heavier gauge, tighter reinforcement, full leak testing.',
        method: 'Take the duct weight on AHU discharges, add the extra steel from the gauge upgrade and the added reinforcement, price shop and field labor for the heavier duct, and heavier flange corners and gaskets.',
        drivers: [['Duct on AHU discharges', fmt(q.mh) + ' lbs', '17% of duct weight'], ['Added steel from gauge upgrade', '+28%', '2–4 in. class → 10 in. class, SMACNA tables'], ['Added reinforcement', fmt(reinf) + ' lbs', '4.5% of affected weight'], ['Transverse joints', fmt(joints), 'lbs ÷ 100 lbs per joint']],
        lines: [
          L('Material', 'Added galvanized steel from the heavier gauge', add, 'lbs', R.steel, `${fmt(q.mh)} × 28%`),
          L('Material', 'Added reinforcement angle / tie rods', reinf, 'lbs', 1.10, ''),
          L('Labor', 'Shop: fabricate added weight and reinforcement', add / 75 + reinf / 30, 'hr', R.shop, `${fmt(add)} ÷ 75 + ${fmt(reinf)} ÷ 30 lbs/hr`),
          labor('Field: heavier handling and joint make-up (+12%)', q.mh / 42 * 0.12, R.jman, `${fmt(q.mh)} ÷ 42 lbs/hr × 12%`),
          L('Material', 'Heavier flange corners and gaskets', joints, 'joint', 14, ''),
        ],
        cont: 7, contWhy: 'The extent of high-pressure duct depends on where the fire/smoke dampers land after coordination.',
        changes: ['Damper locations on the coordination model', 'Whether round spiral can replace rectangular on mains', 'Steel price at buyout'],
      };
    },
    leak: q => {
      const secs = Math.round(q.systems * 2 + q.mh / 1500 + q.systems * 0.5), fail = Math.round(secs * 0.12);
      return {
        scope: 'Leak-test all medium- and high-pressure duct, two low-pressure sections per air system and all shaft duct, before insulation, with witnesses.',
        method: 'Count test sections, price a 2-person test crew per section, rig rental, witness scheduling and reports, then add remediation and retest for an expected failure rate.',
        drivers: [['Test sections', fmt(secs), `${q.systems} systems × 2 LP + ~${fmt(q.mh / 1500)} MP/HP (≈75 ft each) + shafts`], ['Expected first-test failures', '12%', fmt(fail) + ' sections'], ['Crew', '2 workers × 4.5 hr per section', 'set up, pressurize, record, tear down']],
        lines: [
          labor('Test crew: 2 workers × 4.5 hr per section', secs * 9, R.jman, `${fmt(secs)} sections × 9 hr`),
          labor('Seal remediation on failed sections', fail * 6, R.jman, `${fmt(fail)} × 6 hr`),
          labor('Retest failed sections', fail * 9, R.jman, `${fmt(fail)} × 9 hr`),
          L('Equipment', 'Leak-test rig rental (orifice tube + blower)', Math.ceil(secs / 12), 'wk', 650, `${fmt(secs)} sections ÷ 12 per week`),
          labor('Witness scheduling with TAB and CxA', secs * 0.5, R.pm, `${fmt(secs)} × 0.5 hr`),
          labor('Test reports', secs * 0.4, R.det, `${fmt(secs)} × 0.4 hr`),
        ],
        cont: 10, contWhy: 'Witness availability drives idle time; failure rates on Class A duct run 5–20%.',
        changes: ['Number of air systems on the schedules', 'Whether TAB witnesses in batches', 'Shaft count by building'],
      };
    },
    spin: q => {
      const n = Math.round(q.grds * 1.2);
      return {
        scope: 'Spin-in, cinch-lock and dovetail fittings are prohibited at branch takeoffs.',
        method: 'Count branch takeoffs from air devices, price the conical or bellmouth fitting over a spin-in, the integral damper on those that need one, and the extra field time.',
        drivers: [['Branch takeoffs', fmt(n), `${fmt(q.grds)} air devices × 1.2`], ['With integral damper', '40%', '']],
        lines: [
          L('Material', 'Conical / bellmouth takeoff over spin-in (price difference)', n, 'ea', 11.60, ''),
          L('Material', 'Integral damper on 40% of takeoffs (difference)', n * 0.4, 'ea', 8.50, ''),
          labor('Field: extra fit-up time', n * 0.10, R.jman, `${fmt(n)} × 0.10 hr`),
        ],
        cont: 5, contWhy: 'Takeoff count firms up with the duct takeoff.', changes: ['Takeoff count from the duct takeoff', 'Transfer-duct exceptions in the clause'],
      };
    },
    snap: q => ({
      scope: 'Button-punch snaplock and pocket-lock seams are not permitted; Pittsburgh seams only.',
      method: 'Price the shop labor difference to form and close Pittsburgh seams on rectangular duct, machine changeovers, the extra seam allowance in steel and field hammer-closing.',
      drivers: [['Rectangular duct', fmt(q.rect) + ' lbs', '82% of duct weight'], ['Shop seam delta', '0.00085 hr per lb', 'Pittsburgh vs snaplock']],
      lines: [
        L('Labor', 'Shop: Pittsburgh seam forming and closing (difference)', q.rect * 0.00085, 'hr', R.shop, `${fmt(q.rect)} lbs × 0.00085 hr`),
        L('Labor', 'Shop: coil-line and Pittsburgh machine changeovers', 48, 'hr', R.shop, '6 machine-days × 8 hr'),
        L('Material', 'Extra seam allowance (+1.2% steel)', q.rect * 0.012, 'lbs', R.steel, ''),
        labor('Field: hammer-closing Pittsburgh seams', q.rect / 42 * 0.04, R.jman, '4% of field labor on rectangular duct'),
      ],
      cont: 4, contWhy: 'Shop process change, well understood.', changes: ['Share of round spiral duct', 'Drive-slip exceptions in shafts'],
    }),
    door: q => ({
      scope: 'Factory double-wall access doors only; shop- or field-built doors are not permitted.',
      method: 'Count access doors from dampers and equipment, price the factory door over a shop-built one, extra install time, freight and door schedules.',
      drivers: [['Access doors', fmt(q.doors), '1 per ~2,000 SF (dampers, coils, devices)']],
      lines: [
        L('Material', 'Factory double-wall door 18×18 over shop-built (difference)', q.doors, 'ea', 77, '$118 factory − $41 shop-built'),
        labor('Field: cut-in and frame fastening (+0.15 hr)', q.doors * 0.15, R.jman, ''),
        L('Material', 'Freight and handling (4%)', q.doors * 77 * 0.04, '$', 1, ''),
        labor('Door schedule and tags in shop drawings', q.doors * 0.05, R.det, ''),
      ],
      cont: 5, contWhy: 'Door count firms up with damper count.', changes: ['Fire/smoke damper count', 'Access door sizes over 24 in.'],
    }),
    flex: q => {
      const a = Math.round(q.diffusers * 0.35);
      return {
        scope: 'Flexible duct limited to a short maximum length and not allowed on return or exhaust; the rest becomes hard duct.',
        method: 'Find diffusers where the layout would exceed the flex limit, price extra hard round duct and an adjustable elbow at each, and credit the flex no longer used.',
        drivers: [['Supply diffusers', fmt(q.diffusers), '42% of air devices'], ['Over the flex limit', '35%', fmt(a) + ' diffusers'], ['Extra hard duct', '5 ft each', '8 in. round']],
        lines: [
          L('Material', '8 in. round hard duct, fabricated', a * 5, 'ft', 9.40, `${fmt(a)} × 5 ft`),
          L('Material', 'Adjustable elbows', a, 'ea', 6.80, ''),
          labor('Install hard duct and elbow', a * 0.35, R.jman, `${fmt(a)} × 0.35 hr`),
          L('Credit', 'Flex duct no longer used', a * 5, 'ft', -1.10, ''),
        ],
        cont: 6, contWhy: 'Depends on ceiling layout and diffuser locations.', changes: ['Reflected ceiling plans', 'Diffuser neck sizes'],
      };
    },
    outins: q => ({
      scope: 'Outdoor duct insulated with board and a metal-clad weather jacket instead of wrap and mastic.',
      method: 'Take outdoor duct surface area, price the insulation subcontractor’s jacketed system, credit the wrap the base carried, and add seam sealing, rooftop lifts and McCorvey coordination.',
      drivers: [['Outdoor duct surface', fmt(q.outSF) + ' SF', 'rooftop supply and return'], ['Sub price, jacketed', '$6.05/SF', 'demo quote'], ['Base carried', '$2.40/SF', 'exterior wrap + mastic']],
      lines: [
        L('Subcontract', 'Insulation sub: board + metal-clad jacket', q.outSF, 'SF', 6.05, ''),
        L('Credit', 'Exterior wrap and mastic the base already carried', q.outSF, 'SF', -2.40, ''),
        L('Subcontract', 'Jacket seam sealing and banding', q.outSF, 'SF', 0.35, ''),
        L('Equipment', 'Crane / lift days for rooftop work', 6, 'day', 1850, ''),
        labor('McCorvey coordination and roof protection', 60, R.jman, ''),
      ],
      cont: 8, contWhy: 'Jacket material (aluminum vs stainless) and exposure details still to confirm.', changes: ['Jacket material', 'Rooftop duct routing'],
    }),
    castiron: q => ({
      scope: 'Above-ground condensate drain in service-weight cast iron instead of PVC.',
      method: 'Take condensate drain length, price cast iron and couplings over PVC, the heavier install and closer hanger spacing.',
      drivers: [['Condensate drain', fmt(q.condLF) + ' LF', '1 LF per ~415 SF']],
      lines: [
        L('Material', 'Service-weight hubless cast iron over PVC (difference)', q.condLF, 'LF', 23.70, ''),
        L('Material', 'No-hub couplings, 1 per 10 ft', q.condLF / 10, 'ea', 14.50, ''),
        labor('Heavier install (+0.08 hr/ft)', q.condLF * 0.08, R.plumber, ''),
        L('Material', 'Extra hangers at 5 ft spacing', q.condLF / 5 - q.condLF / 8, 'ea', 9.80, ''),
      ],
      cont: 6, contWhy: 'Confirm intent: cast iron on condensate is unusual.', changes: ['RFI answer on condensate material', 'Drain lengths from the plumbing takeoff'],
    }),
    legion: q => {
      const s = Math.round(q.fixtures * 0.10);
      return {
        scope: 'Swab and lab-test a share of faucets and showerheads for Legionella before occupancy; disinfect and retest failures.',
        method: 'Take the sampled fixture count, price lab analysis and sample collection, and add a disinfection and retest allowance for zones that fail.',
        drivers: [['Fixtures', fmt(q.fixtures), '1 per ~1,280 SF'], ['Sampled', fmt(s), '10%']],
        lines: [
          L('Subcontract', 'Accredited lab analysis (culture method)', s, 'sample', 145, ''),
          L('Labor', 'Sample collection and chain of custody', s * 0.35, 'hr', R.plumber, ''),
          L('Subcontract', 'Disinfection of failing zones (allowance)', 2, 'zone', 2800, '15% risk across ~12 zones'),
          L('Subcontract', 'Retest after disinfection', Math.round(s * 0.15), 'sample', 145, ''),
        ],
        cont: 10, contWhy: 'Results are outside McCorvey’s control.', changes: ['Fixture count', 'Water system flushing before test'],
      };
    },
    thd: q => ({
      scope: 'Fan drives limited to a low total harmonic distortion; needs filters or active front ends.',
      method: 'Count fan drives, price passive filters on smaller drives and active front ends on larger ones, coordination with the electrician, and a verification test per motor control center.',
      drivers: [['Fan VFDs', fmt(q.vfds), '1 per ~27,500 SF'], ['Over 50 hp', '20%', '']],
      lines: [
        L('Material', 'Passive harmonic filter, drives up to 50 hp', Math.round(q.vfds * 0.8), 'ea', 1850, ''),
        L('Material', 'Active front end premium, drives over 50 hp', Math.round(q.vfds * 0.2), 'ea', 3900, ''),
        labor('Coordination and mounting support (Div 26 installs)', q.vfds * 2, R.jman, ''),
        L('Subcontract', 'Harmonic verification test, per MCC', 6, 'test', 1650, ''),
      ],
      cont: 8, contWhy: 'Utility point-of-coupling study may change the solution.', changes: ['Drive schedule horsepower', 'Whether the limit is per drive or at the point of common coupling'],
    }),
    pads: q => ({
      scope: 'Mechanical trade provides reinforced concrete housekeeping pads and pad drawings.',
      method: 'Count pads from equipment schedules, price concrete, forming and rebar labor, materials and pad drawings.',
      drivers: [['Equipment pads', fmt(q.pads), 'AHUs, pumps, compressors'], ['Concrete per pad', '0.65 CY', '8×6 ft × 4 in.']],
      lines: [
        L('Subcontract', 'Concrete incl. short-load and pump', q.pads * 0.65, 'CY', 210, ''),
        labor('Form, rebar, dowel, pour, chamfer', q.pads * 6, R.jman, ''),
        L('Material', 'Rebar, dowels and forms', q.pads, 'ea', 95, ''),
        labor('Pad drawings and anchor layout', q.pads * 1.5, R.det, ''),
      ],
      cont: 7, contWhy: 'Pad sizes depend on approved equipment.', changes: ['Approved equipment footprints', 'Seismic anchorage requirements'],
    }),
    curb: q => ({
      scope: 'Cantilever equipment curbs and screen frames designed by the contractor’s engineer for wind, dead and seismic loads.',
      method: 'Price PE design per curb type and submittal cycles, curb and screen fabrication per unit, setting labor and crane picks.',
      drivers: [['Rooftop units', fmt(q.rtus), '1 per ~30,700 SF'], ['Curb/screen types', '6', 'by unit size']],
      lines: [
        L('Engineering', 'PE design per curb/screen type', 6 * 22, 'hr', R.pe, '6 types × 22 hr'),
        L('Engineering', 'Sealed calcs and 2 submittal cycles', 6 * 2 * 6, 'hr', R.pe, ''),
        L('Material', 'Cantilever curb + screen frame, galvanized', q.rtus, 'ea', 4100, ''),
        labor('Set, shim and anchor curb and screen', q.rtus * 14, R.jman, ''),
        L('Equipment', 'Crane picks', Math.ceil(q.rtus / 8), 'day', 3800, '8 units per day'),
      ],
      cont: 10, contWhy: 'Design-build: loads and connection details unknown until the PE designs.', changes: ['Unit weights', 'Roof structure at each curb'],
    }),
    flame: q => {
      const sh = Math.round(q.weldLF / 6 + q.braze / 40);
      return {
        scope: 'No open flame without an owner hot-work permit for each occurrence and a fire watch per NFPA 51B.',
        method: 'Convert field welding and brazing into hot-work shifts, price a fire watch and permit for each, lost productivity waiting on permits, and fire-safety equipment.',
        drivers: [['Field-welded duct', fmt(q.weldLF) + ' LF', 'grease and stainless exhaust'], ['Brazed joints', fmt(q.braze), 'refrigerant piping'], ['Hot-work shifts', fmt(sh), 'LF ÷ 6 per shift + joints ÷ 40 per shift']],
        lines: [
          L('Labor', 'Fire watch per shift (8 hr + 1 hr post-watch)', sh * 9, 'hr', R.fire, `${fmt(sh)} shifts × 9 hr`),
          labor('Owner permit requests, per occurrence', sh * 0.5, R.pm, ''),
          labor('Productivity lost waiting on permits (6%)', sh * 16 * 0.06, R.jman, `${fmt(sh)} shifts × 2 workers × 8 hr × 6%`),
          L('Equipment', 'Extinguishers, welding blankets, gas monitors', 1, 'lot', 9500, ''),
        ],
        cont: 8, contWhy: 'Owner permit turnaround is unknown.', changes: ['Owner permit turnaround time', 'Press fittings in lieu of brazing where allowed'],
      };
    },
    pe: q => {
      const pk = 6, braces = Math.round(q.hangers / 6);
      return {
        scope: 'The contractor retains a licensed professional engineer to design restraints for its systems and seals the calculations.',
        method: 'Price PE design per design package and submittal cycles, field review and final letters, BIM detailing of the restraint details, PM coordination with the engineer of record, and the restraint hardware the design will require.',
        drivers: [['Design packages', String(pk), 'duct seismic, equipment seismic, hangers, rooftop wind, isolation, anchorage'], ['Restraint locations', fmt(braces), 'every 6th support of ' + fmt(q.hangers)]],
        lines: [
          L('Engineering', 'PE design and sealed calcs per package', pk * 46, 'hr', R.pe, `${pk} packages × 46 hr`),
          L('Engineering', 'Submittal cycles, 2 per package', pk * 2 * 10, 'hr', R.pe, ''),
          L('Engineering', 'Field review and final PE letters', 6, 'visit', 1650, ''),
          labor('BIM: insert restraint and attachment details', 160, R.det, ''),
          labor('Coordinate engineer-of-record comments', 40, R.pm, ''),
          L('Material', 'Restraint hardware (cable kits, clevis upgrades)', braces, 'ea', 42, ''),
          labor('Install restraints', braces * 0.6, R.jman, `${fmt(braces)} × 0.6 hr`),
        ],
        cont: 12, contWhy: 'The paragraph leaves it open whether criteria come from the structural drawings instead; an RFI answer could cut or grow scope.',
        changes: ['RFI answer on which criteria govern', 'Seismic design category', 'Number of restraint types the PE allows'],
      };
    },
    perdiem: q => {
      const t = q.systems * 4, f = Math.round(t * 0.08);
      return {
        scope: 'Missed or failed tests are back-charged at the commissioning agent’s per-diem rate.',
        method: 'Count functional tests, apply an expected failure rate, price the agent’s per-diem and McCorvey crew time for each retest, and a few late cancellations.',
        drivers: [['Functional tests', fmt(t), `${q.systems} systems × 4`], ['Expected failures', '8%', fmt(f) + ' retests']],
        lines: [
          L('Subcontract', 'CxA per-diem back-charge (0.5 day per retest)', f * 0.5, 'day', 1450, ''),
          labor('McCorvey crew attending retests (2 × 4 hr)', f * 8, R.jman, ''),
          L('Subcontract', 'Late cancellations (under 48 hr notice)', 3, 'day', 1450, ''),
        ],
        cont: 15, contWhy: 'Failures often trace to other trades but land on the mechanical sub.', changes: ['Commissioning plan test count', 'Pre-functional checklist completion'],
      };
    },
    temp: q => {
      const u = q.ahus + q.rtus;
      return {
        scope: 'The installer operates and maintains permanent systems while they are used for temporary conditioning.',
        method: 'Price weekly technician rounds for the temporary period, construction filters and changes, return-opening filter media and the temporary-use plan.',
        drivers: [['Temporary use', q.tempWeeks + ' weeks', 'unit setting to substantial completion'], ['Units operating', fmt(u), 'AHUs + RTUs']],
        lines: [
          L('Labor', 'HVAC tech: daily rounds, logs, alarms (20 hr/wk)', q.tempWeeks * 20, 'hr', R.tech, ''),
          L('Material', 'MERV 8 construction filters, 3 changes', u * 3, 'set', 185, ''),
          L('Labor', 'Filter changes', u * 3 * 1.5, 'hr', R.tech, ''),
          L('Material', 'Return-opening filter media', q.returns, 'ea', 21.50, ''),
          labor('Temporary-use plan and weekly reporting', q.tempWeeks * 2, R.pm, ''),
        ],
        cont: 10, contWhy: 'The GC controls when units start; early start extends the period.', changes: ['Start date of temporary use', 'Who pays utilities'],
      };
    },
    startup: q => ({
      scope: 'Equipment used for temporary service gets a second factory start-up before substantial completion.',
      method: 'Price the manufacturer’s second start-up per unit, McCorvey tech attendance and scheduling.',
      drivers: [['Units', fmt(q.units), 'AHUs, RTUs, fans on the schedules']],
      lines: [
        L('Subcontract', 'Manufacturer second start-up', q.units, 'unit', 1450, ''),
        L('Labor', 'McCorvey tech attending (2 hr)', q.units * 2, 'hr', R.tech, ''),
        labor('Scheduling within 1 month of substantial completion', 24, R.pm, ''),
      ],
      cont: 5, contWhy: 'Manufacturer rates vary by brand.', changes: ['Which units are used temporarily', 'Manufacturer start-up rates'],
    }),
    anchors: q => {
      const n = Math.round(q.hangers * 0.30);
      return {
        scope: 'Powder-actuated and adhesive anchors are prohibited; mechanical anchors only.',
        method: 'Take attachments into concrete, price the extra labor to drill and set wedge anchors over powder-actuated pins, the anchor difference and consumables.',
        drivers: [['Concrete attachments', fmt(n), '30% of attachment points']],
        lines: [
          labor('Drill and set wedge anchors (+0.12 hr each)', n * 0.12, R.jman, ''),
          L('Material', 'Wedge anchor over powder pin (difference)', n, 'ea', 1.40, ''),
          L('Material', 'Bits and consumables', n, 'ea', 0.35, ''),
        ],
        cont: 5, contWhy: 'Attachment count firms up with the takeoff.', changes: ['Share of attachments into concrete vs steel'],
      };
    },
    leed: q => ({
      scope: 'Product reporting forms for every product, low-VOC limits, duct-protection photos and an indoor-air-quality test repeated until it passes.',
      method: 'Price admin hours for product forms, duct-end protection, photo documentation and IAQ test support with a corrective flush-out allowance.',
      drivers: [['Products to document', String(q.products), 'incl. accessories'], ['Duct to protect', fmt(q.duct) + ' lbs', '']],
      lines: [
        labor('Product reporting forms (0.75 hr per product)', q.products * 0.75, R.det, ''),
        L('Material', 'Duct-end caps and poly protection', q.duct, 'lbs', 0.004, ''),
        labor('Photo documentation at 40 milestones', 40, R.det, ''),
        L('Labor', 'IAQ test support and corrective flush-out', 80, 'hr', R.tech, ''),
      ],
      cont: 10, contWhy: '“Until it passes” is open-ended.', changes: ['IAQ test protocol', 'Number of products in scope'],
    }),
    /* rules that normally carry a clarification, priced as allowances when the estimator picks Price it */
    vfd: q => ({ scope: 'VFDs specified in Division 26 are furnished by the mechanical trade.', method: 'Price furnished drives by count at an average size, spare parts and start-up coordination.', drivers: [['Drives', fmt(q.vfds), '']], lines: [L('Material', 'VFDs furnished, 10–30 hp average', q.vfds, 'ea', 3250, ''), L('Material', 'Spare fuses and filters', q.vfds, 'ea', 140, ''), labor('Start-up coordination', q.vfds * 2, R.tech, '')], cont: 6, contWhy: 'Sizes per the drive schedule.', changes: ['Drive schedule horsepower'] }),
    grease: q => ({ scope: 'Grease duct construction and testing per the listed system.', method: 'Price factory-built listed grease duct over welded steel, plus a light/leakage test.', drivers: [['Grease duct', fmt(q.weldLF * 0.6) + ' LF', '']], lines: [L('Material', 'Factory-built listed grease duct (difference)', q.weldLF * 0.6, 'LF', 118, ''), L('Subcontract', 'Light and leakage test', 4, 'test', 950, '')], cont: 10, contWhy: 'Construction type is unresolved.', changes: ['RFI answer on construction type'] }),
    warr: q => ({ scope: 'Extended warranty beyond the standard term.', method: 'Price the extended manufacturer warranty as a share of equipment value per extra year.', drivers: [['Equipment value', usd(q.rtus * 38000 + q.ahus * 95000), 'RTUs + AHUs, demo']], lines: [L('Subcontract', 'Extended warranty, 1 extra year (1.8%)', 1, 'lot', (q.rtus * 38000 + q.ahus * 95000) * 0.018, '')], cont: 5, contWhy: 'Manufacturer pricing.', changes: ['Which equipment is covered'] }),
    nocost: q => ({ scope: 'Cost shifted to the trade “at no additional cost”.', method: 'Carry an allowance for the likely occurrences.', drivers: [['Expected occurrences', '3', '']], lines: [L('Subcontract', 'Electrical upsizing on substitutions', 3, 'ea', 12500, '')], cont: 20, contWhy: 'Open-ended clause.', changes: ['Whether any substitutions are made'] }),
    paycoord: q => ({ scope: 'Progress payments held until coordination drawings are complete.', method: 'Price the carrying cost of materials and labor billed late.', drivers: [['Billings held', usd(2400000), 'first 2 months of work'], ['Cost of money', '9% / yr', '']], lines: [L('Indirect', 'Carrying cost of held billings (2 months)', 1, 'lot', 2400000 * 0.09 / 6, '')], cont: 10, contWhy: 'Depends on how fast coordination is signed.', changes: ['Coordination schedule'] }),
    risk: q => ({ scope: 'Work installed before coordination is signed is at the contractor’s risk.', method: 'Carry a relocation allowance as a share of field labor.', drivers: [['Field labor on duct', fmt(q.duct / 42) + ' hr', '']], lines: [labor('Relocation allowance (1.5% of field labor)', q.duct / 42 * 0.015, R.jman, '')], cont: 15, contWhy: 'Depends on other trades.', changes: ['Coordination sign-off dates'] }),
    lds: q => ({ scope: 'Liquidated damages apply to late completion.', method: 'Carry McCorvey’s share of a likely delay.', drivers: [['LD rate', '$2,500/day', 'demo'], ['Delay exposure', '10 days', '']], lines: [L('Indirect', 'LD exposure, McCorvey share 30%', 10, 'day', 2500 * 0.3, '')], cont: 0, contWhy: '', changes: ['Actual LD rate in the subcontract'] }),
    oilfree: q => ({ scope: 'Oil-free air requirement against an oil-injected compressor.', method: 'Price the oil-free machine over the basis of design.', drivers: [['Compressors', '2', '']], lines: [L('Material', 'Oil-free compressor premium', 2, 'ea', 38000, '')], cont: 5, contWhy: '', changes: ['RFI answer on compressor type'] }),
  };

  function has(f) { return !!(f && f.rule && T[f.rule]); }

  function build(f) {
    const q = Q(), t = T[f.rule](q), lines = t.lines.slice();
    let laborHrs = lines.filter(l => l.g === 'Labor' && l.u === 'hr').reduce((a, l) => a + l.q, 0);
    if (laborHrs > 120) lines.push(labor('Foreman supervision (1 per 6 workers)', laborHrs / 6, R.foreman, `${fmt(laborHrs)} hr ÷ 6`));
    if (t.lift) lines.push(L('Equipment', t.lift === R.boomWk ? 'Boom lift weeks' : 'Scissor lift weeks', Math.ceil(laborHrs / ((t.crew || 2) * 40)), 'wk', t.lift, `${fmt(laborHrs)} hr ÷ ${(t.crew || 2) * 40} hr per lift-week`));
    lines.forEach(l => { l.amt = l.q * l.r; });
    const laborAmt = lines.filter(l => l.g === 'Labor').reduce((a, l) => a + l.amt, 0);
    if (laborAmt > 0) lines.push(Object.assign(L('Indirect', 'Small tools and consumables (3% of labor)', 1, 'lot', laborAmt * 0.03, ''), { amt: laborAmt * 0.03 }));
    const sub = lines.reduce((a, l) => a + l.amt, 0);
    const cont = sub * (t.cont || 0) / 100;
    const total = Math.round((sub + cont) / 100) * 100;
    laborHrs = lines.filter(l => l.u === 'hr' && (l.g === 'Labor')).reduce((a, l) => a + l.q, 0);
    const groups = ['Labor', 'Material', 'Equipment', 'Subcontract', 'Engineering', 'Indirect', 'Credit'].map(g => ({ g, lines: lines.filter(l => l.g === g), amt: lines.filter(l => l.g === g).reduce((a, l) => a + l.amt, 0) })).filter(x => x.lines.length);
    const checks = [
      `${usd(total)} ÷ ${fmt(q.sf)} SF = ${'$' + (total / q.sf).toFixed(2)} per SF of building`,
      `${(total / q.contract * 100).toFixed(1)}% of an assumed ${usd(q.contract)} sheet-metal contract ($19.50/SF)`,
    ];
    if (laborHrs > 0) checks.push(`${fmt(laborHrs)} labor hours ≈ ${(laborHrs / 320).toFixed(1)} crew-weeks for an 8-person crew`);
    return Object.assign({}, t, { rule: f.rule, lines, groups, sub, contAmt: cont, total, laborHrs, checks, q });
  }

  const recommend = f => has(f) ? build(f).total : 0;

  function html(f) {
    if (!has(f)) return '';
    const b = build(f);
    const rows = b.groups.map(G => `<tr class="bu-g"><td colspan="4">${G.g}</td><td>${usd(G.amt)}</td></tr>` + G.lines.map(l => `<tr><td class="d">${l.d}${l.how ? `<small>${l.how}</small>` : ''}</td><td>${l.u === '$' || l.u === 'lot' ? '' : fmt(l.q)}</td><td>${l.u === '$' ? '' : l.u}</td><td>${l.u === '$' ? '' : rate(Math.abs(l.r)) + (l.r < 0 ? ' cr' : '')}</td><td>${usd(l.amt)}</td></tr>`).join('')).join('');
    return `<div class="bu">
      <div class="bu-h"><div><span class="bu-k">Recommended adder · direct cost</span><b>${usd(b.total)}</b></div><span class="bu-tag">Illustrative: demo rates and assumed quantities, not McCorvey's numbers</span></div>
      <div class="bu-2"><div><span class="bu-k">What the clause requires</span><p>${b.scope}</p></div><div><span class="bu-k">How it was priced</span><p>${b.method}</p></div></div>
      <span class="bu-k">Quantity drivers</span>
      <table class="bu-drv">${b.drivers.map(d => `<tr><td>${d[0]}</td><td><b>${d[1]}</b></td><td>${d[2] || ''}</td></tr>`).join('')}<tr><td>Project size</td><td><b>${fmt(b.q.sf)} SF</b></td><td>${profile.src === 'book' ? 'read from the spec book' : 'assumed; replace with the real takeoff'}</td></tr></table>
      <span class="bu-k">Cost build-up</span>
      <table class="bu-tbl"><thead><tr><th>Item</th><th>Qty</th><th>Unit</th><th>Rate</th><th>Amount</th></tr></thead><tbody>${rows}
        <tr class="bu-s"><td colspan="4">Subtotal</td><td>${usd(b.sub)}</td></tr>
        ${b.cont ? `<tr><td class="d">Contingency ${b.cont}%<small>${b.contWhy}</small></td><td colspan="3"></td><td>${usd(b.contAmt)}</td></tr>` : ''}
        <tr class="bu-t"><td colspan="4">Recommended adder (rounded to $100)</td><td>${usd(b.total)}</td></tr></tbody></table>
      <div class="bu-2"><div><span class="bu-k">Sanity checks</span><ul>${b.checks.map(c => `<li>${c}</li>`).join('')}</ul></div><div><span class="bu-k">What would move this number</span><ul>${b.changes.map(c => `<li>${c}</li>`).join('')}</ul></div></div>
      <div class="bu-foot">${RATE_NOTE} Markup is applied on the bid sheet.</div>
    </div>`;
  }

  function text(f) {
    if (!has(f)) return '';
    const b = build(f);
    return [`${f.title || f.rule} — recommended adder ${usd(b.total)} (illustrative, demo rates)`, '', 'What the clause requires: ' + b.scope, 'How it was priced: ' + b.method, '',
      ...b.lines.map(l => `${l.g}\t${l.d}\t${l.u === '$' || l.u === 'lot' ? '' : fmt(l.q) + ' ' + l.u}\t${l.u === '$' ? '' : rate(Math.abs(l.r))}\t${usd(l.amt)}`),
      `Subtotal\t\t\t\t${usd(b.sub)}`, b.cont ? `Contingency ${b.cont}%\t\t\t\t${usd(b.contAmt)}` : '', `Recommended adder\t\t\t\t${usd(b.total)}`].filter(x => x !== '').join('\n');
  }

  /* styles live with the module so the page only has to call html() */
  if (typeof document !== 'undefined' && !document.getElementById('bu-css')) {
    const st = document.createElement('style'); st.id = 'bu-css';
    st.textContent = `
.bu { border:1px solid var(--color-border); border-radius:12px; background:var(--color-bg); padding:14px 16px; margin-top:10px; font-size:12.4px; color:var(--color-cloud-whisper); text-align:left; }
.bu-h { display:flex; justify-content:space-between; gap:12px; align-items:flex-start; flex-wrap:wrap; padding-bottom:10px; border-bottom:2px solid #14283c; margin-bottom:10px; }
.bu-h b { display:block; font-size:22px; font-variant-numeric:tabular-nums; }
.bu-tag { font-size:9.5px; font-weight:800; letter-spacing:.07em; text-transform:uppercase; color:var(--color-amber); background:var(--color-amber-bg); border:1px solid var(--color-amber); border-radius:5px; padding:4px 8px; max-width:280px; }
.bu-k { display:block; font-size:9.5px; font-weight:800; letter-spacing:.1em; text-transform:uppercase; color:var(--color-slate-hint); margin:10px 0 5px; }
.bu-h .bu-k { margin-top:0; }
.bu p { margin:0; line-height:1.55; color:var(--color-text-muted); }
.bu-2 { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
.bu table { width:100%; border-collapse:collapse; font-variant-numeric:tabular-nums; }
.bu-drv td { padding:5px 8px; border-bottom:1px solid var(--color-border); vertical-align:top; }
.bu-drv td:first-child { color:var(--color-text-muted); width:30%; } .bu-drv td:last-child { color:var(--color-text-muted); font-size:11.5px; }
.bu-tbl th { text-align:right; font-size:9.5px; letter-spacing:.08em; text-transform:uppercase; color:var(--color-slate-hint); border-bottom:1.5px solid #14283c; padding:5px 8px; }
.bu-tbl th:first-child, .bu-tbl td.d { text-align:left; }
.bu-tbl td { text-align:right; padding:5px 8px; border-bottom:1px solid var(--color-border); vertical-align:top; white-space:nowrap; }
.bu-tbl td.d { white-space:normal; }
.bu-tbl td small { display:block; font-size:10.5px; color:var(--color-text-muted); margin-top:1px; }
.bu-tbl tr.bu-g td { font-size:10px; font-weight:800; letter-spacing:.08em; text-transform:uppercase; color:var(--color-slate-hint); background:var(--color-bg-2); text-align:left; }
.bu-tbl tr.bu-g td:last-child { text-align:right; }
.bu-tbl tr.bu-s td { font-weight:700; border-top:1px solid #9aa6b2; text-align:right; } .bu-tbl tr.bu-s td:first-child { text-align:left; }
.bu-tbl tr.bu-t td { font-weight:800; font-size:13.5px; border-top:2px solid #14283c; border-bottom:0; text-align:right; } .bu-tbl tr.bu-t td:first-child { text-align:left; }
.bu ul { margin:0; padding-left:18px; color:var(--color-text-muted); line-height:1.55; }
.bu-foot { margin-top:10px; font-size:10.5px; color:var(--color-text-muted); border-top:1px solid var(--color-border); padding-top:8px; }
@media (max-width:700px) { .bu-2 { grid-template-columns:1fr; } .bu-tbl td, .bu-tbl th { padding:4px 5px; } }`;
    document.head.appendChild(st);
  }

  window.BuildUps = { has, build, recommend, html, text, profile, rules: Object.keys(T) };
})();
