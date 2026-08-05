/* =========================================================
   MSM — McCORVEY SHEET METAL WORKS, L.P. · OPERATIONS PORTAL (DEMO)
   HVAC sheet metal ductwork — detailing, fabrication & installation.
   Houston, TX · est. 1925. All project data fictional / illustrative.
   Demo build by Endurance AI Labs: the "single source of truth"
   concept — Vista financials + STRATUS fab data + AI document
   review in one owned system.
   ========================================================= */

const MCCORVEY = {
  brand: "MSM",
  company: "McCorvey Sheet Metal Works, L.P.",
  tagline: "Leaders in the HVAC Industry",
  mission: "Our goal was never to be the largest HVAC ductwork company; we have always strived to be the best.",
  est: "Established 1925",
  hq: "Houston, Texas",
  address: "8610 Wallisville Road, Houston, TX 77029",
  phone: "(713) 672-7545",
  email: "info@mccorvey.com",
  award: "3,000+ major commercial projects completed · 1,200 employees",
  lines: "BIM Design · Pre-Fabrication · HVAC Installation · Turnkey",
  /* compat fields used by document footers */
  legal: "McCorvey Sheet Metal Works, L.P.",
  office: "8610 Wallisville Road, Houston, TX 77029",
  license: "TX TACLA (demo)",
  enr: "Among the largest HVAC ductwork fabricators in the United States",
};
/* legacy alias */
const MCC = MCCORVEY;

/* ---- demo org (fictional personas except public leadership) ---- */
const PEOPLE = {
  pms: ["Travis Boone", "Alicia Grant", "Marcus Webb"],
  supers: ["J. Carter", "R. Salinas", "D. Okafor", "T. Nguyen"],
};

const SUBS = [
  "MSM Field Crew — Self-Perform",
  "MSM Fab — Plant 1 (Wallisville)",
  "MSM Fab — Plant 2 (Spiral & Round)",
  "Gulf Coast Insulation Partners",
  "Lone Star TAB & Balancing",
  "Bayou City Crane & Rigging",
];

/* ---- helper: internal cost basis implied by default levers (OH 6% x profit 9% x bond/GL 1.85%) ---- */
const MULT = 1.06 * 1.09 * 1.0185;
const cost = (sell) => Math.round((sell / MULT) * 100) / 100;

/* =========================================================
   JOBS — construction-division ductwork packages
   ========================================================= */
