/* =========================================================
   Y8S — YATES COMPANY, LLC · OPERATIONS PORTAL (DEMO)
   Building automation & energy solutions — San Marcos, TX.
   All project data fictional / illustrative. Demo build by
   Endurance AI Labs: the "single source of truth" concept —
   QuickBooks + ServiceTitan + field ops in one owned system.
   ========================================================= */

const YATES = {
  brand: "Y8S",
  company: "YATES Company, LLC",
  tagline: "Building Automation Systems Nurtured by Experience",
  mission: "Aggressively challenging the present in order to create the best future.",
  est: "Established 2011",
  hq: "San Antonio, Texas",
  address: "4738 Whirlwind Dr, San Antonio, TX 78217",
  phone: "(210) 702-3820",
  email: "contact@y8sco.com",
  award: "Best Place to Work in San Marcos, TX 2026",
  lines: "Carrier i-Vu · Innotech · Lynxspring",
  /* compat fields used by document footers */
  legal: "YATES Company, LLC",
  office: "4738 Whirlwind Dr, San Antonio, TX 78217",
  license: "TX TACLA #26155E (demo)",
  enr: "Best Place to Work — San Marcos, TX 2026",
};

/* ---- the real Y8S org drives user access (demo personas) ---- */
const PEOPLE = {
  pms: ["Tyler Reidhead", "Jordan Felps, P.E.", "Brandon Yates"],
  supers: ["R. Trejo", "M. Okafor", "C. Delgado", "S. Whitmore"],
};

const SUBS = [
  "Y8S Controls Crew — Self-Perform",
  "Alamo Electrical Contractors",
  "Hill Country Mechanical",
  "TexNet Low-Voltage Cabling",
  "Balance-Pro TAB & Commissioning",
  "SA Crane & Rigging",
];

/* ---- helper: internal cost basis implied by default levers (OH 6% x profit 9% x bond/GL 1.85%) ---- */
const MULT = 1.06 * 1.09 * 1.0185;
const cost = (sell) => Math.round((sell / MULT) * 100) / 100;

/* =========================================================
   JOBS — construction-division controls projects
   ========================================================= */
