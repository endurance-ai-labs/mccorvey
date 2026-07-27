/* =========================================================
   YATES CONSTRUCTION — OPERATIONS PORTAL (DEMO)
   All data fictional / demo. Flagship job seeded from the
   Lakeview Villas storm-damage repair records.
   ========================================================= */

const YATES = {
  company: "Yates Construction",
  legal: "W.G. Yates & Sons Construction Company",
  tagline: "We Make It Possible",
  hq: "Philadelphia, Mississippi · family-owned since 1964",
  office: "Texas Division — Dallas",
  address: "5049 Ridge Creek Ln, Dallas, TX 75244",
  phone: "(972) 555-0148",
  license: "TX GC #084412",
  enr: "ENR Top 400 — #29",
};

const PEOPLE = {
  pms: ["Marcus Pruitt", "Sarah Whitfield", "Miguel Delgado", "Tram Nguyen"],
  supers: ["D. Kowalski", "R. Trejo", "J. Boone", "C. Marsh"],
  execs: { cfo: "Alan Reece, CFO", ops: "K. Yates, VP Operations" },
};

const SUBS = [
  "Caldwell Roofing Group, LLC (Roofing)",
  "Lone Star Seamless Gutters",
  "Trinity Carpentry & Millwork",
  "Metro Glass & Glazing",
  "ProCoat Commercial Painting",
  "Big Tex Fence & Stain",
  "Airway Mechanical (HVAC)",
  "Self-Perform — Yates Crew",
];

/* ---- helper: internal cost basis implied by default levers (OH 6%, profit 9%) ---- */
const MULT = 1.06 * 1.09 * 1.0185;   // OH x profit x (P&P bond 1.0% + GL 0.85%)
const cost = (sell) => Math.round((sell / MULT) * 100) / 100;

/* =========================================================
   JOBS
   ========================================================= */