const JOBS = [
  {
    id: "GCM-2410",
    name: "Gulf Coast Medical Tower — HVAC Ductwork Package",
    owner: "Gulf Coast Health Partners (GC: Harmon Construction)",
    address: "6720 Fannin Corridor, Houston, TX",
    sector: "Healthcare — Full Ductwork Package (LOD 400)",
    pm: "Travis Boone",
    super: "J. Carter",
    sub: "MSM Field Crew — Self-Perform",
    status: "Closeout",
    contractDate: "2024-08-16",
    start: "2024-09-09",
    finish: "2025-06-27",
    retainagePct: 5,
    contract: 6840000.00,
    sov: [
      { item: "1001", desc: "Rectangular Duct — Galvanized, Fab & Deliver (1.42M lbs)", scheduled: 2460000.00, pct: 100, budget: cost(2460000.00), costToDate: Math.round(cost(2460000.00) * 0.962) },
      { item: "1002", desc: "Spiral & Round Duct — Exposed & Concealed", scheduled: 684000.00, pct: 100, budget: cost(684000.00), costToDate: Math.round(cost(684000.00) * 0.955) },
      { item: "1003", desc: "Field Installation Labor — Mains, Risers & Branches", scheduled: 1710000.00, pct: 100, budget: cost(1710000.00), costToDate: Math.round(cost(1710000.00) * 0.978) },
      { item: "1004", desc: "Duct Liner & Wrap Coordination", scheduled: 342000.00, pct: 100, budget: cost(342000.00), costToDate: Math.round(cost(342000.00) * 0.96) },
      { item: "1005", desc: "Fire/Smoke Dampers & Duct Accessories", scheduled: 478000.00, pct: 100, budget: cost(478000.00), costToDate: Math.round(cost(478000.00) * 0.968) },
      { item: "1006", desc: "Diffusers, Registers & Grilles", scheduled: 274000.00, pct: 100, budget: cost(274000.00), costToDate: Math.round(cost(274000.00) * 0.95) },
      { item: "1007", desc: "Kitchen & Lab Exhaust — Welded Stainless", scheduled: 380000.00, pct: 100, budget: cost(380000.00), costToDate: Math.round(cost(380000.00) * 0.985) },
      { item: "1008", desc: "BIM Coordination & Shop Drawings (LOD 400)", scheduled: 205000.00, pct: 100, budget: cost(205000.00), costToDate: Math.round(cost(205000.00) * 0.94) },
      { item: "1009", desc: "General Conditions", scheduled: 171000.00, pct: 100, budget: cost(171000.00), costToDate: Math.round(cost(171000.00) * 0.97) },
      { item: "1010", desc: "Project Management & Engineering", scheduled: 136000.00, pct: 100, budget: cost(136000.00), costToDate: Math.round(cost(136000.00) * 0.95) },
    ],
    payApps: [
      { num: "410-01", label: "Pay App 1 — Mobilization & Coil Stock", period: "2024-10-04", certified: 1368000.00, status: "Paid" },
      { num: "410-02", label: "Pay App 2 — Fab Release Levels 1-6", period: "2024-12-20", certified: 2736000.00, status: "Paid" },
      { num: "410-03", label: "Pay App 3 — Install Through Trim", period: "2025-05-02", certified: 2394000.00, status: "Paid" },
      { num: "410-RET", label: "Retention Release", period: "2025-07-11", certified: 342000.00, status: "Paid" },
    ],
    phases: [
      { name: "BIM Coordination & Clash Sign-Off", start: "2024-09-09", finish: "2024-10-18", value: 205000, pct: 100 },
      { name: "Plant 1 Fabrication — Levels 1-6", start: "2024-10-14", finish: "2024-12-20", value: 1580000, pct: 100 },
      { name: "Plant 1 Fabrication — Levels 7-12", start: "2024-12-02", finish: "2025-02-14", value: 1564000, pct: 100 },
      { name: "Field Rough-In — Risers & Mains", start: "2024-11-04", finish: "2025-02-28", value: 1140000, pct: 100 },
      { name: "Field Rough-In — Branch & Runouts", start: "2025-01-13", finish: "2025-04-18", value: 970000, pct: 100 },
      { name: "Kitchen & Lab Exhaust — Welded", start: "2025-02-03", finish: "2025-04-25", value: 380000, pct: 100 },
      { name: "Dampers, Accessories & Air Devices", start: "2025-03-10", finish: "2025-05-23", value: 752000, pct: 100 },
      { name: "TAB Support & Deficiency Closure", start: "2025-05-19", finish: "2025-06-20", value: 113000, pct: 100 },
      { name: "As-Builts, O&M & Closeout", start: "2025-06-16", finish: "2025-06-27", value: 136000, pct: 100 },
    ],
    changeOrders: [
      { num: "CO-01", desc: "OR suite HEPA exhaust reroute — structural clash discovered at level 4 (GC directive)", amount: 84600.00, status: "Approved" },
    ],
    photos: [],   /* wired below */
    reports: [
      { date: "2024-11-15", title: "Ductwork Progress — Report 1 (Risers & Mains)", photos: 46, author: "Travis Boone" },
      { date: "2025-01-24", title: "Ductwork Progress — Report 2 (Levels 1-6 Trim)", photos: 38, author: "Travis Boone" },
      { date: "2025-03-21", title: "Ductwork Progress — Report 3 (Exhaust Systems)", photos: 29, author: "Travis Boone" },
      { date: "2025-06-13", title: "Ductwork Progress — Report 4 (TAB & Punch)", photos: 61, author: "Travis Boone" },
    ],
  },

  {
    id: "SJC-2502",
    name: "San Jacinto Convention Center Expansion — Sheet Metal Package",
    owner: "San Jacinto Convention District (GC: Titan Builders JV)",
    address: "900 Convention Plaza Dr, Houston, TX",
    sector: "Convention / Public Assembly — Exposed Architectural Duct",
    pm: "Alicia Grant",
    super: "R. Salinas",
    sub: "MSM Fab — Plant 2 (Spiral & Round)",
    status: "In Progress",
    contractDate: "2025-01-17",
    start: "2025-02-10",
    finish: "2026-04-24",
    retainagePct: 10,
    contract: 12400000.00,
    sov: [
      { item: "2001", desc: "BIM Coordination & Shop Drawings (LOD 400)", scheduled: 620000.00, pct: 92, budget: cost(620000.00), costToDate: Math.round(cost(620000.00) * 0.92 * 0.97) },
      { item: "2002", desc: "Rectangular Duct — Fab & Deliver (2.6M lbs)", scheduled: 4340000.00, pct: 64, budget: cost(4340000.00), costToDate: Math.round(cost(4340000.00) * 0.64 * 0.99) },
      { item: "2003", desc: "Exposed Architectural Spiral — Paint-Grade", scheduled: 1860000.00, pct: 41, budget: cost(1860000.00), costToDate: Math.round(cost(1860000.00) * 0.41 * 1.03) },
      { item: "2004", desc: "Field Installation Labor", scheduled: 3100000.00, pct: 47, budget: cost(3100000.00), costToDate: Math.round(cost(3100000.00) * 0.47 * 0.98) },
      { item: "2005", desc: "Fire/Smoke Dampers & Accessories", scheduled: 868000.00, pct: 38, budget: cost(868000.00), costToDate: Math.round(cost(868000.00) * 0.38 * 0.96) },
      { item: "2006", desc: "Air Devices — Diffusers, Registers & Grilles", scheduled: 496000.00, pct: 12, budget: cost(496000.00), costToDate: Math.round(cost(496000.00) * 0.12 * 0.95) },
      { item: "2007", desc: "AHU Rigging & Equipment Setting (18 units)", scheduled: 372000.00, pct: 25, budget: cost(372000.00), costToDate: Math.round(cost(372000.00) * 0.25 * 0.99) },
      { item: "2008", desc: "General Conditions & PM/Engineering", scheduled: 744000.00, pct: 55, budget: cost(744000.00), costToDate: Math.round(cost(744000.00) * 0.55 * 0.97) },
    ],
    payApps: [
      { num: "502-01", label: "Pay App 1 — Mobilization & BIM", period: "2025-03-28", certified: 1041600.00, status: "Paid" },
      { num: "502-02", label: "Pay App 2", period: "2025-05-30", certified: 1687400.00, status: "Paid" },
      { num: "502-03", label: "Pay App 3", period: "2025-07-03", certified: 1489000.00, status: "Paid" },
      { num: "502-04", label: "Pay App 4", period: "2025-07-31", certified: 1240000.00, status: "Pending Owner" },
    ],
    phases: [
      { name: "BIM Coordination & Clash Sign-Off", start: "2025-02-10", finish: "2025-05-16", value: 620000, pct: 92 },
      { name: "Plant Fabrication — Exhibit Halls A-C", start: "2025-04-14", finish: "2025-09-26", value: 3400000, pct: 71 },
      { name: "Plant Fabrication — Ballroom & Meeting Levels", start: "2025-08-04", finish: "2026-01-16", value: 2800000, pct: 18 },
      { name: "Field Rough-In — Halls A-C", start: "2025-06-02", finish: "2025-11-21", value: 2480000, pct: 52 },
      { name: "Exposed Spiral — Concourse & Lobby", start: "2025-09-08", finish: "2026-02-13", value: 1860000, pct: 9 },
      { name: "Trim, Air Devices & TAB Support", start: "2026-01-05", finish: "2026-04-10", value: 992000, pct: 0 },
      { name: "Punch & Closeout", start: "2026-04-06", finish: "2026-04-24", value: 248000, pct: 0 },
    ],
    changeOrders: [
      { num: "CO-01", desc: "Ballroom AV soffit reroute — 40x22 main split to twin 30x16 (architect ASI-014)", amount: 96400.00, status: "Approved" },
      { num: "CO-02", desc: "Added smoke evac duct at Hall C per fire marshal review", amount: 148200.00, status: "Submitted" },
    ],
    photos: [],
    reports: [
      { date: "2025-05-09", title: "Monthly Progress Report — May", photos: 44, author: "Alicia Grant" },
      { date: "2025-06-06", title: "Monthly Progress Report — June", photos: 52, author: "Alicia Grant" },
      { date: "2025-07-11", title: "Monthly Progress Report — July", photos: 47, author: "Alicia Grant" },
    ],
  },

  {
    id: "BPC-2506",
    name: "Bayport Cold Storage Distribution Center — Ductwork & Exhaust",
    owner: "Bayport Industrial REIT (GC: Meridian Design-Build)",
    address: "4200 Port Rd, Pasadena, TX",
    sector: "Industrial / Cold Storage — Insulated Duct Systems",
    pm: "Travis Boone",
    super: "D. Okafor",
    sub: "Gulf Coast Insulation Partners",
    status: "In Progress",
    contractDate: "2025-04-25",
    start: "2025-05-26",
    finish: "2026-01-30",
    retainagePct: 10,
    contract: 4920000.00,
    sov: [
      { item: "3001", desc: "BIM Coordination & Shop Drawings", scheduled: 246000.00, pct: 88, budget: cost(246000.00), costToDate: Math.round(cost(246000.00) * 0.88 * 0.95) },
      { item: "3002", desc: "Rectangular & Spiral Duct — Fab & Deliver", scheduled: 2214000.00, pct: 42, budget: cost(2214000.00), costToDate: Math.round(cost(2214000.00) * 0.42 * 0.98) },
      { item: "3003", desc: "Field Installation Labor — Freezer & Dock Zones", scheduled: 1476000.00, pct: 28, budget: cost(1476000.00), costToDate: Math.round(cost(1476000.00) * 0.28 * 1.02) },
      { item: "3004", desc: "Battery Charging & Welding Exhaust Systems", scheduled: 394000.00, pct: 15, budget: cost(394000.00), costToDate: Math.round(cost(394000.00) * 0.15 * 0.97) },
      { item: "3005", desc: "Dampers, Accessories & Air Devices", scheduled: 344000.00, pct: 12, budget: cost(344000.00), costToDate: Math.round(cost(344000.00) * 0.12 * 0.96) },
      { item: "3006", desc: "General Conditions & PM/Engineering", scheduled: 246000.00, pct: 40, budget: cost(246000.00), costToDate: Math.round(cost(246000.00) * 0.40 * 0.97) },
    ],
    payApps: [
      { num: "506-01", label: "Pay App 1 — Mobilization & BIM", period: "2025-06-27", certified: 528400.00, status: "Paid" },
      { num: "506-02", label: "Pay App 2", period: "2025-07-25", certified: 741600.00, status: "Submitted" },
    ],
    phases: [
      { name: "BIM Coordination & Clash Sign-Off", start: "2025-05-26", finish: "2025-07-11", value: 246000, pct: 88 },
      { name: "Plant Fabrication — Dock & Dry Zones", start: "2025-06-23", finish: "2025-09-19", value: 1240000, pct: 55 },
      { name: "Plant Fabrication — Freezer Zones", start: "2025-09-01", finish: "2025-11-14", value: 974000, pct: 6 },
      { name: "Field Rough-In — Dock & Dry", start: "2025-07-21", finish: "2025-11-07", value: 1180000, pct: 32 },
      { name: "Freezer Zone Install & Exhaust", start: "2025-11-03", finish: "2026-01-09", value: 984000, pct: 0 },
      { name: "Trim, TAB Support & Closeout", start: "2026-01-05", finish: "2026-01-30", value: 296000, pct: 0 },
    ],
    changeOrders: [
      { num: "CO-01", desc: "Dock zone destratification fan duct adders per tenant fit-out rev 2", amount: 62800.00, status: "Approved" },
    ],
    photos: [],
    reports: [
      { date: "2025-06-27", title: "Monthly Progress Report — June", photos: 39, author: "Travis Boone" },
      { date: "2025-07-25", title: "Monthly Progress Report — July", photos: 43, author: "Travis Boone" },
    ],
  },

  {
    id: "ADC-2507",
    name: "Austin Data Center DC-3 — Ductwork Package (4 Halls)",
    owner: "Silverline Data Infrastructure (GC: Corestone Constructors)",
    address: "7800 Innovation Blvd, Austin, TX",
    sector: "Mission Critical — Data Hall Air Distribution",
    pm: "Marcus Webb",
    super: "T. Nguyen",
    sub: "MSM Fab — Plant 1 (Wallisville)",
    status: "Just Started",
    contractDate: "2025-06-27",
    start: "2025-07-14",
    finish: "2026-06-26",
    retainagePct: 5,
    contract: 9150000.00,
    sov: [
      { item: "4001", desc: "BIM Coordination & Shop Drawings", scheduled: 458000.00, pct: 34, budget: cost(458000.00), costToDate: Math.round(cost(458000.00) * 0.34 * 0.94) },
      { item: "4002", desc: "Rectangular Duct — Fab & Deliver (4 halls)", scheduled: 4118000.00, pct: 6, budget: cost(4118000.00), costToDate: Math.round(cost(4118000.00) * 0.06 * 0.98) },
      { item: "4003", desc: "Field Installation Labor", scheduled: 2745000.00, pct: 2, budget: cost(2745000.00), costToDate: Math.round(cost(2745000.00) * 0.02 * 1.0) },
      { item: "4004", desc: "Dampers, Accessories & Containment Duct", scheduled: 915000.00, pct: 0, budget: cost(915000.00), costToDate: 0 },
      { item: "4005", desc: "General Conditions & PM/Engineering", scheduled: 914000.00, pct: 10, budget: cost(914000.00), costToDate: Math.round(cost(914000.00) * 0.10 * 0.96) },
    ],
    payApps: [
      { num: "507-01", label: "Pay App 1 — Mobilization & BIM", period: "2025-07-31", certified: 412600.00, status: "Draft" },
    ],
    phases: [
      { name: "BIM Coordination — Halls 1-2", start: "2025-07-14", finish: "2025-09-12", value: 229000, pct: 62 },
      { name: "BIM Coordination — Halls 3-4", start: "2025-09-01", finish: "2025-11-07", value: 229000, pct: 4 },
      { name: "Plant Fabrication — Hall 1", start: "2025-09-15", finish: "2025-12-05", value: 1030000, pct: 8 },
      { name: "Field Install — Hall 1", start: "2025-11-03", finish: "2026-02-06", value: 1372000, pct: 0 },
      { name: "Fabrication & Install — Halls 2-4", start: "2025-12-08", finish: "2026-05-29", value: 5375000, pct: 0 },
      { name: "TAB Support & Closeout", start: "2026-05-18", finish: "2026-06-26", value: 915000, pct: 0 },
    ],
    changeOrders: [],
    photos: [],
    reports: [],
  },
];

/* ---- photo library (McCorvey site imagery + stock — fictional captions) ---- */
JOBS[0].photos = [
  { src: "/mccorvey/assets/photos/mc01.jpg", cap: "Overhead rectangular mains — patient tower level 6", date: "2025-01-17", tag: "Install" },
  { src: "/mccorvey/assets/photos/mc02.jpg", cap: "Riser install — mechanical shaft B", date: "2024-12-06", tag: "Install" },
  { src: "/mccorvey/assets/photos/b03.jpg", cap: "Plant 1 — coil line run, 22ga galvanized", date: "2024-11-08", tag: "Fabrication" },
  { src: "/mccorvey/assets/photos/b06.jpg", cap: "Welded stainless lab exhaust — spool assembly", date: "2025-02-21", tag: "Welded" },
  { src: "/mccorvey/assets/photos/mc03.jpg", cap: "Branch duct & VAV connections — level 9", date: "2025-03-14", tag: "Install" },
  { src: "/mccorvey/assets/photos/b10.jpg", cap: "TAB support walk with commissioning team", date: "2025-06-13", tag: "Closeout" },
];
JOBS[1].photos = [
  { src: "/mccorvey/assets/photos/mc04.jpg", cap: "Exhibit hall mains — 84x40 trunk sections", date: "2025-06-20", tag: "Install" },
  { src: "/mccorvey/assets/photos/mc05.jpg", cap: "Exposed architectural spiral — concourse mockup", date: "2025-07-03", tag: "Spiral" },
  { src: "/mccorvey/assets/photos/b13.jpg", cap: "Plant 2 spiral line — paint-grade run", date: "2025-06-06", tag: "Fabrication" },
];
JOBS[2].photos = [
  { src: "/mccorvey/assets/photos/mc06.jpg", cap: "Dock zone duct — insulated supply mains", date: "2025-07-18", tag: "Install" },
];
JOBS[3].photos = [
  { src: "/mccorvey/assets/photos/b14.jpg", cap: "Hall 1 coordination model — sign-off review", date: "2025-08-01", tag: "BIM" },
];

