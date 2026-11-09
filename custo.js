"use strict";
/* Custo do Veículo (cadastro) + Custo Operacional (cálculo dos Custos Diretos)
   Baseado na "Planilha Custo Detalhado Veículo": cada veículo é uma coluna; os custos por km
   (combustível, manutenção, depreciação) × distância, mais a mão de obra (custo/hora × horas),
   despesas e pedágio, formam os Custos Diretos. Módulo independente: guarda tudo na chave
   "custoVeiculos" de app_config e só usa $, fmtBRL, fmtNum, carregarConfig e salvarConfig do app.js. */
(function () {
  const KEY = "custoVeiculos";
  const veic = (nome, consumo, mecanica, autonomia, lic, seguro, oleo, autOleo, pneusQtd, pneusValor, rastreador) => ({
    nome, combustivel: "Diesel", custoLitro: 6.25, consumo, mecanica, autonomia, licenciamento: lic, seguro,
    trocaOleo: oleo, autonomiaOleo: autOleo, pneusQtd, pneusValor, rastreador, depreciacaoKm: 0,
    salarioMotorista: 4000, horasMotorista: 158.4, salarioAjudante: 0, horasAjudante: 158.4,
  });
  const PADRAO = {
    params: { fgts: 8, rescisao: 5 },
    veiculos: [
      veic("QIG6150 BOXER 9 CBM 1800 Kg", 12, 15000, 70000, 5000, 8500, 1500, 20000, 4, 1000, 380),
      veic("MLU0908 TOCO 32 CBM 5 TONS", 4, 44000, 60000, 2500, 20000, 1500, 25000, 6, 1200, 380),
      veic("QIY4838 TOCO 8 TONS", 4.5, 65000, 65000, 2500, 26000, 2000, 25000, 6, 2500, 380),
      veic("OKG5879 TRUCK 80 CBM 12 TONS", 4, 70000, 60000, 2500, 30000, 2000, 25000, 10, 2500, 380),
      veic("FVE9D27 3/4 30 CBM 1,5 TONS", 6.5, 60000, 50000, 2000, 8500, 1500, 20000, 4, 1300, 401.5),
    ],
  };
  let M = structuredClone(PADRAO);

  const num = (v) => { const n = parseFloat(v); return isFinite(n) ? n : 0; };
  const div = (a, b) => (b > 0 ? a / b : 0);
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const brl4 = (v) => `R$ ${fmtNum(v, 4)}`;

  /* ---------- contas (iguais às da planilha) ---------- */
  function encargos(p) {
    const fgts = num(p.fgts) / 100;
    return { fgts, ferias: (4 / 3) * (1 + fgts) / 12, decimo: (1 + fgts) / 12, rescisao: num(p.rescisao) / 100 };
  }
  /** Custo/hora = salário com encargos (FGTS + férias + 13º + provisão de rescisões) ÷ horas trabalhadas no mês. */
  function custoHora(salario, horas, p) {
    const e = encargos(p);
    return div(num(salario) * (1 + e.fgts + e.ferias + e.decimo + e.rescisao), num(horas));
  }
  /** Custos por km rodado de um veículo. A "autonomia" da mecânica é também o km rodado ao ano. */
  function custoKm(v) {
    const kmAno = num(v.autonomia);
    return {
      combustivel: div(num(v.custoLitro), num(v.consumo)),
      mecanica: div(num(v.mecanica), kmAno),
      licenciamento: div(num(v.licenciamento), kmAno),
      seguro: div(num(v.seguro), kmAno),
      oleo: div(num(v.trocaOleo), num(v.autonomiaOleo)),
      pneus: div(num(v.pneusQtd) * num(v.pneusValor), kmAno),
      rastreador: div(num(v.rastreador) * 12, kmAno),
      depreciacao: num(v.depreciacaoKm),
    };
  }
  function calcularCustosDiretos(v, p, dist, hMot, hAju, desp, ped) {
    const k = custoKm(v);
    const manutencao = {
      mecanica: dist * k.mecanica, licenciamento: dist * k.licenciamento, seguro: dist * k.seguro,
      oleo: dist * k.oleo, pneus: dist * k.pneus, rastreador: dist * k.rastreador,
    };
    const manutTotal = Object.values(manutencao).reduce((a, b) => a + b, 0);
    const r = {
      combustivel: dist * k.combustivel, manutencao, manutTotal, depreciacao: dist * k.depreciacao,
      motorista: hMot * custoHora(v.salarioMotorista, v.horasMotorista, p), ajudante: hAju * custoHora(v.salarioAjudante, v.horasAjudante, p),
      despesas: desp, pedagio: ped,
    };
    r.total = r.combustivel + r.manutTotal + r.depreciacao + r.motorista + r.ajudante + r.despesas + r.pedagio;
    r.porKm = div(r.total, dist);
    return r;
  }

  /* ---------- cadastro (grade: linhas = itens, colunas = veículos) ---------- */
  const pct = (x) => `${fmtNum(x * 100, 2)}%`;
  /** Bloco de mão de obra igual ao da planilha: Salário, FGTS, Férias, 13º, Provisão de Rescisões,
   *  Horas trabalhadas ao mês e Custo/hora. Os percentuais ficam ao lado do rótulo (editáveis no
   *  bloco do motorista; o ajudante usa os mesmos). */
  function maoDeObra(titulo, sal, hor, id, editavel) {
    const campoPct = (nome, chave) => editavel
      ? `${nome} <input type="number" step="any" min="0" class="cv-pct" data-p="${chave}" value="${esc(M.params[chave])}"> %`
      : `${nome} <b data-pct="${chave === "fgts" ? "fgts" : "rescisao"}">${pct(encargos(M.params)[chave === "fgts" ? "fgts" : "rescisao"])}</b>`;
    const e = () => encargos(M.params);
    return { t: titulo, linhas: [
      { l: "Salário (R$ / mês)", k: sal },
      { lh: () => campoPct("FGTS", "fgts"), c: `fgts${id}`, f: (v) => fmtBRL(num(v[sal]) * e().fgts) },
      { lh: () => `Férias <b data-pct="ferias">${pct(e().ferias)}</b>`, c: `fer${id}`, f: (v) => fmtBRL(num(v[sal]) * e().ferias) },
      { lh: () => `13º Salário <b data-pct="decimo">${pct(e().decimo)}</b>`, c: `dec${id}`, f: (v) => fmtBRL(num(v[sal]) * e().decimo) },
      { lh: () => campoPct("Provisão Rescisões", "rescisao"), c: `res${id}`, f: (v) => fmtBRL(num(v[sal]) * e().rescisao) },
      { l: "Horas Trabalhadas ao mês", k: hor },
      { l: "Custo/hora de trabalho", c: `hora${id}`, f: (v) => fmtBRL(custoHora(v[sal], v[hor], M.params)) },
    ] };
  }
  const SECOES = [
    { t: "01. Combustível", linhas: [
      { l: "Tipo de combustível", k: "combustivel", texto: true },
      { l: "Custo / Litro (R$)", k: "custoLitro" },
      { l: "Consumo (km / litro)", k: "consumo" },
      { l: "Custo / km rodado", c: "kmComb", f: (v) => brl4(custoKm(v).combustivel) },
    ] },
    { t: "02. Manutenção do veículo", linhas: [
      { l: "a. Mecânica (R$)", k: "mecanica" },
      { l: "Autonomia (km) — também é o km rodado ao ano", k: "autonomia" },
      { l: "Custo / km rodado", c: "kmMec", f: (v) => brl4(custoKm(v).mecanica) },
      { l: "b. Licenciamento (R$ / ano)", k: "licenciamento" },
      { l: "Custo / km rodado", c: "kmLic", f: (v) => brl4(custoKm(v).licenciamento) },
      { l: "c. Seguro do veículo (R$ / ano)", k: "seguro" },
      { l: "Custo / km rodado", c: "kmSeg", f: (v) => brl4(custoKm(v).seguro) },
      { l: "d. Troca de óleo & filtros (R$)", k: "trocaOleo" },
      { l: "Autonomia da troca (km)", k: "autonomiaOleo" },
      { l: "Custo / km rodado", c: "kmOleo", f: (v) => brl4(custoKm(v).oleo) },
      { l: "e. Pneus — quantidade", k: "pneusQtd" },
      { l: "Pneus — valor por pneu (R$)", k: "pneusValor" },
      { l: "Custo / km rodado", c: "kmPneus", f: (v) => brl4(custoKm(v).pneus) },
      { l: "f. Rastreador / monitoramento (R$ / mês)", k: "rastreador" },
      { l: "Custo / km rodado", c: "kmRast", f: (v) => brl4(custoKm(v).rastreador) },
    ] },
    { t: "03. Depreciação", linhas: [
      { l: "Depreciação (R$ / km rodado)", k: "depreciacaoKm" },
    ] },
    maoDeObra("04. Mão de Obra — Motorista", "salarioMotorista", "horasMotorista", "M", true),
    maoDeObra("05. Mão de Obra — Ajudante", "salarioAjudante", "horasAjudante", "A", false),
  ];

  function renderGrade() {
    const cab = M.veiculos.map((v, i) =>
      `<th><input type="text" class="cv-nome" data-vi="${i}" data-k="nome" value="${esc(v.nome)}" title="Placa / descrição do veículo"><button type="button" class="btn-remove" data-rem="${i}" title="Remover veículo">&times;</button></th>`).join("");
    let corpo = "";
    SECOES.forEach((s) => {
      corpo += `<tr class="cv-secao"><td colspan="${M.veiculos.length + 1}">${s.t}</td></tr>`;
      s.linhas.forEach((r) => {
        const cels = M.veiculos.map((v, i) => r.c
          ? `<td class="cv-calc" data-c="${r.c}" data-vi="${i}">—</td>`
          : `<td><input type="${r.texto ? "text" : "number"}" ${r.texto ? "" : 'step="any" min="0"'} data-vi="${i}" data-k="${r.k}" value="${esc(v[r.k])}"></td>`).join("");
        corpo += `<tr class="${r.c ? "cv-linha-calc" : ""}"><td class="cv-rotulo">${r.lh ? r.lh() : r.l}</td>${cels}</tr>`;
      });
    });
    $("cvGrade").innerHTML = `<thead><tr><th class="cv-rotulo">Veículo</th>${cab}</tr></thead><tbody>${corpo}</tbody>`;
    atualizarCalculos();
  }
  function atualizarCalculos() {
    const porId = {};
    SECOES.forEach((s) => s.linhas.forEach((r) => { if (r.c) porId[r.c] = r.f; }));
    document.querySelectorAll("#cvGrade td[data-c]").forEach((td) => {
      td.textContent = porId[td.dataset.c](M.veiculos[+td.dataset.vi]);
    });
    const e = encargos(M.params);
    document.querySelectorAll("#cvGrade b[data-pct]").forEach((b) => { b.textContent = pct(e[b.dataset.pct === "decimo" ? "decimo" : b.dataset.pct]); });
  }

  $("cvGrade").addEventListener("input", (e) => {
    const el = e.target;
    if (el.dataset.p) {
      M.params[el.dataset.p] = num(el.value);
      atualizarCalculos(); recalcular();
      return;
    }
    if (el.dataset.k === undefined) return;
    const v = M.veiculos[+el.dataset.vi];
    v[el.dataset.k] = el.type === "number" ? num(el.value) : el.value;
    atualizarCalculos();
    recalcular();
  });
  $("cvGrade").addEventListener("click", (e) => {
    const b = e.target.closest("[data-rem]"); if (!b) return;
    if (M.veiculos.length <= 1) return;
    M.veiculos.splice(+b.dataset.rem, 1);
    renderGrade(); preencherSelectVeiculo();
  });
  $("cvBtnAdd").addEventListener("click", () => {
    const base = structuredClone(M.veiculos[M.veiculos.length - 1] || PADRAO.veiculos[0]);
    base.nome = "Novo veículo";
    M.veiculos.push(base);
    renderGrade(); preencherSelectVeiculo();
  });
  $("cvBtnSalvar").addEventListener("click", async () => {
    $("cvMsg").textContent = "Salvando...";
    await salvarConfig(KEY, M);
    $("cvMsg").textContent = "Cadastro salvo.";
    setTimeout(() => ($("cvMsg").textContent = ""), 2500);
    preencherSelectVeiculo();
  });

  /* ---------- cálculo e comparação (linhas 66 a 79 da planilha) ---------- */
  // Cada coluna é um cenário: um veículo + a distância/tempo/despesas/pedágio dele + quantos
  // veículos. Serve para comparar, por exemplo, 2 vans x 1 três-quartos para a mesma carga.
  const novoCenario = (vi, base = {}) => ({ vi, dist: base.dist ?? 0, hMot: base.hMot ?? 0, hAju: base.hAju ?? 0, desp: base.desp ?? 0, ped: base.ped ?? 0, qtd: base.qtd ?? 1 });
  let CEN = [novoCenario(0)];
  const LINHAS = [
    ["Custos Diretos (por veículo)", (r) => r.total, "cvc-total"],
    ["01. Combustível", (r) => r.combustivel],
    ["02. Manutenção de Veículo", (r) => r.manutTotal],
    ["a. Mecânica", (r) => r.manutencao.mecanica, "dre-subitem"],
    ["b. Licenciamento", (r) => r.manutencao.licenciamento, "dre-subitem"],
    ["c. Seguro", (r) => r.manutencao.seguro, "dre-subitem"],
    ["d. Troca de Óleo & Filtros", (r) => r.manutencao.oleo, "dre-subitem"],
    ["e. Pneus", (r) => r.manutencao.pneus, "dre-subitem"],
    ["f. Rastreador/Monitoramento", (r) => r.manutencao.rastreador, "dre-subitem"],
    ["03. Depreciação", (r) => r.depreciacao],
    ["04. Mão de Obra - Motorista", (r) => r.motorista],
    ["05. Mão de Obra - Ajudante", (r) => r.ajudante],
    ["06. Despesas (diária/alimentação)", (r) => r.despesas],
    ["07. Pedágio", (r) => r.pedagio],
  ];

  function preencherSelectVeiculo() {
    CEN.forEach((c) => { if (c.vi >= M.veiculos.length) c.vi = 0; });
    renderComparacao();
  }
  function renderComparacao() {
    const opcoes = (sel) => M.veiculos.map((v, i) => `<option value="${i}" ${i === sel ? "selected" : ""}>${esc(v.nome)}</option>`).join("");
    const campo = (c, i, k, rot, step = "any") => `<label>${rot}<input type="number" min="0" step="${step}" data-ci="${i}" data-k="${k}" value="${esc(c[k])}"></label>`;
    const cab = CEN.map((c, i) => `<th class="cvc-col">
        <div class="cvc-topo"><b>Veículo ${i + 1}</b>${CEN.length > 1 ? `<button type="button" class="btn-remove" data-crem="${i}" title="Remover da comparação">&times;</button>` : ""}</div>
        <select data-ci="${i}" data-k="vi">${opcoes(c.vi)}</select>
        ${campo(c, i, "dist", "Distância a percorrer (km)")}
        ${campo(c, i, "hMot", "Tempo motorista (horas)")}
        ${campo(c, i, "hAju", "Tempo ajudante (horas)")}
        ${campo(c, i, "desp", "Despesas diária/alimentação (R$)", "0.01")}
        ${campo(c, i, "ped", "Pedágio (R$)", "0.01")}
        ${campo(c, i, "qtd", "Quantidade de veículos", "1")}
        <button type="button" class="btn-secondary cvc-mes" data-cmes="${i}" title="Km/ano ÷ 12 e 220 h, como na planilha">Usar referência da planilha</button>
      </th>`).join("");
    const linhas = LINHAS.map(([rot, , cls], li) => `<tr class="${cls || ""}"><td class="cvc-rot">${rot}</td>${CEN.map((c, i) => `<td class="cvc-val" data-li="${li}" data-ci="${i}">—</td>`).join("")}</tr>`).join("");
    const extra = ["porkm", "carga", "dif"].map((id, n) => {
      const rot = ["Custo direto por km", "Custo total da carga (× quantidade)", "Diferença para o menor"][n];
      return `<tr class="${n === 1 ? "cvc-total cvc-carga" : ""}"><td class="cvc-rot">${rot}</td>${CEN.map((c, i) => `<td class="cvc-val" data-x="${id}" data-ci="${i}">—</td>`).join("")}</tr>`;
    }).join("");
    $("cvcGrade").innerHTML = `<thead><tr><th class="cvc-rot">Comparação de veículos</th>${cab}</tr></thead><tbody>${linhas}${extra}</tbody>`;
    atualizarComparacao();
  }
  function atualizarComparacao() {
    const res = CEN.map((c) => {
      const v = M.veiculos[c.vi];
      return v ? calcularCustosDiretos(v, M.params, num(c.dist), num(c.hMot), num(c.hAju), num(c.desp), num(c.ped)) : null;
    });
    const carga = CEN.map((c, i) => (res[i] ? res[i].total * Math.max(1, num(c.qtd)) : 0));
    document.querySelectorAll("#cvcGrade td[data-li]").forEach((td) => {
      const r = res[+td.dataset.ci];
      td.textContent = r ? fmtBRL(LINHAS[+td.dataset.li][1](r)) : "—";
    });
    const validos = carga.filter((x) => x > 0);
    const menor = validos.length ? Math.min(...validos) : 0;
    const comparar = validos.length > 1;
    document.querySelectorAll("#cvcGrade td[data-x]").forEach((td) => {
      const i = +td.dataset.ci, r = res[i], c = CEN[i];
      td.classList.remove("cvc-melhor");
      if (!r) { td.textContent = "—"; return; }
      if (td.dataset.x === "porkm") td.textContent = num(c.dist) > 0 ? `${fmtBRL(r.porKm)} / km` : "—";
      else if (td.dataset.x === "carga") {
        td.textContent = carga[i] > 0 ? fmtBRL(carga[i]) + (comparar && carga[i] === menor ? "  ✔ menor custo" : "") : "—";
        if (comparar && carga[i] === menor) td.classList.add("cvc-melhor");
      } else if (td.dataset.x === "dif") {
        td.textContent = !comparar || !(carga[i] > 0) ? "—" : carga[i] === menor ? "—" : `+ ${fmtBRL(carga[i] - menor)} (+${fmtNum(((carga[i] - menor) / menor) * 100, 1)}%)`;
      }
    });
  }
  const recalcular = atualizarComparacao;

  const aoMudarCenario = (e) => {
    const el = e.target; if (el.dataset.ci === undefined) return;
    CEN[+el.dataset.ci][el.dataset.k] = el.tagName === "SELECT" ? +el.value : num(el.value);
    atualizarComparacao();
  };
  $("cvcGrade").addEventListener("input", aoMudarCenario);
  $("cvcGrade").addEventListener("change", aoMudarCenario);
  $("cvcGrade").addEventListener("click", (e) => {
    const rem = e.target.closest("[data-crem]");
    if (rem) { CEN.splice(+rem.dataset.crem, 1); renderComparacao(); return; }
    const mes = e.target.closest("[data-cmes]");
    if (mes) {
      const c = CEN[+mes.dataset.cmes], v = M.veiculos[c.vi];
      if (v) { c.dist = +(num(v.autonomia) / 12).toFixed(4); c.hMot = 220; renderComparacao(); }
    }
  });
  $("cvcBtnAdd").addEventListener("click", () => {
    const ult = CEN[CEN.length - 1];
    CEN.push(novoCenario((ult.vi + 1) % M.veiculos.length, ult));
    renderComparacao();
  });

  /* ---------- início ---------- */
  renderGrade();
  preencherSelectVeiculo();
  carregarConfig(KEY, PADRAO).then((salvo) => {
    if (salvo && Array.isArray(salvo.veiculos) && salvo.veiculos.length) {
      const horasAntigas = num((salvo.params || {}).horasMes) || 158.4; // cadastro salvo antes das horas por veículo
      M = { params: { ...PADRAO.params, ...(salvo.params || {}) }, veiculos: salvo.veiculos };
      M.veiculos.forEach((v) => {
        if (v.horasMotorista === undefined) v.horasMotorista = horasAntigas;
        if (v.horasAjudante === undefined) v.horasAjudante = horasAntigas;
      });
      renderGrade(); preencherSelectVeiculo();
    }
  });
})();
