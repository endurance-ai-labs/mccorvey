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
  hq: "San Marcos, Texas",
  address: "San Marcos, TX",
  phone: "(210) 702-3820",
  email: "contact@y8sco.com",
  award: "Best Place to Work in San Marcos, TX 2026",
  lines: "Carrier i-Vu · Innotech · Lynxspring",
  /* compat fields used by document footers */
  legal: "YATES Company, LLC",
  office: "San Marcos, Texas",
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