window.JOBS = JOBS;
window.SUBS = SUBS;
window.PEOPLE = PEOPLE;
window.MCCORVEY = MCCORVEY;
window.MCC = MCC;

/* =========================================================
   BID BUILDER — default template (full ductwork package)
   ========================================================= */
const BID_DEFAULTS = {
  meta: {
    project: "Gulf Coast Medical Tower — HVAC Ductwork Package",
    owner: "Gulf Coast Health Partners (GC: Harmon Construction)",
    address: "6720 Fannin Corridor, Houston, TX",
    bidNumber: "MSM-2024-1187",
    pm: "Travis Boone",
    super: "J. Carter",
    startDate: "2024-09-09",
    validDays: 30,
  },
  levers: { overheadPct: 6.0, profitPct: 9.0, contingencyPct: 0.0, retainagePct: 5.0, taxPct: 0.0, bondPct: 1.0, glPct: 0.85, escalationPct: 0.0 },
  lines: [
    { trade: "Rectangular Duct", csi: "23 31 13", desc: "Galvanized rectangular duct per SMACNA — fab & deliver, 1.42M lbs", qty: 1420000, unit: "lbs", unitCost: cost(2460000.00) / 1420000, sub: "MSM Fab — Plant 1 (Wallisville)", offset: 35, dur: 120 },
    { trade: "Spiral & Round Duct", csi: "23 31 13", desc: "Spiral & round duct — exposed and concealed runs", qty: 38000, unit: "LF", unitCost: cost(684000.00) / 38000, sub: "MSM Fab — Plant 2 (Spiral & Round)", offset: 45, dur: 100 },
    { trade: "Field Installation", csi: "23 31 13", desc: "Field installation labor — mains, risers, branches & runouts", qty: 1, unit: "LS", unitCost: cost(1710000.00), sub: "MSM Field Crew — Self-Perform", offset: 56, dur: 170 },
    { trade: "Duct Liner & Wrap", csi: "23 07 13", desc: "Duct liner and external wrap coordination w/ insulation partner", qty: 1, unit: "LS", unitCost: cost(342000.00), sub: "Gulf Coast Insulation Partners", offset: 70, dur: 120 },
    { trade: "Dampers & Accessories", csi: "23 33 00", desc: "Fire/smoke dampers, volume dampers, access doors & flex connections", qty: 1, unit: "LS", unitCost: cost(478000.00), sub: "MSM Field Crew — Self-Perform", offset: 84, dur: 110 },
    { trade: "Air Devices", csi: "23 37 13", desc: "Diffusers, registers & grilles per GRD schedule", qty: 2140, unit: "GRD", unitCost: cost(274000.00) / 2140, sub: "MSM Field Crew — Self-Perform", offset: 150, dur: 60 },
    { trade: "Welded Exhaust", csi: "23 38 13", desc: "Kitchen & lab exhaust — welded stainless, liquid-tight per NFPA 96", qty: 1, unit: "LS", unitCost: cost(380000.00), sub: "MSM Fab — Plant 1 (Wallisville)", offset: 100, dur: 80 },
    { trade: "BIM & Shop Drawings", csi: "23 05 00", desc: "LOD 400 coordination model, clash resolution & sign-off drawings", qty: 1, unit: "LS", unitCost: cost(205000.00), sub: "MSM Field Crew — Self-Perform", offset: 0, dur: 40 },
    { trade: "General Conditions", csi: "01 31 00", desc: "Hoisting, lifts, badging, protection and daily coordination", qty: 1, unit: "LS", unitCost: cost(171000.00), sub: "MSM Field Crew — Self-Perform", offset: 0, dur: 290 },
    { trade: "PM & Engineering", csi: "01 31 13", desc: "Project management, engineering, submittals and closeout documentation", qty: 1, unit: "LS", unitCost: cost(136000.00), sub: "MSM Field Crew — Self-Perform", offset: 0, dur: 290 },
  ],
  alternates: [
    { id: "ALT-1", desc: "Upgrade OR suite exhaust to fully welded 316 stainless", amount: 96500.00, included: false },
    { id: "ALT-2", desc: "Double-wall insulated duct in lieu of lined — patient floors", amount: 214000.00, included: false },
    { id: "ALT-3", desc: "Deduct — owner-furnished air devices (install only)", amount: -118000.00, included: false },
    { id: "ALT-4", desc: "Phased overtime acceleration — 3-week schedule recovery", amount: 167000.00, included: false },
  ],
  allowances: [
    { desc: "Concealed-condition / structural clash reroute allowance", amount: 85000.00 },
    { desc: "Permit & inspection fees", amount: 12500.00 },
  ],
  scopes: {
    "Rectangular Duct": "Fabricate and deliver galvanized rectangular ductwork per SMACNA HVAC Duct Construction Standards and the project gauge schedule. Includes seams, sealant class per spec section 23 31 13, and delivery in coordinated spool packages.",
    "Spiral & Round Duct": "Fabricate spiral and round duct including exposed paint-grade runs. Machine-formed fittings, gasketed connections where specified.",
    "Field Installation": "Complete field installation of all ductwork — mains, risers, branches and runouts — including hangers and supports per 23 05 29 and seismic bracing where required.",
    "Duct Liner & Wrap": "Coordinate and manage duct liner and external insulation scope with insulation partner; liner installed at the plant where scheduled.",
    "Dampers & Accessories": "Furnish and install fire/smoke dampers, volume dampers, access doors, flexible connections and turning vanes per 23 33 00.",
    "Air Devices": "Furnish and install diffusers, registers and grilles per the GRD schedule; final trim aligned with architectural ceilings.",
    "Welded Exhaust": "Kitchen and lab exhaust systems — continuous liquid-tight welded construction per NFPA 96 and 23 38 13, with cleanouts and access per code.",
    "BIM & Shop Drawings": "Full LOD 400 coordination model, clash detection participation, signed-off shop and spool drawings released to the plant via STRATUS.",
    "General Conditions": "Hoisting and rigging, lifts, badging and background-checked crews, protection of finishes, daily coordination with the GC.",
    "PM & Engineering": "Dedicated project manager and engineering support, submittal package, O&M documentation, as-builts and warranty.",
  },
  exclusions: [
    "HVAC equipment purchase (AHUs, RTUs, VAVs — rigging/setting only where listed)",
    "Temperature controls, BAS and controls wiring (by others)",
    "Electrical power wiring and fire alarm connections to dampers",
    "TAB — testing, adjusting and balancing (support included; TAB by others)",
    "Roof curbs, penetrations, patching and structural steel beyond duct supports",
    "Painting of exposed duct beyond shop prime (finish paint by others unless alternate accepted)",
  ],
  terms: [
    "Progress billing monthly via AIA G702/G703 with 5% retainage, Net 30 upon GC certification.",
    "Coil stock deposit invoice due at mobilization to lock steel pricing for the fabrication schedule.",
    "Concealed conditions billed against documented allowance with photo evidence; approval required before proceeding beyond allowance.",
    "Retainage released with final completion, lien waivers, as-builts and closeout sign-off.",
    "Proposal valid 30 days. Steel surcharge escalation applies after validity per attached index. MSM workmanship warranty: 2 years.",
  ],
};
window.BID_DEFAULTS = BID_DEFAULTS;


/* =========================================================
   EXTENDED JOB REGISTER — generated deterministically so every
   SOV, pay app and phase reconciles with jobMetrics math.
   Typical MSM work: healthcare, aviation, mission critical,
   higher-ed, K-12, hospitality, industrial, public assembly.
   ========================================================= */