const JOBS = [
  {
    id: "CTX-2410",
    name: "Central Texas ISD — District Energy Management Retrofit",
    owner: "Central Texas Independent School District",
    address: "12 campuses · San Marcos, TX",
    sector: "K-12 — Controls Retrofit (Carrier i-Vu)",
    pm: "Tyler Reidhead",
    super: "R. Trejo",
    sub: "Y8S Controls Crew — Self-Perform",
    status: "Closeout",
    contractDate: "2024-09-13",
    start: "2024-10-04",
    finish: "2024-11-14",
    retainagePct: 5,
    contract: 682400.00,
    sov: [
      { item: "1001", desc: "DDC Controllers & Field Hardware (i-Vu)", scheduled: 379600.00, pct: 100, budget: cost(379600.00), costToDate: 323100.00 },
      { item: "1002", desc: "Rooftop Unit Controls Integration", scheduled: 27600.00, pct: 100, budget: cost(27600.00), costToDate: 24000.00 },
      { item: "1003", desc: "Low-Voltage Wiring & Conduit", scheduled: 46000.00, pct: 100, budget: cost(46000.00), costToDate: 39300.00 },
      { item: "1004", desc: "Valve & Damper Actuators", scheduled: 27900.00, pct: 100, budget: cost(27900.00), costToDate: 24500.00 },
      { item: "1005", desc: "Space Sensors & Thermostats", scheduled: 9500.00, pct: 100, budget: cost(9500.00), costToDate: 8000.00 },
      { item: "1006", desc: "Chiller & Boiler Plant Controls", scheduled: 100600.00, pct: 100, budget: cost(100600.00), costToDate: 88500.00 },
      { item: "1007", desc: "Mechanical Integration Allowance / CO", scheduled: 47400.00, pct: 100, budget: cost(47400.00), costToDate: 42100.00 },
      { item: "1008", desc: "Graphics Development & Alarming", scheduled: 9700.00, pct: 100, budget: cost(9700.00), costToDate: 8300.00 },
      { item: "1009", desc: "General Conditions", scheduled: 17600.00, pct: 100, budget: cost(17600.00), costToDate: 15600.00 },
      { item: "1010", desc: "Project Management & Engineering", scheduled: 16500.00, pct: 100, budget: cost(16500.00), costToDate: 14700.00 },
    ],
    payApps: [
      { num: "410-01", label: "Pay App 1 — Controls Hardware Deposit", period: "2024-10-11", certified: 134200.00, status: "Paid" },
      { num: "410-02a", label: "Pay App 2 (Revised)", period: "2024-10-25", certified: 318080.00, status: "Paid" },
      { num: "410-03", label: "Pay App 3", period: "2025-01-02", certified: 196000.00, status: "Paid" },
      { num: "410-RET", label: "Retention Release", period: "2025-01-02", certified: 34120.00, status: "Paid" },
    ],
    phases: [
      { name: "Submittals & Hardware Procurement", start: "2024-10-04", finish: "2024-10-10", value: 134200, pct: 100 },
      { name: "Controller & Panel Installation", start: "2024-10-11", finish: "2024-10-24", value: 353400, pct: 100 },
      { name: "Low-Voltage Wiring & Terminations", start: "2024-10-18", finish: "2024-10-31", value: 74300, pct: 100 },
      { name: "Actuator & Sensor Install", start: "2024-10-25", finish: "2024-10-31", value: 14200, pct: 100 },
      { name: "Point-to-Point Checkout", start: "2024-10-30", finish: "2024-10-31", value: 6200, pct: 100 },
      { name: "Network & Server Configuration", start: "2024-11-01", finish: "2024-11-04", value: 1350, pct: 100 },
      { name: "Plant Controls Integration", start: "2024-11-01", finish: "2024-11-14", value: 29400, pct: 100 },
      { name: "Graphics & Alarm Programming", start: "2024-11-01", finish: "2024-11-07", value: 20900, pct: 100 },
      { name: "Commissioning & TAB Support", start: "2024-11-08", finish: "2024-11-14", value: 35100, pct: 100 },
      { name: "Owner Training & Closeout", start: "2024-11-14", finish: "2024-11-14", value: 2200, pct: 100 },
    ],
    changeOrders: [
      { num: "CO-01", desc: "Concealed mechanical conditions at Campus 7 chiller plant (valve rebuild)", amount: 0, status: "Absorbed in SOV 1007 per allowance" },
    ],
    photos: [],   /* wired below */
    reports: [
      { date: "2024-10-15", title: "Controls Retrofit Progress — Report 1", photos: 49, author: "Tyler Reidhead" },
      { date: "2024-10-23", title: "Controls Retrofit Progress — Report 2", photos: 26, author: "Tyler Reidhead" },
      { date: "2024-10-25", title: "Controls Retrofit Progress — Report 3", photos: 18, author: "Tyler Reidhead" },
      { date: "2024-11-08", title: "Controls Retrofit Progress — Report 4", photos: 72, author: "Tyler Reidhead" },
    ],
  },

  {
    id: "HMP-2502",
    name: "Hays Medical Plaza — BAS Installation & Energy Retrofit",
    owner: "Hays Medical Properties, LP",
    address: "1340 Wonder World Dr, San Marcos, TX 78666",
    sector: "Healthcare — New BAS (Innotech)",
    pm: "Jordan Felps, P.E.",
    super: "M. Okafor",
    sub: "Alamo Electrical Contractors",
    status: "In Progress",
    contractDate: "2025-01-10",
    start: "2025-02-03",
    finish: "2025-06-27",
    retainagePct: 10,
    contract: 1284500.00,
    sov: [
      { item: "2001", desc: "DDC Controllers, Panels & Software", scheduled: 742000.00, pct: 78, budget: 631000.00, costToDate: 497200.00 },
      { item: "2002", desc: "Air Handler & VAV Integration (64 boxes)", scheduled: 96500.00, pct: 55, budget: 81300.00, costToDate: 44800.00 },
      { item: "2003", desc: "Electrical & Low-Voltage Rough-In", scheduled: 188000.00, pct: 40, budget: 158900.00, costToDate: 66300.00 },
      { item: "2004", desc: "Chilled Water Plant Optimization", scheduled: 152000.00, pct: 18, budget: 128200.00, costToDate: 24100.00 },
      { item: "2005", desc: "Commissioning, TAB & Training", scheduled: 58000.00, pct: 0, budget: 49400.00, costToDate: 0 },
      { item: "2006", desc: "General Conditions & PM/Engineering", scheduled: 48000.00, pct: 62, budget: 42500.00, costToDate: 26900.00 },
    ],
    payApps: [
      { num: "310-01", label: "Pay App 1", period: "2025-02-28", certified: 148230.00, status: "Paid" },
      { num: "310-02", label: "Pay App 2", period: "2025-03-31", certified: 221540.00, status: "Paid" },
      { num: "310-03", label: "Pay App 3", period: "2025-04-30", certified: 196875.00, status: "Paid" },
      { num: "310-04", label: "Pay App 4", period: "2025-05-31", certified: 154310.00, status: "Pending Owner" },
    ],
    phases: [
      { name: "Submittals & Procurement", start: "2025-02-03", finish: "2025-02-14", value: 96000, pct: 100 },
      { name: "Rough-In — Floors 1-3", start: "2025-02-17", finish: "2025-04-11", value: 371000, pct: 100 },
      { name: "Rough-In — Floors 4-6", start: "2025-04-14", finish: "2025-06-06", value: 371000, pct: 55 },
      { name: "VAV & AHU Integration", start: "2025-03-10", finish: "2025-06-13", value: 96500, pct: 55 },
      { name: "Plant Optimization Sequences", start: "2025-03-24", finish: "2025-06-13", value: 188000, pct: 40 },
      { name: "Graphics & Alarming", start: "2025-05-05", finish: "2025-06-20", value: 152000, pct: 18 },
      { name: "Commissioning & Punch", start: "2025-06-09", finish: "2025-06-27", value: 58000, pct: 0 },
    ],
    changeOrders: [
      { num: "CO-01", desc: "Added OR suite pressure monitoring (6 rooms)", amount: 18600.00, status: "Approved" },
      { num: "CO-02", desc: "Isolation-room controls per updated code review", amount: 21450.00, status: "Submitted" },
    ],
    photos: [],
    reports: [
      { date: "2025-03-07", title: "Monthly Progress Report — March", photos: 41, author: "Jordan Felps, P.E." },
      { date: "2025-04-04", title: "Monthly Progress Report — April", photos: 38, author: "Jordan Felps, P.E." },
      { date: "2025-05-09", title: "Monthly Progress Report — May", photos: 44, author: "Jordan Felps, P.E." },
    ],
  },

  {
    id: "HPL-2506",
    name: "Harbor Point Logistics Center — Warehouse Controls & EMS",
    owner: "Harbor Point Industrial REIT",
    address: "1900 Duncan Perry Rd, Grand Prairie, TX 75050",
    sector: "Industrial — EMS (Lynxspring)",
    pm: "Tyler Reidhead",
    super: "C. Delgado",
    sub: "TexNet Low-Voltage Cabling",
    status: "In Progress",
    contractDate: "2025-04-22",
    start: "2025-05-19",
    finish: "2025-10-31",
    retainagePct: 10,
    contract: 2410000.00,
    sov: [
      { item: "3001", desc: "Legacy Pneumatic Demo & Removal (412,000 SF)", scheduled: 396000.00, pct: 74, budget: 334000.00, costToDate: 251400.00 },
      { item: "3002", desc: "DDC Hardware, HVLS & Lighting Controls", scheduled: 1522000.00, pct: 31, budget: 1291000.00, costToDate: 409800.00 },
      { item: "3003", desc: "Power & Network Infrastructure", scheduled: 246000.00, pct: 12, budget: 208400.00, costToDate: 26500.00 },
      { item: "3004", desc: "Utility Metering & Submetering", scheduled: 118000.00, pct: 22, budget: 99600.00, costToDate: 23400.00 },
      { item: "3005", desc: "General Conditions & PM/Engineering", scheduled: 128000.00, pct: 38, budget: 111000.00, costToDate: 43700.00 },
    ],
    payApps: [
      { num: "412-01", label: "Pay App 1", period: "2025-06-30", certified: 287400.00, status: "Paid" },
      { num: "412-02", label: "Pay App 2", period: "2025-07-25", certified: 341200.00, status: "Submitted" },
    ],
    phases: [
      { name: "Mobilization & Submittals", start: "2025-05-19", finish: "2025-05-30", value: 84000, pct: 100 },
      { name: "Section 1 — Demo & Controls Install", start: "2025-06-02", finish: "2025-07-18", value: 640000, pct: 88 },
      { name: "Section 2 — Demo & Controls Install", start: "2025-07-21", finish: "2025-09-05", value: 640000, pct: 8 },
      { name: "Section 3 — Demo & Controls Install", start: "2025-09-08", finish: "2025-10-17", value: 640000, pct: 0 },
      { name: "EMS Integration & Commissioning", start: "2025-10-06", finish: "2025-10-31", value: 406000, pct: 0 },
    ],
    changeOrders: [
      { num: "CO-01", desc: "Added dock-door interlock controls — Section 1 (survey delta)", amount: 64200.00, status: "Approved" },
    ],
    photos: [],
    reports: [
      { date: "2025-06-27", title: "Monthly Progress Report — June", photos: 52, author: "Tyler Reidhead" },
      { date: "2025-07-25", title: "Monthly Progress Report — July", photos: 47, author: "Tyler Reidhead" },
    ],
  },

  {
    id: "RCI-2507",
    name: "Rock Creek ISD — District Controls Standardization (3 Campuses)",
    owner: "Rock Creek Independent School District",
    address: "1200 Bronco Way, Mansfield, TX 76063",
    sector: "K-12 — Controls Standardization (i-Vu)",
    pm: "Brandon Yates",
    super: "S. Whitmore",
    sub: "Hill Country Mechanical",
    status: "Just Started",
    contractDate: "2025-06-30",
    start: "2025-07-14",
    finish: "2025-12-19",
    retainagePct: 5,
    contract: 869300.00,
    sov: [
      { item: "4001", desc: "DDC Controllers & Front-End Migration", scheduled: 522000.00, pct: 9, budget: 441000.00, costToDate: 38200.00 },
      { item: "4002", desc: "RTU & Split-System Integration", scheduled: 84300.00, pct: 0, budget: 71400.00, costToDate: 0 },
      { item: "4003", desc: "Kitchen & Gym Ventilation Controls", scheduled: 66000.00, pct: 0, budget: 55800.00, costToDate: 0 },
      { item: "4004", desc: "Energy Dashboards & Reporting", scheduled: 92000.00, pct: 4, budget: 77900.00, costToDate: 2900.00 },
      { item: "4005", desc: "General Conditions & PM/Engineering", scheduled: 105000.00, pct: 12, budget: 91000.00, costToDate: 9800.00 },
    ],
    payApps: [
      { num: "455-01", label: "Pay App 1 — Mobilization & Hardware", period: "2025-07-31", certified: 92400.00, status: "Draft" },
    ],
    phases: [
      { name: "Submittals & Network Design", start: "2025-07-14", finish: "2025-08-01", value: 62000, pct: 45 },
      { name: "Campus 1 — Prairie View Elementary", start: "2025-08-04", finish: "2025-09-26", value: 289000, pct: 0 },
      { name: "Campus 2 — Rock Creek Middle", start: "2025-09-15", finish: "2025-11-07", value: 301000, pct: 0 },
      { name: "Campus 3 — Admin & Annex", start: "2025-10-27", finish: "2025-12-12", value: 217300, pct: 0 },
      { name: "Commissioning & Closeout", start: "2025-12-08", finish: "2025-12-19", value: 0, pct: 0 },
    ],
    changeOrders: [],
    photos: [],
    reports: [],
  },
];