const JOBS = [
  {
    id: "LKV-2410",
    name: "Lakeview Villas — Storm Damage Repairs",
    owner: "Bluebonnet Residential Partners, LP",
    address: "4800 Shoreline Vista Drive, Arlington, TX 76016",
    sector: "Multifamily — Insurance Restoration",
    pm: "Marcus Pruitt",
    super: "D. Kowalski",
    sub: "Caldwell Roofing Group, LLC (Roofing)",
    status: "Closeout",
    contractDate: "2024-09-13",
    start: "2024-10-04",
    finish: "2024-11-14",
    retainagePct: 5,
    contract: 682400.00,
    insurance: { carrier: "Ranger Mutual Insurance", approval: "Full approval 9/20/2024", peril: "Hail / wind — May 2024 storm event" },
    sov: [
      { item: "1001", desc: "Roof Replacement — Class 3 Impact-Resistant (26 bldgs)", scheduled: 379600.0, pct: 100, budget: cost(379600.0), costToDate: 323100.00 },
      { item: "1002", desc: "Carport R-Panel Replacement", scheduled: 27600.0, pct: 100, budget: cost(27600.0), costToDate: 24000.00 },
      { item: "1003", desc: "Gutters & Downspouts", scheduled: 46000.0, pct: 100, budget: cost(46000.0), costToDate: 39300.00 },
      { item: "1004", desc: "Exterior Doors", scheduled: 27900.0, pct: 100, budget: cost(27900.0), costToDate: 24500.00 },
      { item: "1005", desc: "Windows & Screens", scheduled: 9500.00, pct: 100, budget: cost(9500.00), costToDate: 8000.00 },
      { item: "1006", desc: "Chimneys & Rake Walls", scheduled: 100600.0, pct: 100, budget: cost(100600.0), costToDate: 88500.00 },
      { item: "1007", desc: "Carpentry Repairs / Change Order", scheduled: 47400.00, pct: 100, budget: cost(47400.00), costToDate: 42100.00 },
      { item: "1008", desc: "Fence Staining", scheduled: 9700.0, pct: 100, budget: cost(9700.0), costToDate: 8300.00 },
      { item: "1009", desc: "General Conditions", scheduled: 17600.00, pct: 100, budget: cost(17600.00), costToDate: 15600.00 },
      { item: "1010", desc: "Supervision", scheduled: 16500.0, pct: 100, budget: cost(16500.0), costToDate: 14700.00 },
    ],
    payApps: [
      { num: "410-01", label: "Pay App 1 — Material Deposit", period: "2024-10-11", certified: 134200.00, status: "Paid" },
      { num: "410-02a", label: "Pay App 2 (Revised)", period: "2024-10-25", certified: 318080.00, status: "Paid" },
      { num: "410-03", label: "Pay App 3", period: "2025-01-02", certified: 196000.00, status: "Paid" },
      { num: "410-RET", label: "Retention Release", period: "2025-01-02", certified: 34120.00, status: "Paid" },
    ],
    phases: [
      { name: "Material Procurement", start: "2024-10-04", finish: "2024-10-10", value: 134200, pct: 100 },
      { name: "Roof Replacement", start: "2024-10-11", finish: "2024-10-24", value: 353400, pct: 100 },
      { name: "Carpentry & Doors", start: "2024-10-18", finish: "2024-10-31", value: 74300, pct: 100 },
      { name: "Paint", start: "2024-10-25", finish: "2024-10-31", value: 14200, pct: 100 },
      { name: "Glass & Glazing", start: "2024-10-30", finish: "2024-10-31", value: 6200, pct: 100 },
      { name: "HVAC", start: "2024-11-01", finish: "2024-11-04", value: 13500, pct: 100 },
      { name: "Carports", start: "2024-11-01", finish: "2024-11-14", value: 29400, pct: 100 },
      { name: "Fence Staining", start: "2024-11-01", finish: "2024-11-07", value: 20900, pct: 100 },
      { name: "Gutters", start: "2024-11-08", finish: "2024-11-14", value: 35100, pct: 100 },
      { name: "Final Cleaning", start: "2024-11-14", finish: "2024-11-14", value: 22000, pct: 100 },
    ],
    changeOrders: [
      { num: "CO-01", desc: "Rake wall supplemental repairs (concealed rot at rake walls, Bldgs 7/11/14)", amount: 0, status: "Absorbed in SOV 1006 per supplemental approval" },
    ],
    photos: [
      { src: "/yates/assets/photos/q01.jpg", cap: "Pre-construction — storm-damaged roof section, Building 12", date: "2024-05-21", tag: "Damage" },
      { src: "/yates/assets/photos/q02.jpg", cap: "Pre-construction — interior water intrusion below roof leak", date: "2024-05-21", tag: "Damage" },
      { src: "/yates/assets/photos/q03.jpg", cap: "Tear-off and dry-in underway — Buildings 3-5", date: "2024-10-15", tag: "Roofing" },
      { src: "/yates/assets/photos/q04.jpg", cap: "Field crew loading shingles over synthetic underlayment", date: "2024-10-15", tag: "Roofing" },
      { src: "/yates/assets/photos/q05.jpg", cap: "Class 3 architectural shingle installation — field nailing", date: "2024-10-15", tag: "Roofing" },
      { src: "/yates/assets/photos/q06.jpg", cap: "Shingle install detail — underlayment overlap verified", date: "2024-10-23", tag: "Roofing" },
      { src: "/yates/assets/photos/q07.jpg", cap: "Rake wall reframing — carpentry crew", date: "2024-10-23", tag: "Carpentry" },
      { src: "/yates/assets/photos/q08.jpg", cap: "Fascia trim fabrication at the cut station", date: "2024-10-23", tag: "Carpentry" },
      { src: "/yates/assets/photos/q09.jpg", cap: "Ridge detail work — Building 9", date: "2024-10-23", tag: "Roofing" },
      { src: "/yates/assets/photos/q10.jpg", cap: "Carport R-panel replacement complete", date: "2024-11-08", tag: "Carports" },
      { src: "/yates/assets/photos/q11.jpg", cap: "Gutter and downspout flow test", date: "2024-11-08", tag: "Gutters" },
      { src: "/yates/assets/photos/q12.jpg", cap: "Exterior door replacement — Building 7", date: "2024-11-08", tag: "Doors" },
      { src: "/yates/assets/photos/q13.jpg", cap: "Glazing measurement for window replacement", date: "2024-11-08", tag: "Windows" },
      { src: "/yates/assets/photos/q14.jpg", cap: "Perimeter fence staining complete", date: "2024-11-08", tag: "Fence" },
      { src: "/yates/assets/photos/q15.jpg", cap: "Trim paint touch-in at window frames", date: "2024-11-08", tag: "Paint" },
      { src: "/yates/assets/photos/q16.jpg", cap: "Completed elevation — closeout documentation", date: "2024-11-08", tag: "Site" },
    ],
    reports: [
      { date: "2024-10-15", title: "Storm Damage Repairs Progress — Report 1", photos: 49, author: "Marcus Pruitt" },
      { date: "2024-10-23", title: "Storm Damage Repairs Progress — Report 2", photos: 26, author: "Marcus Pruitt" },
      { date: "2024-10-25", title: "Storm Damage Repairs Progress — Report 3", photos: 18, author: "Marcus Pruitt" },
      { date: "2024-11-08", title: "Storm Damage Repairs Progress — Report 4", photos: 72, author: "Marcus Pruitt" },
    ],
  },

  {
    id: "MBC-2502",
    name: "Meadowbrook Commons — Reroof & Exterior Package",
    owner: "Meadowbrook Residential Partners LP",
    address: "2830 Meadowbrook Dr, Fort Worth, TX 76103",
    sector: "Multifamily — Capital Improvement",
    pm: "Sarah Whitfield",
    super: "R. Trejo",
    sub: "Caldwell Roofing Group, LLC (Roofing)",
    status: "In Progress",
    contractDate: "2025-01-10",
    start: "2025-02-03",
    finish: "2025-06-27",
    retainagePct: 10,
    contract: 1284500.00,
    sov: [
      { item: "2001", desc: "Roof Replacement — 14 buildings", scheduled: 742000.00, pct: 78, budget: 631000.00, costToDate: 497200.00 },
      { item: "2002", desc: "Gutters & Downspouts", scheduled: 96500.00, pct: 55, budget: 81300.00, costToDate: 44800.00 },
      { item: "2003", desc: "Siding & Trim Repairs", scheduled: 188000.00, pct: 40, budget: 158900.00, costToDate: 66300.00 },
      { item: "2004", desc: "Exterior Paint — full wrap", scheduled: 152000.00, pct: 18, budget: 128200.00, costToDate: 24100.00 },
      { item: "2005", desc: "Balcony Deck Coating", scheduled: 58000.00, pct: 0, budget: 49400.00, costToDate: 0 },
      { item: "2006", desc: "General Conditions & Supervision", scheduled: 48000.00, pct: 62, budget: 42500.00, costToDate: 26900.00 },
    ],
    payApps: [
      { num: "310-01", label: "Pay App 1", period: "2025-02-28", certified: 148230.00, status: "Paid" },
      { num: "310-02", label: "Pay App 2", period: "2025-03-31", certified: 221540.00, status: "Paid" },
      { num: "310-03", label: "Pay App 3", period: "2025-04-30", certified: 196875.00, status: "Paid" },
      { num: "310-04", label: "Pay App 4", period: "2025-05-31", certified: 154310.00, status: "Pending Owner" },
    ],
    phases: [
      { name: "Mobilization & Procurement", start: "2025-02-03", finish: "2025-02-14", value: 96000, pct: 100 },
      { name: "Roofing — Phase A (Bldgs 1-7)", start: "2025-02-17", finish: "2025-04-11", value: 371000, pct: 100 },
      { name: "Roofing — Phase B (Bldgs 8-14)", start: "2025-04-14", finish: "2025-06-06", value: 371000, pct: 55 },
      { name: "Gutters", start: "2025-03-10", finish: "2025-06-13", value: 96500, pct: 55 },
      { name: "Siding & Trim", start: "2025-03-24", finish: "2025-06-13", value: 188000, pct: 40 },
      { name: "Paint", start: "2025-05-05", finish: "2025-06-20", value: 152000, pct: 18 },
      { name: "Balcony Coatings & Punch", start: "2025-06-09", finish: "2025-06-27", value: 58000, pct: 0 },
    ],
    changeOrders: [
      { num: "CO-01", desc: "Decking replacement overage — Phase A (1,240 SF beyond allowance)", amount: 18600.00, status: "Approved" },
      { num: "CO-02", desc: "Chimney chase rebuilds (6 ea)", amount: 21450.00, status: "Submitted" },
    ],
    photos: [
      { src: "/yates/assets/photos/q17.jpg", cap: "Roofing Phase B — field install, Building 9", date: "2025-05-09", tag: "Roofing" },
      { src: "/yates/assets/photos/q18.jpg", cap: "Exterior paint wrap — scaffold crew, Building 6", date: "2025-05-09", tag: "Paint" },
      { src: "/yates/assets/photos/q19.jpg", cap: "Superintendent QC walk — Phase B layout", date: "2025-05-09", tag: "Site" },
    ],
    reports: [
      { date: "2025-03-07", title: "Monthly Progress Report — March", photos: 41, author: "Sarah Whitfield" },
      { date: "2025-04-04", title: "Monthly Progress Report — April", photos: 38, author: "Sarah Whitfield" },
      { date: "2025-05-09", title: "Monthly Progress Report — May", photos: 44, author: "Sarah Whitfield" },
    ],
  },

  {
    id: "HPL-2506",
    name: "Harbor Point Logistics Center — TPO Roof Replacement",
    owner: "Harbor Point Industrial REIT",
    address: "1900 Duncan Perry Rd, Grand Prairie, TX 75050",
    sector: "Industrial — Roofing",
    pm: "Miguel Delgado",
    super: "J. Boone",
    sub: "Self-Perform — Yates Crew",
    status: "In Progress",
    contractDate: "2025-04-22",
    start: "2025-05-19",
    finish: "2025-10-31",
    retainagePct: 10,
    contract: 2410000.00,
    sov: [
      { item: "3001", desc: "Demo & wet insulation removal (412,000 SF)", scheduled: 396000.00, pct: 74, budget: 334000.00, costToDate: 251400.00 },
      { item: "3002", desc: "60-mil TPO membrane & insulation", scheduled: 1522000.00, pct: 31, budget: 1291000.00, costToDate: 409800.00 },
      { item: "3003", desc: "Sheet metal, copings & terminations", scheduled: 246000.00, pct: 12, budget: 208400.00, costToDate: 26500.00 },
      { item: "3004", desc: "Roof drains & overflow retrofit", scheduled: 118000.00, pct: 22, budget: 99600.00, costToDate: 23400.00 },
      { item: "3005", desc: "General Conditions & Supervision", scheduled: 128000.00, pct: 38, budget: 111000.00, costToDate: 43700.00 },
    ],
    payApps: [
      { num: "412-01", label: "Pay App 1", period: "2025-06-30", certified: 287400.00, status: "Paid" },
      { num: "412-02", label: "Pay App 2", period: "2025-07-25", certified: 341200.00, status: "Submitted" },
    ],
    phases: [
      { name: "Mobilization & Safety Setup", start: "2025-05-19", finish: "2025-05-30", value: 84000, pct: 100 },
      { name: "Section 1 — Demo & Dry-in", start: "2025-06-02", finish: "2025-07-18", value: 640000, pct: 88 },
      { name: "Section 2 — Demo & Dry-in", start: "2025-07-21", finish: "2025-09-05", value: 640000, pct: 8 },
      { name: "Section 3 — Demo & Dry-in", start: "2025-09-08", finish: "2025-10-17", value: 640000, pct: 0 },
      { name: "Sheet Metal & Punch", start: "2025-10-06", finish: "2025-10-31", value: 406000, pct: 0 },
    ],
    changeOrders: [
      { num: "CO-01", desc: "Wet insulation overage — Section 1 (infrared survey delta)", amount: 64200.00, status: "Approved" },
    ],
    photos: [
      { src: "/yates/assets/photos/q20.jpg", cap: "Section 1 complete — membrane and panel transition", date: "2025-07-18", tag: "Roofing" },
    ],
    reports: [
      { date: "2025-06-27", title: "Monthly Progress Report — June", photos: 52, author: "Miguel Delgado" },
      { date: "2025-07-25", title: "Monthly Progress Report — July", photos: 47, author: "Miguel Delgado" },
    ],
  },

  {
    id: "RCI-2507",
    name: "Rock Creek ISD — Storm Restoration Package (3 Campuses)",
    owner: "Rock Creek Independent School District",
    address: "1200 Bronco Way, Mansfield, TX 76063",
    sector: "K-12 — Insurance Restoration",
    pm: "Tram Nguyen",
    super: "C. Marsh",
    sub: "Caldwell Roofing Group, LLC (Roofing)",
    status: "Just Started",
    contractDate: "2025-06-30",
    start: "2025-07-14",
    finish: "2025-12-19",
    retainagePct: 5,
    contract: 869300.00,
    insurance: { carrier: "Lone Star Schools Risk Pool", approval: "Approved 6/12/2025", peril: "Hail — April 2025 event" },
    sov: [
      { item: "4001", desc: "Roofing — modified bitumen & shingle mix", scheduled: 522000.00, pct: 9, budget: 441000.00, costToDate: 38200.00 },
      { item: "4002", desc: "Skylights & smoke hatches", scheduled: 84300.00, pct: 0, budget: 71400.00, costToDate: 0 },
      { item: "4003", desc: "HVAC curb & coil protection", scheduled: 66000.00, pct: 0, budget: 55800.00, costToDate: 0 },
      { item: "4004", desc: "Exterior glazing & sealants", scheduled: 92000.00, pct: 4, budget: 77900.00, costToDate: 2900.00 },
      { item: "4005", desc: "General Conditions & Supervision", scheduled: 105000.00, pct: 12, budget: 91000.00, costToDate: 9800.00 },
    ],
    payApps: [
      { num: "455-01", label: "Pay App 1 — Mobilization & Materials", period: "2025-07-31", certified: 92400.00, status: "Draft" },
    ],
    phases: [
      { name: "Mobilization & Submittals", start: "2025-07-14", finish: "2025-08-01", value: 62000, pct: 45 },
      { name: "Campus 1 — Prairie View Elementary", start: "2025-08-04", finish: "2025-09-26", value: 289000, pct: 0 },
      { name: "Campus 2 — Rock Creek Middle", start: "2025-09-15", finish: "2025-11-07", value: 301000, pct: 0 },
      { name: "Campus 3 — Admin & Annex", start: "2025-10-27", finish: "2025-12-12", value: 217300, pct: 0 },
      { name: "Punch & Closeout", start: "2025-12-08", finish: "2025-12-19", value: 0, pct: 0 },
    ],
    changeOrders: [],
    photos: [
      { src: "/yates/assets/photos/q21.jpg", cap: "Campus 1 mobilization — parapet prep and staging", date: "2025-07-21", tag: "Site" },
    ],
    reports: [],
  },
];