(function () {
  const CATALOG = [
    ["HIA-2318", "Houston Intercontinental — Concourse D Ductwork", "Houston Airport System (GC: Archer-Gray JV)", "2800 N Terminal Rd, Houston, TX", "Aviation — Concourse Air Distribution", "Alicia Grant", "R. Salinas", 0, "Complete", "2023-10-02", "2025-01-31", 18600000, 5, 100, 0.97],
    ["SAM-2402", "St. Anne's Medical Pavilion — Ductwork Package", "St. Anne's Health System (GC: Harmon Construction)", "9200 Medical Plaza Dr, Houston, TX", "Healthcare — Patient Tower Ductwork", "Travis Boone", "J. Carter", 1, "In Progress", "2024-03-04", "2026-02-27", 8400000, 10, 62, 0.98],
    ["UTL-2405", "University Research Lab Building — Exhaust & Supply", "Texas University System (CM: Vaughn CM)", "Research Park Blvd, Austin, TX", "Higher Ed — Lab Exhaust (Welded)", "Marcus Webb", "T. Nguyen", 1, "Complete", "2024-05-06", "2025-06-27", 5200000, 5, 100, 0.96],
    ["CTE-2408", "Cypress CTE Center — HVAC Ductwork", "Cypress Ridge ISD (GC: Meridian Design-Build)", "12800 Cypress Ridge Dr, Cypress, TX", "K-12 — CTE / Shop Ventilation", "Marcus Webb", "D. Okafor", 0, "Complete", "2024-08-12", "2025-05-30", 2400000, 5, 100, 0.95],
    ["OTW-2411", "One Twelve Tower — TI Floors 18-24 Ductwork", "Landmark Property Trust (GC: Corestone)", "112 Main St, Houston, TX", "Commercial — Tenant Improvement", "Alicia Grant", "R. Salinas", 0, "Complete", "2024-11-04", "2025-04-25", 1900000, 5, 100, 0.94],
    ["HRT-2501", "Hill Country Resort & Spa — Ductwork Package", "Hill Country Hospitality Group (GC: Titan Builders)", "18400 Resort Ranch Rd, San Antonio, TX", "Hospitality — Resort & Conference", "Alicia Grant", "D. Okafor", 2, "In Progress", "2025-01-13", "2026-03-27", 6300000, 10, 28, 0.99],
    ["PCA-2502", "Petrochem Admin & Control Complex — HVAC Sheet Metal", "Gulf Coast Energy Partners (EPC: Sterling)", "1400 Battleground Rd, Deer Park, TX", "Industrial — Pressurized Control Rooms", "Travis Boone", "J. Carter", 1, "In Progress", "2025-02-17", "2025-12-19", 3800000, 10, 51, 0.96],
    ["STD-2503", "Memorial Stadium Club Level — Renovation Ductwork", "Memorial Athletics Authority (GC: Archer-Gray)", "1 Stadium Dr, Houston, TX", "Public Assembly — Club & Suites Reno", "Marcus Webb", "R. Salinas", 0, "Closeout", "2025-03-03", "2025-08-15", 4500000, 5, 100, 1.03],
    ["SFB-2504", "Silicon Ranch Fab Support Building — Cleanroom Duct", "Silicon Ranch Semiconductor (GC: Corestone)", "5600 Chip Plant Rd, Taylor, TX", "Mission Critical — Cleanroom Stainless", "Travis Boone", "T. Nguyen", 2, "In Progress", "2025-04-07", "2026-06-26", 14200000, 10, 33, 1.01],
    ["WSS-2505", "Westport Spec Shells (3 Bldgs) — Ductwork", "Westport Industrial Partners (GC: Meridian)", "8800 Westport Pkwy, Katy, TX", "Industrial — Spec Warehouse", "Marcus Webb", "D. Okafor", 0, "Complete", "2025-05-05", "2025-10-17", 2700000, 5, 100, 0.93],
    ["GDC-2506", "Gulfway Grocery Distribution Center — Ductwork & Exhaust", "Gulfway Grocers, Inc. (GC: Titan Builders)", "10200 Gulfway Dr, Baytown, TX", "Industrial — Distribution & Cold Dock", "Travis Boone", "J. Carter", 0, "In Progress", "2025-05-19", "2025-12-05", 3400000, 10, 68, 0.95],
    ["HCC-2507", "Harris County Courthouse Annex — Renovation Ductwork", "Harris County Facilities (CM: Vaughn CM)", "1201 Congress St, Houston, TX", "Municipal — Historic Renovation", "Alicia Grant", "R. Salinas", 0, "Just Started", "2025-07-07", "2026-03-20", 2200000, 5, 8, 0.97],
    ["KSD-2508", "Katy ISD — CUP & Two Campus Additions", "Katy Springs ISD (GC: Harmon Construction)", "Districtwide · Katy, TX", "K-12 — Central Utility Plant & Additions", "Marcus Webb", "D. Okafor", 1, "In Progress", "2025-03-10", "2026-07-31", 7600000, 5, 39, 0.98],
    ["DC4-2510", "Austin Data Center DC-4 — Ductwork Package", "Silverline Data Infrastructure (GC: Corestone)", "7900 Innovation Blvd, Austin, TX", "Mission Critical — Data Hall Air Distribution", "Marcus Webb", "T. Nguyen", 1, "Awarded", "2025-10-06", "2026-10-30", 11800000, 5, 0, 1.0],
    ["CHE-2511", "Children's Hospital Expansion — Ductwork Package", "Bluebird Children's Health (GC: Harmon Construction)", "6900 Fannin Corridor, Houston, TX", "Healthcare — Bed Tower Expansion", "Travis Boone", "J. Carter", 1, "Awarded", "2025-11-03", "2027-04-30", 9700000, 10, 0, 1.0],
    ["CVH-2509", "Convention District Hotel Tower — Sheet Metal Package", "San Jacinto Hospitality LP (GC: Titan Builders JV)", "1000 Convention Plaza Dr, Houston, TX", "Hospitality — 42-Story Hotel Tower", "Alicia Grant", "R. Salinas", 2, "In Progress", "2025-06-02", "2027-01-29", 16400000, 10, 21, 0.99],
    ["GPM-2503", "Grand Parkway Medical City — Central Plant & Towers", "Grand Parkway Health (GC: Archer-Gray JV)", "24500 Grand Parkway, Richmond, TX", "Healthcare — Multi-Tower Campus", "Travis Boone", "J. Carter", 1, "In Progress", "2025-03-17", "2027-06-25", 28500000, 5, 36, 0.98],
  ];

  const SOV_T = [
    ["Ductwork Fabrication — Galv, Spiral & Welded", 0.44],
    ["Field Installation Labor & Hangers", 0.26],
    ["BIM Coordination & Shop Drawings", 0.07],
    ["Dampers, Accessories & Air Devices", 0.12],
    ["General Conditions & PM/Engineering", 0.11],
  ];
  const PH_T = [
    ["BIM Coordination & Sign-Off", 0.12],
    ["Shop Fabrication & Plant Release", 0.34],
    ["Field Rough-In — Mains & Risers", 0.30],
    ["Branch, Trim & Air Devices", 0.16],
    ["TAB Support, Punch & Closeout", 0.08],
  ];
  const hash = (s) => { let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 9973; return h; };
  const addM = (iso, n) => { const d = new Date(iso + "T12:00:00"); d.setMonth(d.getMonth() + n); return d.toISOString().slice(0, 10); };

  CATALOG.forEach((c) => {
    const id = c[0], name = c[1], owner = c[2], address = c[3], sector = c[4], pm = c[5], sup = c[6],
          subIdx = c[7], status = c[8], start = c[9], finish = c[10], contract = c[11], ret = c[12],
          pct = c[13], costFactor = c[14];
    const h = hash(id);
    const prefix = 100 + (h % 800);

    const sov = SOV_T.map((t, i) => {
      const scheduled = Math.round(contract * t[1] / 100) * 100;
      const budget = Math.round(scheduled / 1.176);
      const gate = [0.0, 0.15, 0.45, 0.75, 0.35][i];
      let linePct = pct >= 100 ? 100 : Math.max(0, Math.min(100, Math.round((pct - gate * 100) / (1 - gate + 0.0001))));
      if (pct === 0) linePct = 0;
      const costToDate = Math.round(budget * linePct / 100 * costFactor);
      return { item: String(prefix) + (i + 1), desc: t[0], scheduled, pct: linePct, budget, costToDate };
    });
    sov[0].scheduled += contract - sov.reduce((s, r) => s + r.scheduled, 0);

    const earned = sov.reduce((s, r) => s + r.scheduled * r.pct / 100, 0);

    const payApps = [];
    if (earned > 0) {
      const done = pct >= 100;
      const nApps = done ? 3 : Math.max(1, Math.min(4, Math.floor(pct / 22)) || 1);
      const billable = earned * (1 - ret / 100);
      for (let i = 0; i < nApps; i++) {
        const last = i === nApps - 1;
        payApps.push({
          num: prefix + "-0" + (i + 1),
          label: i === 0 ? "Pay App 1 — Mobilization & Coil Stock" : "Pay App " + (i + 1),
          period: addM(start, i + 1),
          certified: Math.round(billable / nApps * 100) / 100,
          status: done ? "Paid" : last ? ["Submitted", "Pending Owner", "Draft"][h % 3] : "Paid",
        });
      }
      if (done) payApps.push({ num: prefix + "-RET", label: "Retention Release", period: addM(start, nApps + 1), certified: Math.round(earned * ret / 100 * 100) / 100, status: "Paid" });
    }

    const t0 = new Date(start + "T12:00:00").getTime(), t1 = new Date(finish + "T12:00:00").getTime();
    let cum = 0;
    const phases = PH_T.map((p, i) => {
      const s = new Date(t0 + (t1 - t0) * cum).toISOString().slice(0, 10);
      cum += p[1];
      const f = new Date(t0 + (t1 - t0) * Math.min(1, cum)).toISOString().slice(0, 10);
      const gate = [0, 0.15, 0.6, 0.8, 0.95][i];
      let ppct = pct >= 100 ? 100 : Math.max(0, Math.min(100, Math.round((pct - gate * 100) / (1 - gate + 0.0001))));
      if (pct === 0) ppct = 0;
      return { name: p[0], start: s, finish: f, value: Math.round(contract * p[1]), pct: ppct };
    });

    JOBS.push({
      id: id, name: name, owner: owner, address: address, sector: sector, pm: pm, super: sup, sub: SUBS[subIdx],
      status: status, contractDate: addM(start, -1), start: start, finish: finish,
      retainagePct: ret, contract: contract, sov: sov, payApps: payApps, phases: phases,
      changeOrders: (h % 3 === 0 && pct > 20) ? [{ num: "CO-01", desc: "GC-directed reroutes at congested corridors per coordination rev", amount: Math.round(contract * 0.021 / 100) * 100, status: h % 2 ? "Approved" : "Submitted" }] : [],
      photos: pct > 0 ? [{ src: "/mccorvey/assets/photos/b" + String((h % 14) + 1).padStart(2, "0") + ".jpg", cap: "Field progress — " + name.split("—")[1].trim().toLowerCase(), date: addM(start, 1), tag: "Install" }] : [],
      reports: pct > 10 && pct < 100 ? [{ date: addM(start, 1), title: "Monthly Progress Report", photos: 18 + (h % 30), author: pm }] : [],
    });
  });
})();

/* =========================================================
   ESTIMATING CATALOG — dropdown options for the Bid Builder
   ========================================================= */