/* ---- photo library (stock via Pexels — fictional captions) ---- */
JOBS[0].photos = [
  { src: "/yates/assets/photos/b01.jpg", cap: "Existing conditions — legacy panel survey, Campus 3", date: "2024-05-21", tag: "Survey" },
  { src: "/yates/assets/photos/b02.jpg", cap: "Existing RTU inventory & controls assessment", date: "2024-05-21", tag: "Survey" },
  { src: "/yates/assets/photos/b03.jpg", cap: "DDC panel build-out — controller backplane", date: "2024-10-15", tag: "Controls" },
  { src: "/yates/assets/photos/b04.jpg", cap: "Low-voltage terminations at field panel", date: "2024-10-15", tag: "Wiring" },
  { src: "/yates/assets/photos/b05.jpg", cap: "RTU controls integration — economizer sequence", date: "2024-10-23", tag: "Mechanical" },
  { src: "/yates/assets/photos/b06.jpg", cap: "Plant piping & valve actuator install", date: "2024-10-23", tag: "Mechanical" },
  { src: "/yates/assets/photos/b07.jpg", cap: "Point-to-point checkout — field verification", date: "2024-10-30", tag: "Checkout" },
  { src: "/yates/assets/photos/b08.jpg", cap: "Front-end graphics build — campus dashboards", date: "2024-11-04", tag: "Graphics" },
  { src: "/yates/assets/photos/b09.jpg", cap: "Network head-end rack — server & switches", date: "2024-11-04", tag: "Network" },
  { src: "/yates/assets/photos/b10.jpg", cap: "Commissioning walk with owner facilities team", date: "2024-11-14", tag: "Commissioning" },
];
JOBS[1].photos = [
  { src: "/yates/assets/photos/b11.jpg", cap: "AHU integration — floor 4 mechanical room", date: "2025-05-09", tag: "Mechanical" },
  { src: "/yates/assets/photos/b12.jpg", cap: "Electrical rough-in coordination — Alamo crew", date: "2025-05-09", tag: "Wiring" },
];
JOBS[2].photos = [
  { src: "/yates/assets/photos/b13.jpg", cap: "Section 1 EMS install — warehouse controls backbone", date: "2025-07-18", tag: "Controls" },
];
JOBS[3].photos = [
  { src: "/yates/assets/photos/b14.jpg", cap: "Campus 1 survey — head-end migration planning", date: "2025-07-21", tag: "Survey" },
];

window.JOBS = JOBS;
window.SUBS = SUBS;
window.PEOPLE = PEOPLE;
window.YATES = YATES;

/* =========================================================
   BID BUILDER — default template (controls retrofit)
   ========================================================= */
const BID_DEFAULTS = {
  meta: {
    project: "Central Texas ISD — District Energy Management Retrofit",
    owner: "Central Texas Independent School District",
    address: "12 campuses · San Marcos, TX",
    bidNumber: "Y8S-2024-0418",
    pm: "Tyler Reidhead",
    super: "R. Trejo",
    startDate: "2024-10-04",
    validDays: 30,
  },
  levers: { overheadPct: 6.0, profitPct: 9.0, contingencyPct: 0.0, retainagePct: 5.0, taxPct: 0.0, bondPct: 1.0, glPct: 0.85, escalationPct: 0.0 },
  lines: [
    { trade: "DDC Controls", csi: "25 14 00", desc: "i-Vu DDC controllers, field hardware and panel fabrication — 12 campuses", qty: 12, unit: "campus", unitCost: cost(379600.00) / 12, sub: "Y8S Controls Crew — Self-Perform", offset: 7, dur: 14 },
    { trade: "RTU Integration", csi: "23 09 33", desc: "Rooftop unit controls integration incl. economizer sequences", qty: 1, unit: "LS", unitCost: cost(27600.00), sub: "Y8S Controls Crew — Self-Perform", offset: 28, dur: 14 },
    { trade: "LV Wiring", csi: "25 05 28", desc: "Low-voltage wiring, conduit and pathway — all campuses", qty: 1, unit: "LS", unitCost: cost(46000.00), sub: "TexNet Low-Voltage Cabling", offset: 35, dur: 7 },
    { trade: "Actuators", csi: "23 09 13", desc: "Valve and damper actuator replacement at AHUs and VAVs", qty: 34, unit: "ea", unitCost: cost(27900.00) / 34, sub: "Hill Country Mechanical", offset: 14, dur: 14 },
    { trade: "Sensors", csi: "25 15 00", desc: "Space sensors, thermostats and CO2 monitoring", qty: 1, unit: "LS", unitCost: cost(9500.00), sub: "Y8S Controls Crew — Self-Perform", offset: 26, dur: 2 },
    { trade: "Plant Controls", csi: "23 09 93", desc: "Chiller and boiler plant sequences of operation, safeties and optimization", qty: 1, unit: "LS", unitCost: cost(100600.00), sub: "Y8S Controls Crew — Self-Perform", offset: 14, dur: 14 },
    { trade: "Mechanical Allowance", csi: "23 05 00", desc: "Concealed-condition mechanical allowance (valves, dampers, piping repairs)", qty: 1, unit: "LS", unitCost: cost(47400.00), sub: "Hill Country Mechanical", offset: 14, dur: 18 },
    { trade: "Graphics", csi: "25 90 00", desc: "Front-end graphics, alarming, trending and energy dashboards", qty: 1, unit: "LS", unitCost: cost(9700.00), sub: "Y8S Controls Crew — Self-Perform", offset: 28, dur: 6 },
    { trade: "General Conditions", csi: "01 31 00", desc: "Site logistics, lifts, badging, protection and daily coordination", qty: 1, unit: "LS", unitCost: cost(17600.00), sub: "Y8S Controls Crew — Self-Perform", offset: 0, dur: 41 },
    { trade: "PM & Engineering", csi: "01 31 13", desc: "Project management, engineering, submittals and closeout documentation", qty: 1, unit: "LS", unitCost: cost(16500.00), sub: "Y8S Controls Crew — Self-Perform", offset: 0, dur: 41 },
  ],
  alternates: [
    { id: "ALT-1", desc: "District-wide analytics & fault-detection (FDD) layer", amount: 38500.00, included: false },
    { id: "ALT-2", desc: "Gym & kitchen ventilation controls (2 campuses)", amount: 12800.00, included: false },
    { id: "ALT-3", desc: "Deduct — owner-furnished network switches", amount: -6200.00, included: false },
    { id: "ALT-4", desc: "First-year service agreement — Quarterly package (plant & terminal reviews, remote support)", amount: 14800.00, included: false },
  ],
  allowances: [
    { desc: "Concealed-condition mechanical allowance (carried in base, SOV 1007)", amount: 47400.00 },
    { desc: "Municipal permit & inspection fees", amount: 8500.00 },
  ],
  scopes: {
    "DDC Controls": "Furnish and install Carrier i-Vu DDC controllers and field hardware at all campuses. Panel fabrication, controller programming, database build and BACnet network configuration for full front-end visibility across the district.",
    "RTU Integration": "Integrate existing rooftop units into the new control system including economizer sequences, demand-controlled ventilation and fault reporting.",
    "LV Wiring": "Furnish and install low-voltage wiring, conduit and pathways per TIA standards. All terminations labeled and documented.",
    "Actuators": "Replace failed and end-of-life valve and damper actuators at air handlers and VAV terminals; verify stroke and calibrate.",
    "Sensors": "Install space temperature, humidity and CO2 sensors per the engineered points list; calibrate and map to graphics.",
    "Plant Controls": "Chiller and boiler plant controls: sequences of operation, equipment staging, safeties, and energy optimization routines. Coordinated shutdown windows with district facilities.",
    "Mechanical Allowance": "Owner allowance for concealed mechanical conditions discovered during retrofit, invoiced against documented quantities with photo evidence.",
    "Graphics": "Front-end graphics for every campus and system, alarm routing, trend configuration and district energy dashboards.",
    "General Conditions": "Lifts, site logistics, campus badging and background-checked technicians, protection of finishes, daily coordination with facilities staff.",
    "PM & Engineering": "Dedicated project manager and engineering support, submittal package, O&M documentation, as-builts and owner training.",
  },
  exclusions: [
    "Mechanical equipment replacement (chillers, boilers, RTUs) beyond controls scope",
    "Electrical panel upgrades or new circuits beyond low-voltage scope",
    "Asbestos abatement or hazardous-material handling",
    "Network infrastructure beyond the BAS VLAN (district IT scope)",
    "Structural repairs and roof penetrations beyond controls pathways",
    "Utility rebate application fees (application support included)",
  ],
  terms: [
    "Progress billing monthly via AIA G702/G703 with 5% retainage, Net 15 upon owner certification.",
    "Controls hardware deposit invoice due at mobilization for procurement of long-lead controllers.",
    "Concealed conditions billed against documented allowance with photo evidence; approval required before proceeding beyond allowance.",
    "Retainage released with final completion, lien waivers, as-builts and owner training sign-off.",
    "Proposal valid 30 days. Manufacturer warranty per product line; Y8S workmanship warranty: 2 years.",
  ],
};
window.BID_DEFAULTS = BID_DEFAULTS;


