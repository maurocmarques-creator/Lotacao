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
    salarioMotorista: 4000, salarioAjudante: 0,
  });
  const PADRAO = {
    params: { fgts: 8, rescisao: 5, horasMes: 158.4 },
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
  function custoHora(salario, p) {
    const e = encargos(p);
    return div(num(salario) * (1 + e.fgts + e.ferias + e.decimo + e.rescisao), num(p.horasMes));
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
      motorista: hMot * custoHora(v.salarioMotorista, p), ajudante: hAju * custoHora(v.salarioAjudante, p),
      despesas: desp, pedagio: ped,
    };
    r.total = r.combustivel + r.manutTotal + r.depreciacao + r.motorista + r.ajudante + r.despesas + r.pedagio;
    r.porKm = div(r.total, dist);
    return r;
  }

  /* ---------- cadastro (grade: linhas = itens, colunas = veículos) ---------- */
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
    { t: "04. Mão de obra — Motorista", linhas: [
      { l: "Salário (R$ / mês)", k: "salarioMotorista" },
      { l: "Custo / hora de trabalho (com encargos)", c: "horaMot", f: (v) => fmtBRL(custoHora(v.salarioMotorista, M.params)) },
    ] },
    { t: "05. Mão de obra — Ajudante", linhas: [
      { l: "Salário (R$ / mês)", k: "salarioAjudante" },
      { l: "Custo / hora de trabalho (com encargos)", c: "horaAju", f: (v) => fmtBRL(custoHora(v.salarioAjudante, M.params)) },
    ] },
  ];

  function renderParametros() {
    const e = encargos(M.params);
    $("cvParams").innerHTML = `
      <label>FGTS (%)<input type="number" step="any" min="0" data-p="fgts" value="${esc(M.params.fgts)}"></label>
      <label>Provisão de rescisões (%)<input type="number" step="any" min="0" data-p="rescisao" value="${esc(M.params.rescisao)}"></label>
      <label>Horas trabalhadas ao mês<input type="number" step="any" min="0" data-p="horasMes" value="${esc(M.params.horasMes)}"></label>
      <small class="hint" id="cvEncargosInfo"></small>`;
    atualizarInfoEncargos(e);
  }
  function atualizarInfoEncargos(e = encargos(M.params)) {
    const el = $("cvEncargosInfo");
    if (el) el.textContent = `Férias = 4/3 × (1 + FGTS) ÷ 12 = ${fmtNum(e.ferias * 100, 2)}% · 13º = (1 + FGTS) ÷ 12 = ${fmtNum(e.decimo * 100, 2)}% · horas/mês da planilha: 220 × 90% × 80% = 158,4.`;
  }

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
        corpo += `<tr class="${r.c ? "cv-linha-calc" : ""}"><td class="cv-rotulo">${r.l}</td>${cels}</tr>`;
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
  }

  $("cvGrade").addEventListener("input", (e) => {
    const el = e.target; if (el.dataset.k === undefined) return;
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
  $("cvParams").addEventListener("input", (e) => {
    const k = e.target.dataset.p; if (!k) return;
    M.params[k] = num(e.target.value);
    atualizarInfoEncargos(); atualizarCalculos(); recalcular();
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

  /* ---------- cálculo (linhas 66 a 79 da planilha) ---------- */
  function preencherSelectVeiculo() {
    const sel = $("cvcVeiculo"), atual = sel.value;
    sel.innerHTML = M.veiculos.map((v, i) => `<option value="${i}">${esc(v.nome)}</option>`).join("");
    if (atual !== "" && +atual < M.veiculos.length) sel.value = atual;
    recalcular();
  }
  function recalcular() {
    const v = M.veiculos[+$("cvcVeiculo").value];
    if (!v) { $("cvcTabela").innerHTML = ""; return; }
    const dist = num($("cvcDist").value);
    const r = calcularCustosDiretos(v, M.params, dist, num($("cvcHMot").value), num($("cvcHAju").value), num($("cvcDesp").value), num($("cvcPed").value));
    const li = (rot, val, cls) => `<tr class="${cls || ""}"><td>${rot}</td><td>${fmtBRL(val)}</td></tr>`;
    $("cvcTabela").innerHTML = [
      li("Custos Diretos", r.total, "total"),
      li("01. Combustível", r.combustivel),
      li("02. Manutenção de Veículo", r.manutTotal),
      li("a. Mecânica", r.manutencao.mecanica, "dre-subitem"),
      li("b. Licenciamento", r.manutencao.licenciamento, "dre-subitem"),
      li("c. Seguro", r.manutencao.seguro, "dre-subitem"),
      li("d. Troca de Óleo & Filtros", r.manutencao.oleo, "dre-subitem"),
      li("e. Pneus", r.manutencao.pneus, "dre-subitem"),
      li("f. Rastreador/Monitoramento", r.manutencao.rastreador, "dre-subitem"),
      li("03. Depreciação", r.depreciacao),
      li("04. Mão de Obra - Motorista", r.motorista),
      li("05. Mão de Obra - Ajudante", r.ajudante),
      li("06. Despesas (diária/alimentação)", r.despesas),
      li("07. Pedágio", r.pedagio),
    ].join("");
    $("cvcPorKm").textContent = dist > 0 ? `${fmtBRL(r.porKm)} por km` : "—";
  }
  ["cvcDist", "cvcHMot", "cvcHAju", "cvcDesp", "cvcPed"].forEach((id) => $(id).addEventListener("input", recalcular));
  $("cvcVeiculo").addEventListener("change", recalcular);
  $("cvcBtnMes").addEventListener("click", () => {
    const v = M.veiculos[+$("cvcVeiculo").value]; if (!v) return;
    $("cvcDist").value = +(num(v.autonomia) / 12).toFixed(4);
    $("cvcHMot").value = 220;
    recalcular();
  });

  /* ---------- início ---------- */
  renderParametros();
  renderGrade();
  preencherSelectVeiculo();
  carregarConfig(KEY, PADRAO).then((salvo) => {
    if (salvo && Array.isArray(salvo.veiculos) && salvo.veiculos.length) {
      M = { params: { ...PADRAO.params, ...(salvo.params || {}) }, veiculos: salvo.veiculos };
      renderParametros(); renderGrade(); preencherSelectVeiculo();
    }
  });
})();