const CSI_OPTIONS = [
  ["01 31 00", "Project Management & Coordination"],
  ["01 31 13", "Project Coordination"],
  ["01 79 00", "Demonstration & Training"],
  ["23 05 00", "Common Work Results for HVAC"],
  ["23 05 29", "Hangers & Supports for HVAC"],
  ["23 05 53", "Identification for HVAC"],
  ["23 05 93", "Testing, Adjusting & Balancing"],
  ["23 07 13", "Duct Insulation"],
  ["23 31 13", "Metal Ducts"],
  ["23 31 16", "Nonmetal Ducts"],
  ["23 33 00", "Air Duct Accessories"],
  ["23 33 13", "Dampers"],
  ["23 33 46", "Flexible Ducts"],
  ["23 34 23", "HVAC Power Ventilators"],
  ["23 36 00", "Air Terminal Units"],
  ["23 37 13", "Diffusers, Registers & Grilles"],
  ["23 38 13", "Commercial Kitchen Hoods & Exhaust"],
  ["26 05 00", "Common Work Results for Electrical"],
];
const UNITS = ["LS", "lbs", "LF", "SF", "ea", "floor", "bldg", "hall", "hood", "GRD", "VAV", "hr", "wk"];
const TRADE_CATALOG = [
  { trade: "Rectangular Duct", csi: "23 31 13", unit: "lbs", sub: 1, descs: [
    "Galvanized rectangular duct per SMACNA — fab & deliver",
    "Rectangular duct — TDC/TDF connections, sealant class A",
    "Medium-pressure rectangular mains per gauge schedule",
    "Aluminum rectangular duct — natatorium / corrosive environment",
    "Double-wall insulated rectangular duct — acoustic core",
    "Rectangular fitting package — elbows, transitions & taps" ] },
  { trade: "Spiral & Round Duct", csi: "23 31 13", unit: "LF", sub: 2, descs: [
    "Spiral duct — machine-formed, concealed runs",
    "Exposed architectural spiral — paint-grade finish",
    "Round duct & fittings — gasketed self-sealing connections",
    "Oval duct where structure limits round profiles",
    "Stainless spiral for moisture-laden exhaust" ] },
  { trade: "Welded Exhaust", csi: "23 38 13", unit: "LS", sub: 1, descs: [
    "Kitchen exhaust — continuous liquid-tight weld per NFPA 96",
    "Lab / fume exhaust — welded 304 stainless",
    "Dishwasher & moisture exhaust — welded aluminum or stainless",
    "Generator & battery room exhaust systems",
    "Grease duct wrap coordination and access door layout" ] },
  { trade: "Field Installation", csi: "23 31 13", unit: "LS", sub: 0, descs: [
    "Field installation — mains, risers, branches & runouts",
    "Installation labor incl. hangers & supports per 23 05 29",
    "Seismic bracing and support engineering where required",
    "After-hours / occupied-facility installation protocols",
    "Duct demolition and removal of abandoned systems" ] },
  { trade: "BIM & Shop Drawings", csi: "23 05 00", unit: "LS", sub: 0, descs: [
    "LOD 400 coordination model & clash resolution",
    "Shop & spool drawings released to plant via STRATUS",
    "Coordination drawings signed off with all MEP trades",
    "Laser scanning of existing conditions for renovation scopes",
    "Hanger & sleeve drawings with embed layout" ] },
  { trade: "Dampers & Accessories", csi: "23 33 00", unit: "ea", sub: 0, descs: [
    "Fire/smoke dampers furnished & installed per code",
    "Volume dampers, access doors & flexible connections",
    "Motorized damper coordination with controls contractor",
    "Turning vanes and duct-mounted accessories",
    "Sound attenuators per acoustic consultant schedule" ] },
  { trade: "Air Devices", csi: "23 37 13", unit: "GRD", sub: 0, descs: [
    "Diffusers, registers & grilles per GRD schedule",
    "Linear slot diffusers with plenum boxes",
    "Displacement ventilation outlets — public assembly",
    "Security grilles at detention/behavioral areas",
    "Architectural custom air devices — finish coordination" ] },
  { trade: "Air Terminal Units", csi: "23 36 00", unit: "VAV", sub: 0, descs: [
    "VAV terminal setting & duct connections (units by others)",
    "Fan-powered box setting with inlet/outlet transitions",
    "Terminal unit hanging, isolation and access clearances" ] },
  { trade: "Equipment Rigging", csi: "23 05 00", unit: "ea", sub: 5, descs: [
    "AHU rigging & setting incl. crane coordination",
    "RTU setting with curb adaptation",
    "Fan array and power ventilator setting per 23 34 23",
    "Splitting, skidding & reassembly of oversized units" ] },
  { trade: "Duct Liner & Wrap", csi: "23 07 13", unit: "SF", sub: 3, descs: [
    "Duct liner installed at plant — acoustic & thermal",
    "External duct wrap coordination with insulation partner",
    "Grease duct fire wrap per listed system" ] },
  { trade: "TAB Support", csi: "23 05 93", unit: "LS", sub: 4, descs: [
    "TAB support — damper adjustment & access provisioning",
    "Duct leakage testing per SMACNA leakage class",
    "Deficiency closure from TAB and commissioning reports" ] },
  { trade: "Plant Fabrication", csi: "23 31 13", unit: "lbs", sub: 1, descs: [
    "Plasma table & coil line production — galvanized",
    "Spot-weld and Pittsburgh seam lines — light gauge",
    "Stainless & aluminum TIG welded fabrication",
    "Powder coat / paint-grade finishing for exposed work" ] },
  { trade: "General Conditions", csi: "01 31 00", unit: "LS", sub: 0, descs: [
    "Hoisting, lifts, badging, protection & daily coordination",
    "General conditions — supervision, safety and cleanup",
    "Occupied-facility protocols: escorts, after-hours & shutdowns",
    "Material logistics, laydown and just-in-time spool delivery" ] },
  { trade: "PM & Engineering", csi: "01 31 13", unit: "LS", sub: 0, descs: [
    "Project management, engineering, submittals & closeout docs",
    "Submittal package — gauge schedules, hangers, seismic calcs",
    "Coordination with GC schedule and MEP trade partners",
    "As-builts, O&M documentation and warranty administration" ] },
];
window.CSI_OPTIONS = CSI_OPTIONS;
window.UNITS = UNITS;
window.TRADE_CATALOG = TRADE_CATALOG;


/* =========================================================
   ENGINEERING LAYER — VDC/BIM process, submittal register,
   RFIs, systems schedule and fabrication agreements. Mirrors
   the real MSM workflow: estimating → VDC → plant → field.
   ========================================================= */
const DESIGN_PROCESS = [
  "Estimating-to-VDC turnover — award package & scope review",
  "Existing conditions capture & model setup (LOD 400)",
  "BIM coordination — clash detection with all MEP trades",
  "Signed-off shop & spool drawings released to plant (STRATUS)",
  "Plant release — plasma, coil line & spiral scheduling",
  "Field release — spool maps, hanger drawings & install packages",
];
const SERVICE_TIERS = {
  "Standing PO": ["Reserved weekly plant capacity", "Dedicated account detailer", "Same-week shipping on stock fittings"],
  "Weekly Release": ["Reserved weekly plant capacity", "Dedicated account detailer", "Same-week shipping on stock fittings", "Spool-map packaging by area", "Jobsite JIT delivery windows"],
  "On-Demand": ["Quoted per release", "Standard 10-day plant turnaround", "Will-call or freight"],
  "Custom": ["Program built from any combination of fabrication, delivery and detailing services"],
};
window.DESIGN_PROCESS = DESIGN_PROCESS;
window.SERVICE_TIERS = SERVICE_TIERS;

