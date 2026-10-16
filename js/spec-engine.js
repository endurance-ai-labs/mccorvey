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
    sm:    { label: 'Sheet Metal (duct)', btn: ['Sheet Metal', 'duct · Div 23'], show: ['all', 'sm'] },
    hvac:  { label: 'HVAC — Div 23', btn: ['HVAC', 'Div 23'], show: ['all', 'sm', 'hvac'] },
    plumb: { label: 'Plumbing — Div 22', btn: ['Plumbing', 'Div 22'], show: ['all', 'plumb'] },
    mech:  { label: 'Plumbing + HVAC — Div 22 + 23', btn: ['Plumbing + HVAC', 'Div 22 + 23'], show: ['all', 'sm', 'hvac', 'plumb'] },
    all:   { label: 'All trades', btn: ['All trades', 'every division'], show: ['all', 'sm', 'hvac', 'plumb', 'other'] },
  };
  const inLens = (itemLens, lens) => (LENSES[lens] || LENSES.all).show.includes(itemLens || 'other');

  /* ---------------- rule library (known spec traps) ----------------
     rx    → the clause pattern (tested against the page body, headers stripped)
     t     → optional title built from the clause, so it names the actual value
     basis → how an estimator prices it (shown next to the $ field)
     sev   → high = moves the number or the schedule on most jobs          */
  const NUMW = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, fifteen: 15, twenty: 20 };
  const numOf = w => NUMW[String(w).toLowerCase()] || +w;
  const RULES = [
    { id: 'deck', lens: 'sm', sev: 'high', cat: 'Hangers', title: 'Hangers prohibited from metal deck — supplemental steel at every attachment', rx: /(no hangers?[^.]{0,80}metal deck|(attach|suspend)\w*[^.]{0,40}(to|from)[^.]{0,30}metal deck)/i, impact: 'Every hanger needs steel back to structure. On a large footprint this is often the single biggest cost the drawings do not show.', act: 'price', basis: 'Hanger points × supplemental angle installed (typically $120–180 each)' },
    { id: 'drops', lens: 'sm', sev: 'high', cat: 'Hangers', title: 'Long drops must be angle or channel with sway bracing — no rods or straps', rx: /(do not use (straps|rods)|drops?[^.]{0,60}(exceed|over|greater than)[^.]{0,30}\d+\s*(inch|in\.|")[^.]{0,80}(angle|channel))/i, impact: 'High-bay runs become trapeze and bracing work instead of rod hangers.', act: 'price', basis: 'Drops over the limit × trapeze + sway bracing' },
    { id: 'sealA', lens: 'sm', sev: 'high', cat: 'Sealing', title: 'Seal Class A required', rx: /seal(ing)?\s+class\s*[:\-]?\s*A\b/i, impact: 'Sealing labor premium — check whether it applies to low-pressure systems too.', act: 'price', basis: '≈2–4% of field labor on low-pressure duct' },
    { id: 'wg10', lens: 'sm', sev: 'high', cat: 'Pressure class', title: 'High-pressure duct class', t: s => { const m = s.match(/(\d{1,2})\s*(inch|in\.?|")\s*(w\.?g|water gauge)/i); return m ? `${m[1]}" wg duct pressure class` : null; }, rx: /\b(6|8|10)\s*(inch|in\.?|")\s*(w\.?g|water gauge)\.?\s*(positive|\+)/i, impact: 'Heavier gauge, closer reinforcement and full leak testing on the affected runs.', act: 'price', basis: 'Gauge + reinforcement upgrade on affected runs' },
    { id: 'leak', lens: 'sm', sev: 'high', cat: 'Testing', title: 'Duct leakage testing scope', rx: /(test all (high|medium)[^.]{0,40}duct|leakage test[^.]{0,120}(medium|high|shaft|witness))/i, impact: 'Test crew, rigs, retests and an inspection hold before insulation.', act: 'price', basis: 'Test crew days + rig + retest allowance' },
    { id: 'spin', lens: 'sm', sev: 'med', cat: 'Fittings', title: 'Spin-in / cinch-lock fittings prohibited', rx: /spin[- ]?in[^.]{0,60}(not (allowed|permitted|acceptable)|prohibit)/i, impact: 'Every takeoff becomes a conical tee, bellmouth or boot.', act: 'price', basis: 'Takeoff count × conical tee / boot delta' },
    { id: 'snap', lens: 'sm', sev: 'med', cat: 'Shop', title: 'Snaplock / button-punch seams prohibited', rx: /(snap\s?lock|button[- ]punch|pocket lock)[^.]{0,60}not (be )?(permitted|allowed|acceptable)/i, impact: 'Pittsburgh seams only — coil-line setup and seam labor.', act: 'price', basis: 'Shop seam labor delta' },
    { id: 'door', lens: 'sm', sev: 'med', cat: 'Accessories', title: 'Factory access doors only — no shop-built doors', rx: /(shop|field)[- ]fabricated access doors?[^.]{0,40}not/i, impact: 'Every access door is a purchased item.', act: 'price', basis: 'Door count × factory double-wall premium' },
    { id: 'flex', lens: 'sm', sev: 'med', cat: 'Flex', title: 'Flex duct length limit', t: s => { const m = s.match(/maximum length of (\d+)\s*(inch|in|")/i) || s.match(/(\d+)\s*(inch|in\.?|")\s*max/i); return m ? `Flex duct limited to ${m[1]}"` : null; }, rx: /(flex(ible)? duct[^.]{0,140}(maximum|max\.?)[^.]{0,30}\d+\s*(inch|in|")|maximum length of \d+\s*(inch|in))/i, impact: 'More hard duct to each diffuser than the plans suggest.', act: 'price', basis: 'Extra hard duct per diffuser' },
    { id: 'grease', lens: 'sm', sev: 'med', cat: 'Grease duct', title: 'Grease duct construction and testing', rx: /grease duct[^.]{0,120}(UL|welded|liquid[- ]tight|light test|NFPA 96)|grease laden vapors/i, impact: 'Confirm factory-built vs field-welded and who performs the NFPA 96 test.', act: 'clarify', basis: '' },
    { id: 'outins', lens: 'sm', sev: 'high', cat: 'Insulation', title: 'Outdoor duct insulation with jacket', rx: /(outdoor|exterior|exposed to (the )?weather)[^.]{0,80}duct[^.]{0,120}(jacket|cladding|\d\s*(inch|in\.?|")\s*(thick|board))/i, impact: 'Rooftop duct finish is a large insulation-sub number.', act: 'price', basis: 'Outdoor duct SF × jacketed insulation (sub quote)' },
    { id: 'castiron', lens: 'plumb', sev: 'high', cat: 'Material', title: 'Cast iron required for condensate drain', rx: /(condensate[^.]{0,100}cast[- ]iron|cast[- ]iron[^.]{0,100}condensate)/i, impact: 'Unusual and expensive vs PVC or copper — confirm intent or carry it.', act: 'price', basis: 'Condensate LF × cast iron vs PVC delta' },
    { id: 'legion', lens: 'plumb', sev: 'med', cat: 'Testing', title: 'Legionella testing and report required', rx: /legionella/i, impact: 'Lab fees plus disinfection and retest risk before occupancy.', act: 'price', basis: 'Lab fees + disinfection/retest allowance' },
    { id: 'oilfree', lens: 'plumb', sev: 'med', cat: 'Conflict', title: 'Oil-free air requirement — check against the compressor specified', rx: /oil[- ]free/i, impact: 'Oil-free machines cost roughly double — confirm the basis of design matches.', act: 'rfi', basis: '' },
    { id: 'oakum', lens: 'plumb', sev: 'med', cat: 'Means & methods', title: 'Lead-and-oakum joints on cast iron', rx: /oakum/i, impact: 'Labor-heavy, and hot work where open flame is restricted.', act: 'note', basis: '' },
    { id: 'pex', lens: 'plumb', sev: 'info', cat: 'Material', title: 'Copper type mandated / PEX restricted', rx: /(PEX[^.]{0,40}not (permitted|allowed)|type\s+L[^.]{0,40}(only|copper)|copper tubing,?\s*type\s+[LK])/i, impact: 'Sets the material basis for domestic water.', act: 'note', basis: '' },
    { id: 'pltest', lens: 'plumb', sev: 'med', cat: 'Testing', title: 'Domestic water pressure test', t: s => { const m = s.match(/\b(\d{2,3})\s*psig/i), h = s.match(/\b(\d{1,2})\s*hours?\b/i); return m ? `Domestic water tested at ${m[1]} psig${h ? ' for ' + h[1] + ' hours' : ''}` : null; }, rx: /(hydrostatic(ally)?\s+test\w*|test\w*\s+(\w+\s+){0,6}(at|to|with)\s+(a\s+)?(minimum\s+)?(pressure\s+of\s+)?)[^.]{0,60}\b\d{2,3}\s*psig/i, skip: /(sprinkler|standpipe|fire|refrigerant|compressed[- ]air|natural[- ]gas|fuel|working pressure|rated|rating|construction shall)/i, impact: 'Test crew time, a pressure hold before insulation and concealment, and an inspector to witness each zone.', act: 'price', basis: 'Test zones × crew hours + retest allowance' },
    { id: 'dwvtest', lens: 'plumb', sev: 'med', cat: 'Testing', title: 'Drainage and vent piping tests (water / air / smoke)', rx: /((10|ten)[- ]f(oo|ee)t\s+(of\s+)?(water\s+)?head|(drain|waste|vent|sanitary|storm)[^.]{0,80}(water test|air test|smoke test)|(water test|air test|smoke test)[^.]{0,80}(drain|waste|vent|sanitary|storm))/i, skip: /(sprinkler|fire)/i, impact: 'Every drainage section plugged, filled and held before it is covered: crew time, plugs and retests.', act: 'price', basis: 'Test sections × crew hours, plugs and water' },
    { id: 'backflow', lens: 'plumb', sev: 'med', cat: 'Scope', title: 'Backflow preventers with certified field testing', rx: /(reduced[- ]pressure[- ]principle|backflow[- ]prevent\w*\s+assembl|\bRPZ\b|double[- ]check[- ](valve|detector)[- ]assembl)/i, skip: /(sprinkler|fire[- ]protection|standpipe)/i, impact: 'Reduced-pressure assemblies cost more than basic checks, need a drain and air gap, and a certified tester before turnover.', act: 'price', basis: 'Assemblies × install + certified test' },
    { id: 'disinfect', lens: 'plumb', sev: 'med', cat: 'Testing', title: 'Disinfect domestic water with lab samples', rx: /(disinfect\w*[^.]{0,160}(AWWA\s*C65[12]|chlorin\w*|ppm|bacteriolog\w*)|AWWA\s*C65[12]|bacteriolog\w*\s+(test|sampl|analys))/i, impact: 'Chlorinate, hold, flush and lab-sample every zone before occupancy, with a resample when a zone fails.', act: 'price', basis: 'Zones × chlorination crew + lab samples + flush' },
    { id: 'plins', lens: 'plumb', sev: 'med', cat: 'Scope', title: 'Insulation on drainage piping (storm / condensate / waste)', rx: /insulat\w*[^.]{0,80}\b(storm|rainwater|roof[- ]drain|overflow drain|condensate drain|sanitary waste|waste piping)/i, skip: /(not (be )?insulated|do not insulate|insulation is not required)/i, impact: 'Horizontal storm and condensate piping above ceilings is often missed in the insulation quote.', act: 'price', basis: 'Insulated drainage LF × insulation sub price' },
    { id: 'tepid', lens: 'plumb', sev: 'high', cat: 'Scope', title: 'Tepid water to emergency eyewash and showers', rx: /tepid/i, impact: 'Tempering valve stations, extra hot and cold piping and flow testing at every emergency fixture.', act: 'price', basis: 'Emergency fixtures × tempering station + piping' },
    { id: 'trapprim', lens: 'plumb', sev: 'med', cat: 'Scope', title: 'Trap primers / trap seal devices at floor drains', rx: /(trap[- ](primer|seal\s+(primer|device|protection|protector))|primed traps?|trap seal primer)/i, impact: 'A primer or seal device, supply piping and labor at every floor drain that needs one.', act: 'price', basis: 'Floor drains × primer + piping' },
    { id: 'video', lens: 'plumb', sev: 'med', cat: 'Testing', title: 'Video inspection of drainage piping', rx: /((video|camera|CCTV)[^.]{0,60}(inspect\w*|survey)[^.]{0,80}(sewer|drain\w*|sanitary|storm|piping|lines?)|(sewer|drain\w*|sanitary|storm)[^.]{0,80}(video|CCTV))/i, skip: /(training|demonstration|photograph|recordings?|closeout|preconstruction)/i, impact: 'A camera crew on buried drainage before backfill or turnover, plus re-inspection after repairs.', act: 'price', basis: 'LF of buried drainage × camera crew' },
    { id: 'plseis', lens: 'plumb', sev: 'high', cat: 'Seismic', title: 'Seismic bracing of plumbing piping', rx: /seismic[^.]{0,40}(restrain\w*|brac\w*)/i, impact: 'Engineered braces on mains and risers, with calcs, at a count the takeoff does not show.', act: 'price', basis: 'Brace points × engineered brace + calcs' },
    { id: 'sleeves', lens: 'plumb', sev: 'med', cat: 'Scope', title: 'Pipe sleeves through walls and floors', rx: /sleeve\w*[^.]{0,80}(schedule\s*40|steel pipe|cast[- ]iron|galvanized[- ]steel|link[- ]seal|mechanical sleeve seal)/i, impact: 'A sleeve set and coordinated at every penetration, sealed where wet or exterior.', act: 'price', basis: 'Penetrations × sleeve + set' },
    { id: 'plabel', lens: 'plumb', sev: 'info', cat: 'Identification', title: 'Pipe labeling with flow arrows at set intervals', rx: /((pipe\s+(labels?|markers?)|identif\w*)[^.]{0,100}(direction of flow|flow arrows?|\b\d{1,2}\s*(feet|ft)\b[^.]{0,20}(on center|o\.?\s?c\.?|intervals?|maximum)))/i, impact: 'Labels, flow arrows and valve tags across all plumbing piping, plus the valve chart.', act: 'price', basis: 'Labeled LF ÷ interval × label + valve tags' },
    { id: 'leadfree', lens: 'plumb', sev: 'info', cat: 'Material', title: 'Lead-free / NSF 61 components required', rx: /(lead[- ]free|NSF\s*\/?\s*(ANSI\s*)?(61|372))/i, impact: 'Sets the valve and fitting basis for domestic water; check vendor quotes carry it.', act: 'note', basis: '' },
    { id: 'vfd', lens: 'hvac', sev: 'med', cat: 'Scope split', title: 'VFDs furnished by the mechanical / plumbing trade', rx: /(variable[- ]frequency[^.]{0,40}(drives?|controllers?)|VFDs?)[^.]{0,140}(furnished|provided) (by|under) Division 2[23]/i, impact: 'The drive purchase lands in your number even though Division 26 installs it.', act: 'clarify', basis: '' },
    { id: 'thd', lens: 'hvac', sev: 'high', cat: 'Electrical', title: 'Harmonic distortion limit', t: s => { const m = s.match(/(\d(?:\.\d)?)\s*%\s*(total )?harmonic/i); return m ? `Drive harmonics limited to ${m[1]}% THD` : null; }, rx: /(\d(\.\d)?\s*%\s*(total )?harmonic|THD[^.]{0,40}\d\s*%)/i, impact: 'Filters or active front ends on every drive.', act: 'price', basis: 'Drive count × filter / active front end' },
    { id: 'pads', lens: 'hvac', sev: 'med', cat: 'Scope', title: 'Equipment pads by the mechanical trade', rx: /(provide|furnish)[^.]{0,30}(reinforced )?concrete (equipment )?(pads|bases|housekeeping)/i, impact: 'Concrete scope inside the mechanical number.', act: 'price', basis: 'Pad count × form, pour and pad drawings' },
    { id: 'curb', lens: 'hvac', sev: 'high', cat: 'Delegated design', title: 'Structural curbs / screens with delegated design', rx: /(curbs?|screen frames?)[^.]{0,140}(wind|seismic)[^.]{0,60}(load|design)/i, impact: 'A structural design-build item hidden in an equipment section.', act: 'price', basis: 'Curb/screen count × design + fabrication' },
    { id: 'subs', lens: 'all', sev: 'med', cat: 'Closed spec', title: 'Substitutions restricted', rx: /(no substitutions?|substitutions? (for convenience )?(are|is|will) not (be )?(permitted|considered|accepted|allowed)|comparable products? will not be considered)/i, impact: 'Price only the listed manufacturers — no VE swaps after award.', act: 'note', basis: '' },
    { id: 'nocost', skip: /will be provided at no (extra|additional) cost/i, lens: 'all', sev: 'med', cat: 'Cost shift', title: 'Cost shifted to the trade — "no additional cost"', t: s => /feeder|electrical/i.test(s) ? 'Larger equipment = you pay for the electrical upsizing' : /relocat/i.test(s) ? 'Relocations for access or coordination at your cost' : /retest|defective|correct/i.test(s) ? 'Corrections and retests at your cost' : null, rx: /(at no (additional|extra) cost to (the )?owner|no change orders? (will|shall) be (accepted|considered|issued))/i, impact: 'Read each one — this is where margin quietly leaves the job.', act: 'clarify', basis: '' },
    { id: 'flame', lens: 'all', sev: 'high', cat: 'Means & methods', title: 'Hot work restricted — fire watch / permits', rx: /(open[- ]flame[^.]{0,60}not (be )?permitted|hot[- ]work permit|fire watch)/i, impact: 'Press fittings for copper, fire-watch labor and permit lead time on welded work.', act: 'price', basis: 'Fire-watch hours + permit lead time on welded/brazed work' },
    { id: 'pe', lens: 'all', sev: 'high', cat: 'Delegated design', title: 'Contractor-retained engineer for delegated design', t: s => /seismic|restraint/i.test(s) ? 'Seismic restraint design delegated to your engineer' : null, rx: /((engage|employ|retain)[^.]{0,40}(professional|licensed|registered) engineer[^.]{0,160}(design|restraint|seismic|calculation)|delegated[- ]design services)/i, impact: 'PE fee, sealed calculations and a submittal cycle at the front of detailing.', act: 'price', basis: 'PE fee + sealed calcs + submittal cycles' },
    { id: 'perdiem', lens: 'all', sev: 'med', cat: 'Cost shift', title: 'Retests back-charged at the agent\'s per-diem rate', rx: /(per[- ]diem|back[- ]?charged?)/i, impact: 'Failed or missed tests cost you the commissioning or TAB agent\'s time.', act: 'price', basis: 'Retest allowance at the agent\'s per-diem rate' },
    { id: 'paycoord', lens: 'all', sev: 'high', cat: 'Payment', title: 'Progress payments held until coordination drawings are complete', rx: /prerequisite for (any )?(progress )?payment/i, impact: 'Cash flow waits on BIM sign-off — carry coordination as its own SOV line.', act: 'clarify', basis: '' },
    { id: 'risk', lens: 'all', sev: 'high', cat: 'Coordination', title: 'Work before signed coordination is at your risk', rx: /(at (the )?(sub)?contractor'?s risk|regardless of which (was|trade) installed first|will not be considered (a )?changes?)/i, impact: 'No relief for field relocations or "difficult installations".', act: 'clarify', basis: '' },
    { id: 'temp', lens: 'all', sev: 'high', cat: 'Cost shift', title: 'You operate permanent systems during temporary use', rx: /(installer of each permanent service|temporary use of permanent (equipment|facilities)[^.]{0,160}(installer|contractor|operat|plan))/i, impact: 'Temporary conditioning labor, filters and protection fall on the installer.', act: 'price', basis: 'Weeks of temporary operation × tech hours + filters' },
    { id: 'startup', lens: 'all', sev: 'med', cat: 'Cost shift', title: 'Second factory start-up before Substantial Completion', rx: /start[- ]?up[^.]{0,140}(prior to|before|one month)[^.]{0,30}substantial completion/i, impact: 'Equipment used temporarily gets started up twice.', act: 'price', basis: 'Unit count × second factory start-up' },
    { id: 'sampling', lens: 'all', sev: 'med', cat: 'Testing', title: '100% functional-test sampling', rx: /100\s*(%|percent)\s*(sampling|of (the )?(systems|equipment|devices|items)[^.]{0,60}(functional|performance) test)/i, impact: 'End-of-job staffing; failures can redo whole reports.', act: 'note', basis: '' },
    { id: 'clock', lens: 'all', sev: 'med', cat: 'Cx clock', title: 'Deficiency turnaround clock', t: s => { const m = s.match(/within (one|two|three|five|\d+)\s*(\(\d+\)\s*)?(work(ing)?\s*)?days?/i); return m ? `Deficiencies acknowledged within ${numOf(m[1])} work day${numOf(m[1]) > 1 ? 's' : ''}` : null; }, rx: /within (one|two|three|five|\d+|\(\d+\))\s*(\(\d+\)\s*)?(work(ing)?\s*)?days?[^.]{0,100}(deficienc|correct|resolv|acknowledg)/i, impact: 'Closeout crew must be available on short notice.', act: 'note', basis: '' },
    { id: 'warr', withSec: true, lens: 'all', sev: 'med', cat: 'Warranty', title: 'Extended warranty term', t: s => { const m = s.match(/\b(two|three|five|ten|fifteen|twenty|\d{1,2})\s*(\(\d+\)\s*)?[- ]?years?/i); return m ? `${numOf(m[1])}-year warranty${(s.match(/warranty (period )?for ([a-z ]{3,30}?)[:.,]/i) || [])[2] ? ' — ' + s.match(/warranty (period )?for ([a-z ]{3,30}?)[:.,]/i)[2].trim() : ''}` : null; }, rx: /warrant\w*[^.]{0,80}\b(two|three|five|ten|fifteen|twenty|[2-9]|1\d|20)\s*(\(\d+\)\s*)?[- ]?years?\b/i, impact: 'Longer than the standard one year — confirm the manufacturer passes it through or qualify it.', act: 'clarify', basis: '' },
    { id: 'anchors', lens: 'all', sev: 'med', cat: 'Means & methods', title: 'Powder-actuated / adhesive anchors prohibited', rx: /(powder[- ]actuated|adhesive anchors?)[^.]{0,60}(not|prohibit)/i, impact: 'Mechanical anchors only — more hanger labor.', act: 'price', basis: 'Anchor count × mechanical anchor labor delta' },
    { id: 'lds', lens: 'all', sev: 'high', cat: 'Commercial', title: 'Liquidated damages', rx: /liquidated damages/i, impact: 'Schedule exposure — confirm the amount and whether it flows down.', act: 'clarify', basis: '' },
    { id: 'retain', lens: 'all', sev: 'med', cat: 'Commercial', title: 'Retainage terms', rx: /retainage/i, impact: 'Cash-flow terms for the subcontract.', act: 'note', basis: '' },
    { id: 'leed', lens: 'all', sev: 'med', cat: 'LEED', title: 'LEED documentation and indoor-air-quality testing', rx: /(product data reporting form|IAQ (air )?test|indoor air quality[^.]{0,60}(test|photo)|report from testing and inspecting agency indicating results of IAQ)/i, impact: 'Admin hours plus corrective action if the air test fails.', act: 'price', basis: 'Admin hours + IAQ protection materials' },
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

  /* open the book again to draw single pages in the viewer; nothing leaves the browser */
  async function openPdf(file) {
    await loadPdfJs();
    return window.pdfjsLib.getDocument({ data: await file.arrayBuffer() }).promise;
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
  /* tidy PDF extraction artefacts so a clause reads like the page */
  const tidy = s => s
    .replace(/(\w) - (\w)/g, '$1-$2')
    .replace(/ ([’'])\s?s\b/g, '$1s')
    .replace(/\s+([,.;:)])/g, '$1').replace(/\(\s+/g, '(')
    .replace(/^[a-z0-9]{1,3}[.)]\s+/i, '')
    .replace(/\s{2,}/g, ' ').trim()
    .replace(/\s+[A-Za-z0-9]{1,2}\.$/, '');
  function sentenceAt(t, idx) {
    const stop = /(?<=[.;:])\s+(?=[A-Z0-9(])/g;
    let a = 0, m;
    stop.lastIndex = 0;
    while ((m = stop.exec(t)) && m.index < idx) a = m.index + m[0].length;
    const head = t.slice(idx, idx + 30);
    if (/^[A-Z0-9 \-]{12,}/.test(head)) a = idx;                       /* matched a heading: start there */
    if (idx - a > 150) { a = idx - 120; const sp = t.indexOf(' ', a); if (sp > 0 && sp < idx) a = sp + 1; }
    let b = t.length; stop.lastIndex = idx;
    if ((m = stop.exec(t))) b = m.index;
    let s = t.slice(a, Math.min(b, idx + 280)).trim();
    /* a heading or list stub on its own ("1.4 DELEGATED-DESIGN SERVICES A.") reads as noise: take the next sentence too */
    if (s.length < 70 && b < t.length) {
      stop.lastIndex = b + 1;
      const m2 = stop.exec(t);
      s = t.slice(a, Math.min(m2 ? m2.index : t.length, a + 320)).trim();
    }
    s = tidy(s);
    if (/^[a-z,;:)\]]/.test(s)) s = '…' + s.replace(/^[,;:)\]]\s*/, '');      /* clause began on the previous page / mid-sentence */
    return s;
  }
  /* words the PDF's own letter spacing split apart ("ductw ork", "re qui red"): rejoin a run
     of 2-5 pieces only when the joined word appears whole elsewhere in the same book and at least
     one piece is not a word there in its own right. Two real words ("with in") stay apart. */
  function wordCounts(bodies) {
    const lex = new Map();
    bodies.forEach(t => { const m = (t || '').match(/[A-Za-z]+/g); if (m) m.forEach(w => { w = w.toLowerCase(); lex.set(w, (lex.get(w) || 0) + 1); }); });
    return lex;
  }
  function mend(s, lex) {
    if (!lex || !s) return s;
    const L = w => lex.get(w.toLowerCase()) || 0;
    const T = s.split(' '), out = [];
    let a = 0;
    while (a < T.length) {
      let hit = null, k = Math.min(5, T.length - a);
      for (; k >= 2; k--) {
        const head = T[a].match(/^([^A-Za-z]*)([A-Za-z]+)$/), tail = T[a + k - 1].match(/^([A-Za-z]+)([^A-Za-z]*)$/), mid = T.slice(a + 1, a + k - 1);
        if (!head || !tail || !mid.every(t => /^[A-Za-z]+$/.test(t))) continue;
        const parts = [head[2], ...mid, tail[1]], w = parts.join(''), lw = L(w);
        if (lw < 3) continue;
        if (!parts.some(f => L(f) <= 2 || (f.length <= 3 && L(f) * 5 <= lw))) continue;
        if (parts.every(f => f.length >= 3 && L(f) >= 50)) continue;
        hit = head[1] + w + tail[2]; break;
      }
      if (hit) { out.push(hit); a += k; } else out.push(T[a++]);
    }
    return out.join(' ');
  }
  const goodSnip = s => s.length >= 70 && s.length <= 300 && !/^…/.test(s);
  const scanDiv = d => YOURS.includes(d) || HOOKS.includes(d);
  /* in hook divisions (21/25/26/28/40) a clause only counts if it lands on the mechanical trades */
  const MECH = /Division\s*2[23]|mechanical|HVAC|plumbing|duct|piping|BAS|building automation/i;

  function runRules(bodies, pageSec, secById, lex) {
    const hits = {};
    bodies.forEach((raw, i) => {
      const sec = pageSec[i], s = secById[sec];
      if (!s || !scanDiv(s.div)) return;
      const t = norm(raw || '');
      const hook = HOOKS.includes(s.div);
      RULES.forEach(r => {
        const ok = r.lens === 'all' || s.div === '01' ||
          ((r.lens === 'sm' || r.lens === 'hvac') && ['23', '25', '26'].includes(s.div)) ||
          (r.lens === 'plumb' && ['22', '21', '40'].includes(s.div));
        if (!ok) return;
        const m = t.match(r.rx); if (!m) return;
        const says = sentenceAt(t, m.index);
        if (hook && !MECH.test(says)) return;
        if (r.skip && r.skip.test(says)) return;
        const k = r.id + '|' + sec;
        if (hits[k]) { hits[k].count++; if (!goodSnip(hits[k].says) && goodSnip(says)) { hits[k].says = says; hits[k].page = i + 1; } return; }
        hits[k] = { rule: r, sec, page: i + 1, count: 1, says };
      });
    });
    /* the same boilerplate pasted into several sections becomes one finding that names every section */
    const groups = {};
    Object.values(hits).sort((a, b) => a.page - b.page).forEach(h => {
      const key = h.rule.id + '|' + h.says.replace(/[^a-z]/gi, '').toLowerCase().slice(0, 90);
      if (groups[key]) groups[key].also.push(h.sec); else groups[key] = Object.assign(h, { also: [] });
    });
    let n = 0;
    return Object.values(groups).map(h => {
      const sl = lensOf(h.sec), r = h.rule, st = secById[h.sec];
      h.says = mend(h.says, lex);
      let title = r.title;
      try { title = (r.t && r.t(h.says)) || r.title; } catch (e) {}
      if (r.withSec && st && !/ — /.test(title)) title += ' — ' + st.title;
      const extra = (h.count > 1 ? ` Appears on ${h.count} pages of this section.` : '') + (h.also.length ? ` Same requirement repeated in ${h.also.join(', ')}.` : '');
      return { id: 'R' + String(++n).padStart(3, '0'), rule: r.id, sec: h.sec, page: h.page, para: '', sev: r.sev, cat: r.cat,
        title, says: h.says, impact: r.impact + extra, also: h.also,
        act: r.act, amt: 0, basis: r.basis || '', lens: sl === 'all' ? 'all' : (sl === 'other' ? r.lens : sl) };
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
  function runMatrix(pages, pageSec, secById, lex) {
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
        const say = mend(txt, lex);
        rows.push({ item: say.length > 230 ? say.slice(0, 227) + '…' : say, lens: lensOf(sec), src: sec, page: i + 1 });
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
  /* ---------------- CSI Parts: 1 General · 2 Products · 3 Execution ----------------
     Read from the book's own PART headings; each finding gets the Part it sits in and
     the nearest paragraph number before its clause, and each section its Part page ranges. */
  const PART_RE = /PART\s*([123])\s*[-–—:.]*\s*(GENERAL|PRODUCTS|EXECUTION)/gi;
  const flat = t => String(t || '').replace(/\s+/g, ' ');
  function assignParts(sections, bodies, findings) {
    const heads = {};
    sections.forEach(s => {
      const H = []; let cur = null;
      for (let p = s.start; p <= s.end; p++) {
        const t = flat(bodies[p - 1]); PART_RE.lastIndex = 0; let m;
        H.push({ page: p, idx: -1, part: cur });
        while ((m = PART_RE.exec(t))) { cur = +m[1]; H.push({ page: p, idx: m.index, part: cur }); }
      }
      heads[s.id] = H;
      const rng = {};
      H.forEach(h => { if (!h.part) return; const r = rng[h.part] = rng[h.part] || [h.page, h.page]; r[0] = Math.min(r[0], h.page); r[1] = Math.max(r[1], h.page); });
      if (Object.keys(rng).length) s.parts = rng;
    });
    findings.forEach(f => {
      const H = heads[f.sec]; if (!H) return;
      const t = flat(bodies[f.page - 1]), key = flat(f.says).replace(/^…/, '').slice(0, 28);
      const at = key ? t.indexOf(key) : -1, pos = at >= 0 ? at : t.length;
      let part = null;
      H.forEach(h => { if (h.page < f.page || (h.page === f.page && h.idx <= pos)) { if (h.part) part = h.part; } });
      if (part) f.part = part;
      if (!f.para && at > 0) {
        const nums = t.slice(Math.max(0, at - 500), at).match(/\b[123]\.\d{1,2}(?:\.[A-Z](?:\.\d{1,2})?)?(?=\s)/g);
        const near = nums && nums[nums.length - 1];
        if (near && (!part || +near[0] === part)) f.para = near;
      }
      if (!f.part && /^[123]\./.test(f.para || '')) f.part = +f.para[0];
    });
  }
  async function analyze(file, onProgress) {
    const pages = await extract(file, (d, n) => onProgress && onProgress('Reading page ' + d.toLocaleString() + ' of ' + n.toLocaleString(), d / n * 0.85));
    onProgress && onProgress('Mapping sections and issue stamps', 0.88);
    const { sections, pageSec, bodies } = buildSections(pages);
    const secById = Object.fromEntries(sections.map(s => [s.id, s]));
    onProgress && onProgress('Running spec-trap rules', 0.92);
    const lex = wordCounts(bodies);
    const findings = runRules(bodies, pageSec, secById, lex);
    assignParts(sections, bodies, findings);
    onProgress && onProgress('Checking cross-references and template text', 0.96);
    const conflicts = runChecks(pages, pageSec, secById, sections);
    const matrix = runMatrix(pages, pageSec, secById, lex);
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
    book.conflicts = staleRfis(book).concat(book.conflicts);
    onProgress && onProgress('Done', 1);
    return { book, raw: { sections, bodies } };
  }
  /* sections still stamped older than the set you priced → RFI each one */
  function staleRfis(book) {
    return book.sections.filter(s => YOURS.includes(s.div) && s.id !== '00 0000' && s.issue != null && s.issue < book.pricedIssue).map((s, i) => ({
      id: 'S' + String(i + 1).padStart(2, '0'), kind: 'stale', lens: lensOf(s.id), sev: 'high',
      title: `${s.id} ${s.title} is still at Issue ${String(s.issue).padStart(2, '0')}`,
      a: { sec: s.id, page: s.start, para: 'Header', says: `Stamped Issue ${String(s.issue).padStart(2, '0')}${s.date ? ' (' + s.date + ')' : ''}.` },
      b: { sec: '—', page: null, para: '', says: `Most of the book is at Issue ${String(book.pricedIssue).padStart(2, '0')} or later.` },
      q: `Section ${s.id} ${s.title} is stamped Issue ${String(s.issue).padStart(2, '0')}, older than the rest of the issued set. Confirm whether a revised section will be issued. Bid is based on the section as issued.`,
      cost: 'Pricing basis may be out of date.' }));
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
  /* typed $ wins; else a typed qty x the price book unit cost (your own book); else the book's own amount */
  function amtOf(f, d) {
    d = d || {};
    if (d.amt != null) return +d.amt || 0;
    const L = d.qty > 0 && window.PRICEBOOK && window.PRICEBOOK.lineFor(f);
    if (L && !L.fixed) return Math.round(d.qty * L.it.unitCost);
    return f.amt || (window.BuildUps && window.BuildUps.has(f) ? window.BuildUps.recommend(f) : 0);
  }
  function decOf(book, f, D) { D = D || decisions(book); const d = D[f.id] || {}; return { act: d.act || f.act, amt: amtOf(f, d) }; }
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

  const PARTS = { 1: 'General', 2: 'Products', 3: 'Execution' };
  window.SpecEngine = { PARTS, assignParts, analyze, extract, openPdf, buildSections, diffBooks, stampDiffs, staleRfis, lensOf, inLens, LENSES, DIV_NAMES, YOURS, HOOKS, RULES,
    mend, wordCounts, store, activeBook, decisions, saveDecisions, amtOf, decOf, secTitle, cite, rfiNo, rfiText };
})();