/* =========================================================
   EXTENDED JOB REGISTER — generated deterministically so every
   SOV, pay app and phase reconciles with jobMetrics math.
   Typical Y8S work: K-12, municipal, higher-ed, healthcare,
   commercial, industrial, hospitality, mission-critical.
   ========================================================= */
(function () {
  const CATALOG = [
    ["SMCA-2311", "San Marcos Civic Center — i-Vu Front-End Migration", "City of San Marcos", "630 E Hopkins St, San Marcos, TX", "Municipal — Front-End Migration (i-Vu)", "Brandon Yates", "S. Whitmore", 0, "Complete", "2023-11-06", "2024-01-26", 214000, 5, 100, 0.97],
    ["GUAD-2318", "Guadalupe County Annex — Controls Retrofit", "Guadalupe County", "211 W Court St, Seguin, TX", "Municipal — Controls Retrofit (i-Vu)", "Tyler Reidhead", "R. Trejo", 2, "Complete", "2023-12-04", "2024-03-15", 342500, 5, 100, 0.95],
    ["BLCO-2402", "Blanco River Office Park — Tenant Controls & Submetering", "Blanco River Holdings, LLC", "100 River Ridge Pkwy, San Marcos, TX", "Commercial — Controls & Metering (Lynxspring)", "Jordan Felps, P.E.", "M. Okafor", 3, "Complete", "2024-02-05", "2024-04-19", 187300, 5, 100, 0.98],
    ["KYLE-2405", "Kyle Medical Office Building — VAV Controls Upgrade", "Plum Creek Medical Partners", "1180 Kyle Pkwy, Kyle, TX", "Healthcare — VAV Upgrade (Innotech)", "Jordan Felps, P.E.", "M. Okafor", 1, "Complete", "2024-05-06", "2024-07-26", 296800, 5, 100, 0.96],
    ["TXST-2408", "Hillview State University — Science Hall BAS Replacement", "Hillview State University System", "Campus Dr, San Marcos, TX", "Higher Ed — BAS Replacement (i-Vu)", "Tyler Reidhead", "R. Trejo", 0, "Closeout", "2024-08-12", "2025-01-17", 1120000, 5, 100, 1.02],
    ["NBRF-2412", "New Braunfels Rec Center — EMS & Pool Dehumidification", "City of New Braunfels", "S Kessler Ave, New Braunfels, TX", "Municipal — EMS (Innotech)", "Brandon Yates", "C. Delgado", 2, "Complete", "2024-12-02", "2025-02-21", 158400, 5, 100, 0.94],
    ["SEGN-2501", "Seguin ISD — Chiller Plant Optimization (2 Plants)", "Seguin Independent School District", "1221 E Kingsbury St, Seguin, TX", "K-12 — Plant Optimization (i-Vu)", "Tyler Reidhead", "R. Trejo", 2, "In Progress", "2025-02-10", "2025-09-26", 438600, 10, 72, 0.95],
    ["AUSL-2503", "Austin Logistics Park — Building C Controls (New Construction)", "Capstone Industrial Development", "7800 Burleson Rd, Austin, TX", "Industrial — Plan & Spec (Lynxspring)", "Jordan Felps, P.E.", "C. Delgado", 1, "In Progress", "2025-03-17", "2025-10-10", 524000, 10, 61, 0.97],
    ["HILL-2504", "Hill Country Baptist Hospital — AHU Controls Phase 2", "Hill Country Baptist Health", "1305 Wonder World Dr, San Marcos, TX", "Healthcare — AHU Controls (Innotech)", "Jordan Felps, P.E.", "M. Okafor", 1, "In Progress", "2025-04-07", "2025-12-12", 912700, 10, 48, 0.99],
    ["WIMB-2505", "Wimberley ISD — District EMS & Energy Dashboards", "Wimberley Independent School District", "950 FM 2325, Wimberley, TX", "K-12 — EMS & Dashboards (i-Vu)", "Brandon Yates", "S. Whitmore", 0, "In Progress", "2025-05-05", "2025-11-21", 377900, 5, 35, 0.96],
    ["ALMO-2506", "Alamo Foods Cold Storage — Refrigeration Monitoring & Alarms", "Alamo Foods Distribution, Inc.", "4400 Lookout Rd, Selma, TX", "Industrial — Refrigeration Monitoring (Lynxspring)", "Tyler Reidhead", "C. Delgado", 3, "In Progress", "2025-05-19", "2025-10-03", 458300, 10, 55, 1.09],
    ["SANM-2508", "San Marcos Outlet Pavilion — RTU Controls & Demand Management", "Pavilion Retail Partners, LP", "3939 S IH-35, San Marcos, TX", "Retail — RTU Controls & Demand Mgmt (i-Vu)", "Brandon Yates", "S. Whitmore", 0, "In Progress", "2025-06-09", "2025-11-07", 243500, 10, 22, 0.95],
    ["LOCK-2509", "Lockhart City Hall — DDC Upgrade & Utility Metering", "City of Lockhart", "308 W San Antonio St, Lockhart, TX", "Municipal — DDC Upgrade (i-Vu)", "Brandon Yates", "S. Whitmore", 0, "Just Started", "2025-07-07", "2025-10-24", 129800, 5, 6, 0.95],
    ["BUDA-2510", "Buda Data Processing Center — CRAC Integration & Monitoring", "Lone Star Data Infrastructure", "1550 Main St, Buda, TX", "Mission Critical — CRAC Integration (Lynxspring)", "Jordan Felps, P.E.", "C. Delgado", 3, "Just Started", "2025-07-14", "2026-01-30", 684200, 10, 4, 1.0],
    ["CANY-2511", "Canyon Lake Resort & Spa — Guestroom EMS (214 Keys)", "Canyon Lake Hospitality Group", "2273 FM 2673, Canyon Lake, TX", "Hospitality — Guestroom EMS (Innotech)", "Brandon Yates", "M. Okafor", 1, "Awarded", "2025-08-18", "2026-02-27", 796400, 10, 0, 1.0],
    ["SCHL-2512", "Schlagel Distribution HQ — Office & Warehouse BAS", "Schlagel Distribution Co.", "8200 Interport Blvd, San Antonio, TX", "Commercial — New BAS (i-Vu)", "Tyler Reidhead", "R. Trejo", 2, "Awarded", "2025-09-01", "2026-03-20", 312600, 10, 0, 1.0],
    ["BLUE-2503", "Bluebonnet ISD — Districtwide MEP Controls Pkg #1 (14 Campuses)", "Bluebonnet Independent School District", "Districtwide · Guadalupe County, TX", "K-12 — Districtwide MEP Controls (i-Vu)", "Tyler Reidhead", "R. Trejo", 1, "In Progress", "2025-03-03", "2026-05-29", 5850000, 5, 41, 0.98],
    ["BLUE-2601", "Bluebonnet ISD — Districtwide MEP Controls Pkg #2 (11 Campuses)", "Bluebonnet Independent School District", "Districtwide · Guadalupe County, TX", "K-12 — Districtwide MEP Controls (i-Vu)", "Tyler Reidhead", "C. Delgado", 1, "Awarded", "2026-09-07", "2027-11-26", 7150000, 5, 0, 1.0],
  ];

  const SOV_T = [
    ["Controls Hardware, Panels & Software", 0.52],
    ["Installation Labor & Low-Voltage Wiring", 0.22],
    ["Integration & Programming", 0.12],
    ["Commissioning, TAB & Training", 0.06],
    ["General Conditions & PM/Engineering", 0.08],
  ];
  const PH_T = [
    ["Submittals & Procurement", 0.15],
    ["Rough-In & Controls Installation", 0.45],
    ["Integration & Programming", 0.20],
    ["Commissioning & TAB", 0.15],
    ["Closeout & Owner Training", 0.05],
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
          label: i === 0 ? "Pay App 1 — Mobilization & Hardware" : "Pay App " + (i + 1),
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
      changeOrders: (h % 3 === 0 && pct > 20) ? [{ num: "CO-01", desc: "Owner-added points and graphics revisions per field walk", amount: Math.round(contract * 0.021 / 100) * 100, status: h % 2 ? "Approved" : "Submitted" }] : [],
      photos: pct > 0 ? [{ src: "/yates/assets/photos/b" + String((h % 14) + 1).padStart(2, "0") + ".jpg", cap: "Field progress — " + name.split("—")[1].trim().toLowerCase(), date: addM(start, 1), tag: "Controls" }] : [],
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
  ["23 05 93", "Testing, Adjusting & Balancing"],
  ["23 09 13", "Instrumentation & Control Devices for HVAC"],
  ["23 09 23", "Direct-Digital Control System for HVAC"],
  ["23 09 33", "Electric & Electronic Control System for HVAC"],
  ["23 09 93", "Sequences of Operation for HVAC Controls"],
  ["25 05 28", "Pathways for Integrated Automation"],
  ["25 08 00", "Commissioning of Integrated Automation"],
  ["25 11 00", "Integrated Automation Network Devices"],
  ["25 14 00", "Integrated Automation Local Control Units"],
  ["25 15 00", "Integrated Automation Instrumentation & Terminal Devices"],
  ["25 36 00", "Integrated Automation Meters"],
  ["25 90 00", "Integrated Automation Control Sequences"],
  ["26 05 00", "Common Work Results for Electrical"],
  ["27 15 00", "Communications Horizontal Cabling"],
];
const UNITS = ["LS", "ea", "campus", "bldg", "floor", "SF", "LF", "pt", "RTU", "VAV", "panel", "hr", "wk"];
const TRADE_CATALOG = [
  { trade: "DDC Controls", csi: "25 14 00", unit: "campus", sub: 0, descs: [
    "i-Vu DDC controllers, field hardware and panel fabrication",
    "DDC controller replacement and database migration",
    "New DDC control system — controllers, panels and software",
    "Open-protocol BACnet controller retrofit at existing panels",
    "Standalone building controller with web-based access",
    "Controller firmware standardization and point database rebuild" ] },
  { trade: "Front-End & Network", csi: "25 11 00", unit: "LS", sub: 0, descs: [
    "Head-end server, network devices and BACnet configuration",
    "Front-end migration to i-Vu with graphics conversion",
    "BAS VLAN design, switches and IP addressing with district IT",
    "Cloud-hosted front end with remote access and MFA",
    "Legacy front-end decommissioning and history export" ] },
  { trade: "RTU Integration", csi: "23 09 33", unit: "RTU", sub: 0, descs: [
    "Rooftop unit controls integration incl. economizer sequences",
    "RTU replacement controls with demand-controlled ventilation",
    "Factory-controller integration via BACnet MSTP",
    "RTU fault detection and filter/airflow alarming",
    "Night setback and optimal start programming for packaged units" ] },
  { trade: "VAV Controls", csi: "23 09 23", unit: "VAV", sub: 0, descs: [
    "VAV terminal controllers, airflow calibration and mapping",
    "VAV retrofit — controllers, actuators and space sensors",
    "Fan-powered box controls with reheat sequences",
    "Zone rebalancing support and airflow verification",
    "Occupancy-based VAV setback with sensor integration" ] },
  { trade: "AHU Controls", csi: "23 09 23", unit: "ea", sub: 0, descs: [
    "Air handler controls — sensors, safeties and sequences",
    "AHU retrofit with static optimization and alarming",
    "Economizer and mixed-air control rebuild per Guideline 36",
    "VFD integration with duct static reset",
    "Freeze protection, smoke shutdown and safety circuit rework" ] },
  { trade: "Plant Controls", csi: "23 09 93", unit: "LS", sub: 0, descs: [
    "Chiller and boiler plant sequences of operation, safeties and optimization",
    "Chilled-water plant optimization and staging sequences",
    "Boiler lead/lag, outdoor reset and low-fire hold sequences",
    "Cooling tower staging, VFD fan control and basin management",
    "Condenser water optimization with wet-bulb reset",
    "Thermal storage charge/discharge scheduling" ] },
  { trade: "LV Wiring", csi: "25 05 28", unit: "LS", sub: 3, descs: [
    "Low-voltage wiring, conduit and pathway",
    "Communications cabling for BAS VLAN per TIA standards",
    "Plenum-rated sensor and controller cabling with labeling",
    "Conduit rough-in and sleeves at rated assemblies",
    "Demo and abatement-safe removal of abandoned control wiring" ] },
  { trade: "Actuators", csi: "23 09 13", unit: "ea", sub: 2, descs: [
    "Valve and damper actuator replacement at AHUs and VAVs",
    "Control valve replacement incl. piping coordination",
    "Pressure-independent control valve (PICV) upgrade",
    "Outside-air and relief damper actuator replacement",
    "Fail-safe (spring return) actuator upgrades at critical zones" ] },
  { trade: "Sensors", csi: "25 15 00", unit: "pt", sub: 0, descs: [
    "Space sensors, thermostats and CO2 monitoring",
    "Duct and pipe instrumentation per engineered points list",
    "Wireless sensor deployment for hard-to-wire zones",
    "Refrigerant leak and indoor air quality monitoring",
    "Outdoor air, humidity and enthalpy sensor package" ] },
  { trade: "Metering", csi: "25 36 00", unit: "ea", sub: 0, descs: [
    "Utility metering and submetering with dashboard integration",
    "Power monitoring — CTs, meters and trend configuration",
    "BTU metering at chilled and heating water loops",
    "Gas and domestic water submetering with leak alerts",
    "Tenant/departmental cost-allocation metering" ] },
  { trade: "Graphics", csi: "25 90 00", unit: "LS", sub: 0, descs: [
    "Front-end graphics, alarming, trending and energy dashboards",
    "Graphics standardization across campuses with alarm routing",
    "Floor-plan graphics with live zone temperature overlay",
    "Energy dashboard for lobby/kiosk display",
    "Alarm rationalization — priorities, routing and escalation" ] },
  { trade: "Electrical Sub", csi: "26 05 00", unit: "LS", sub: 1, descs: [
    "Line-voltage power to panels and transformers by electrical subcontractor",
    "Electrical rough-in coordination and circuits for controls",
    "120V panel feeds, disconnects and transformer installation",
    "Lighting control panel power and interlock wiring",
    "Emergency power coordination for critical controls" ] },
  { trade: "Mechanical Allowance", csi: "23 05 00", unit: "LS", sub: 2, descs: [
    "Concealed-condition mechanical allowance (valves, dampers, piping repairs)",
    "Mechanical repairs allowance billed against documented quantities",
    "Damper repair/replacement allowance at inaccessible shafts",
    "Steam trap and condensate repair allowance",
    "Refrigerant circuit repair allowance discovered during checkout" ] },
  { trade: "TAB & Commissioning", csi: "25 08 00", unit: "LS", sub: 4, descs: [
    "Point-to-point checkout, commissioning support and TAB coordination",
    "Functional performance testing and commissioning documentation",
    "Third-party Cx agent support and issue-log closure",
    "Seasonal/deferred testing (heating and cooling modes)",
    "Trend-based verification and M&V reporting period" ] },
  { trade: "Training & Closeout", csi: "01 79 00", unit: "LS", sub: 0, descs: [
    "Owner training, O&M documentation and as-builts",
    "Closeout package — warranties, as-builts and training sessions",
    "Recorded operator training sessions with quick-reference guides",
    "First-year warranty support and seasonal recommissioning visit" ] },
  { trade: "General Conditions", csi: "01 31 00", unit: "LS", sub: 0, descs: [
    "Site logistics, lifts, badging, protection and daily coordination",
    "General conditions — supervision support, safety and cleanup",
    "Occupied-facility protocols: escorts, after-hours and shutdown coordination",
    "Scaffolding, lifts and ceiling access incl. tile handling",
    "Waste handling, recycling of demolished controls and haul-off" ] },
  { trade: "PM & Engineering", csi: "01 31 13", unit: "LS", sub: 0, descs: [
    "Project management, engineering, submittals and closeout documentation",
    "Engineering — sequences, submittals and coordination drawings",
    "Points list, network riser and panel layout drawings",
    "Coordination with mechanical/electrical trades and owner IT",
    "Utility rebate application support and documentation" ] },
];
window.CSI_OPTIONS = CSI_OPTIONS;
window.UNITS = UNITS;
window.TRADE_CATALOG = TRADE_CATALOG;


/* =========================================================
   ENGINEERING LAYER — design process, submittal register,
   RFIs, equipment schedule and service agreements. Mirrors
   the real Y8S engineering workflow (y8sco.com design process,
   submittal package structure, service package tiers).
   ========================================================= */
const DESIGN_PROCESS = [
  "Internal sales-to-engineering team turnover discussion",
  "Engineer reviews sales and project documentation",
  "Request equipment submittals, AutoCAD files, existing site information",
  "Submit RFI addressing any discrepancies or concerns",
  "Thorough internal engineering review",
  "Provide completed design product to client",
];
const SERVICE_TIERS = {
  Annual: ["Database Management", "Basic Operator Training", "Remote Technical Support"],
  Quarterly: ["Database Management", "Basic Operator Training", "Remote Technical Support", "Central Plant Functional Review", "Maintenance Efficiency Strategies", "Terminal Unit Functional Review"],
  Monthly: ["Database Management", "Basic Operator Training", "Remote Technical Support", "Central Plant Functional Review", "Maintenance Efficiency Strategies", "Terminal Unit Functional Review", "Central Plant Optimization", "Input/Output Evaluation"],
  Custom: ["Personalized task list and visit schedule built from any combination of services"],
};
window.DESIGN_PROCESS = DESIGN_PROCESS;
window.SERVICE_TIERS = SERVICE_TIERS;

(function () {
  const hash = (s) => { let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 9973; return h; };
  const addD = (iso, n) => { const d = new Date(iso + "T12:00:00"); d.setDate(d.getDate() + n); return d.toISOString().slice(0, 10); };

  const SUB_T = [
    ["TOC.1", "Table of Contents"],
    ["SYM.1", "Symbols & Tag Descriptions"],
    ["WIRE.1", "Wiring Instructions (MS/TP · ARC156 · Modbus RTU)"],
    ["BOM.1", "Summary Bill of Materials"],
    ["VLV.1", "Valve & Damper Schedule"],
    ["NET.1", "Network Riser"],
    ["NET.2", "Network Schedule"],
    ["SEQ.1", "Air-Side Flow, Module Diagrams & Sequences of Operation"],
    ["SEQ.2", "Plant / Terminal Unit Sequences of Operation"],
    ["GFX.1", "Graphics Mockups & Dashboard Standards"],
  ];
  const RFI_SUBJECTS = [
    "Existing transformer sizing at VAV controllers conflicts with drawing E-401",
    "Chilled water differential-pressure sensor location vs. mechanical riser",
    "Ceiling access above corridor 214 blocked — request alternate pathway",
    "Economizer damper actuator torque exceeds spec at AHU-3",
    "BAS VLAN uplink port assignment pending owner IT confirmation",
    "Existing pneumatic tubing abandonment scope at mechanical room B",
  ];

  JOBS.forEach((j) => {
    const h = hash(j.id);
    const m = j.sov.reduce((a, r) => a + r.scheduled * r.pct / 100, 0);
    const pct = j.contract ? m / j.contract * 100 : 0;

    /* design process: steps complete scale with progress; awarded jobs are mid-turnover */
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

    /* equipment & points schedule (scaled to contract) */
    const scale = Math.max(1, Math.round(j.contract / 250000));
    const line = (j.sector.match(/\(([^)]+)\)/) || [null, "i-Vu"])[1].replace("Carrier ", "");
    const eq = [];
    const sec = j.sector.toLowerCase();
    if (sec.includes("k-12") || sec.includes("higher ed") || sec.includes("municipal") || sec.includes("retail") || sec.includes("hospitality") || sec.includes("commercial") || sec.includes("front-end")) {
      eq.push(["RTU", "Packaged rooftop units", 4 * scale, 12]);
      eq.push(["EF", "Exhaust fans", 3 * scale, 3]);
      if (j.contract > 300000) eq.push(["CH/B", "Chiller & boiler plant", 1, 64]);
      eq.push(["VAV", "VAV terminal units", 8 * scale, 9]);
    } else if (sec.includes("health")) {
      eq.push(["AHU", "Air handling units", 2 * scale, 38]);
      eq.push(["VAV", "VAV terminal units w/ reheat", 10 * scale, 11]);
      eq.push(["CH", "Chilled water plant", 1, 72]);
      eq.push(["ISO", "Isolation / pressure-monitored rooms", 2 * scale, 6]);
    } else if (sec.includes("industrial") || sec.includes("mission critical") || sec.includes("refrigeration") || sec.includes("ems")) {
      eq.push(["RTU", "Packaged rooftop units", 5 * scale, 12]);
      eq.push(["HVLS", "HVLS fans & warehouse ventilation", 3 * scale, 4]);
      eq.push(["MTR", "Utility meters & submeters", 2 * scale, 8]);
      if (sec.includes("mission critical")) eq.push(["CRAC", "CRAC/CRAH units", 4, 22]);
      if (sec.includes("refrigeration")) eq.push(["RCK", "Refrigeration racks & cases", 3, 18]);
    } else {
      eq.push(["AHU", "Air handling units", 2 * scale, 32]);
      eq.push(["VAV", "VAV terminal units", 6 * scale, 9]);
    }
    const equipment = eq.map((e) => ({ tag: e[0], desc: e[1], qty: e[2], ptsEach: e[3], controller: line + " DDC", points: e[2] * e[3] }));

    /* service agreement (their real tiers) */
    const tiers = ["Annual", "Quarterly", "Monthly", "Custom"];
    const tier = tiers[h % 4];
    const servicePkg = pct >= 100 ? { tier, status: "Active" } : pct > 40 ? { tier, status: "Proposed" } : null;

    j.eng = { design, submittals, rfis, equipment, servicePkg };
  });
})();


/* =========================================================
   SERVICE DIVISION — agreements book + dispatch board.
   Tiers and inclusions mirror y8sco.com/services-packages.
   ========================================================= */
const SERVICE_AGREEMENTS = [
  { client: "Central Texas ISD", line: "Controls", svcType: "PMA", site: "12 campuses · San Marcos", tier: "Monthly", monthly: 3850, start: "2025-01-01", renewal: "2026-12-31", status: "Active", tech: "M. Ibarra" },
  { client: "Hillview State University", line: "Controls", svcType: "PMA", site: "Science Hall + 3 bldgs", tier: "Monthly", monthly: 3200, start: "2025-02-01", renewal: "2027-01-31", status: "Active", tech: "T. Coleman" },
  { client: "City of San Marcos", line: "HVAC", svcType: "PMA", site: "Civic Center + Library", tier: "Quarterly", monthly: 1150, start: "2024-03-01", renewal: "2026-08-31", status: "Expiring", tech: "L. Fuentes" },
  { client: "Guadalupe County", line: "Controls", svcType: "PMA", site: "Annex + Courthouse", tier: "Quarterly", monthly: 980, start: "2024-04-01", renewal: "2027-03-31", status: "Active", tech: "M. Ibarra" },
  { client: "Plum Creek Medical Partners", line: "HVAC", svcType: "PMA", site: "Kyle MOB", tier: "Monthly", monthly: 2650, start: "2024-08-01", renewal: "2026-09-30", status: "Expiring", tech: "T. Coleman" },
  { client: "Blanco River Holdings", line: "Controls", svcType: "On-Demand", site: "Office Park — 3 bldgs", tier: "Quarterly", monthly: 890, start: "2024-05-01", renewal: "2027-04-30", status: "Active", tech: "L. Fuentes" },
  { client: "City of New Braunfels", line: "HVAC", svcType: "PMA", site: "Rec Center + Pool", tier: "Quarterly", monthly: 1240, start: "2025-03-01", renewal: "2027-02-28", status: "Active", tech: "M. Ibarra" },
  { client: "Hill Country Baptist Health", line: "Controls", svcType: "PMA", site: "Main Hospital Campus", tier: "Monthly", monthly: 3675, start: "2025-06-01", renewal: "2027-05-31", status: "Active", tech: "T. Coleman" },
  { client: "Riverbend Church", line: "HVAC", svcType: "On-Demand", site: "Sanctuary + Annex", tier: "Annual", monthly: 420, start: "2024-10-01", renewal: "2026-09-30", status: "Expiring", tech: "L. Fuentes" },
  { client: "San Marcos Outlet Pavilion", line: "Controls", svcType: "Small Project", site: "Retail Pavilion", tier: "Custom", monthly: 1550, start: "2025-07-01", renewal: "2027-06-30", status: "Active", tech: "M. Ibarra" },
  { client: "Comal County Offices", line: "Plumbing", svcType: "PMA", site: "3 county facilities", tier: "Annual", monthly: 510, start: "2025-01-15", renewal: "2027-01-14", status: "Active", tech: "L. Fuentes" },
  { client: "Alamo Foods Distribution", line: "Controls", svcType: "PMA", site: "Cold Storage — Selma", tier: "Monthly", monthly: 2980, start: "2025-09-01", renewal: "2026-10-15", status: "Proposed", tech: "—" },
  { client: "Lone Star Data Infrastructure", line: "Controls", svcType: "PMA", site: "Buda Data Center", tier: "Custom", monthly: 4400, start: "2026-02-01", renewal: "2027-01-31", status: "Proposed", tech: "—" },
  { client: "Wimberley ISD", line: "HVAC", svcType: "Small Project", site: "District-wide", tier: "Quarterly", monthly: 1380, start: "2025-12-01", renewal: "2026-11-30", status: "Proposed", tech: "—" },
];
const SERVICE_CALLS = [
  { num: "SC-4211", client: "Hill Country Baptist Health", issue: "OR suite humidity alarm — AHU-2 valve hunting", priority: "Emergency", tech: "T. Coleman", status: "In Progress", opened: "2026-07-27" },
  { num: "SC-4209", client: "Central Texas ISD", issue: "Campus 4 chiller 2 failed to stage during afternoon peak", priority: "High", tech: "M. Ibarra", status: "In Progress", opened: "2026-07-27" },
  { num: "SC-4206", client: "City of San Marcos", issue: "Library RTU-3 economizer damper fault", priority: "Standard", tech: "L. Fuentes", status: "Scheduled", opened: "2026-07-26" },
  { num: "SC-4204", client: "Plum Creek Medical Partners", issue: "Suite 210 zone sensor offline — comm loss", priority: "Standard", tech: "T. Coleman", status: "Scheduled", opened: "2026-07-26" },
  { num: "SC-4199", client: "Guadalupe County", issue: "Courthouse boiler lockout — flame sensor", priority: "High", tech: "M. Ibarra", status: "Parts on Order", opened: "2026-07-24" },
  { num: "SC-4195", client: "Blanco River Holdings", issue: "Bldg B after-hours override schedule not releasing", priority: "Standard", tech: "L. Fuentes", status: "Dispatched", opened: "2026-07-24" },
  { num: "SC-4192", client: "Hillview State University", issue: "Science Hall lab exhaust tracking alarm", priority: "High", tech: "T. Coleman", status: "Parts on Order", opened: "2026-07-23" },
  { num: "SC-4188", client: "City of New Braunfels", issue: "Pool dehumidification unit condensate alarm", priority: "Standard", tech: "M. Ibarra", status: "Scheduled", opened: "2026-07-22" },
];
window.SERVICE_AGREEMENTS = SERVICE_AGREEMENTS;
window.SERVICE_CALLS = SERVICE_CALLS;


/* =========================================================
   BID PIPELINE — preconstruction book for win/loss analytics.
   Estimators = the real Y8S sales team.
   ========================================================= */
const BID_PIPELINE = [
  { id: "B-2601", project: "Comal ISD — 4-Campus Controls Retrofit", owner: "Comal ISD", sector: "K-12", est: "David Glenney", due: "2026-08-14", amount: 918000, marginPct: 14.8, status: "Submitted" },
  { id: "B-2602", project: "Kerrville Medical Pavilion — New BAS", owner: "Hill Country Medical REIT", sector: "Healthcare", est: "Taz Abid", due: "2026-08-21", amount: 1240000, marginPct: 15.6, status: "Draft" },
  { id: "B-2603", project: "San Antonio Food Bank — EMS & Refrigeration", owner: "SA Food Bank", sector: "Industrial", est: "Joe Luna", due: "2026-08-08", amount: 486000, marginPct: 13.9, status: "Submitted" },
  { id: "B-2604", project: "Georgetown Civic Complex — Plant Optimization", owner: "City of Georgetown", sector: "Municipal", est: "David Glenney", due: "2026-09-04", amount: 352000, marginPct: 14.2, status: "Draft" },
  { id: "B-2605", project: "Alamo Heights Hotel — Guestroom EMS (168 keys)", owner: "AH Hospitality LP", sector: "Hospitality", est: "Taz Abid", due: "2026-08-28", amount: 642000, marginPct: 16.1, status: "Pending Award" },
  { id: "B-2598", project: "Bexar County Annex — DDC Upgrade", owner: "Bexar County", sector: "Municipal", est: "Joe Luna", due: "2026-07-10", amount: 298000, marginPct: 13.5, status: "Pending Award" },
  { id: "B-2594", project: "Canyon Lake Resort — Guestroom EMS", owner: "Canyon Lake Hospitality Group", sector: "Hospitality", est: "Taz Abid", due: "2026-06-19", amount: 796400, marginPct: 15.2, status: "Won", jobId: "CANY-2511" },
  { id: "B-2593", project: "Schlagel Distribution HQ — Office & Warehouse BAS", owner: "Schlagel Distribution Co.", sector: "Commercial", est: "David Glenney", due: "2026-06-12", amount: 312600, marginPct: 14.6, status: "Won", jobId: "SCHL-2512" },
  { id: "B-2590", project: "Buda Data Processing Center — CRAC Integration", owner: "Lone Star Data Infrastructure", sector: "Mission Critical", est: "Joe Luna", due: "2026-05-29", amount: 684200, marginPct: 15.9, status: "Won", jobId: "BUDA-2510" },
  { id: "B-2588", project: "Rock Creek ISD — Controls Standardization", owner: "Rock Creek ISD", sector: "K-12", est: "David Glenney", due: "2026-05-15", amount: 869300, marginPct: 15.1, status: "Won", jobId: "RCI-2507" },
  { id: "B-2586", project: "Medina Valley ISD — 2-Campus Retrofit", owner: "Medina Valley ISD", sector: "K-12", est: "David Glenney", due: "2026-05-08", amount: 512000, marginPct: 12.4, status: "Lost", note: "Price — incumbent 9% under" },
  { id: "B-2583", project: "Northline Office Tower — BAS Replacement", owner: "Northline Partners", sector: "Commercial", est: "Taz Abid", due: "2026-04-24", amount: 1180000, marginPct: 16.8, status: "Lost", note: "Owner deferred capital to 2027" },
  { id: "B-2580", project: "San Marcos Outlet Pavilion — RTU & Demand Mgmt", owner: "Pavilion Retail Partners, LP", sector: "Retail", est: "Joe Luna", due: "2026-04-10", amount: 243500, marginPct: 14.0, status: "Won", jobId: "SANM-2508" },
  { id: "B-2577", project: "Guadalupe Regional Clinic — VAV Controls", owner: "GR Health", sector: "Healthcare", est: "Taz Abid", due: "2026-03-27", amount: 388000, marginPct: 15.4, status: "Won" },
  { id: "B-2574", project: "Seguin Distribution Center — Warehouse EMS", owner: "Seguin Logistics LLC", sector: "Industrial", est: "Joe Luna", due: "2026-03-13", amount: 705000, marginPct: 13.2, status: "Lost", note: "Bid as plan-and-spec; GC self-performed" },
  { id: "B-2571", project: "Lockhart City Hall — DDC & Metering", owner: "City of Lockhart", sector: "Municipal", est: "David Glenney", due: "2026-02-27", amount: 129800, marginPct: 14.9, status: "Won", jobId: "LOCK-2509" },
  { id: "B-2568", project: "Blanco County Justice Center — New BAS", owner: "Blanco County", sector: "Municipal", est: "Joe Luna", due: "2026-02-13", amount: 445000, marginPct: 13.8, status: "Lost", note: "Price — 4% over low bidder" },
  { id: "B-2565", project: "Hays Medical Plaza — BAS & Energy Retrofit", owner: "Hays Medical Properties, LP", sector: "Healthcare", est: "Taz Abid", due: "2026-01-09", amount: 1284500, marginPct: 15.7, status: "Won", jobId: "HMP-2502" },
];
window.BID_PIPELINE = BID_PIPELINE;

/* ---- change orders created in the portal (localStorage) merge into each job ---- */
(function () {
  JOBS.forEach((j) => {
    try {
      const stored = JSON.parse(localStorage.getItem('yates-co:' + j.id) || '[]');
      stored.forEach(co => j.changeOrders.push(co));
    } catch (e) {}
  });
})();


/* =========================================================
   FORECAST ENGINE PARAMETERS — fictional recreation of the
   monthly-forecast math (trade mix, spread curves, heads).
   ========================================================= */
const ENGINE = {
  tradeMix: { pm: 7, eng: 8, tech: 9, material: 46, install: 20 },   /* % of revenue; remainder = mileage/incentive/other */
  curve12: [1, 3, 26, 18, 16, 11, 3, 3, 4, 5, 5, 5],                 /* % of job revenue by month — $350K-$900K jobs */
  curve18: [2, 2, 4, 5, 3, 9, 10, 8, 6, 6, 6, 6, 6, 6, 6, 5, 5, 5], /* larger jobs */
  weeksPerMo: 4.3, hrsPerWk: 40, utilization: 0.9,                   /* heads = hours / (4.3*40*0.9 = 154.8) */
  blendedRates: { install: 82, tech: 96, eng: 112, pm: 105 },        /* $/hr for hours conversion */
  installHeadsCurrent: 38,
};
ENGINE.hrsPerHead = ENGINE.weeksPerMo * ENGINE.hrsPerWk * ENGINE.utilization;
window.ENGINE = ENGINE;

/* utilization snapshot — labor dollars costed to… (from timesheets/ServiceTitan) */
const UTILIZATION = {
  current: { projects: 71, service: 21, overhead: 8 },
  trend: [
    { wk: "Jun 5", projects: 68, service: 22, overhead: 10 },
    { wk: "Jun 12", projects: 70, service: 21, overhead: 9 },
    { wk: "Jun 19", projects: 73, service: 19, overhead: 8 },
    { wk: "Jun 26", projects: 69, service: 23, overhead: 8 },
    { wk: "Jul 3", projects: 72, service: 20, overhead: 8 },
    { wk: "Jul 10", projects: 71, service: 21, overhead: 8 },
  ],
};
window.UTILIZATION = UTILIZATION;

/* KPI snapshot for the executive dashboard (fictional) */
const KPI_SNAPSHOT = {
  cashOnHand: 2840000, arDays: 52, apDays: 38,
  backlogMonths: 7.4, safetyDays: 412, openRFIs: 6,
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