(function () {
  const hash = (s) => { let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 9973; return h; };
  const addD = (iso, n) => { const d = new Date(iso + "T12:00:00"); d.setDate(d.getDate() + n); return d.toISOString().slice(0, 10); };

  const SUB_T = [
    ["TOC.1", "Submittal Index & Table of Contents"],
    ["STD.1", "SMACNA Duct Construction Standards & Sealant Classes"],
    ["GAU.1", "Gauge Schedule & Reinforcement Tables"],
    ["HGR.1", "Hangers, Supports & Seismic Bracing Details"],
    ["SPL.1", "Spiral & Round Duct Cutsheets"],
    ["DMP.1", "Fire/Smoke Damper Schedule & Cutsheets"],
    ["GRD.1", "Air Device (GRD) Schedule & Cutsheets"],
    ["KEX.1", "Kitchen/Lab Exhaust — Welded Construction Details"],
    ["BIM.1", "Coordination Drawings — Level-by-Level Sign-Off"],
    ["ASB.1", "As-Built & Closeout Package Format"],
  ];
  const RFI_SUBJECTS = [
    "Gauge schedule conflict — spec 23 31 13 table vs. drawing M-601 general notes",
    "Structural clash at level 3 corridor — 54x24 main vs. beam pocket, reroute needed",
    "Ceiling cavity at corridor 214 insufficient for scheduled duct depth plus liner",
    "Fire/smoke damper rating at shaft wall B-2 — drawing shows 1.5hr, spec requires 3hr",
    "Kitchen exhaust routing over electrical room conflicts with NFPA 96 clearances",
    "Addendum 3 revised diffuser schedule quantities — confirm governs over M-702",
  ];

  JOBS.forEach((j) => {
    const h = hash(j.id);
    const m = j.sov.reduce((a, r) => a + r.scheduled * r.pct / 100, 0);
    const pct = j.contract ? m / j.contract * 100 : 0;

    /* VDC process: steps complete scale with progress; awarded jobs are mid-turnover */
    const doneSteps = pct >= 15 ? 6 : pct > 0 ? 4 + (h % 2) : (j.status === "Awarded" ? 1 + (h % 2) : 6);
    const design = DESIGN_PROCESS.map((step, i) => ({ step, done: i < doneSteps }));

    /* submittal register */
    const submittals = SUB_T.map((t, i) => {
      let status, rev = "0";
      if (pct >= 25) { status = (i === 9 && h % 2) ? "Approved as Noted" : "Approved"; rev = (h + i) % 3 ? "1" : "0"; }
      else if (pct > 5) { status = ["Under Review", "Submitted", "Approved", "RFI Open"][(h + i) % 4]; }
      else if (pct > 0) { status = i < 4 ? "Submitted" : "Preparing"; }
      else { status = i < 2 ? "Preparing" : "Not Started"; }
      return { no: t[0], name: t[1], rev, status, date: addD(j.start, 7 + i * 2) };
    });

    /* RFIs */
    const rfis = [];
    if (pct > 0 && pct < 90 && h % 3 !== 1) {
      const n = 1 + (h % 2);
      for (let i = 0; i < n; i++) {
        rfis.push({
          num: "RFI-0" + (i + 1),
          subject: RFI_SUBJECTS[(h + i * 2) % RFI_SUBJECTS.length],
          issued: addD(j.start, 10 + i * 9),
          status: (h + i) % 2 ? "Answered" : "Open",
        });
      }
    }

    /* systems schedule (scaled to contract) */
    const scale = Math.max(1, Math.round(j.contract / 1200000));
    const eq = [];
    const sec = j.sector.toLowerCase();
    if (sec.includes("health")) {
      eq.push(["RECT", "Rectangular duct — patient floors", 180 * scale, 1000]);
      eq.push(["WELD", "Welded stainless exhaust systems", 2 * Math.max(1, Math.round(scale / 2)), 540]);
      eq.push(["FSD", "Fire/smoke dampers", 60 * scale, 1]);
      eq.push(["GRD", "Air devices", 320 * scale, 1]);
    } else if (sec.includes("mission critical") || sec.includes("cleanroom") || sec.includes("data")) {
      eq.push(["RECT", "Rectangular duct — halls & galleries", 260 * scale, 1000]);
      eq.push(["DMP", "Control & isolation dampers", 40 * scale, 1]);
      eq.push(["SS", "Stainless / cleanroom duct sections", 3 * scale, 800]);
    } else if (sec.includes("aviation") || sec.includes("assembly") || sec.includes("convention") || sec.includes("hospitality")) {
      eq.push(["RECT", "Rectangular duct — concourse & BOH", 220 * scale, 1000]);
      eq.push(["SPIR", "Exposed architectural spiral (LF)", 6 * scale, 100]);
      eq.push(["GRD", "Air devices incl. linear slots", 260 * scale, 1]);
    } else if (sec.includes("industrial") || sec.includes("distribution") || sec.includes("warehouse") || sec.includes("cold")) {
      eq.push(["RECT", "Rectangular & spiral duct", 140 * scale, 1000]);
      eq.push(["EXH", "Process & battery exhaust systems", 3 * Math.max(1, Math.round(scale / 2)), 420]);
      eq.push(["DEST", "Destratification / HVLS duct adapters", 8 * scale, 1]);
    } else {
      eq.push(["RECT", "Rectangular duct", 150 * scale, 1000]);
      eq.push(["GRD", "Air devices", 180 * scale, 1]);
      eq.push(["FSD", "Fire/smoke dampers", 30 * scale, 1]);
    }
    const equipment = eq.map((e) => ({ tag: e[0], desc: e[1], qty: e[2], ptsEach: e[3], controller: "STRATUS pkg", points: e[2] * e[3] }));

    /* fabrication program (plant relationship post-project) */
    const tiers = ["Standing PO", "Weekly Release", "On-Demand", "Custom"];
    const tier = tiers[h % 4];
    const servicePkg = pct >= 100 ? { tier, status: "Active" } : pct > 40 ? { tier, status: "Proposed" } : null;

    j.eng = { design, submittals, rfis, equipment, servicePkg };
  });
})();


/* =========================================================
   FABRICATION DIVISION — Duct Direct accounts + shop floor board.
   Plants: Wallisville Rd (Plant 1), Spiral & Round (Plant 2).
   ========================================================= */
const SERVICE_AGREEMENTS = [
  { client: "Lone Star Mechanical", line: "Rect", svcType: "Duct Direct", site: "Houston metro projects", tier: "Standing PO", monthly: 148000, start: "2025-01-01", renewal: "2026-12-31", status: "Active", tech: "Plant 1 — Bay 3" },
  { client: "Gulf Coast Mechanical Group", line: "Rect + Spiral", svcType: "Duct Direct", site: "TX Gulf Coast", tier: "Weekly Release", monthly: 212000, start: "2025-02-01", renewal: "2027-01-31", status: "Active", tech: "Plant 1 — Bay 1" },
  { client: "Alamo Air Systems", line: "Spiral", svcType: "Duct Direct", site: "San Antonio", tier: "Weekly Release", monthly: 96000, start: "2024-03-01", renewal: "2026-08-31", status: "Expiring", tech: "Plant 2 — Spiral" },
  { client: "Hill Country HVAC", line: "Rect", svcType: "Duct Direct", site: "Austin metro", tier: "On-Demand", monthly: 44000, start: "2024-04-01", renewal: "2027-03-31", status: "Active", tech: "Plant 1 — Bay 2" },
  { client: "Bayou Mechanical", line: "Welded", svcType: "Fab Partner", site: "Petrochem corridor", tier: "Standing PO", monthly: 118000, start: "2024-08-01", renewal: "2026-09-30", status: "Expiring", tech: "Plant 1 — Weld Shop" },
  { client: "Piney Woods Mech", line: "Rect", svcType: "Duct Direct", site: "East TX", tier: "On-Demand", monthly: 31000, start: "2024-05-01", renewal: "2027-04-30", status: "Active", tech: "Plant 1 — Bay 2" },
  { client: "Metroplex Air", line: "Rect + Spiral", svcType: "Duct Direct", site: "DFW", tier: "Weekly Release", monthly: 164000, start: "2025-03-01", renewal: "2027-02-28", status: "Active", tech: "Plant 1 — Bay 3" },
  { client: "Way Mechanical (affiliate)", line: "Rect", svcType: "Fab Partner", site: "TX + Southeast", tier: "Standing PO", monthly: 385000, start: "2025-06-01", renewal: "2027-05-31", status: "Active", tech: "Plant 1 — Bay 1" },
  { client: "Coastal Commercial HVAC", line: "Spiral", svcType: "Duct Direct", site: "Corpus Christi", tier: "On-Demand", monthly: 27000, start: "2024-10-01", renewal: "2026-09-30", status: "Expiring", tech: "Plant 2 — Spiral" },
  { client: "Summit Mechanical Partners", line: "Rect", svcType: "Duct Direct", site: "OK + North TX", tier: "Custom", monthly: 88000, start: "2025-07-01", renewal: "2027-06-30", status: "Active", tech: "Plant 1 — Bay 2" },
  { client: "Kirlin Way (affiliate)", line: "Welded", svcType: "Fab Partner", site: "Mid-Atlantic", tier: "Custom", monthly: 142000, start: "2025-01-15", renewal: "2027-01-14", status: "Active", tech: "Plant 1 — Weld Shop" },
  { client: "Rio Grande Air Conditioning", line: "Rect", svcType: "Duct Direct", site: "RGV", tier: "On-Demand", monthly: 39000, start: "2025-09-01", renewal: "2026-10-15", status: "Proposed", tech: "—" },
  { client: "Silverline DC Facilities", line: "Rect", svcType: "OEM Program", site: "Data center campuses", tier: "Standing PO", monthly: 205000, start: "2026-02-01", renewal: "2027-01-31", status: "Proposed", tech: "—" },
  { client: "Trinity Commercial Services", line: "Spiral", svcType: "Duct Direct", site: "Dallas", tier: "Weekly Release", monthly: 71000, start: "2025-12-01", renewal: "2026-11-30", status: "Proposed", tech: "—" },
];
const SERVICE_CALLS = [
  { num: "WO-8211", client: "SJC-2502 Convention Center", issue: "Exposed spiral rerun — 620 LF paint-grade 26ga, ballroom rev ASI-014", priority: "Emergency", tech: "Plant 2 — Spiral", status: "In Fabrication", opened: "2026-07-27" },
  { num: "WO-8209", client: "Way Mechanical (affiliate)", issue: "Hospital package release 14 — 38,000 lbs rect, TDC, liner installed at plant", priority: "High", tech: "Plant 1 — Bay 1", status: "In Fabrication", opened: "2026-07-27" },
  { num: "WO-8206", client: "Lone Star Mechanical", issue: "Stock fitting order — 240 ea 90° elbows w/ vanes, mixed sizes", priority: "Standard", tech: "Plant 1 — Bay 3", status: "Queued", opened: "2026-07-26" },
  { num: "WO-8204", client: "GPM-2503 Medical City", issue: "Central plant welded exhaust spools — 304SS, 11 assemblies", priority: "Standard", tech: "Plant 1 — Weld Shop", status: "Cutting", opened: "2026-07-26" },
  { num: "WO-8199", client: "Gulf Coast Mechanical Group", issue: "Weekly release — 22,400 lbs rect + 1,800 LF spiral, JIT Thursday", priority: "High", tech: "Plant 1 — Bay 1", status: "QC Hold", opened: "2026-07-24" },
  { num: "WO-8195", client: "SFB-2504 Silicon Ranch", issue: "Cleanroom stainless duct — orbital weld batch 6, bagged & tagged", priority: "Standard", tech: "Plant 1 — Weld Shop", status: "In Fabrication", opened: "2026-07-24" },
  { num: "WO-8192", client: "Metroplex Air", issue: "Spiral order — 3,400 LF 24ga w/ gasketed fittings, freight to DFW", priority: "High", tech: "Plant 2 — Spiral", status: "Shipped", opened: "2026-07-23" },
  { num: "WO-8188", client: "CVH-2509 Hotel Tower", issue: "Tower floors 18-24 spool release — 41,200 lbs, hoist windows booked", priority: "Standard", tech: "Plant 1 — Bay 2", status: "Queued", opened: "2026-07-22" },
];
window.SERVICE_AGREEMENTS = SERVICE_AGREEMENTS;
window.SERVICE_CALLS = SERVICE_CALLS;


