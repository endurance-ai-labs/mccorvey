/* =====================================================================
   BID CALC — the Adjustable Bid Modeler's math, shared so the Spec Book
   proposal prices to the penny the same way the bid sheet does.
   Keep in sync with bidmodel/index.html (lineCost / lineCalc / totals).
   ===================================================================== */
(function () {
  const KEY_STATE = 'msm-bidsheet-v3', KEY_REVS = 'msm-bidsheet-revs-v3';
  const FIELD_POOL = 340, SHOP_POOL = 580, UTIL = 0.9, HRSWK = 40, TARGET = 13, FLOOR = 11;
  const DEFAULT_G = { shopRate: 62, fieldRate: 78, escPct: 1.0, defMkup: 15.5, ohPct: 6.0, bondPct: 1.0, glPct: 0.85, contPct: 0.5,
    weeks: 40, otPct: 0, fieldCommitPct: 78, shopCommitPct: 82 };
  const DEFAULT_TERMS = {
    incl: 'Detailing & LOD 400 coordination, fabrication at McCorvey plants, delivery, installation, hangers & supports, TAB support. Quantities per the bid documents and addenda as reviewed.',
    excl: 'HVAC equipment, controls, electrical, TAB (by others), painting of exposed duct. Progress billing monthly via AIA G702/G703, 5% retainage. Steel surcharge applies after validity.',
    valid: 30,
  };
  const ADDER = 'Spec adder — ';
  const inc = l => l.inc !== false;

  function lineCost(S, l) {
    const G = S.g, em = 1 + G.escPct / 100, otX = 1 + (G.otPct / (100 + G.otPct)) * 0.5;
    const shopH = l.shopUPH > 0 ? l.qty / l.shopUPH : 0, fieldH = l.fieldUPH > 0 ? l.qty / l.fieldUPH : 0;
    const mat = l.qty * l.mat * em, shop = shopH * G.shopRate * otX, field = fieldH * G.fieldRate * otX;
    return { shopH, fieldH, mat, shop, field, cost: mat + shop + field };
  }
  function lineCalc(S, l) {
    const b = lineCost(S, l);
    const mk = l.mkup != null ? l.mkup : S.g.defMkup;
    const sell = b.cost * (1 + mk / 100), oh = b.cost * S.g.ohPct / 100;
    return Object.assign(b, { unitCost: l.qty ? b.cost / l.qty : 0, mk, sell, unitSell: l.qty ? sell / l.qty : 0, oh, profit: sell - b.cost - oh, margin: sell ? (sell - b.cost) / sell * 100 : 0 });
  }
  function totals(S) {
    const G = S.g;
    const L = S.lines.map(l => lineCalc(S, l));
    const sum = k => L.reduce((a, x, i) => a + (inc(S.lines[i]) ? x[k] : 0), 0);
    const cost = sum('cost'), sell = sum('sell'), oh = sum('oh'), profit = sum('profit'), shopH = sum('shopH'), fieldH = sum('fieldH');
    const a = (G.bondPct + G.glPct + G.contPct) / 100;
    const addons = sell * a, cont$ = sell * G.contPct / 100, client = sell + addons;
    const margin = client ? (sell - cost + cont$) / client * 100 : 0;
    const weeks = Math.max(4, G.weeks), hpw = weeks * HRSWK * UTIL * (1 + G.otPct / 100);
    const fieldNeed = fieldH / hpw, shopNeed = shopH / hpw;
    const fieldAvail = FIELD_POOL * (1 - G.fieldCommitPct / 100), shopAvail = SHOP_POOL * (1 - G.shopCommitPct / 100);
    const fLoad = fieldNeed / Math.max(0.1, fieldAvail) * 100, sLoad = shopNeed / Math.max(0.1, shopAvail) * 100;
    const st = x => x <= 85 ? 'ok' : x <= 100 ? 'tight' : 'over';
    return { L, cost, sell, oh, profit, addons, client, margin, a, weeks, fieldNeed, shopNeed, fieldAvail, shopAvail, fLoad, sLoad, mp: st(Math.max(fLoad, sLoad)) };
  }

  function load() { try { const s = JSON.parse(localStorage.getItem(KEY_STATE) || 'null'); if (s && s.lines) { s.meta = Object.assign({}, DEFAULT_TERMS, s.meta); s.g = Object.assign({}, DEFAULT_G, s.g); return s; } } catch (e) {} return null; }
  function save(S) { try { localStorage.setItem(KEY_STATE, JSON.stringify(S)); } catch (e) {} }
  function revs() { try { return JSON.parse(localStorage.getItem(KEY_REVS) || '[]'); } catch (e) { return []; } }

  /* Start a fresh sheet for a spec book (old sheet kept as a backup) */
  function startSheet(meta, baseLines) {
    const old = load();
    if (old) try { localStorage.setItem(KEY_STATE + '-backup', JSON.stringify(old)); localStorage.setItem(KEY_REVS + '-backup', localStorage.getItem(KEY_REVS) || '[]'); } catch (e) {}
    try { localStorage.setItem(KEY_REVS, '[]'); } catch (e) {}
    const S = { meta: Object.assign({}, DEFAULT_TERMS, meta), g: Object.assign({}, DEFAULT_G),
      lines: (baseLines || []).map(b => ({ scope: b.scope, unit: b.unit, qty: b.qty, mat: b.mat, shopUPH: b.shopUPH, fieldUPH: b.fieldUPH, mkup: b.mkup != null ? b.mkup : null, tag: 'Spec book takeoff' })),
      status: 'draft' };
    save(S);
    return S;
  }
  /* Make the sheet's spec-adder lines exactly match the priced findings */
  function syncAdders(S, adders) {
    const want = new Map(adders.map(a => [ADDER + a.title, a]));
    let added = 0, updated = 0, removed = 0;
    S.lines = S.lines.filter(l => {
      if (!l.scope.startsWith(ADDER)) return true;
      if (!want.has(l.scope)) { removed++; return false; }
      return true;
    });
    want.forEach((a, scope) => {
      const ex = S.lines.find(l => l.scope === scope);
      if (ex) { if (ex.mat !== a.amt || ex.inc === false || ex.qty !== 1) { ex.mat = a.amt; ex.qty = 1; ex.inc = undefined; ex.tag = a.tag; updated++; } }
      else { S.lines.push({ scope, unit: 'LS', qty: 1, mat: a.amt, shopUPH: 0, fieldUPH: 0, mkup: null, tag: a.tag, flag: 1 }); added++; }
    });
    return { added, updated, removed };
  }
  /* What is out of sync, without changing anything */
  function adderDiff(S, adders) {
    const issues = [];
    if (!S) return [{ kind: 'nosheet' }];
    const want = new Map(adders.map(a => [ADDER + a.title, a]));
    want.forEach((a, scope) => {
      const ex = S.lines.find(l => l.scope === scope);
      if (!ex) issues.push({ kind: 'missing', title: a.title });
      else if (ex.inc === false) issues.push({ kind: 'excluded', title: a.title });
      else if (Math.round(ex.mat * ex.qty) !== Math.round(a.amt)) issues.push({ kind: 'amount', title: a.title, sheet: ex.mat * ex.qty, spec: a.amt });
    });
    S.lines.forEach(l => { if (l.scope.startsWith(ADDER) && inc(l) && !want.has(l.scope)) issues.push({ kind: 'extra', title: l.scope.slice(ADDER.length) }); });
    return issues;
  }

  window.BidCalc = { KEY_STATE, KEY_REVS, TARGET, FLOOR, ADDER, DEFAULT_G, DEFAULT_TERMS, inc, lineCalc, totals, load, save, revs, startSheet, syncAdders, adderDiff };
})();