/* =========================================================
   BID BUILDER — default template (seeded from the Lakeview Villas scope)
   ========================================================= */
window.JOBS = JOBS;
window.SUBS = SUBS;
window.PEOPLE = PEOPLE;
window.YATES = YATES;

const BID_DEFAULTS = {
  meta: {
    project: "Lakeview Villas — Storm Damage Repairs",
    owner: "Bluebonnet Residential Partners, LP",
    address: "4800 Shoreline Vista Drive, Arlington, TX 76016",
    bidNumber: "Y-2024-0418",
    pm: "Marcus Pruitt",
    super: "D. Kowalski",
    startDate: "2024-10-04",
    validDays: 30,
  },
  levers: { overheadPct: 6.0, profitPct: 9.0, contingencyPct: 0.0, retainagePct: 5.0, taxPct: 0.0, bondPct: 1.0, glPct: 0.85, escalationPct: 0.0 },
  lines: [
    { trade: "Roofing", csi: "07 31 13", desc: "Roof replacement — tear-off, re-deck as required, synthetic underlayment, Class 3 impact-resistant architectural shingles, ridge vents, full flashing package (26 buildings)", qty: 26, unit: "bldg", unitCost: cost(379600.0) / 26, sub: "Caldwell Roofing Group, LLC (Roofing)", offset: 7, dur: 14 },
    { trade: "Carports", csi: "07 41 13", desc: "Carport R-panel replacement incl. trim and fasteners", qty: 1, unit: "LS", unitCost: cost(27600.0), sub: "Caldwell Roofing Group, LLC (Roofing)", offset: 28, dur: 14 },
    { trade: "Gutters", csi: "07 71 23", desc: "Remove & replace 5\" seamless gutters and downspouts, all buildings", qty: 1, unit: "LS", unitCost: cost(46000.0), sub: "Lone Star Seamless Gutters", offset: 35, dur: 7 },
    { trade: "Doors", csi: "08 11 13", desc: "Replace storm-damaged exterior unit doors incl. hardware and paint", qty: 34, unit: "ea", unitCost: cost(27900.0) / 34, sub: "Trinity Carpentry & Millwork", offset: 14, dur: 14 },
    { trade: "Windows & Screens", csi: "08 51 13", desc: "Glass replacement and screen fabrication at damaged openings", qty: 1, unit: "LS", unitCost: cost(9500.00), sub: "Metro Glass & Glazing", offset: 26, dur: 2 },
    { trade: "Chimneys & Rakes", csi: "06 10 00", desc: "Chimney chase rebuilds, rake wall repair, siding & trim at roofline", qty: 1, unit: "LS", unitCost: cost(100600.0), sub: "Trinity Carpentry & Millwork", offset: 14, dur: 14 },
    { trade: "Carpentry / CO", csi: "06 10 53", desc: "Concealed-condition carpentry allowance (decking, fascia, soffit)", qty: 1, unit: "LS", unitCost: cost(47400.00), sub: "Trinity Carpentry & Millwork", offset: 14, dur: 18 },
    { trade: "Fence Staining", csi: "09 93 00", desc: "Pressure wash and re-stain perimeter fencing", qty: 1, unit: "LS", unitCost: cost(9700.0), sub: "Big Tex Fence & Stain", offset: 28, dur: 6 },
    { trade: "General Conditions", csi: "01 31 00", desc: "Dumpsters, temp protection, site logistics, daily cleanup", qty: 1, unit: "LS", unitCost: cost(17600.00), sub: "Self-Perform — Yates Crew", offset: 0, dur: 41 },
    { trade: "Supervision", csi: "01 31 13", desc: "Full-time superintendent, safety program, QC documentation", qty: 1, unit: "LS", unitCost: cost(16500.0), sub: "Self-Perform — Yates Crew", offset: 0, dur: 41 },
  ],
  alternates: [
    { id: "ALT-1", desc: "Upgrade field shingles to Class 4 SBS-modified", amount: 38500.00, included: false },
    { id: "ALT-2", desc: "Carport LED lighting package (26 bays)", amount: 12800.00, included: false },
    { id: "ALT-3", desc: "Deduct — owner-supplied dumpsters & haul-off", amount: -6200.00, included: false },
  ],
  allowances: [
    { desc: "Concealed-condition carpentry (carried in base, SOV 1007)", amount: 47400.00 },
    { desc: "Municipal roofing permit fees", amount: 8500.00 },
  ],
  scopes: {
    "Roofing": "Complete tear-off of existing composition shingles to deck. Inspect decking; replace deteriorated sheathing (allowance carried under Carpentry). Install synthetic underlayment, ice & water shield at valleys and penetrations, new drip edge, pipe jacks and flashings. Install Class 3 impact-resistant architectural shingles per manufacturer specification for full warranty eligibility. Ridge vent at all ridges. Magnetic sweep of grounds daily.",
    "Carports": "Remove hail-damaged R-panel roofing at carport structures. Furnish and install new 26-ga R-panel with matching trim, closures, and fasteners. Verify structural members; report damage beyond surface panels.",
    "Gutters": "Remove existing gutters and downspouts. Furnish and install new 5\" seamless aluminum gutters with hidden hangers and downspouts, color to match trim. Splash blocks at grade terminations.",
    "Doors": "Replace storm-damaged exterior unit entry doors. Includes slab, weatherstrip, threshold, hardware re-key coordination with management, and finish paint.",
    "Windows & Screens": "Replace broken glazing units and fabricate new screens at damaged openings. Match existing frames; OEM-equivalent screen frame and mesh.",
    "Chimneys & Rakes": "Rebuild damaged chimney chases including framing, sheathing, siding, cricket flashing, and caps. Repair rake walls with concealed rot as encountered and documented via photo report.",
    "Carpentry / CO": "Owner allowance for concealed conditions: decking replacement beyond base scope, fascia, soffit and structural repairs, invoiced against documented quantities.",
    "Fence Staining": "Clean and apply semi-transparent stain to perimeter wood fencing damaged by overspray and weathering.",
    "General Conditions": "Project dumpsters and haul-off, temporary protection, resident notification coordination with property management, site logistics and daily cleanup.",
    "Supervision": "Dedicated superintendent for project duration; daily photo documentation via ServiceTitan field sync; weekly owner progress reporting; OSHA-compliant safety program.",
  },
  exclusions: [
    "Interior repairs of any kind unless separately authorized",
    "Mold remediation or asbestos abatement",
    "HVAC condenser comb/replacement (by Owner's mechanical vendor)",
    "Landscaping repair beyond magnetic sweep and debris removal",
    "Permit fees in excess of standard municipal roofing permit",
    "Engineering or structural design services",
  ],
  terms: [
    "Progress billing monthly via AIA G702/G703 with 5% retainage, Net 15 upon owner certification.",
    "Material deposit invoice due at mobilization for procurement of roofing materials.",
    "Concealed conditions billed against documented allowance with photo evidence; approval required before proceeding beyond allowance.",
    "Retainage released with final completion, lien waivers, and warranty documentation.",
    "Proposal valid 30 days from date of issue. Manufacturer warranty: manufacturer limited lifetime; workmanship warranty: 2 years.",
  ],
};
window.BID_DEFAULTS = BID_DEFAULTS;