/* =========================================================
   BID PIPELINE — preconstruction book for win/loss analytics.
   Estimators = MSM estimating team (fictional).
   ========================================================= */
const BID_PIPELINE = [
  { id: "B-2601", project: "Memorial City Medical Office Tower — Ductwork", owner: "GC: Harmon Construction", sector: "Healthcare", est: "Rick Alvarez", due: "2026-08-14", amount: 6900000, marginPct: 14.8, status: "Submitted" },
  { id: "B-2602", project: "DFW Logistics Air Cargo Facility — Sheet Metal", owner: "GC: Meridian Design-Build", sector: "Aviation", est: "Dana Kowalski", due: "2026-08-21", amount: 8400000, marginPct: 15.6, status: "Draft" },
  { id: "B-2603", project: "Baylor Research Annex — Lab Exhaust & Supply", owner: "CM: Vaughn CM", sector: "Higher Ed", est: "Priya Shah", due: "2026-08-08", amount: 4200000, marginPct: 13.9, status: "Submitted" },
  { id: "B-2604", project: "Frisco Performing Arts Center — Exposed Duct", owner: "GC: Titan Builders", sector: "Public Assembly", est: "Rick Alvarez", due: "2026-09-04", amount: 3600000, marginPct: 14.2, status: "Draft" },
  { id: "B-2605", project: "Galveston Convention Hotel — Ductwork Package", owner: "GC: Titan Builders JV", sector: "Hospitality", est: "Dana Kowalski", due: "2026-08-28", amount: 7800000, marginPct: 16.1, status: "Pending Award" },
  { id: "B-2598", project: "Pearland ISD CUP & Additions — Ductwork", owner: "GC: Harmon Construction", sector: "K-12", est: "Joe Herrera", due: "2026-07-10", amount: 2980000, marginPct: 13.5, status: "Pending Award" },
  { id: "B-2594", project: "Austin Data Center DC-4 — Ductwork Package", owner: "GC: Corestone Constructors", sector: "Mission Critical", est: "Dana Kowalski", due: "2026-06-19", amount: 11800000, marginPct: 15.2, status: "Won", jobId: "DC4-2510" },
  { id: "B-2593", project: "Children's Hospital Expansion — Ductwork", owner: "GC: Harmon Construction", sector: "Healthcare", est: "Rick Alvarez", due: "2026-06-12", amount: 9700000, marginPct: 14.6, status: "Won", jobId: "CHE-2511" },
  { id: "B-2590", project: "Convention District Hotel Tower — Sheet Metal", owner: "GC: Titan Builders JV", sector: "Hospitality", est: "Dana Kowalski", due: "2026-05-29", amount: 16400000, marginPct: 15.9, status: "Won", jobId: "CVH-2509" },
  { id: "B-2588", project: "Austin Data Center DC-3 — Ductwork Package", owner: "GC: Corestone Constructors", sector: "Mission Critical", est: "Priya Shah", due: "2026-05-15", amount: 9150000, marginPct: 15.1, status: "Won", jobId: "ADC-2507" },
  { id: "B-2586", project: "Sugar Land Office Campus — Ductwork (3 bldgs)", owner: "GC: Corestone Constructors", sector: "Commercial", est: "Rick Alvarez", due: "2026-05-08", amount: 5120000, marginPct: 12.4, status: "Lost", note: "Price — regional shop 8% under; their number missed the Addendum 2 welded-exhaust upgrade" },
  { id: "B-2583", project: "Med Center Proton Therapy Bldg — Ductwork", owner: "GC: Archer-Gray JV", sector: "Healthcare", est: "Dana Kowalski", due: "2026-04-24", amount: 11200000, marginPct: 16.8, status: "Lost", note: "Owner deferred capital to 2027" },
  { id: "B-2580", project: "Katy ISD CUP & Two Campus Additions", owner: "GC: Harmon Construction", sector: "K-12", est: "Joe Herrera", due: "2026-04-10", amount: 7600000, marginPct: 14.0, status: "Won", jobId: "KSD-2508" },
  { id: "B-2577", project: "Woodlands Surgical Pavilion — Ductwork", owner: "GC: Harmon Construction", sector: "Healthcare", est: "Priya Shah", due: "2026-03-27", amount: 3880000, marginPct: 15.4, status: "Won" },
  { id: "B-2574", project: "Port Houston Distribution Hub — Sheet Metal", owner: "GC: Meridian Design-Build", sector: "Industrial", est: "Joe Herrera", due: "2026-03-13", amount: 7050000, marginPct: 13.2, status: "Lost", note: "GC self-performed with in-house shop" },
  { id: "B-2571", project: "Harris County Courthouse Annex — Renovation", owner: "CM: Vaughn CM", sector: "Municipal", est: "Rick Alvarez", due: "2026-02-27", amount: 2200000, marginPct: 14.9, status: "Won", jobId: "HCC-2507" },
  { id: "B-2568", project: "Round Rock Sports Complex — Ductwork", owner: "GC: Titan Builders", sector: "Public Assembly", est: "Joe Herrera", due: "2026-02-13", amount: 4450000, marginPct: 13.8, status: "Lost", note: "Price — 4% over low bidder; LDs at $8,500/day priced into our number" },
  { id: "B-2565", project: "San Jacinto Convention Center Expansion", owner: "GC: Titan Builders JV", sector: "Public Assembly", est: "Dana Kowalski", due: "2026-01-09", amount: 12400000, marginPct: 15.7, status: "Won", jobId: "SJC-2502" },
];
window.BID_PIPELINE = BID_PIPELINE;


/* =========================================================
   AI DOCUMENT REVIEW — the $3M problem, instrumented.
   Every ITB's drawings, specs and addenda machine-read
   before an estimator opens the set. Fictional demo data.
   ========================================================= */
