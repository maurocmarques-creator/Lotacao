/* ============================================================
   Formação de Carga — diz se os volumes cabem no baú e monta o
   plano de carregamento (3D passo a passo, mapa por nível, vista
   lateral e sequência). Tudo local: estado salvo no localStorage.
   ============================================================ */
(function () {
  const $ = (id) => document.getElementById(id);
  const EPS = 1e-6;
  const COLORS = ["#E3A23B", "#4A8CCB", "#58A96A", "#D0685A", "#8C71C6", "#35ADA5", "#C77CAD", "#A39447", "#6E83A6", "#DB8B4B", "#7FB24A", "#B9795A"];
  const letter = (i) => String.fromCharCode(65 + (i % 26)) + (i >= 26 ? Math.floor(i / 26) : "");
  const color = (i) => COLORS[i % COLORS.length];
  const num = (v) => { const n = parseFloat(String(v ?? "").trim().replace(/\s/g, "").replace(",", ".")); return isFinite(n) ? n : NaN; };
  const fmt = (n, d = 2) => n.toLocaleString("pt-BR", { minimumFractionDigits: d, maximumFractionDigits: d });
  const fmt0 = (n) => Math.round(n).toLocaleString("pt-BR");
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  const PRESETS = [
    { k: "custom", n: "Personalizado" },
    { k: "ex", n: "Carreta baú 15,80 × 2,60 × 2,80", L: "15,80", W: "2,60", H: "2,80" },
    { k: "car", n: "Carreta baú típica — 14,60 × 2,48 × 2,70", L: "14,60", W: "2,48", H: "2,70" },
    { k: "trk", n: "Truck baú típico — 8,50 × 2,48 × 2,70", L: "8,50", W: "2,48", H: "2,70" },
    { k: "toc", n: "Toco baú típico — 6,50 × 2,45 × 2,60", L: "6,50", W: "2,45", H: "2,60" },
    { k: "vuc", n: "VUC típico — 4,30 × 2,20 × 2,20", L: "4,30", W: "2,20", H: "2,20" },
    { k: "c20", n: "Contêiner 20' Dry — 5,90 × 2,35 × 2,39", L: "5,90", W: "2,35", H: "2,39" },
    { k: "c40", n: "Contêiner 40' Dry — 12,03 × 2,35 × 2,39", L: "12,03", W: "2,35", H: "2,39" },
    { k: "c40h", n: "Contêiner 40' HC — 12,03 × 2,35 × 2,69", L: "12,03", W: "2,35", H: "2,69" },
  ];
  const DEFAULT = {
    cotacao: "",
    truck: { L: "15,80", W: "2,60", H: "2,80", cap: "" },
    opts: { stack: true, tip: false, sup: 80, gap: 0 },
    types: [
      { q: 15, l: 146, w: 82, h: 96, kg: "", st: true },
      { q: 29, l: 107, w: 62, h: 73, kg: "", st: true },
      { q: 10, l: 122, w: 57, h: 114, kg: "", st: true },
      { q: 2, l: 120, w: 80, h: 76, kg: "", st: true },
      { q: 1, l: 82, w: 63, h: 75, kg: "", st: true },
      { q: 3, l: 133, w: 73, h: 127, kg: "", st: true },
      { q: 3, l: 108, w: 63, h: 74, kg: "", st: true },
    ],
  };
  const KEY = "formacaoCarga.v1";
  let S;
  try { S = JSON.parse(localStorage.getItem(KEY)); } catch (e) { S = null; }
  if (!S || !S.truck || !Array.isArray(S.types)) S = JSON.parse(JSON.stringify(DEFAULT));
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} };

  /* ---------- entradas ---------- */
  const presetSel = $("fcPreset");
  presetSel.innerHTML = PRESETS.map((p) => `<option value="${p.k}">${esc(p.n)}</option>`).join("");
  function syncPreset() {
    const m = PRESETS.find((p) => p.L && num(p.L) === num(S.truck.L) && num(p.W) === num(S.truck.W) && num(p.H) === num(S.truck.H));
    presetSel.value = m ? m.k : "custom";
  }
  function fillTruck() {
    $("fcCotacao").value = S.cotacao || "";
    $("fcL").value = S.truck.L; $("fcW").value = S.truck.W; $("fcH").value = S.truck.H; $("fcCap").value = S.truck.cap || "";
    $("fcStack").checked = !!S.opts.stack; $("fcTip").checked = !!S.opts.tip; $("fcSup").value = S.opts.sup; $("fcGap").value = S.opts.gap;
    syncPreset();
    atualizarCotacaoInfo();
  }
  function atualizarCotacaoInfo() {
    const el = $("fcCotacaoInfo");
    const v = (S.cotacao || "").toString().trim();
    el.hidden = !v;
    el.textContent = v ? `Cotação Nº ${v}` : "";
  }
  $("fcCotacao").addEventListener("input", (e) => { S.cotacao = e.target.value; atualizarCotacaoInfo(); save(); });
  presetSel.addEventListener("change", () => {
    const p = PRESETS.find((x) => x.k === presetSel.value);
    if (p && p.L) { S.truck.L = p.L; S.truck.W = p.W; S.truck.H = p.H; fillTruck(); save(); }
  });
  [["fcL", "L"], ["fcW", "W"], ["fcH", "H"], ["fcCap", "cap"]].forEach(([id, k]) =>
    $(id).addEventListener("input", (e) => { S.truck[k] = e.target.value; syncPreset(); save(); }));
  $("fcStack").addEventListener("change", (e) => { S.opts.stack = e.target.checked; save(); });
  $("fcTip").addEventListener("change", (e) => { S.opts.tip = e.target.checked; save(); });
  $("fcSup").addEventListener("input", (e) => { S.opts.sup = e.target.value; save(); });
  $("fcGap").addEventListener("input", (e) => { S.opts.gap = e.target.value; save(); });

  function renderTypes() {
    $("fcTypesBody").innerHTML = S.types.map((t, i) => `<tr>
      <td><span class="fc-chip" style="background:${color(i)}">${letter(i)}</span></td>
      <td class="q"><input class="fc-num" id="fc${i}q" data-i="${i}" data-k="q" value="${esc(t.q)}" inputmode="numeric" aria-label="Quantidade tipo ${letter(i)}"></td>
      <td class="d"><input class="fc-num" id="fc${i}l" data-i="${i}" data-k="l" value="${esc(t.l)}" inputmode="decimal" aria-label="Comprimento tipo ${letter(i)}"></td>
      <td class="d"><input class="fc-num" id="fc${i}w" data-i="${i}" data-k="w" value="${esc(t.w)}" inputmode="decimal" aria-label="Largura tipo ${letter(i)}"></td>
      <td class="d"><input class="fc-num" id="fc${i}h" data-i="${i}" data-k="h" value="${esc(t.h)}" inputmode="decimal" aria-label="Altura tipo ${letter(i)}"></td>
      <td class="k"><input class="fc-num" id="fc${i}kg" data-i="${i}" data-k="kg" value="${esc(t.kg ?? "")}" inputmode="decimal" placeholder="—" aria-label="Peso por caixa tipo ${letter(i)}"></td>
      <td style="text-align:center"><input type="checkbox" id="fc${i}st" data-i="${i}" data-k="st" ${t.st !== false ? "checked" : ""} aria-label="Tipo ${letter(i)} aceita carga em cima"></td>
      <td><button type="button" class="btn-remove" data-del="${i}" aria-label="Remover tipo ${letter(i)}">×</button></td>
    </tr>`).join("");
    cargoSummary();
  }
  function cargoSummary() {
    let n = 0, v = 0, kg = 0;
    S.types.forEach((t) => { const q = num(t.q) || 0; n += q; v += q * (num(t.l) || 0) * (num(t.w) || 0) * (num(t.h) || 0) / 1e6; kg += q * (num(t.kg) || 0); });
    $("fcCargoSum").textContent = `${S.types.length} tipos · ${fmt0(n)} volumes · ${fmt(v)} m³` + (kg ? ` · ${fmt0(kg)} kg` : "");
  }
  $("fcTypesBody").addEventListener("input", (e) => {
    const el = e.target, i = +el.dataset.i, k = el.dataset.k;
    if (k == null || isNaN(i)) return;
    S.types[i][k] = k === "st" ? el.checked : el.value; cargoSummary(); save();
  });
  $("fcTypesBody").addEventListener("change", (e) => { const el = e.target; if (el.dataset.k === "st") { S.types[+el.dataset.i].st = el.checked; save(); } });
  $("fcTypesBody").addEventListener("click", (e) => {
    const d = e.target.closest("[data-del]"); if (!d) return;
    S.types.splice(+d.dataset.del, 1); renderTypes(); save();
  });
  $("fcBtnAdd").addEventListener("click", () => {
    S.types.push({ q: 1, l: 100, w: 60, h: 60, kg: "", st: true }); renderTypes(); save();
    $("fc" + (S.types.length - 1) + "q").focus();
  });

  function parseList(txt) {
    const out = [];
    txt.split(/\r?\n/).forEach((line) => {
      const m = line.match(/(\d+)[^\d]*?(\d+(?:[.,]\d+)?)\s*(?:cm|mm|m)?\s*[x×X*]\s*(\d+(?:[.,]\d+)?)\s*(?:cm|mm|m)?\s*[x×X*]\s*(\d+(?:[.,]\d+)?)/);
      if (!m) return;
      let d = [num(m[2]), num(m[3]), num(m[4])];
      if (/\d\s*mm\b/i.test(line)) d = d.map((x) => x / 10);
      else if (d.every((x) => x < 10)) d = d.map((x) => x * 100);
      out.push({ q: parseInt(m[1], 10), l: +d[0].toFixed(1), w: +d[1].toFixed(1), h: +d[2].toFixed(1), kg: "", st: true });
    });
    return out;
  }
  $("fcBtnPaste").addEventListener("click", () => { const b = $("fcPasteBox"); b.hidden = !b.hidden; if (!b.hidden) $("fcPasteText").focus(); });
  function doImport(replace) {
    const r = parseList($("fcPasteText").value);
    if (!r.length) { $("fcPasteMsg").textContent = "Nenhuma linha reconhecida. Use o formato “15 caixas com 146x82x96 cm”."; return; }
    S.types = replace ? r : S.types.concat(r); renderTypes(); save();
    $("fcPasteMsg").textContent = `${r.length} tipo(s) importado(s).`;
  }
  $("fcBtnImport").addEventListener("click", () => doImport(true));
  $("fcBtnAppend").addEventListener("click", () => doImport(false));
  $("fcBtnReset").addEventListener("click", () => { S = JSON.parse(JSON.stringify(DEFAULT)); fillTruck(); renderTypes(); save(); run(); });

  /* ---------- motor de arrumação (extreme points) ---------- */
  function orients(it, tip) {
    const { l, w, h } = it;
    const list = tip ? [[l, w, h], [w, l, h], [l, h, w], [h, l, w], [w, h, l], [h, w, l]] : [[l, w, h], [w, l, h]];
    const seen = new Set(), out = [];
    list.forEach(([a, b, c]) => { const k = a + "|" + b + "|" + c; if (!seen.has(k)) { seen.add(k); out.push({ l: a, w: b, h: c }); } });
    return out;
  }
  function cmp(a, b) { for (let i = 0; i < a.length; i++) { if (a[i] < b[i] - EPS) return -1; if (a[i] > b[i] + EPS) return 1; } return 0; }
  function collide(P, p, r) {
    for (let i = 0; i < P.length; i++) {
      const b = P[i];
      if (p.x < b.x + b.l - EPS && p.x + r.l > b.x + EPS && p.y < b.y + b.w - EPS && p.y + r.w > b.y + EPS && p.z < b.z + b.h - EPS && p.z + r.h > b.z + EPS) return true;
    }
    return false;
  }
  function supported(P, p, r, o) {
    if (!o.stack) return false;
    let a = 0;
    for (const b of P) {
      if (Math.abs(b.z + b.h - p.z) > EPS) continue;
      const ox = Math.min(p.x + r.l, b.x + b.l) - Math.max(p.x, b.x); if (ox <= EPS) continue;
      const oy = Math.min(p.y + r.w, b.y + b.w) - Math.max(p.y, b.y); if (oy <= EPS) continue;
      if (!b.it.st) return false;
      a += ox * oy;
    }
    return a >= o.sup / 100 * r.l * r.w - EPS;
  }
  function projZ(P, x, y, z) { let m = 0; for (const b of P) { const t = b.z + b.h; if (t <= z + EPS && t > m && b.x <= x + EPS && x < b.x + b.l - EPS && b.y <= y + EPS && y < b.y + b.w - EPS) m = t; } return m; }
  function projY(P, x, y, z) { let m = 0; for (const b of P) { const t = b.y + b.w; if (t <= y + EPS && t > m && b.x <= x + EPS && x < b.x + b.l - EPS && b.z <= z + EPS && z < b.z + b.h - EPS) m = t; } return m; }
  function projX(P, x, y, z) { let m = 0; for (const b of P) { const t = b.x + b.l; if (t <= x + EPS && t > m && b.y <= y + EPS && y < b.y + b.w - EPS && b.z <= z + EPS && z < b.z + b.h - EPS) m = t; } return m; }
  function pack(C, items, o, rule) {
    const P = [], un = []; let pts = [{ x: 0, y: 0, z: 0 }]; const seen = new Set(["0|0|0"]);
    for (const it of items) {
      const ors = orients(it, o.tip).map((d) => ({ l: d.l + o.gap, w: d.w + o.gap, h: d.h, d }));
      let best = null, bk = null;
      for (const p of pts) {
        for (const r of ors) {
          if (p.x + r.l > C.L + EPS || p.y + r.w > C.W + EPS || p.z + r.h > C.H + EPS) continue;
          const k = rule(p, r); if (bk && cmp(k, bk) >= 0) continue;
          if (collide(P, p, r)) continue;
          if (p.z > EPS && !supported(P, p, r, o)) continue;
          best = { p, r }; bk = k;
        }
      }
      if (!best) { un.push(it); continue; }
      const b = { x: best.p.x, y: best.p.y, z: best.p.z, l: best.r.l, w: best.r.w, h: best.r.h, d: best.r.d, it };
      P.push(b);
      pts = pts.filter((q) => !(q.x >= b.x - EPS && q.x < b.x + b.l - EPS && q.y >= b.y - EPS && q.y < b.y + b.w - EPS && q.z >= b.z - EPS && q.z < b.z + b.h - EPS));
      const X = b.x + b.l, Y = b.y + b.w, Z = b.z + b.h;
      const np = [
        [X, b.y, b.z], [X, projY(P, X, b.y, b.z), b.z], [X, b.y, projZ(P, X, b.y, b.z)],
        [b.x, Y, b.z], [projX(P, b.x, Y, b.z), Y, b.z], [b.x, Y, projZ(P, b.x, Y, b.z)],
        [b.x, b.y, Z], [projX(P, b.x, b.y, Z), b.y, Z], [b.x, projY(P, b.x, b.y, Z), Z],
      ];
      for (const [x, y, z] of np) {
        if (x >= C.L - EPS || y >= C.W - EPS || z >= C.H - EPS) continue;
        const key = x.toFixed(3) + "|" + y.toFixed(3) + "|" + z.toFixed(3);
        if (seen.has(key)) continue; seen.add(key);
        if (collide(P, { x, y, z }, { l: EPS * 4, w: EPS * 4, h: EPS * 4 })) continue;
        pts.push({ x, y, z });
      }
    }
    return { placed: P, un };
  }
  const vol = (i) => i.l * i.w * i.h;
  const SORTS = [
    (a, b) => vol(b) - vol(a) || a.ti - b.ti,
    (a, b) => b.l * b.w - a.l * a.w || b.h - a.h || a.ti - b.ti,
    (a, b) => b.h - a.h || vol(b) - vol(a) || a.ti - b.ti,
    (a, b) => Math.max(b.l, b.w, b.h) - Math.max(a.l, a.w, a.h) || vol(b) - vol(a) || a.ti - b.ti,
    (a, b) => (b.kg || 0) - (a.kg || 0) || vol(b) - vol(a) || a.ti - b.ti,
  ];
  const RULES = [
    (p, r) => [p.x, p.z, p.y, r.l],
    (p, r) => [p.x, p.y, p.z, r.l],
    (p, r) => [p.x + r.l, p.z, p.y],
    (p, r) => [p.x + r.l, p.y, p.z],
  ];
  function solve(C, items, o) {
    let best = null, bs = null;
    const sorts = items.some((i) => i.kg) ? SORTS : SORTS.slice(0, 4);
    for (const s of sorts) {
      const arr = items.slice().sort(s);
      for (const rule of RULES) {
        const r = pack(C, arr, o, rule);
        const used = r.placed.reduce((m, b) => Math.max(m, b.x + b.d.l), 0);
        const sc = [r.un.length, r.un.reduce((t, i) => t + vol(i), 0), used];
        if (!bs || cmp(sc, bs) < 0) { best = r; bs = sc; }
      }
    }
    return best;
  }
  /** Níveis (piso = 1) e ordem de carregamento: da cabine para as portas, e nenhuma
   * caixa antes das que a sustentam. */
  function finalize(res) {
    const P = res.placed;
    P.forEach((b) => { b.sup = []; });
    for (const b of P) {
      if (b.z <= EPS) continue;
      for (const a of P) {
        if (Math.abs(a.z + a.h - b.z) > EPS) continue;
        const ox = Math.min(a.x + a.l, b.x + b.l) - Math.max(a.x, b.x), oy = Math.min(a.y + a.w, b.y + b.w) - Math.max(a.y, b.y);
        if (ox > EPS && oy > EPS) b.sup.push(a);
      }
    }
    P.slice().sort((a, b) => a.z - b.z).forEach((b) => { b.level = b.sup.length ? 1 + Math.max(...b.sup.map((s) => s.level)) : 1; });
    const done = new Set(), order = [];
    let rest = P.slice();
    while (rest.length) {
      let pick = null;
      for (const b of rest) { if (b.sup.every((s) => done.has(s)) && (!pick || cmp([b.x, b.z, b.y], [pick.x, pick.z, pick.y]) < 0)) pick = b; }
      if (!pick) pick = rest[0];
      done.add(pick); order.push(pick); rest = rest.filter((b) => b !== pick);
    }
    order.forEach((b, i) => (b.seq = i + 1));
    // Índice da caixa dentro do próprio tipo (1ª, 2ª... do tipo F), na ordem de
    // carregamento — usado na etiqueta dos mapas (ex.: "2/3 - F" = a 2ª de 3 caixas do
    // tipo F). O "#" da tabela de sequência continua sendo a ordem geral (b.seq).
    const porTipo = {};
    order.forEach((b) => { porTipo[b.it.ti] = (porTipo[b.it.ti] || 0) + 1; b.tIdx = porTipo[b.it.ti]; });
    order.forEach((b) => { b.tTotal = porTipo[b.it.ti]; });
    res.order = order;
    return res;
  }

  /* ---------- cálculo ---------- */
  let R = null, C = null;
  function run() {
    const L = num(S.truck.L), W = num(S.truck.W), H = num(S.truck.H);
    const o = { stack: !!S.opts.stack, tip: !!S.opts.tip, sup: Math.min(100, Math.max(10, num(S.opts.sup) || 80)), gap: Math.max(0, num(S.opts.gap) || 0) };
    const bad = (m) => { setVerdict("bad", "Confira os dados", m); $("fcMetrics").innerHTML = ""; };
    if (!(L > 0 && W > 0 && H > 0)) return bad("Informe comprimento, largura e altura internos do baú em metros (ex.: 15,80).");
    C = { L: L * 100, W: W * 100, H: H * 100, cap: num(S.truck.cap) };
    const items = [];
    for (let ti = 0; ti < S.types.length; ti++) {
      const t = S.types[ti]; const q = Math.round(num(t.q)), l = num(t.l), w = num(t.w), h = num(t.h), kg = num(t.kg);
      if (!(q > 0)) continue;
      if (!(l > 0 && w > 0 && h > 0)) return bad(`O tipo ${letter(ti)} está sem medida válida. Preencha C, L e A em centímetros.`);
      if (q > 2000) return bad(`O tipo ${letter(ti)} tem ${q} volumes; o limite é 2000 por tipo.`);
      for (let k = 0; k < q; k++) items.push({ ti, l, w, h, kg: kg > 0 ? kg : 0, st: t.st !== false });
    }
    if (!items.length) return bad("Adicione pelo menos um tipo de caixa com quantidade maior que zero.");
    $("fcResults").classList.add("fc-busy");
    setVerdict("warn", "Calculando…", `Testando arranjos para ${items.length} volumes.`);
    setTimeout(() => {
      R = finalize(solve(C, items, o)); R.items = items;
      $("fcResults").classList.remove("fc-busy");
      renderAll();
    }, 30);
  }
  $("fcBtnRun").addEventListener("click", run);

  function setVerdict(kind, title, text) {
    const v = $("fcVerdict"); v.className = "fc-verdict " + kind;
    const mark = { ok: "Cabe", bad: "Não cabe", warn: "Atenção" }[kind];
    v.innerHTML = `<span class="fc-mark">${mark}</span><div><h3>${esc(title)}</h3><p>${text}</p></div>`;
  }

  function renderAll() {
    const P = R.order, un = R.un, items = R.items;
    const used = P.reduce((m, b) => Math.max(m, b.x + b.d.l), 0);
    const maxH = P.reduce((m, b) => Math.max(m, b.z + b.d.h), 0);
    const vTot = items.reduce((t, i) => t + vol(i), 0) / 1e6, vIn = P.reduce((t, b) => t + vol(b.d), 0) / 1e6, vBox = C.L * C.W * C.H / 1e6;
    const kgTot = items.reduce((t, i) => t + i.kg, 0), kgIn = P.reduce((t, b) => t + b.it.kg, 0);
    const overKg = C.cap > 0 && kgTot > C.cap;
    if (!un.length && !overKg) {
      setVerdict("ok", "Toda a carga entra no baú", `Ocupa <b>${fmt(used / 100)} m</b> dos ${fmt(C.L / 100)} m de comprimento — sobram <b>${fmt((C.L - used) / 100)} m</b> livres junto às portas. Siga a sequência abaixo: da cabine para as portas, de baixo para cima.`);
    } else if (!un.length && overKg) {
      setVerdict("warn", "Cabe no espaço, mas passa do peso", `A carga soma ${fmt0(kgTot)} kg para ${fmt0(C.cap)} kg de capacidade (${fmt0(kgTot - C.cap)} kg acima).`);
    } else {
      const byT = {}; un.forEach((i) => (byT[i.ti] = (byT[i.ti] || 0) + 1));
      const list = Object.entries(byT).map(([t, n]) => `${n} × tipo ${letter(+t)}`).join(", ");
      const why = vTot > vBox ? ` O volume da carga (${fmt(vTot)} m³) já passa o volume do baú (${fmt(vBox)} m³).` : "";
      setVerdict("bad", `${un.length} volume${un.length > 1 ? "s ficaram" : " ficou"} de fora`, `Não couberam: ${list}.${why} Tente permitir deitar caixas, reduzir o apoio mínimo ou usar um baú maior.`);
    }
    const m = [
      { v: `${fmt(used / 100)} m`, s: `comprimento usado de ${fmt(C.L / 100)} m`, p: used / C.L },
      { v: `${fmt(vIn)} m³`, s: `carga no baú · ${fmt(vIn / vBox * 100, 0)}% de ${fmt(vBox, 1)} m³`, p: vIn / vBox },
      { v: `${P.length}/${items.length}`, s: "volumes carregados", p: P.length / items.length },
      { v: `${fmt(maxH / 100)} m`, s: `altura máxima de ${fmt(C.H / 100)} m`, p: maxH / C.H },
    ];
    if (kgTot) m.push({ v: `${fmt0(kgIn)} kg`, s: C.cap > 0 ? `de ${fmt0(C.cap)} kg de capacidade` : "peso carregado", p: C.cap > 0 ? kgIn / C.cap : null });
    $("fcMetrics").innerHTML = m.map((x) => `<div class="fc-metric"><b>${x.v}</b><span>${x.s}</span>${x.p != null ? `<div class="fc-bar"><i style="width:${Math.min(100, x.p * 100).toFixed(1)}%;${x.p > 1 ? "background:#c0392b" : ""}"></i></div>` : ""}</div>`).join("");

    const porTipo = S.types.map((t, i) => ({ i, n: P.filter((b) => b.it.ti === i).length, q: items.filter((it) => it.ti === i).length })).filter((x) => x.q);
    $("fcLegend").innerHTML = porTipo.map((x) => { const t = S.types[x.i]; return `<span><span class="fc-chip" style="background:${color(x.i)}">${letter(x.i)}</span>${num(t.l)}×${num(t.w)}×${num(t.h)} · ${x.n}/${x.q}</span>`; }).join("");

    const maxL = P.reduce((mx, b) => Math.max(mx, b.level), 0);
    const tabs = [`<button type="button" class="btn-secondary" data-l="0" aria-pressed="true">Todos os níveis</button>`];
    for (let l = 1; l <= maxL; l++) tabs.push(`<button type="button" class="btn-secondary" data-l="${l}" aria-pressed="false">Nível ${l}${l === 1 ? " · piso" : ""}</button>`);
    $("fcLvlTabs").innerHTML = tabs.join("");
    curLevel = 0;
    renderSeq();
    drawPiles();
    build3D();
    setStep(P.length);
    $("fcLeftOut").innerHTML = un.length
      ? `<p class="hint" style="color:#c0392b;margin:10px 0 0"><b>Ficaram de fora:</b></p><ul class="fc-out">${Object.entries(un.reduce((a, i) => ((a[i.ti] = (a[i.ti] || 0) + 1), a), {})).map(([t, n]) => { const x = S.types[t]; return `<li>${n} × tipo ${letter(+t)} (${num(x.l)}×${num(x.w)}×${num(x.h)} cm)</li>`; }).join("")}</ul>`
      : "";
  }

  /* ---------- mapas 2D ---------- */
  let curLevel = 0, curSeq = 0;
  $("fcLvlTabs").addEventListener("click", (e) => {
    const b = e.target.closest("[data-l]"); if (!b) return;
    curLevel = +b.dataset.l;
    $("fcLvlTabs").querySelectorAll("button").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    drawTop();
  });
  function ruler(len, y0, y1) {
    let s = "";
    for (let c = 100; c < len; c += 100) s += `<line class="fc-tick" x1="${c}" y1="${y0}" x2="${c}" y2="${y1}"/>`;
    for (let c = 0; c <= len + 1; c += 100) s += `<text class="fc-rul" x="${Math.min(c, len - 12)}" y="${y1 + 22}" text-anchor="${c === 0 ? "start" : "middle"}">${c / 100}</text>`;
    return s;
  }
  function lbl(b, wd, ht, x, y) {
    const txt = `${b.tIdx}/${b.tTotal} - ${letter(b.it.ti)}`;
    const fs = Math.min(18, (wd * 1.55) / txt.length, ht * 0.4);
    return fs >= 6 ? `<text class="fc-lb" x="${x + wd / 2}" y="${y + ht / 2}" font-size="${fs.toFixed(1)}">${txt}</text>` : "";
  }
  function drawTop() {
    const P = R.order.filter((b) => !curLevel || b.level === curLevel).slice().sort((a, b) => a.z - b.z || a.seq - b.seq);
    let s = `<svg class="fc-plan" viewBox="-4 -4 ${C.L + 8} ${C.W + 36}" role="img" aria-label="Mapa de carga visto de cima"><rect class="fc-bed" x="0" y="0" width="${C.L}" height="${C.W}"/>${ruler(C.L, 0, C.W)}`;
    for (const b of P) {
      const x = b.x, y = C.W - (b.y + b.d.w);
      s += `<rect class="fc-bx${b.seq === curSeq ? " fc-hi" : ""}" x="${x}" y="${y}" width="${b.d.l}" height="${b.d.w}" fill="${color(b.it.ti)}"/>` + lbl(b, b.d.l, b.d.w, x, y);
    }
    $("fcTopSvg").innerHTML = s + "</svg>";
  }
  function drawSide() {
    const P = R.order.slice().sort((a, b) => (b.y + b.d.w) - (a.y + a.d.w) || a.seq - b.seq);
    let s = `<svg class="fc-plan" viewBox="-4 -4 ${C.L + 8} ${C.H + 36}" role="img" aria-label="Vista lateral da carga"><rect class="fc-bed" x="0" y="0" width="${C.L}" height="${C.H}"/>${ruler(C.L, 0, C.H)}`;
    for (const b of P) {
      const x = b.x, y = C.H - (b.z + b.d.h);
      s += `<rect class="fc-bx${b.seq === curSeq ? " fc-hi" : ""}" x="${x}" y="${y}" width="${b.d.l}" height="${b.d.h}" fill="${color(b.it.ti)}"/>` + lbl(b, b.d.l, b.d.h, x, y);
    }
    $("fcSideSvg").innerHTML = s + "</svg>";
  }
  /** Desenha um corte transversal do baú (largura × altura) — como se alguém entrasse no
   * baú e olhasse reto pra frente (cabine → traseira), parado num certo ponto. Mostra
   * TODA caixa que passa por ali, mesmo que ela também apareça no corte vizinho (uma caixa
   * larga que ocupa duas posições aparece inteira nos dois). Um corte novo só aparece onde
   * o conjunto de caixas visível realmente muda (início ou fim de alguma caixa) — dois
   * pontos com exatamente as mesmas caixas viram um corte só, sem repetir imagem igual.
   * Caixas mais próximas da cabine (de quem olha) são desenhadas por cima. */
  function drawPiles() {
    const wrap = $("fcPiles");
    if (!wrap) return;
    if (!R || !R.order.length) { wrap.innerHTML = ""; return; }
    const marcos = new Set([0]);
    R.order.forEach((b) => { marcos.add(b.x); marcos.add(b.x + b.l); });
    const pontos = Array.from(marcos).filter((x) => x < C.L - EPS).sort((a, b) => a - b);
    let assinaturaAnterior = null;
    const posicoes = [];
    pontos.forEach((x0, i) => {
      const x1 = i + 1 < pontos.length ? pontos[i + 1] : C.L;
      const xc = (x0 + x1) / 2;
      const boxes = R.order.filter((b) => b.x <= xc + EPS && b.x + b.l >= xc - EPS).sort((a, b) => a.seq - b.seq);
      if (!boxes.length) return; // espaço vazio sobrando (depois da última caixa) — não mostra
      const assinatura = boxes.map((b) => b.seq).join(",");
      if (assinatura === assinaturaAnterior) return; // igual ao corte anterior, não repete
      assinaturaAnterior = assinatura;
      posicoes.push({ xc, boxes });
    });
    wrap.innerHTML = posicoes.map(({ xc, boxes: lista }, idx) => {
      const boxes = lista.slice().sort((a, b) => (b.x + b.d.l) - (a.x + a.d.l));
      let s = `<svg class="fc-plan fc-pile-svg" viewBox="-2 -2 ${C.W + 4} ${C.H + 4}" role="img" aria-label="Posição ${idx + 1}, vista de frente"><rect class="fc-bed" x="0" y="0" width="${C.W}" height="${C.H}"/>`;
      for (const b of boxes) {
        const x = C.W - (b.y + b.d.w), y = C.H - (b.z + b.d.h);
        s += `<rect class="fc-bx" x="${x}" y="${y}" width="${b.d.w}" height="${b.d.h}" fill="${color(b.it.ti)}"/>` + lbl(b, b.d.w, b.d.h, x, y);
      }
      s += "</svg>";
      return `<div class="fc-pile-item"><h4>Posição ${idx + 1} <span class="hint">(${fmt(xc / 100)} m da cabine)</span></h4>${s}</div>`;
    }).join("");
  }

  function renderSeq() {
    $("fcSeqBody").innerHTML = R.order.map((b) => {
      const it = b.it, d = b.d; const obs = [];
      if (d.h !== it.h) obs.push("deitada"); else if (d.l !== it.l) obs.push("girada 90°");
      if (b.sup.length) obs.push("sobre #" + b.sup.map((s) => s.seq).join(", #"));
      return `<tr data-s="${b.seq}"><td>${b.seq}</td><td class="fc-etiqueta"><span class="fc-chip" style="background:${color(it.ti)};width:20px;height:20px;font-size:10.5px">${letter(it.ti)}</span><span>${b.tIdx}/${b.tTotal} - ${letter(it.ti)}</span></td>
        <td>${d.l}×${d.w}×${d.h}</td><td>${fmt(b.x / 100)} m</td><td>${fmt(b.y / 100)} m</td><td>${fmt(b.z / 100)} m</td>
        <td><span class="fc-pill">${b.level === 1 ? "piso" : b.level + "º"}</span></td><td>${obs.join(" · ")}</td></tr>`;
    }).join("");
  }
  $("fcSeqBody").addEventListener("click", (e) => {
    const tr = e.target.closest("tr[data-s]");
    if (tr) { stopPlay(); setStep(+tr.dataset.s); $("fcStage").scrollIntoView({ behavior: "smooth", block: "center" }); }
  });

  /* ---------- 3D ---------- */
  let T = null;
  function init3D() {
    const el = $("fcStage");
    if (!window.THREE || !THREE.OrbitControls) {
      el.insertAdjacentHTML("afterbegin", '<p class="hint" style="padding:16px">A visualização 3D não carregou neste navegador. Os mapas 2D abaixo continuam válidos.</p>');
      return;
    }
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    el.prepend(renderer.domElement);
    const scene = new THREE.Scene(), camera = new THREE.PerspectiveCamera(38, 1, 0.05, 300);
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; controls.maxPolarAngle = Math.PI * 0.495;
    scene.add(new THREE.HemisphereLight(0xffffff, 0x5a6a72, 0.85));
    const dl = new THREE.DirectionalLight(0xffffff, 0.55); dl.position.set(-6, 12, 8); scene.add(dl);
    const group = new THREE.Group(); scene.add(group);
    T = { renderer, scene, camera, controls, group, meshes: [] };
    const resize = () => {
      const w = el.clientWidth, h = el.clientHeight; if (!w || !h) return;
      renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix();
    };
    new ResizeObserver(resize).observe(el); resize();
    (function loop() {
      requestAnimationFrame(loop);
      if (!el.offsetParent) return; // aba escondida: não renderiza
      controls.update(); renderer.render(scene, camera);
    })();
  }
  function build3D() {
    if (!T) return;
    const g = T.group;
    while (g.children.length) { const c = g.children.pop(); c.traverse((o) => { o.geometry && o.geometry.dispose(); o.material && o.material.dispose && o.material.dispose(); }); }
    T.meshes = [];
    const L = C.L / 100, W = C.W / 100, H = C.H / 100, ox = -L / 2, oz = -W / 2;
    const shell = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(L, H, W)), new THREE.LineBasicMaterial({ color: 0x0b2545 }));
    shell.position.set(0, H / 2, 0); g.add(shell);
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(L, W), new THREE.MeshLambertMaterial({ color: 0xf7f9fb, side: THREE.DoubleSide }));
    floor.rotation.x = -Math.PI / 2; floor.position.y = -0.002; g.add(floor);
    const cabH = Math.min(H, 2.6) * 0.9;
    const cab = new THREE.Mesh(new THREE.BoxGeometry(1.9, cabH, W), new THREE.MeshLambertMaterial({ color: 0x8a969c, transparent: true, opacity: 0.55 }));
    cab.position.set(ox - 1.9 / 2 - 0.25, cabH / 2, 0); g.add(cab);
    const edgeM = new THREE.LineBasicMaterial({ color: 0x0e1518, transparent: true, opacity: 0.5 });
    for (const b of R.order) {
      const d = b.d, s = 0.996;
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(d.l / 100 * s, d.h / 100 * s, d.w / 100 * s), new THREE.MeshLambertMaterial({ color: new THREE.Color(color(b.it.ti)) }));
      mesh.position.set(ox + (b.x + d.l / 2) / 100, (b.z + d.h / 2) / 100, -(oz + (b.y + d.w / 2) / 100));
      mesh.add(new THREE.LineSegments(new THREE.EdgesGeometry(mesh.geometry), edgeM));
      g.add(mesh); T.meshes.push(mesh);
    }
    const dist = Math.max(L, W * 3) * 1.05;
    T.camera.position.set(-L * 0.28, dist * 0.55, dist * 0.95);
    T.controls.target.set(0, H * 0.3, 0); T.controls.update();
  }

  /* ---------- passo a passo ---------- */
  const stepEl = $("fcStep"); let playT = null;
  function setStep(n) {
    if (!R) return;
    const N = R.order.length; n = Math.max(0, Math.min(N, n));
    stepEl.max = N; stepEl.value = n; curSeq = n > 0 && n < N ? n : 0;
    if (T) T.meshes.forEach((m, i) => { m.visible = i < n; m.material.emissive && m.material.emissive.setHex(i === n - 1 && n < N ? 0x333333 : 0x000000); });
    const b = R.order[n - 1];
    $("fcStepInfo").innerHTML = n === 0 ? "Baú vazio. Avance para ver cada caixa entrando."
      : n === N ? `Carga completa: <b>${N}</b> volumes.`
      : `Passo <b>${n}</b> de ${N}: tipo <b>${letter(b.it.ti)}</b> (${b.d.l}×${b.d.w}×${b.d.h} cm) a <b>${fmt(b.x / 100)} m</b> da cabine, <b>${fmt(b.y / 100)} m</b> do lado esquerdo, ${b.z > 0 ? `em cima (base a ${fmt(b.z / 100)} m)` : "no piso"}.`;
    document.querySelectorAll("#fcSeqBody tr").forEach((tr) => tr.classList.toggle("fc-cur", +tr.dataset.s === curSeq));
    drawTop(); drawSide();
  }
  function stopPlay() { if (playT) { clearInterval(playT); playT = null; $("fcSPlay").textContent = "Reproduzir"; } }
  stepEl.addEventListener("input", () => { stopPlay(); setStep(+stepEl.value); });
  $("fcSFirst").addEventListener("click", () => { stopPlay(); setStep(0); });
  $("fcSPrev").addEventListener("click", () => { stopPlay(); setStep(+stepEl.value - 1); });
  $("fcSNext").addEventListener("click", () => { stopPlay(); setStep(+stepEl.value + 1); });
  $("fcSAll").addEventListener("click", () => { stopPlay(); setStep(R ? R.order.length : 0); });
  $("fcSPlay").addEventListener("click", () => {
    if (!R) return;
    if (playT) { stopPlay(); return; }
    if (+stepEl.value >= R.order.length) setStep(0);
    $("fcSPlay").textContent = "Pausar";
    playT = setInterval(() => { const n = +stepEl.value + 1; setStep(n); if (n >= R.order.length) stopPlay(); }, 320);
  });

  /* ---------- planos salvos (compartilhado via Supabase, igual ao resto do app) ---------- */
  const CARGAS_KEY = "cargas";
  let cargasSalvas = [];
  const normCotacao = (v) => String(v ?? "").trim();

  function renderListaSalvos(filtro) {
    const ul = $("fcListaSalvos");
    const f = normCotacao(filtro).toLowerCase();
    const itens = f ? cargasSalvas.filter((c) => normCotacao(c.cotacao).toLowerCase().includes(f)) : cargasSalvas;
    if (!itens.length) {
      ul.innerHTML = `<li class="fc-saved-vazio">${cargasSalvas.length ? "Nenhum plano encontrado." : "Nenhum plano salvo ainda."}</li>`;
      return;
    }
    const ordenados = itens.slice().sort((a, b) => (b.atualizadoEm || "").localeCompare(a.atualizadoEm || ""));
    ul.innerHTML = ordenados.map((c) => {
      const dt = c.atualizadoEm ? new Date(c.atualizadoEm) : null;
      const dtTxt = dt ? dt.toLocaleDateString("pt-BR") + " " + dt.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }) : "";
      return `<li data-id="${esc(c.id)}"><b>Cotação Nº ${esc(c.cotacao)}</b><span>${dtTxt}</span></li>`;
    }).join("");
  }
  async function carregarListaSalvos() {
    cargasSalvas = await carregarConfig(CARGAS_KEY, []);
    renderListaSalvos($("fcBusca").value);
  }
  $("fcBusca").addEventListener("input", (e) => renderListaSalvos(e.target.value));
  $("fcListaSalvos").addEventListener("click", (e) => {
    const li = e.target.closest("li[data-id]");
    if (!li) return;
    const registro = cargasSalvas.find((c) => c.id === li.dataset.id);
    if (!registro) return;
    S = { cotacao: registro.cotacao, truck: registro.truck, opts: registro.opts, types: JSON.parse(JSON.stringify(registro.types)) };
    save();
    fillTruck(); renderTypes(); run();
    $("fcMsgSalvar").textContent = `Plano da cotação ${registro.cotacao} carregado.`;
    setTimeout(() => ($("fcMsgSalvar").textContent = ""), 3000);
  });
  $("fcBtnSalvar").addEventListener("click", async () => {
    const cot = normCotacao(S.cotacao);
    if (!cot) { $("fcMsgSalvar").textContent = "Preencha o Nº Cotação antes de salvar."; return; }
    $("fcMsgSalvar").textContent = "Salvando...";
    const lista = await carregarConfig(CARGAS_KEY, []);
    const agora = new Date().toISOString();
    const existente = lista.find((c) => normCotacao(c.cotacao) === cot);
    const registro = {
      id: existente ? existente.id : Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
      cotacao: cot,
      criadoEm: existente ? existente.criadoEm : agora,
      atualizadoEm: agora,
      truck: S.truck, opts: S.opts, types: S.types,
    };
    if (existente) Object.assign(existente, registro); else lista.push(registro);
    await salvarConfig(CARGAS_KEY, lista);
    cargasSalvas = lista;
    renderListaSalvos($("fcBusca").value);
    $("fcMsgSalvar").textContent = existente ? "Plano atualizado." : "Plano salvo.";
    setTimeout(() => ($("fcMsgSalvar").textContent = ""), 3000);
  });

  fillTruck(); renderTypes(); init3D(); carregarListaSalvos();

  // Só calcula na primeira vez que a aba for aberta (não pesa no carregamento do app).
  let calculado = false;
  document.querySelectorAll('.tab-btn[data-tab="carga"]').forEach((btn) =>
    btn.addEventListener("click", () => { if (!calculado) { calculado = true; run(); } }));
})();
