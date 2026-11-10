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
    params: { fgts: 8, rescisao: 5, alimentacaoDia: 52.5, hospedagemNoite: 150, comissaoKm: 1 },
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
  /** Custos Diretos de uma viagem. d = { dist, hMot, hAju, alim, hosp, ped, comKm }: alimentação e
   *  hospedagem formam a "Despesa (diária/alimentação)"; a comissão é km rodado × R$ por km. */
  function calcularCustosDiretos(v, p, d) {
    const k = custoKm(v);
    const dist = d.dist;
    const manutencao = {
      mecanica: dist * k.mecanica, licenciamento: dist * k.licenciamento, seguro: dist * k.seguro,
      oleo: dist * k.oleo, pneus: dist * k.pneus, rastreador: dist * k.rastreador,
    };
    const manutTotal = Object.values(manutencao).reduce((a, b) => a + b, 0);
    const r = {
      combustivel: dist * k.combustivel, manutencao, manutTotal, depreciacao: dist * k.depreciacao,
      motorista: d.hMot * custoHora(v.salarioMotorista, v.horasMotorista, p), ajudante: d.hAju * custoHora(v.salarioAjudante, v.horasAjudante, p),
      alimentacao: d.alim, hospedagem: d.hosp, despesas: d.alim + d.hosp, pedagio: d.ped, comissao: dist * d.comKm,
    };
    r.total = r.combustivel + r.manutTotal + r.depreciacao + r.motorista + r.ajudante + r.despesas + r.pedagio + r.comissao;
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
  const PARAMS_VIAGEM = [["cvpAlim", "alimentacaoDia"], ["cvpHosp", "hospedagemNoite"], ["cvpCom", "comissaoKm"]];
  function preencherParamsViagem() { PARAMS_VIAGEM.forEach(([id, k]) => { $(id).value = M.params[k]; }); }
  PARAMS_VIAGEM.forEach(([id, k]) => $(id).addEventListener("input", (e) => { M.params[k] = num(e.target.value); recalcular(); }));
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
  // Cada coluna é um cenário: veículo + período (início/fim) + cidades do percurso + distância,
  // tempos, pedágio e quantidade de veículos. Alimentação (R$/dia), hospedagem (R$/noite) e
  // comissão (R$/km) vêm dos parâmetros do cadastro, mas podem ser digitadas na mão.
  const novoCenario = (vi, b = {}) => ({
    vi, dist: b.dist ?? 0, hMot: b.hMot ?? 0, hAju: b.hAju ?? 0, ped: b.ped ?? 0, qtd: b.qtd ?? 1,
    inicio: b.inicio || "", fim: b.fim || "",
    rota: Array.isArray(b.rota) && b.rota.length ? [...b.rota] : [""],
    alimManual: b.alimManual ?? (b.alimManual === undefined && num(b.desp) > 0 ? num(b.desp) : null),
    hospManual: b.hospManual ?? null, comKmManual: b.comKmManual ?? null,
  });
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
    ["Alimentação", (r) => r.alimentacao, "dre-subitem"],
    ["Hospedagem", (r) => r.hospedagem, "dre-subitem"],
    ["07. Pedágio", (r) => r.pedagio],
    ["08. Comissão (km rodado × R$/km)", (r) => r.comissao],
  ];

  /** Dias de viagem (datas do calendário, inclusive) e noites (virada de dia): 10/11 08:00 → 11/11 18:00
   *  = 2 dias e 1 noite. */
  function diasViagem(inicio, fim) {
    if (!inicio || !fim) return { dias: 0, noites: 0, ok: false, erro: false };
    const d1 = new Date(inicio.slice(0, 10) + "T00:00:00"), d2 = new Date(fim.slice(0, 10) + "T00:00:00");
    const noites = Math.round((d2 - d1) / 86400000);
    if (!isFinite(noites) || noites < 0) return { dias: 0, noites: 0, ok: false, erro: true };
    return { dias: noites + 1, noites, ok: true, erro: false };
  }
  function viagem(c) {
    const d = diasViagem(c.inicio, c.fim);
    const alimAuto = d.dias * num(M.params.alimentacaoDia), hospAuto = d.noites * num(M.params.hospedagemNoite), comAuto = num(M.params.comissaoKm);
    return { ...d, alimAuto, hospAuto, comAuto, alim: c.alimManual ?? alimAuto, hosp: c.hospManual ?? hospAuto, comKm: c.comKmManual ?? comAuto };
  }
  function resultadoCenario(c) {
    const v = M.veiculos[c.vi]; if (!v) return null;
    const t = viagem(c);
    return calcularCustosDiretos(v, M.params, { dist: num(c.dist), hMot: num(c.hMot), hAju: num(c.hAju), alim: t.alim, hosp: t.hosp, ped: num(c.ped), comKm: t.comKm });
  }
  const dataHora = (v) => (v ? new Date(v).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "");

  function preencherSelectVeiculo() {
    CEN.forEach((c) => { if (c.vi >= M.veiculos.length) c.vi = 0; });
    renderComparacao();
  }
  function renderComparacao() {
    const opcoes = (sel) => M.veiculos.map((v, i) => `<option value="${i}" ${i === sel ? "selected" : ""}>${esc(v.nome)}</option>`).join("");
    const campo = (c, i, k, rot, step = "any") => `<label>${rot}<input type="number" min="0" step="${step}" data-ci="${i}" data-k="${k}" value="${esc(c[k])}"></label>`;
    const campoAuto = (i, k, rot) => `<label>${rot}<input type="number" min="0" step="0.01" data-ci="${i}" data-k="${k}"><small class="cvc-auto" data-autotxt="${i}:${k}"></small></label>`;
    const cidade = (i, ri, val, remover) => `<div class="cvc-cid"><div class="autocomplete-wrap"><input type="text" class="cvc-cidade" data-ci="${i}" data-ri="${ri}" autocomplete="off" placeholder="Digite a cidade" value="${esc(val)}"><ul class="autocomplete-list" hidden></ul></div>${remover ? `<button type="button" class="btn-remove" data-rrem="${i}:${ri}" title="Remover cidade">&times;</button>` : ""}</div>`;
    const cab = CEN.map((c, i) => `<th class="cvc-col">
        <div class="cvc-topo"><b>Veículo ${i + 1}</b>${CEN.length > 1 ? `<button type="button" class="btn-remove" data-crem="${i}" title="Remover da comparação">&times;</button>` : ""}</div>
        <select data-ci="${i}" data-k="vi">${opcoes(c.vi)}</select>
        <label>Início (data e hora)<input type="datetime-local" data-ci="${i}" data-k="inicio" value="${esc(c.inicio)}"></label>
        <label>Fim (data e hora)<input type="datetime-local" data-ci="${i}" data-k="fim" value="${esc(c.fim)}"><small class="cvc-auto" data-fimaviso="${i}"></small></label>
        <div class="cvc-rota">
          <span class="cvc-lbl">Cidade de início</span>${cidade(i, 0, c.rota[0], false)}
          <span class="cvc-lbl">Cidades do percurso (na ordem)</span>${c.rota.slice(1).map((v, k) => cidade(i, k + 1, v, true)).join("")}
          <button type="button" class="btn-secondary cvc-add-cid" data-radd="${i}">+ Adicionar cidade</button>
        </div>
        ${campo(c, i, "dist", "Distância a percorrer (km)")}
        ${campo(c, i, "hMot", "Tempo motorista (horas)")}
        ${campo(c, i, "hAju", "Tempo ajudante (horas)")}
        ${campoAuto(i, "alimManual", "Alimentação (R$)")}
        ${campoAuto(i, "hospManual", "Hospedagem (R$)")}
        ${campo(c, i, "ped", "Pedágio (R$)", "0.01")}
        ${campoAuto(i, "comKmManual", "Comissão (R$ por km rodado)")}
        ${campo(c, i, "qtd", "Quantidade de veículos", "1")}
      </th>`).join("");
    const txt = (id, rot) => `<tr class="cvc-info"><td class="cvc-rot">${rot}</td>${CEN.map((c, i) => `<td class="cvc-val cvc-txt" data-x="${id}" data-ci="${i}">—</td>`).join("")}</tr>`;
    const linhas = LINHAS.map(([rot, , cls], li) => `<tr class="${cls || ""}"><td class="cvc-rot">${rot}</td>${CEN.map((c, i) => `<td class="cvc-val" data-li="${li}" data-ci="${i}">—</td>`).join("")}</tr>`).join("");
    const extra = ["porkm", "carga", "dif"].map((id, n) => {
      const rot = ["Custo direto por km", "Custo total da carga (× quantidade)", "Diferença para o menor"][n];
      return `<tr class="${n === 1 ? "cvc-total cvc-carga" : ""}"><td class="cvc-rot">${rot}</td>${CEN.map((c, i) => `<td class="cvc-val" data-x="${id}" data-ci="${i}">—</td>`).join("")}</tr>`;
    }).join("");
    $("cvcGrade").innerHTML = `<thead><tr><th class="cvc-rot">Comparação de veículos</th>${cab}</tr></thead><tbody>${txt("periodo", "Período")}${txt("rota", "Roteiro")}${linhas}${extra}</tbody>`;
    document.querySelectorAll("#cvcGrade input.cvc-cidade").forEach((inp) => {
      configurarAutocompleteCidadeElementos(inp, inp.parentElement.querySelector("ul"), () => {
        CEN[+inp.dataset.ci].rota[+inp.dataset.ri] = inp.value; atualizarComparacao();
      });
    });
    atualizarComparacao();
  }
  function atualizarComparacao() {
    const res = CEN.map(resultadoCenario);
    const carga = CEN.map((c, i) => (res[i] ? res[i].total * Math.max(1, num(c.qtd)) : 0));
    // campos automáticos (alimentação, hospedagem, comissão): mostram o valor calculado enquanto não forem digitados
    CEN.forEach((c, i) => {
      const t = viagem(c);
      const aviso = document.querySelector(`#cvcGrade [data-fimaviso="${i}"]`);
      if (aviso) aviso.textContent = t.erro ? "O fim é anterior ao início." : t.ok ? `${t.dias} dia(s) · ${t.noites} noite(s)` : "";
      [
        ["alimManual", c.alimManual, t.alimAuto, t.ok ? `automático: ${t.dias} dia(s) × ${fmtBRL(M.params.alimentacaoDia)}` : "automático: informe início e fim"],
        ["hospManual", c.hospManual, t.hospAuto, t.ok ? `automático: ${t.noites} noite(s) × ${fmtBRL(M.params.hospedagemNoite)}` : "automático: informe início e fim"],
        ["comKmManual", c.comKmManual, t.comAuto, `automático: parâmetro do cadastro (${fmtBRL(M.params.comissaoKm)} por km)`],
      ].forEach(([k, manual, auto, texto]) => {
        const inp = document.querySelector(`#cvcGrade input[data-ci="${i}"][data-k="${k}"]`);
        if (inp && manual === null && document.activeElement !== inp) inp.value = String(+auto.toFixed(2));
        if (inp && manual !== null && document.activeElement !== inp) inp.value = String(manual);
        const small = document.querySelector(`#cvcGrade [data-autotxt="${i}:${k}"]`);
        if (small) small.innerHTML = manual === null ? texto : `manual · <button type="button" class="cvc-reset" data-reset="${i}:${k}">↺ voltar ao automático</button>`;
      });
    });
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
      if (td.dataset.x === "periodo") {
        const t = viagem(c);
        td.textContent = c.inicio && c.fim ? `${dataHora(c.inicio)} → ${dataHora(c.fim)}${t.ok ? ` (${t.dias} dia(s), ${t.noites} noite(s))` : ""}` : "—";
        return;
      }
      if (td.dataset.x === "rota") { td.textContent = c.rota.filter(Boolean).join(" → ") || "—"; return; }
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

  const MANUAIS = ["alimManual", "hospManual", "comKmManual"];
  const aoMudarCenario = (e) => {
    const el = e.target; if (el.dataset.ci === undefined) return;
    const c = CEN[+el.dataset.ci], k = el.dataset.k;
    if (el.dataset.ri !== undefined) c.rota[+el.dataset.ri] = el.value;
    else if (k === "inicio" || k === "fim") c[k] = el.value;
    else if (MANUAIS.includes(k)) c[k] = el.value === "" ? null : num(el.value);
    else c[k] = el.tagName === "SELECT" ? +el.value : num(el.value);
    atualizarComparacao();
  };
  $("cvcGrade").addEventListener("input", aoMudarCenario);
  $("cvcGrade").addEventListener("change", aoMudarCenario);
  $("cvcGrade").addEventListener("click", (e) => {
    const rem = e.target.closest("[data-crem]");
    if (rem) { CEN.splice(+rem.dataset.crem, 1); renderComparacao(); return; }
    const add = e.target.closest("[data-radd]");
    if (add) { CEN[+add.dataset.radd].rota.push(""); renderComparacao(); return; }
    const rc = e.target.closest("[data-rrem]");
    if (rc) { const [i, ri] = rc.dataset.rrem.split(":").map(Number); CEN[i].rota.splice(ri, 1); renderComparacao(); return; }
    const rs = e.target.closest("[data-reset]");
    if (rs) { const [i, k] = rs.dataset.reset.split(":"); CEN[+i][k] = null; atualizarComparacao(); }
  });
  $("cvcBtnAdd").addEventListener("click", () => {
    const ult = CEN[CEN.length - 1];
    CEN.push(novoCenario((ult.vi + 1) % M.veiculos.length, ult));
    renderComparacao();
  });

  /* ---------- salvar cálculos ---------- */
  const KEY_CALC = "custoCalculos";
  const KEY_PC = "prestacoesContas";
  let CALCS = [];
  let PCS = [];
  let calcEditId = null;
  const novoId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const dataBR = (iso) => (iso ? new Date(iso).toLocaleDateString("pt-BR") : "—");
  const clone = (o) => JSON.parse(JSON.stringify(o));

  function resumoAtual() {
    return CEN.map((c) => {
      const v = M.veiculos[c.vi];
      return { veiculo: v ? v.nome : "", ...c, rota: [...c.rota], r: resultadoCenario(c) };
    });
  }
  /** Nº do cálculo = sequência do ano (1/2026, 2/2026...). Na virada do ano volta para 1. */
  function proximoNumeroCalc(ano) {
    return CALCS.filter((x) => x.ano === ano).reduce((m, x) => Math.max(m, x.numero || 0), 0) + 1;
  }
  /** Cálculos salvos antes da numeração ganham número pela ordem de criação, ano a ano. */
  function numerarAntigos() {
    const porAno = {};
    CALCS.forEach((x) => { if (!x.numero) { x.ano = new Date(x.criadoEm).getFullYear(); (porAno[x.ano] = porAno[x.ano] || []).push(x); } });
    Object.entries(porAno).forEach(([ano, lista]) => {
      let n = CALCS.filter((x) => x.ano === +ano && x.numero).reduce((m, x) => Math.max(m, x.numero), 0);
      lista.sort((a, b) => a.criadoEm.localeCompare(b.criadoEm)).forEach((x) => { x.numero = ++n; x.numeroFormatado = `${n}/${ano}`; });
    });
  }
  function atualizarBotoesCalc() {
    const c = calcEditId ? CALCS.find((x) => x.id === calcEditId) : null;
    $("cvcBtnSalvar").textContent = c ? "Atualizar cálculo" : "Salvar cálculo";
    $("cvcBtnNovo").hidden = !c;
    $("cvcNumero").textContent = c ? `Cálculo nº ${c.numeroFormatado}` : "";
  }
  function renderCalculosSalvos() {
    const ul = $("cvcLista");
    if (!CALCS.length) { ul.innerHTML = `<li class="cv-vazio">Nenhum cálculo salvo ainda.</li>`; return; }
    ul.innerHTML = CALCS.slice().sort((a, b) => (b.atualizadoEm || b.criadoEm).localeCompare(a.atualizadoEm || a.criadoEm)).map((c) =>
      `<li data-abrir="${c.id}"><span><b>Nº ${esc(c.numeroFormatado || "—")}</b> · ${esc(c.nome || "(sem nome)")} · ${c.resumo.length} veículo(s) · ${dataBR(c.atualizadoEm || c.criadoEm)}</span><button type="button" class="btn-remove" data-excluir="${c.id}" title="Excluir">&times;</button></li>`).join("");
  }
  async function salvarCalculo() {
    const nome = $("cvcNome").value.trim();
    if (!nome) { $("cvcMsg").textContent = "Dê uma identificação ao cálculo para salvar."; return; }
    const agora = new Date().toISOString();
    const existente = calcEditId ? CALCS.find((x) => x.id === calcEditId) : null;
    const ano = existente ? existente.ano : new Date().getFullYear();
    const numero = existente ? existente.numero : proximoNumeroCalc(ano);
    const reg = { id: existente ? existente.id : novoId(), nome, ano, numero, numeroFormatado: `${numero}/${ano}`, criadoEm: existente ? existente.criadoEm : agora, atualizadoEm: agora, resumo: clone(resumoAtual()) };
    if (existente) CALCS[CALCS.indexOf(existente)] = reg; else CALCS.push(reg);
    calcEditId = reg.id;
    $("cvcMsg").textContent = "Salvando...";
    await salvarConfig(KEY_CALC, CALCS);
    $("cvcMsg").textContent = `Cálculo nº ${reg.numeroFormatado} ${existente ? "atualizado" : "salvo"}.`;
    setTimeout(() => ($("cvcMsg").textContent = ""), 2500);
    atualizarBotoesCalc(); renderCalculosSalvos(); preencherCalculosPc();
  }
  function abrirCalculo(id) {
    const c = CALCS.find((x) => x.id === id); if (!c) return;
    CEN = c.resumo.map((s) => {
      let vi = M.veiculos.findIndex((v) => v.nome === s.veiculo);
      if (vi < 0) vi = s.vi < M.veiculos.length ? s.vi : 0;
      return novoCenario(vi, s);
    });
    $("cvcNome").value = c.nome; calcEditId = id;
    renderComparacao(); atualizarBotoesCalc();
  }
  $("cvcBtnSalvar").addEventListener("click", salvarCalculo);
  $("cvcBtnNovo").addEventListener("click", () => { calcEditId = null; $("cvcNome").value = ""; CEN = [novoCenario(0)]; renderComparacao(); atualizarBotoesCalc(); });
  $("cvcLista").addEventListener("click", async (e) => {
    const ex = e.target.closest("[data-excluir]");
    if (ex) {
      e.stopPropagation();
      if (!confirm("Excluir este cálculo salvo?")) return;
      CALCS = CALCS.filter((x) => x.id !== ex.dataset.excluir);
      if (calcEditId === ex.dataset.excluir) { calcEditId = null; atualizarBotoesCalc(); }
      renderCalculosSalvos(); preencherCalculosPc();
      await salvarConfig(KEY_CALC, CALCS);
      return;
    }
    const li = e.target.closest("[data-abrir]"); if (li) abrirCalculo(li.dataset.abrir);
  });

  /* ---------- prestação de contas ---------- */
  const FORMAS = ["Dinheiro", "Débito", "Crédito"];
  const KEY_CAT = "categoriasDespesa";
  // Cada categoria diz em qual item da comparação (estimado x real) ela entra.
  const COMPARA_OPCOES = ["Combustível", "Alimentação", "Hospedagem", "Manutenção", "Pedágio", "Outros"];
  let CATS = COMPARA_OPCOES.map((n) => ({ nome: n, compara: n }));
  const nomesCategorias = () => CATS.map((x) => x.nome);
  const destinoCategoria = (nome) => (CATS.find((x) => x.nome === nome) || {}).compara || (COMPARA_OPCOES.includes(nome) ? nome : "Outros");
  const linhaVazia = () => ({ descricao: "", nf: "", data: "", hora: "", valor: 0, forma: "Dinheiro", categoria: "Outros" });
  let PC_LINHAS = Array.from({ length: 12 }, linhaVazia);
  let pcEditId = null;

  const diaSemana = (d) => (d ? new Date(d + "T00:00:00").toLocaleDateString("pt-BR", { weekday: "long" }) : "");
  const opcoesSel = (lista, sel) => (sel && !lista.includes(sel) ? [...lista, sel] : lista).map((o) => `<option ${o === sel ? "selected" : ""}>${esc(o)}</option>`).join("");

  function renderLinhasPc() {
    $("pcLinhas").innerHTML = PC_LINHAS.map((l, i) => `<tr data-i="${i}">
      <td><input type="text" data-k="descricao" value="${esc(l.descricao)}"></td>
      <td><input type="text" data-k="nf" value="${esc(l.nf)}"></td>
      <td class="pc-data"><input type="date" data-k="data" value="${esc(l.data)}"><small data-dia>${diaSemana(l.data)}</small></td>
      <td><input type="time" data-k="hora" value="${esc(l.hora)}"></td>
      <td><input type="number" min="0" step="0.01" data-k="valor" value="${l.valor ? esc(l.valor) : ""}" placeholder="0,00"></td>
      <td><select data-k="forma">${opcoesSel(FORMAS, l.forma)}</select></td>
      <td><select data-k="categoria">${opcoesSel(nomesCategorias(), l.categoria)}</select></td>
      <td><button type="button" class="btn-remove" data-rem="${i}" title="Remover linha">&times;</button></td></tr>`).join("");
    calcularPc();
  }
  function lerPc() {
    return {
      numero: $("pcNumero").value.trim(), abertura: $("pcAbertura").value,
      veiculo: $("pcVeiculo").value.trim(), motorista: $("pcMotorista").value.trim(), destino: $("pcDestino").value.trim(),
      kmIni: num($("pcKmIni").value), kmFim: num($("pcKmFim").value), inicio: $("pcInicio").value, fim: $("pcFim").value,
      adiantado: num($("pcAdiantado").value), comissao: num($("pcComissao").value),
      linhas: clone(PC_LINHAS), calculoId: $("pcCalculo").value || "", cenarioIdx: +($("pcCenario").value || 0),
    };
  }
  function totaisPc() {
    const custoTotal = PC_LINHAS.reduce((s, l) => s + num(l.valor), 0);
    const utilizado = PC_LINHAS.filter((l) => l.forma === "Dinheiro").reduce((s, l) => s + num(l.valor), 0);
    const adiantado = num($("pcAdiantado").value), comissao = num($("pcComissao").value);
    const km = Math.max(0, num($("pcKmFim").value) - num($("pcKmIni").value));
    const porCat = {};
    PC_LINHAS.forEach((l) => { const d = destinoCategoria(l.categoria); porCat[d] = (porCat[d] || 0) + num(l.valor); });
    return { custoTotal, utilizado, adiantado, saldo: adiantado - utilizado, km, comissao, efetivo: custoTotal + comissao, porCat };
  }
  function calcularPc() {
    const t = totaisPc();
    $("pcCustoTotal").textContent = fmtBRL(t.custoTotal);
    $("pcUtilizado").textContent = fmtBRL(t.utilizado);
    $("pcSaldo").textContent = fmtBRL(t.saldo);
    $("pcSaldo").classList.toggle("pc-neg", t.saldo < 0);
    $("pcKmPerc").textContent = fmtNum(t.km, 1);
    $("pcEfetivo").textContent = fmtBRL(t.efetivo);
    compararPc(t);
  }

  function preencherCalculosPc() {
    const sel = $("pcCalculo"), atual = sel.value;
    sel.innerHTML = `<option value="">— escolha o cálculo —</option>` + CALCS.slice().sort((a, b) => (b.ano - a.ano) || (b.numero - a.numero)).map((c) => `<option value="${c.id}">${esc(c.numeroFormatado)} — ${esc(c.nome)}</option>`).join("");
    if (CALCS.some((c) => c.id === atual)) sel.value = atual;
    preencherCenariosPc();
  }
  function preencherCenariosPc() {
    const c = CALCS.find((x) => x.id === $("pcCalculo").value), sel = $("pcCenario"), atual = sel.value;
    sel.innerHTML = c ? c.resumo.map((s, i) => `<option value="${i}">${esc(s.veiculo)}${num(s.qtd) > 1 ? ` (× ${s.qtd})` : ""}</option>`).join("") : "";
    if (c && +atual < c.resumo.length) sel.value = atual;
    sel.disabled = !c;
    calcularPc();
  }
  /** O Nº Controle da prestação é sempre o número do cálculo escolhido (mesmo número e ano). */
  function atualizarNumeroPc(alternativo = "") {
    const c = CALCS.find((x) => x.id === $("pcCalculo").value);
    $("pcNumero").value = c ? c.numeroFormatado : alternativo;
  }
  function compararPc(t = totaisPc()) {
    const tab = $("pcComparacao");
    const c = CALCS.find((x) => x.id === $("pcCalculo").value);
    const s = c ? c.resumo[+$("pcCenario").value || 0] : null;
    const r = s && s.r;
    const cat = (n) => t.porCat[n] || 0;
    const f = (v) => fmtBRL(v);
    const dif = (real, est) => {
      const d = real - est;
      const p = est > 0 ? ` (${d >= 0 ? "+" : ""}${fmtNum((d / est) * 100, 1)}%)` : "";
      return `<td class="${d > 0.005 ? "pc-neg" : d < -0.005 ? "pc-pos" : ""}">${d >= 0 ? "+" : "−"} ${fmtBRL(Math.abs(d))}${p}</td>`;
    };
    // cálculos salvos antes da separação alimentação/hospedagem/comissão: tudo de despesas vira alimentação
    const principais = r ? [
      ["Alimentação", r.alimentacao ?? r.despesas, cat("Alimentação")],
      ["Combustível", r.combustivel, cat("Combustível")],
      ["Hospedagem", r.hospedagem ?? 0, cat("Hospedagem")],
      ["Comissão", r.comissao ?? 0, t.comissao],
    ] : [];
    const outros = r ? [
      ["Manutenção do veículo", r.manutTotal, cat("Manutenção")],
      ["Pedágio", r.pedagio, cat("Pedágio")],
      ["Mão de obra (motorista + ajudante)", r.motorista + r.ajudante, 0],
      ["Depreciação", r.depreciacao, 0],
      ["Outros", 0, cat("Outros")],
    ] : [];
    const estP = principais.reduce((a, l) => a + l[1], 0), realP = principais.reduce((a, l) => a + l[2], 0);
    let html = `<thead><tr><th>Item</th><th>Estimado (cálculo)</th><th>Real (prestação)</th><th>Diferença (real − estimado)</th></tr></thead><tbody>`;
    principais.forEach(([rot, est, real]) => { html += `<tr><td>${rot}</td><td>${f(est)}</td><td>${f(real)}</td>${dif(real, est)}</tr>`; });
    if (r) html += `<tr class="pc-total"><td>Total dos itens comparados (alimentação + combustível + hospedagem + comissão)</td><td>${f(estP)}</td><td>${f(realP)}</td>${dif(realP, estP)}</tr>`;
    outros.forEach(([rot, est, real]) => { html += `<tr class="pc-sec"><td>${rot}</td><td>${f(est)}</td><td>${f(real)}</td>${dif(real, est)}</tr>`; });
    const estTotal = r ? r.total : 0;
    if (r) html += `<tr class="pc-total"><td>Custo total da viagem</td><td>${f(estTotal)}</td><td>${f(t.efetivo)}</td>${dif(t.efetivo, estTotal)}</tr>`;
    else html += `<tr class="pc-total"><td>Custo efetivo da viagem</td><td>—</td><td>${f(t.efetivo)}</td><td>—</td></tr>`;
    const dist = s ? num(s.dist) : 0;
    html += `<tr><td>Distância (km)</td><td>${s ? fmtNum(dist, 1) : "—"}</td><td>${fmtNum(t.km, 1)}</td><td>${s ? fmtNum(t.km - dist, 1) : "—"}</td></tr>`;
    html += `<tr><td>Custo por km</td><td>${r && dist > 0 ? fmtBRL(estTotal / dist) : "—"}</td><td>${t.km > 0 ? fmtBRL(t.efetivo / t.km) : "—"}</td><td>${r && dist > 0 && t.km > 0 ? fmtBRL(t.efetivo / t.km - estTotal / dist) : "—"}</td></tr></tbody>`;
    tab.innerHTML = html;
  }

  function preencherPc(p) {
    $("pcNumero").value = p.numero || ""; $("pcAbertura").value = p.abertura || "";
    $("pcVeiculo").value = p.veiculo || ""; $("pcMotorista").value = p.motorista || ""; $("pcDestino").value = p.destino || "";
    $("pcKmIni").value = p.kmIni || ""; $("pcKmFim").value = p.kmFim || "";
    $("pcInicio").value = p.inicio || ""; $("pcFim").value = p.fim || "";
    $("pcAdiantado").value = p.adiantado || 0; $("pcComissao").value = p.comissao || 0;
    PC_LINHAS = p.linhas && p.linhas.length ? clone(p.linhas) : Array.from({ length: 12 }, linhaVazia);
    PC_LINHAS.forEach((l) => { if (l.categoria === "Diária/Alimentação") l.categoria = "Alimentação"; });
    renderLinhasPc();
    preencherCalculosPc();
    if (p.calculoId && CALCS.some((c) => c.id === p.calculoId)) { $("pcCalculo").value = p.calculoId; preencherCenariosPc(); $("pcCenario").value = String(p.cenarioIdx || 0); }
    atualizarNumeroPc(p.numero || "");
    calcularPc();
  }
  function novaPc() {
    pcEditId = null;
    preencherPc({ abertura: new Date().toISOString().slice(0, 10) });
    $("pcBtnExcluir").hidden = true; $("pcMsg").textContent = "";
    renderPcSalvas();
  }
  function renderPcSalvas() {
    const ul = $("pcLista");
    if (!PCS.length) { ul.innerHTML = `<li class="cv-vazio">Nenhuma prestação salva ainda.</li>`; return; }
    ul.innerHTML = PCS.slice().sort((a, b) => (b.atualizadoEm || b.criadoEm).localeCompare(a.atualizadoEm || a.criadoEm)).map((p) => {
      const custo = p.linhas.reduce((s, l) => s + num(l.valor), 0) + num(p.comissao);
      return `<li data-abrir="${p.id}" class="${p.id === pcEditId ? "cv-ativo" : ""}"><span><b>Nº ${esc(p.numero || "—")}</b> · ${esc(p.veiculo || "sem veículo")} · ${esc(p.destino || "sem destino")} · ${dataBR(p.abertura)} · custo efetivo <b>${fmtBRL(custo)}</b></span><button type="button" class="btn-remove" data-excluir="${p.id}" title="Excluir">&times;</button></li>`;
    }).join("");
  }
  async function salvarPc() {
    const p = lerPc();
    const calc = CALCS.find((x) => x.id === p.calculoId);
    if (!calc) { $("pcMsg").textContent = "Escolha o cálculo: o Nº Controle da prestação é o mesmo do cálculo."; return; }
    p.numero = calc.numeroFormatado;
    const outra = PCS.find((x) => x.id !== pcEditId && x.calculoId === calc.id);
    if (outra) { $("pcMsg").textContent = `Já existe a prestação de contas do cálculo ${calc.numeroFormatado}. Abra-a na lista para editar.`; return; }
    const agora = new Date().toISOString();
    const existente = pcEditId ? PCS.find((x) => x.id === pcEditId) : null;
    const reg = { ...p, id: existente ? existente.id : novoId(), criadoEm: existente ? existente.criadoEm : agora, atualizadoEm: agora };
    if (existente) PCS[PCS.indexOf(existente)] = reg; else PCS.push(reg);
    pcEditId = reg.id;
    $("pcMsg").textContent = "Salvando...";
    await salvarConfig(KEY_PC, PCS);
    $("pcMsg").textContent = `Prestação nº ${reg.numero} ${existente ? "atualizada" : "salva"}.`;
    setTimeout(() => ($("pcMsg").textContent = ""), 3000);
    $("pcBtnExcluir").hidden = false;
    renderPcSalvas();
  }
  async function excluirPc(id) {
    if (!confirm("Excluir esta prestação de contas? Não dá para desfazer.")) return;
    PCS = PCS.filter((x) => x.id !== id);
    await salvarConfig(KEY_PC, PCS);
    if (pcEditId === id) novaPc(); else renderPcSalvas();
  }

  $("pcLinhas").addEventListener("input", (e) => {
    const el = e.target, tr = el.closest("tr"); if (!tr || !el.dataset.k) return;
    const l = PC_LINHAS[+tr.dataset.i];
    l[el.dataset.k] = el.type === "number" ? num(el.value) : el.value;
    if (el.dataset.k === "data") tr.querySelector("[data-dia]").textContent = diaSemana(el.value);
    calcularPc();
  });
  $("pcLinhas").addEventListener("change", (e) => {
    const el = e.target, tr = el.closest("tr"); if (!tr || el.tagName !== "SELECT") return;
    PC_LINHAS[+tr.dataset.i][el.dataset.k] = el.value; calcularPc();
  });
  $("pcLinhas").addEventListener("click", (e) => {
    const b = e.target.closest("[data-rem]"); if (!b) return;
    PC_LINHAS.splice(+b.dataset.rem, 1); if (!PC_LINHAS.length) PC_LINHAS.push(linhaVazia()); renderLinhasPc();
  });
  $("pcBtnAddLinha").addEventListener("click", () => { PC_LINHAS.push(linhaVazia()); renderLinhasPc(); });
  ["pcAdiantado", "pcKmIni", "pcKmFim", "pcComissao"].forEach((id) => $(id).addEventListener("input", calcularPc));
  $("pcCalculo").addEventListener("change", () => { preencherCenariosPc(); atualizarNumeroPc(); });
  $("pcCenario").addEventListener("change", () => calcularPc());
  $("pcBtnNova").addEventListener("click", novaPc);
  $("pcBtnSalvar").addEventListener("click", salvarPc);
  $("pcBtnExcluir").addEventListener("click", () => pcEditId && excluirPc(pcEditId));
  $("pcLista").addEventListener("click", (e) => {
    const ex = e.target.closest("[data-excluir]");
    if (ex) { e.stopPropagation(); excluirPc(ex.dataset.excluir); return; }
    const li = e.target.closest("[data-abrir]"); if (!li) return;
    const p = PCS.find((x) => x.id === li.dataset.abrir); if (!p) return;
    pcEditId = p.id; preencherPc(p); $("pcBtnExcluir").hidden = false; renderPcSalvas();
  });
  function preencherVeiculosPc() {
    $("pcVeiculosLista").innerHTML = M.veiculos.map((v) => `<option value="${esc(v.nome)}"></option>`).join("");
  }


  /* ---------- cadastro de categorias de despesa ---------- */
  function renderCategorias() {
    $("catLinhas").innerHTML = CATS.map((x, i) => `<tr>
      <td><input type="text" data-ci="${i}" data-k="nome" value="${esc(x.nome)}"></td>
      <td><select data-ci="${i}" data-k="compara">${opcoesSel(COMPARA_OPCOES, x.compara)}</select></td>
      <td><button type="button" class="btn-remove" data-crem="${i}" title="Remover categoria">&times;</button></td></tr>`).join("");
  }
  const aoMudarCategoria = (e) => {
    const el = e.target; if (el.dataset.ci === undefined) return;
    CATS[+el.dataset.ci][el.dataset.k] = el.value;
  };
  $("catLinhas").addEventListener("input", aoMudarCategoria);
  $("catLinhas").addEventListener("change", aoMudarCategoria);
  $("catLinhas").addEventListener("click", (e) => {
    const b = e.target.closest("[data-crem]"); if (!b) return;
    CATS.splice(+b.dataset.crem, 1); renderCategorias();
  });
  $("catBtnAdd").addEventListener("click", () => { CATS.push({ nome: "", compara: "Outros" }); renderCategorias(); });
  $("catBtnSalvar").addEventListener("click", async () => {
    const limpas = CATS.map((x) => ({ nome: x.nome.trim(), compara: x.compara })).filter((x) => x.nome);
    const repetida = limpas.find((x, i) => limpas.findIndex((y) => y.nome.toLowerCase() === x.nome.toLowerCase()) !== i);
    if (!limpas.length) { $("catMsg").textContent = "Cadastre ao menos uma categoria."; return; }
    if (repetida) { $("catMsg").textContent = `A categoria "${repetida.nome}" está repetida.`; return; }
    CATS = limpas; renderCategorias();
    $("catMsg").textContent = "Salvando...";
    await salvarConfig(KEY_CAT, CATS);
    $("catMsg").textContent = "Categorias salvas.";
    setTimeout(() => ($("catMsg").textContent = ""), 2500);
    renderLinhasPc();
  });

  /* ---------- sub-abas: Cálculo | Prestação de Contas ---------- */
  document.querySelectorAll(".cv-subtab").forEach((b) => b.addEventListener("click", () => {
    document.querySelectorAll(".cv-subtab").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    $("cvSubCalculo").hidden = b.dataset.sub !== "calculo";
    $("cvSubPrestacao").hidden = b.dataset.sub !== "prestacao";
  }));

  /* ---------- início ---------- */
  renderGrade();
  preencherParamsViagem();
  preencherSelectVeiculo();
  renderCategorias();
  novaPc();
  preencherVeiculosPc();
  renderCalculosSalvos();
  atualizarBotoesCalc();
  carregarConfig(KEY_CALC, []).then((l) => { CALCS = Array.isArray(l) ? l : []; numerarAntigos(); renderCalculosSalvos(); preencherCalculosPc(); atualizarBotoesCalc(); });
  carregarConfig(KEY_CAT, null).then((l) => { if (Array.isArray(l) && l.length) { CATS = l; renderCategorias(); renderLinhasPc(); } });
  carregarConfig(KEY_PC, []).then((l) => {
    PCS = Array.isArray(l) ? l : [];
    renderPcSalvas();
  });
  carregarConfig(KEY, PADRAO).then((salvo) => {
    if (salvo && Array.isArray(salvo.veiculos) && salvo.veiculos.length) {
      const horasAntigas = num((salvo.params || {}).horasMes) || 158.4; // cadastro salvo antes das horas por veículo
      M = { params: { ...PADRAO.params, ...(salvo.params || {}) }, veiculos: salvo.veiculos };
      M.veiculos.forEach((v) => {
        if (v.horasMotorista === undefined) v.horasMotorista = horasAntigas;
        if (v.horasAjudante === undefined) v.horasAjudante = horasAntigas;
      });
      renderGrade(); preencherParamsViagem(); preencherSelectVeiculo(); preencherVeiculosPc();
    }
  });
})();