const DOCREVIEW = {
  baseline: {
    annualSpend: 3000000,          /* $ spent reviewing bid documents / yr */
    itbPerYear: 620,               /* invitations to bid received */
    avgPagesPerSet: 1420,          /* drawings + specs + addenda per ITB */
    avgHoursManual: 42,            /* estimator hours per full document review */
    avgHoursAI: 3.5,               /* estimator hours after AI first-pass */
    loadedRate: 118,               /* $/hr loaded estimating cost */
  },
  ytd: {
    itbProcessed: 412, pagesRead: 486210, hoursSaved: 9860,
    flagsRaised: 1284, addendaTracked: 517, specTrapsCaught: 96,
    runRateSavings: 2360000,
  },
  queue: [
    {
      bid: "B-2601", project: "Memorial City Medical Office Tower — Ductwork", gc: "Harmon Construction",
      due: "2026-08-14", status: "Review Complete", risk: 72, hoursManual: 56, hoursAI: 4.2,
      docs: [
        { name: "Project Manual Vol. 2 — Div 21-23", type: "Spec", pages: 612, status: "Read" },
        { name: "Mechanical Drawings M-001 → M-802", type: "Drawings", pages: 148, status: "Read" },
        { name: "Addendum 1 — Schedule & GRD revisions", type: "Addendum", pages: 34, status: "Read" },
        { name: "Addendum 2 — Gauge schedule replacement", type: "Addendum", pages: 12, status: "Read" },
        { name: "Supplementary Conditions & Exhibit F", type: "Contract", pages: 88, status: "Read" },
        { name: "Structural S-sheets (coordination read)", type: "Drawings", pages: 64, status: "Read" },
      ],
      findings: [
        { sev: "high", title: "Duct leakage testing assigned to SM subcontractor", clause: "23 05 93 ¶3.4.B", detail: "Spec shifts leakage testing (normally TAB scope) to the sheet metal sub — 100% of medium-pressure duct, witnessed. Estimate impact ≈ $84K not in historic unit costs." },
        { sev: "high", title: "Addendum 2 replaced the entire gauge schedule", clause: "Add. 2 §2, replaces 23 31 13 Table 5", detail: "New table upgauges 17 of 31 size ranges vs. the original spec. Tonnage impact +6.2% (≈ 88,000 lbs). Bids priced off the original manual will be light." },
        { sev: "high", title: "Liquidated damages $6,500/day, no cap", clause: "Supp. Conditions ¶9.11", detail: "LDs flow down uncapped to major subs. Combined with a 14-week duct rough-in window, schedule risk is priced at +0.8% contingency." },
        { sev: "med", title: "Welded stainless required at 4 exhaust systems", clause: "23 38 13 ¶2.1 + M-702 notes", detail: "Dishwasher, decon, lab and kitchen exhaust all spec continuous-weld 304SS. Drawing schedule only flags 2 of 4 — the spec governs. +$196K vs. drawing-only takeoff." },
        { sev: "med", title: "GRD substitution list is closed", clause: "23 37 13 ¶2.2", detail: "Named-manufacturer-only air devices; no or-equal. Named vendor quote came in 12% over our standard line — locked pricing before bid." },
        { sev: "info", title: "BIM LOD 400 + weekly clash cadence mandated", clause: "01 31 00 ¶1.8", detail: "Coordination staffing must carry 26 weeks of weekly clash meetings; matches our standard VDC allocation." },
      ],
      quantities: [
        { item: "Rectangular duct — galvanized", qty: "1,512,000", unit: "lbs", conf: 97 },
        { item: "Spiral / round duct", qty: "22,400", unit: "LF", conf: 95 },
        { item: "Welded stainless exhaust", qty: "4 systems · 2,180", unit: "LF", conf: 92 },
        { item: "Fire/smoke dampers", qty: "214", unit: "ea", conf: 98 },
        { item: "Air devices (GRD schedule + Add.1)", qty: "2,890", unit: "ea", conf: 99 },
      ],
      recommendation: "BID — at 14.8% margin with the $84K leakage-testing adder and $196K welded-exhaust correction priced in. Competitors bidding off the pre-Addendum-2 gauge schedule will be ~6% light on tonnage; expect scope-review leverage at the GC level.",
    },
    {
      bid: "B-2602", project: "DFW Logistics Air Cargo Facility — Sheet Metal", gc: "Meridian Design-Build",
      due: "2026-08-21", status: "Reviewing", risk: 41, hoursManual: 38, hoursAI: 2.8,
      docs: [
        { name: "Project Manual — Div 23", type: "Spec", pages: 388, status: "Read" },
        { name: "Mechanical Drawings M-100 → M-514", type: "Drawings", pages: 96, status: "Read" },
        { name: "Addendum 1 — Phasing revision", type: "Addendum", pages: 18, status: "Reading" },
        { name: "AIA A401 Sub Agreement draft", type: "Contract", pages: 42, status: "Queued" },
      ],
      findings: [
        { sev: "med", title: "Phased turnover — 3 mobilizations required", clause: "Add. 1 §1 / 01 32 00", detail: "Cargo bays turn over in 3 phases 8 weeks apart. Base bid assumes one continuous mobilization; our GCs need +$46K." },
        { sev: "info", title: "Standard SMACNA gauge schedule, no upgauges", clause: "23 31 13 Table 3", detail: "Clean spec — matches historic $/lb basis." },
      ],
      quantities: [
        { item: "Rectangular duct — galvanized", qty: "648,000", unit: "lbs", conf: 96 },
        { item: "Destrat / HVLS adapters", qty: "44", unit: "ea", conf: 91 },
      ],
      recommendation: "Pending — phasing adder under review. Preliminary: BID at 15.6% with 3-mobilization GC adjustment.",
    },
    {
      bid: "B-2603", project: "Baylor Research Annex — Lab Exhaust & Supply", gc: "Vaughn CM",
      due: "2026-08-08", status: "Review Complete", risk: 63, hoursManual: 44, hoursAI: 3.6,
      docs: [
        { name: "Project Manual Vols. 2-3 — Div 22-23", type: "Spec", pages: 720, status: "Read" },
        { name: "Mechanical & Lab Gas Drawings", type: "Drawings", pages: 122, status: "Read" },
        { name: "Addenda 1-3", type: "Addendum", pages: 57, status: "Read" },
      ],
      findings: [
        { sev: "high", title: "Fume exhaust spec'd as 316L, not 304", clause: "23 31 13 ¶2.6.C", detail: "All perchloric and general fume exhaust in 316L with continuous TIG weld + dye test. Material delta vs. 304 ≈ $118K at current surcharge." },
        { sev: "med", title: "Off-hours tie-ins to live vivarium exhaust", clause: "01 10 00 ¶3.2", detail: "6 tie-ins restricted to 10pm-4am windows with standby redundancy. Premium-time labor ≈ $38K." },
      ],
      quantities: [
        { item: "Welded 316L fume exhaust", qty: "4,860", unit: "LF", conf: 93 },
        { item: "Rectangular supply duct", qty: "382,000", unit: "lbs", conf: 97 },
      ],
      recommendation: "BID — 316L surcharge locked with mill quote through bid date. Flag dye-test labor in clarifications.",
    },
    {
      bid: "B-2604", project: "Frisco Performing Arts Center — Exposed Duct", gc: "Titan Builders",
      due: "2026-09-04", status: "Queued", risk: null, hoursManual: 40, hoursAI: null,
      docs: [
        { name: "Project Manual — Div 23 + acoustic report", type: "Spec", pages: 502, status: "Queued" },
        { name: "Mechanical Drawings", type: "Drawings", pages: 88, status: "Queued" },
      ],
      findings: [],
      quantities: [],
      recommendation: null,
    },
    {
      bid: "B-2605", project: "Galveston Convention Hotel — Ductwork Package", gc: "Titan Builders JV",
      due: "2026-08-28", status: "Review Complete", risk: 55, hoursManual: 61, hoursAI: 4.8,
      docs: [
        { name: "Project Manual Vol. 2 — Div 23", type: "Spec", pages: 684, status: "Read" },
        { name: "Mechanical Drawings — Tower + Podium", type: "Drawings", pages: 204, status: "Read" },
        { name: "Addenda 1-4", type: "Addendum", pages: 91, status: "Read" },
        { name: "Exhibit C — Hoisting & Logistics Plan", type: "Contract", pages: 26, status: "Read" },
      ],
      findings: [
        { sev: "high", title: "Coastal corrosion spec — G90 + marine coating on rooftop duct", clause: "23 31 13 ¶2.1.D", detail: "All exterior duct requires G90 with marine-grade coating system. +$92K vs. standard G60 assumption." },
        { sev: "med", title: "Hoist windows shared with curtainwall — 40% availability", clause: "Exh. C §4", detail: "Tower crane and hoist windows heavily constrained; JIT spool deliveries and 2 additional weekend picks priced." },
        { sev: "med", title: "Addendum 4 added 2 restaurant kitchen exhaust systems", clause: "Add. 4 §3", detail: "Two NFPA 96 welded systems added late — 640 LF total. Easy to miss; issued 6 days before bid." },
      ],
      quantities: [
        { item: "Rectangular duct — tower + podium", qty: "1,882,000", unit: "lbs", conf: 96 },
        { item: "Kitchen exhaust (welded, incl. Add.4)", qty: "1,140", unit: "LF", conf: 94 },
      ],
      recommendation: "BID — 16.1% margin holds after the coastal-coating adder. Addendum 4 kitchen systems confirmed in our number; verify competitors caught it.",
    },
    {
      bid: "B-2598", project: "Pearland ISD CUP & Additions — Ductwork", gc: "Harmon Construction",
      due: "2026-07-10", status: "Review Complete", risk: 28, hoursManual: 31, hoursAI: 2.4,
      docs: [
        { name: "Project Manual — Div 23", type: "Spec", pages: 344, status: "Read" },
        { name: "Mechanical Drawings", type: "Drawings", pages: 74, status: "Read" },
        { name: "Addendum 1", type: "Addendum", pages: 9, status: "Read" },
      ],
      findings: [
        { sev: "info", title: "Summer-only work windows at occupied campuses", clause: "01 10 00 ¶1.6", detail: "Campus additions restricted to summer break for tie-ins; CUP unrestricted. Matches planned crew loading." },
      ],
      quantities: [
        { item: "Rectangular duct", qty: "412,000", unit: "lbs", conf: 98 },
        { item: "Air devices", qty: "760", unit: "ea", conf: 99 },
      ],
      recommendation: "BID — clean set, standard K-12 profile. 13.5% margin competitive for this GC relationship.",
    },
  ],
};
window.DOCREVIEW = DOCREVIEW;

/* ---- change orders created in the portal (localStorage) merge into each job ---- */
(function () {
  JOBS.forEach((j) => {
    try {
      const stored = JSON.parse(localStorage.getItem('msm-co:' + j.id) || '[]');
      stored.forEach(co => j.changeOrders.push(co));
    } catch (e) {}
  });
})();


/* =========================================================
   FORECAST ENGINE PARAMETERS — fictional recreation of the
   monthly-forecast math (trade mix, spread curves, heads).
   ========================================================= */
const ENGINE = {
  tradeMix: { pm: 4, eng: 7, tech: 27, material: 42, install: 17 },   /* % of revenue; tech = shop labor; remainder = freight/other */
  curve12: [1, 3, 26, 18, 16, 11, 3, 3, 4, 5, 5, 5],                 /* % of job revenue by month — $2M-$7M packages */
  curve18: [2, 2, 4, 5, 3, 9, 10, 8, 6, 6, 6, 6, 6, 6, 6, 5, 5, 5], /* larger packages */
  weeksPerMo: 4.3, hrsPerWk: 40, utilization: 0.9,                   /* heads = hours / (4.3*40*0.9 = 154.8) */
  blendedRates: { install: 78, tech: 62, eng: 96, pm: 104 },         /* $/hr: field, shop, detailing/VDC, PM */
  installHeadsCurrent: 340,
};
ENGINE.hrsPerHead = ENGINE.weeksPerMo * ENGINE.hrsPerWk * ENGINE.utilization;
window.ENGINE = ENGINE;

/* utilization snapshot — labor dollars costed to… (from timesheets/STRATUS) */
const UTILIZATION = {
  current: { projects: 58, service: 34, overhead: 8 },   /* field · shop · overhead */
  trend: [
    { wk: "Jun 5", projects: 55, service: 36, overhead: 9 },
    { wk: "Jun 12", projects: 57, service: 34, overhead: 9 },
    { wk: "Jun 19", projects: 60, service: 32, overhead: 8 },
    { wk: "Jun 26", projects: 56, service: 36, overhead: 8 },
    { wk: "Jul 3", projects: 59, service: 33, overhead: 8 },
    { wk: "Jul 10", projects: 58, service: 34, overhead: 8 },
  ],
};
window.UTILIZATION = UTILIZATION;

/* KPI snapshot for the executive dashboard (fictional) */
const KPI_SNAPSHOT = {
  cashOnHand: 18400000, arDays: 58, apDays: 41,
  backlogMonths: 8.2, safetyDays: 296, openRFIs: 14,
};
window.KPI_SNAPSHOT = KPI_SNAPSHOT;


/* ---- schedule hygiene: active work must finish in the future ---- */
(function () {
  const addMonths = (iso, n) => { const d = new Date(iso + "T12:00:00"); d.setMonth(d.getMonth() + n); return d.toISOString().slice(0, 10); };
  const horizon = new Date("2026-08-01T12:00:00");
  JOBS.forEach(j => {
    if (["Complete", "Closeout"].includes(j.status)) return;
    let shift = 0;
    let fin = new Date(j.finish + "T12:00:00");
    while (fin < horizon) { shift += 12; fin.setMonth(fin.getMonth() + 12); }
    if (!shift) return;
    j.start = addMonths(j.start, shift);
    j.finish = addMonths(j.finish, shift);
    j.contractDate = addMonths(j.contractDate, shift);
    (j.payApps || []).forEach(p => p.period = addMonths(p.period, shift));
    (j.phases || []).forEach(p => { p.start = addMonths(p.start, shift); p.finish = addMonths(p.finish, shift); });
    (j.reports || []).forEach(r => r.date = addMonths(r.date, shift));
    (j.photos || []).forEach(p => p.date = addMonths(p.date, shift));
  });
})();
