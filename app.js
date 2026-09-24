"use strict";

/* Data/hora do último deploy — atualizada manualmente a cada push, para o
   cabeçalho mostrar se a versão carregada é a mais recente (ajuda a detectar
   cache antigo de CDN, por exemplo). */
const BUILD_TIMESTAMP = "24/09/2026 12:52";

const NOMES_PADRAO_EIXOS = {
  2: "Toco",
  3: "Truck",
  4: "Bitruck/Carreta 4 Eixos",
  5: "Carreta 5 Eixos",
  6: "Carreta LS",
  7: "Bitrem",
  9: "Rodotrem",
};

const DEFAULT_ANTT = [
  { eixos: 2, ccd: 0, cc: 0, nome: NOMES_PADRAO_EIXOS[2] },
  { eixos: 3, ccd: 0, cc: 0, nome: NOMES_PADRAO_EIXOS[3] },
  { eixos: 4, ccd: 0, cc: 0, nome: NOMES_PADRAO_EIXOS[4] },
  { eixos: 5, ccd: 0, cc: 0, nome: NOMES_PADRAO_EIXOS[5] },
  { eixos: 6, ccd: 0, cc: 0, nome: NOMES_PADRAO_EIXOS[6] },
  { eixos: 7, ccd: 0, cc: 0, nome: NOMES_PADRAO_EIXOS[7] },
  { eixos: 9, ccd: 0, cc: 0, nome: NOMES_PADRAO_EIXOS[9] },
];

const DEFAULT_VEICULOS = [
  { tipo: "Fiorino", valorKm: 2.80 },
  { tipo: "Van", valorKm: 3.60 },
  { tipo: "3/4", valorKm: 5.50 },
  { tipo: "Truck", valorKm: 6.50 },
  { tipo: "Carreta", valorKm: 8.50 },
];

const DEFAULT_VENDA = { pctCustoFixo: 5, pctImpostos: 8, pctMargem: 11, pctComissao: 3, pctAdvalorem: 0 };
// Tabela oficial de aliquotas de ICMS interestadual/intraestadual (indice_icms), fornecida
// pela PortoEx. Cobre as 27x27 combinacoes de UF (inclui operacoes dentro do mesmo estado).
// Editavel na aba ICMS; qualquer alteracao la sobrescreve os valores desta tabela.
const DEFAULT_ICMS = [{ufOrigem:"AC",ufDestino:"AC",aliquota:17.0},{ufOrigem:"AC",ufDestino:"AL",aliquota:12.0},{ufOrigem:"AC",ufDestino:"AM",aliquota:12.0},{ufOrigem:"AC",ufDestino:"AP",aliquota:12.0},{ufOrigem:"AC",ufDestino:"BA",aliquota:12.0},{ufOrigem:"AC",ufDestino:"CE",aliquota:12.0},{ufOrigem:"AC",ufDestino:"DF",aliquota:12.0},{ufOrigem:"AC",ufDestino:"ES",aliquota:12.0},{ufOrigem:"AC",ufDestino:"GO",aliquota:12.0},{ufOrigem:"AC",ufDestino:"MA",aliquota:12.0},{ufOrigem:"AC",ufDestino:"MG",aliquota:12.0},{ufOrigem:"AC",ufDestino:"MS",aliquota:12.0},{ufOrigem:"AC",ufDestino:"MT",aliquota:12.0},{ufOrigem:"AC",ufDestino:"PA",aliquota:12.0},{ufOrigem:"AC",ufDestino:"PB",aliquota:12.0},{ufOrigem:"AC",ufDestino:"PE",aliquota:12.0},{ufOrigem:"AC",ufDestino:"PI",aliquota:12.0},{ufOrigem:"AC",ufDestino:"PR",aliquota:12.0},{ufOrigem:"AC",ufDestino:"RJ",aliquota:12.0},{ufOrigem:"AC",ufDestino:"RN",aliquota:12.0},{ufOrigem:"AC",ufDestino:"RO",aliquota:12.0},{ufOrigem:"AC",ufDestino:"RR",aliquota:12.0},{ufOrigem:"AC",ufDestino:"RS",aliquota:12.0},{ufOrigem:"AC",ufDestino:"SC",aliquota:12.0},{ufOrigem:"AC",ufDestino:"SE",aliquota:12.0},{ufOrigem:"AC",ufDestino:"SP",aliquota:12.0},{ufOrigem:"AC",ufDestino:"TO",aliquota:12.0},{ufOrigem:"AL",ufDestino:"AC",aliquota:12.0},{ufOrigem:"AL",ufDestino:"AL",aliquota:17.0},{ufOrigem:"AL",ufDestino:"AM",aliquota:12.0},{ufOrigem:"AL",ufDestino:"AP",aliquota:12.0},{ufOrigem:"AL",ufDestino:"BA",aliquota:12.0},{ufOrigem:"AL",ufDestino:"CE",aliquota:12.0},{ufOrigem:"AL",ufDestino:"DF",aliquota:12.0},{ufOrigem:"AL",ufDestino:"ES",aliquota:12.0},{ufOrigem:"AL",ufDestino:"GO",aliquota:12.0},{ufOrigem:"AL",ufDestino:"MA",aliquota:12.0},{ufOrigem:"AL",ufDestino:"MG",aliquota:12.0},{ufOrigem:"AL",ufDestino:"MS",aliquota:12.0},{ufOrigem:"AL",ufDestino:"MT",aliquota:12.0},{ufOrigem:"AL",ufDestino:"PA",aliquota:12.0},{ufOrigem:"AL",ufDestino:"PB",aliquota:12.0},{ufOrigem:"AL",ufDestino:"PE",aliquota:12.0},{ufOrigem:"AL",ufDestino:"PI",aliquota:12.0},{ufOrigem:"AL",ufDestino:"PR",aliquota:12.0},{ufOrigem:"AL",ufDestino:"RJ",aliquota:12.0},{ufOrigem:"AL",ufDestino:"RN",aliquota:12.0},{ufOrigem:"AL",ufDestino:"RO",aliquota:12.0},{ufOrigem:"AL",ufDestino:"RR",aliquota:12.0},{ufOrigem:"AL",ufDestino:"RS",aliquota:12.0},{ufOrigem:"AL",ufDestino:"SC",aliquota:12.0},{ufOrigem:"AL",ufDestino:"SE",aliquota:12.0},{ufOrigem:"AL",ufDestino:"SP",aliquota:12.0},{ufOrigem:"AL",ufDestino:"TO",aliquota:12.0},{ufOrigem:"AM",ufDestino:"AC",aliquota:12.0},{ufOrigem:"AM",ufDestino:"AL",aliquota:12.0},{ufOrigem:"AM",ufDestino:"AM",aliquota:17.0},{ufOrigem:"AM",ufDestino:"AP",aliquota:12.0},{ufOrigem:"AM",ufDestino:"BA",aliquota:12.0},{ufOrigem:"AM",ufDestino:"CE",aliquota:12.0},{ufOrigem:"AM",ufDestino:"DF",aliquota:12.0},{ufOrigem:"AM",ufDestino:"ES",aliquota:12.0},{ufOrigem:"AM",ufDestino:"GO",aliquota:12.0},{ufOrigem:"AM",ufDestino:"MA",aliquota:12.0},{ufOrigem:"AM",ufDestino:"MG",aliquota:12.0},{ufOrigem:"AM",ufDestino:"MS",aliquota:12.0},{ufOrigem:"AM",ufDestino:"MT",aliquota:12.0},{ufOrigem:"AM",ufDestino:"PA",aliquota:12.0},{ufOrigem:"AM",ufDestino:"PB",aliquota:12.0},{ufOrigem:"AM",ufDestino:"PE",aliquota:12.0},{ufOrigem:"AM",ufDestino:"PI",aliquota:12.0},{ufOrigem:"AM",ufDestino:"PR",aliquota:12.0},{ufOrigem:"AM",ufDestino:"RJ",aliquota:12.0},{ufOrigem:"AM",ufDestino:"RN",aliquota:12.0},{ufOrigem:"AM",ufDestino:"RO",aliquota:12.0},{ufOrigem:"AM",ufDestino:"RR",aliquota:12.0},{ufOrigem:"AM",ufDestino:"RS",aliquota:12.0},{ufOrigem:"AM",ufDestino:"SC",aliquota:12.0},{ufOrigem:"AM",ufDestino:"SE",aliquota:12.0},{ufOrigem:"AM",ufDestino:"SP",aliquota:12.0},{ufOrigem:"AM",ufDestino:"TO",aliquota:12.0},{ufOrigem:"AP",ufDestino:"AC",aliquota:12.0},{ufOrigem:"AP",ufDestino:"AL",aliquota:12.0},{ufOrigem:"AP",ufDestino:"AM",aliquota:12.0},{ufOrigem:"AP",ufDestino:"AP",aliquota:17.0},{ufOrigem:"AP",ufDestino:"BA",aliquota:12.0},{ufOrigem:"AP",ufDestino:"CE",aliquota:12.0},{ufOrigem:"AP",ufDestino:"DF",aliquota:12.0},{ufOrigem:"AP",ufDestino:"ES",aliquota:12.0},{ufOrigem:"AP",ufDestino:"GO",aliquota:12.0},{ufOrigem:"AP",ufDestino:"MA",aliquota:12.0},{ufOrigem:"AP",ufDestino:"MG",aliquota:12.0},{ufOrigem:"AP",ufDestino:"MS",aliquota:12.0},{ufOrigem:"AP",ufDestino:"MT",aliquota:12.0},{ufOrigem:"AP",ufDestino:"PA",aliquota:12.0},{ufOrigem:"AP",ufDestino:"PB",aliquota:12.0},{ufOrigem:"AP",ufDestino:"PE",aliquota:12.0},{ufOrigem:"AP",ufDestino:"PI",aliquota:12.0},{ufOrigem:"AP",ufDestino:"PR",aliquota:12.0},{ufOrigem:"AP",ufDestino:"RJ",aliquota:12.0},{ufOrigem:"AP",ufDestino:"RN",aliquota:12.0},{ufOrigem:"AP",ufDestino:"RO",aliquota:12.0},{ufOrigem:"AP",ufDestino:"RR",aliquota:12.0},{ufOrigem:"AP",ufDestino:"RS",aliquota:12.0},{ufOrigem:"AP",ufDestino:"SC",aliquota:12.0},{ufOrigem:"AP",ufDestino:"SE",aliquota:12.0},{ufOrigem:"AP",ufDestino:"SP",aliquota:12.0},{ufOrigem:"AP",ufDestino:"TO",aliquota:12.0},{ufOrigem:"BA",ufDestino:"AC",aliquota:12.0},{ufOrigem:"BA",ufDestino:"AL",aliquota:12.0},{ufOrigem:"BA",ufDestino:"AM",aliquota:12.0},{ufOrigem:"BA",ufDestino:"AP",aliquota:12.0},{ufOrigem:"BA",ufDestino:"BA",aliquota:17.0},{ufOrigem:"BA",ufDestino:"CE",aliquota:12.0},{ufOrigem:"BA",ufDestino:"DF",aliquota:12.0},{ufOrigem:"BA",ufDestino:"ES",aliquota:12.0},{ufOrigem:"BA",ufDestino:"GO",aliquota:12.0},{ufOrigem:"BA",ufDestino:"MA",aliquota:12.0},{ufOrigem:"BA",ufDestino:"MG",aliquota:12.0},{ufOrigem:"BA",ufDestino:"MS",aliquota:12.0},{ufOrigem:"BA",ufDestino:"MT",aliquota:12.0},{ufOrigem:"BA",ufDestino:"PA",aliquota:12.0},{ufOrigem:"BA",ufDestino:"PB",aliquota:12.0},{ufOrigem:"BA",ufDestino:"PE",aliquota:12.0},{ufOrigem:"BA",ufDestino:"PI",aliquota:12.0},{ufOrigem:"BA",ufDestino:"PR",aliquota:12.0},{ufOrigem:"BA",ufDestino:"RJ",aliquota:12.0},{ufOrigem:"BA",ufDestino:"RN",aliquota:12.0},{ufOrigem:"BA",ufDestino:"RO",aliquota:12.0},{ufOrigem:"BA",ufDestino:"RR",aliquota:12.0},{ufOrigem:"BA",ufDestino:"RS",aliquota:12.0},{ufOrigem:"BA",ufDestino:"SC",aliquota:12.0},{ufOrigem:"BA",ufDestino:"SE",aliquota:12.0},{ufOrigem:"BA",ufDestino:"SP",aliquota:12.0},{ufOrigem:"BA",ufDestino:"TO",aliquota:12.0},{ufOrigem:"CE",ufDestino:"AC",aliquota:12.0},{ufOrigem:"CE",ufDestino:"AL",aliquota:12.0},{ufOrigem:"CE",ufDestino:"AM",aliquota:12.0},{ufOrigem:"CE",ufDestino:"AP",aliquota:12.0},{ufOrigem:"CE",ufDestino:"BA",aliquota:12.0},{ufOrigem:"CE",ufDestino:"CE",aliquota:17.0},{ufOrigem:"CE",ufDestino:"DF",aliquota:12.0},{ufOrigem:"CE",ufDestino:"ES",aliquota:12.0},{ufOrigem:"CE",ufDestino:"GO",aliquota:12.0},{ufOrigem:"CE",ufDestino:"MA",aliquota:12.0},{ufOrigem:"CE",ufDestino:"MG",aliquota:12.0},{ufOrigem:"CE",ufDestino:"MS",aliquota:12.0},{ufOrigem:"CE",ufDestino:"MT",aliquota:12.0},{ufOrigem:"CE",ufDestino:"PA",aliquota:12.0},{ufOrigem:"CE",ufDestino:"PB",aliquota:12.0},{ufOrigem:"CE",ufDestino:"PE",aliquota:12.0},{ufOrigem:"CE",ufDestino:"PI",aliquota:12.0},{ufOrigem:"CE",ufDestino:"PR",aliquota:12.0},{ufOrigem:"CE",ufDestino:"RJ",aliquota:12.0},{ufOrigem:"CE",ufDestino:"RN",aliquota:12.0},{ufOrigem:"CE",ufDestino:"RO",aliquota:12.0},{ufOrigem:"CE",ufDestino:"RR",aliquota:12.0},{ufOrigem:"CE",ufDestino:"RS",aliquota:12.0},{ufOrigem:"CE",ufDestino:"SC",aliquota:12.0},{ufOrigem:"CE",ufDestino:"SE",aliquota:12.0},{ufOrigem:"CE",ufDestino:"SP",aliquota:12.0},{ufOrigem:"CE",ufDestino:"TO",aliquota:12.0},{ufOrigem:"DF",ufDestino:"AC",aliquota:12.0},{ufOrigem:"DF",ufDestino:"AL",aliquota:12.0},{ufOrigem:"DF",ufDestino:"AM",aliquota:12.0},{ufOrigem:"DF",ufDestino:"AP",aliquota:12.0},{ufOrigem:"DF",ufDestino:"BA",aliquota:12.0},{ufOrigem:"DF",ufDestino:"CE",aliquota:12.0},{ufOrigem:"DF",ufDestino:"DF",aliquota:17.0},{ufOrigem:"DF",ufDestino:"ES",aliquota:12.0},{ufOrigem:"DF",ufDestino:"GO",aliquota:12.0},{ufOrigem:"DF",ufDestino:"MA",aliquota:12.0},{ufOrigem:"DF",ufDestino:"MG",aliquota:12.0},{ufOrigem:"DF",ufDestino:"MS",aliquota:12.0},{ufOrigem:"DF",ufDestino:"MT",aliquota:12.0},{ufOrigem:"DF",ufDestino:"PA",aliquota:12.0},{ufOrigem:"DF",ufDestino:"PB",aliquota:12.0},{ufOrigem:"DF",ufDestino:"PE",aliquota:12.0},{ufOrigem:"DF",ufDestino:"PI",aliquota:12.0},{ufOrigem:"DF",ufDestino:"PR",aliquota:12.0},{ufOrigem:"DF",ufDestino:"RJ",aliquota:12.0},{ufOrigem:"DF",ufDestino:"RN",aliquota:12.0},{ufOrigem:"DF",ufDestino:"RO",aliquota:12.0},{ufOrigem:"DF",ufDestino:"RR",aliquota:12.0},{ufOrigem:"DF",ufDestino:"RS",aliquota:12.0},{ufOrigem:"DF",ufDestino:"SC",aliquota:12.0},{ufOrigem:"DF",ufDestino:"SE",aliquota:12.0},{ufOrigem:"DF",ufDestino:"SP",aliquota:12.0},{ufOrigem:"DF",ufDestino:"TO",aliquota:12.0},{ufOrigem:"ES",ufDestino:"AC",aliquota:12.0},{ufOrigem:"ES",ufDestino:"AL",aliquota:12.0},{ufOrigem:"ES",ufDestino:"AM",aliquota:12.0},{ufOrigem:"ES",ufDestino:"AP",aliquota:12.0},{ufOrigem:"ES",ufDestino:"BA",aliquota:12.0},{ufOrigem:"ES",ufDestino:"CE",aliquota:12.0},{ufOrigem:"ES",ufDestino:"DF",aliquota:12.0},{ufOrigem:"ES",ufDestino:"ES",aliquota:17.0},{ufOrigem:"ES",ufDestino:"GO",aliquota:12.0},{ufOrigem:"ES",ufDestino:"MA",aliquota:12.0},{ufOrigem:"ES",ufDestino:"MG",aliquota:12.0},{ufOrigem:"ES",ufDestino:"MS",aliquota:12.0},{ufOrigem:"ES",ufDestino:"MT",aliquota:12.0},{ufOrigem:"ES",ufDestino:"PA",aliquota:12.0},{ufOrigem:"ES",ufDestino:"PB",aliquota:12.0},{ufOrigem:"ES",ufDestino:"PE",aliquota:12.0},{ufOrigem:"ES",ufDestino:"PI",aliquota:12.0},{ufOrigem:"ES",ufDestino:"PR",aliquota:12.0},{ufOrigem:"ES",ufDestino:"RJ",aliquota:12.0},{ufOrigem:"ES",ufDestino:"RN",aliquota:12.0},{ufOrigem:"ES",ufDestino:"RO",aliquota:12.0},{ufOrigem:"ES",ufDestino:"RR",aliquota:12.0},{ufOrigem:"ES",ufDestino:"RS",aliquota:12.0},{ufOrigem:"ES",ufDestino:"SC",aliquota:12.0},{ufOrigem:"ES",ufDestino:"SE",aliquota:12.0},{ufOrigem:"ES",ufDestino:"SP",aliquota:12.0},{ufOrigem:"ES",ufDestino:"TO",aliquota:12.0},{ufOrigem:"GO",ufDestino:"AC",aliquota:12.0},{ufOrigem:"GO",ufDestino:"AL",aliquota:12.0},{ufOrigem:"GO",ufDestino:"AM",aliquota:12.0},{ufOrigem:"GO",ufDestino:"AP",aliquota:12.0},{ufOrigem:"GO",ufDestino:"BA",aliquota:12.0},{ufOrigem:"GO",ufDestino:"CE",aliquota:12.0},{ufOrigem:"GO",ufDestino:"DF",aliquota:12.0},{ufOrigem:"GO",ufDestino:"ES",aliquota:12.0},{ufOrigem:"GO",ufDestino:"GO",aliquota:12.0},{ufOrigem:"GO",ufDestino:"MA",aliquota:12.0},{ufOrigem:"GO",ufDestino:"MG",aliquota:12.0},{ufOrigem:"GO",ufDestino:"MS",aliquota:12.0},{ufOrigem:"GO",ufDestino:"MT",aliquota:12.0},{ufOrigem:"GO",ufDestino:"PA",aliquota:12.0},{ufOrigem:"GO",ufDestino:"PB",aliquota:12.0},{ufOrigem:"GO",ufDestino:"PE",aliquota:12.0},{ufOrigem:"GO",ufDestino:"PI",aliquota:12.0},{ufOrigem:"GO",ufDestino:"PR",aliquota:12.0},{ufOrigem:"GO",ufDestino:"RJ",aliquota:12.0},{ufOrigem:"GO",ufDestino:"RN",aliquota:12.0},{ufOrigem:"GO",ufDestino:"RO",aliquota:12.0},{ufOrigem:"GO",ufDestino:"RR",aliquota:12.0},{ufOrigem:"GO",ufDestino:"RS",aliquota:12.0},{ufOrigem:"GO",ufDestino:"SC",aliquota:12.0},{ufOrigem:"GO",ufDestino:"SE",aliquota:12.0},{ufOrigem:"GO",ufDestino:"SP",aliquota:12.0},{ufOrigem:"GO",ufDestino:"TO",aliquota:12.0},{ufOrigem:"MA",ufDestino:"AC",aliquota:12.0},{ufOrigem:"MA",ufDestino:"AL",aliquota:12.0},{ufOrigem:"MA",ufDestino:"AM",aliquota:12.0},{ufOrigem:"MA",ufDestino:"AP",aliquota:12.0},{ufOrigem:"MA",ufDestino:"BA",aliquota:12.0},{ufOrigem:"MA",ufDestino:"CE",aliquota:12.0},{ufOrigem:"MA",ufDestino:"DF",aliquota:12.0},{ufOrigem:"MA",ufDestino:"ES",aliquota:12.0},{ufOrigem:"MA",ufDestino:"GO",aliquota:12.0},{ufOrigem:"MA",ufDestino:"MA",aliquota:18.0},{ufOrigem:"MA",ufDestino:"MG",aliquota:12.0},{ufOrigem:"MA",ufDestino:"MS",aliquota:12.0},{ufOrigem:"MA",ufDestino:"MT",aliquota:12.0},{ufOrigem:"MA",ufDestino:"PA",aliquota:12.0},{ufOrigem:"MA",ufDestino:"PB",aliquota:12.0},{ufOrigem:"MA",ufDestino:"PE",aliquota:12.0},{ufOrigem:"MA",ufDestino:"PI",aliquota:12.0},{ufOrigem:"MA",ufDestino:"PR",aliquota:12.0},{ufOrigem:"MA",ufDestino:"RJ",aliquota:12.0},{ufOrigem:"MA",ufDestino:"RN",aliquota:12.0},{ufOrigem:"MA",ufDestino:"RO",aliquota:12.0},{ufOrigem:"MA",ufDestino:"RR",aliquota:12.0},{ufOrigem:"MA",ufDestino:"RS",aliquota:12.0},{ufOrigem:"MA",ufDestino:"SC",aliquota:12.0},{ufOrigem:"MA",ufDestino:"SE",aliquota:12.0},{ufOrigem:"MA",ufDestino:"SP",aliquota:12.0},{ufOrigem:"MA",ufDestino:"TO",aliquota:12.0},{ufOrigem:"MG",ufDestino:"AC",aliquota:7.0},{ufOrigem:"MG",ufDestino:"AL",aliquota:7.0},{ufOrigem:"MG",ufDestino:"AM",aliquota:7.0},{ufOrigem:"MG",ufDestino:"AP",aliquota:7.0},{ufOrigem:"MG",ufDestino:"BA",aliquota:7.0},{ufOrigem:"MG",ufDestino:"CE",aliquota:7.0},{ufOrigem:"MG",ufDestino:"DF",aliquota:7.0},{ufOrigem:"MG",ufDestino:"ES",aliquota:7.0},{ufOrigem:"MG",ufDestino:"GO",aliquota:7.0},{ufOrigem:"MG",ufDestino:"MA",aliquota:7.0},{ufOrigem:"MG",ufDestino:"MG",aliquota:18.0},{ufOrigem:"MG",ufDestino:"MS",aliquota:7.0},{ufOrigem:"MG",ufDestino:"MT",aliquota:7.0},{ufOrigem:"MG",ufDestino:"PA",aliquota:7.0},{ufOrigem:"MG",ufDestino:"PB",aliquota:7.0},{ufOrigem:"MG",ufDestino:"PE",aliquota:7.0},{ufOrigem:"MG",ufDestino:"PI",aliquota:7.0},{ufOrigem:"MG",ufDestino:"PR",aliquota:12.0},{ufOrigem:"MG",ufDestino:"RJ",aliquota:12.0},{ufOrigem:"MG",ufDestino:"RN",aliquota:7.0},{ufOrigem:"MG",ufDestino:"RO",aliquota:7.0},{ufOrigem:"MG",ufDestino:"RR",aliquota:7.0},{ufOrigem:"MG",ufDestino:"RS",aliquota:12.0},{ufOrigem:"MG",ufDestino:"SC",aliquota:12.0},{ufOrigem:"MG",ufDestino:"SE",aliquota:7.0},{ufOrigem:"MG",ufDestino:"SP",aliquota:12.0},{ufOrigem:"MG",ufDestino:"TO",aliquota:7.0},{ufOrigem:"MS",ufDestino:"AC",aliquota:12.0},{ufOrigem:"MS",ufDestino:"AL",aliquota:12.0},{ufOrigem:"MS",ufDestino:"AM",aliquota:12.0},{ufOrigem:"MS",ufDestino:"AP",aliquota:12.0},{ufOrigem:"MS",ufDestino:"BA",aliquota:12.0},{ufOrigem:"MS",ufDestino:"CE",aliquota:12.0},{ufOrigem:"MS",ufDestino:"DF",aliquota:12.0},{ufOrigem:"MS",ufDestino:"ES",aliquota:12.0},{ufOrigem:"MS",ufDestino:"GO",aliquota:12.0},{ufOrigem:"MS",ufDestino:"MA",aliquota:12.0},{ufOrigem:"MS",ufDestino:"MG",aliquota:12.0},{ufOrigem:"MS",ufDestino:"MS",aliquota:17.0},{ufOrigem:"MS",ufDestino:"MT",aliquota:12.0},{ufOrigem:"MS",ufDestino:"PA",aliquota:12.0},{ufOrigem:"MS",ufDestino:"PB",aliquota:12.0},{ufOrigem:"MS",ufDestino:"PE",aliquota:12.0},{ufOrigem:"MS",ufDestino:"PI",aliquota:12.0},{ufOrigem:"MS",ufDestino:"PR",aliquota:12.0},{ufOrigem:"MS",ufDestino:"RJ",aliquota:12.0},{ufOrigem:"MS",ufDestino:"RN",aliquota:12.0},{ufOrigem:"MS",ufDestino:"RO",aliquota:12.0},{ufOrigem:"MS",ufDestino:"RR",aliquota:12.0},{ufOrigem:"MS",ufDestino:"RS",aliquota:12.0},{ufOrigem:"MS",ufDestino:"SC",aliquota:12.0},{ufOrigem:"MS",ufDestino:"SE",aliquota:12.0},{ufOrigem:"MS",ufDestino:"SP",aliquota:12.0},{ufOrigem:"MS",ufDestino:"TO",aliquota:12.0},{ufOrigem:"MT",ufDestino:"AC",aliquota:12.0},{ufOrigem:"MT",ufDestino:"AL",aliquota:12.0},{ufOrigem:"MT",ufDestino:"AM",aliquota:12.0},{ufOrigem:"MT",ufDestino:"AP",aliquota:12.0},{ufOrigem:"MT",ufDestino:"BA",aliquota:12.0},{ufOrigem:"MT",ufDestino:"CE",aliquota:12.0},{ufOrigem:"MT",ufDestino:"DF",aliquota:12.0},{ufOrigem:"MT",ufDestino:"ES",aliquota:12.0},{ufOrigem:"MT",ufDestino:"GO",aliquota:12.0},{ufOrigem:"MT",ufDestino:"MA",aliquota:12.0},{ufOrigem:"MT",ufDestino:"MG",aliquota:12.0},{ufOrigem:"MT",ufDestino:"MS",aliquota:12.0},{ufOrigem:"MT",ufDestino:"MT",aliquota:17.0},{ufOrigem:"MT",ufDestino:"PA",aliquota:12.0},{ufOrigem:"MT",ufDestino:"PB",aliquota:12.0},{ufOrigem:"MT",ufDestino:"PE",aliquota:12.0},{ufOrigem:"MT",ufDestino:"PI",aliquota:12.0},{ufOrigem:"MT",ufDestino:"PR",aliquota:12.0},{ufOrigem:"MT",ufDestino:"RJ",aliquota:12.0},{ufOrigem:"MT",ufDestino:"RN",aliquota:12.0},{ufOrigem:"MT",ufDestino:"RO",aliquota:12.0},{ufOrigem:"MT",ufDestino:"RR",aliquota:12.0},{ufOrigem:"MT",ufDestino:"RS",aliquota:12.0},{ufOrigem:"MT",ufDestino:"SC",aliquota:12.0},{ufOrigem:"MT",ufDestino:"SE",aliquota:12.0},{ufOrigem:"MT",ufDestino:"SP",aliquota:12.0},{ufOrigem:"MT",ufDestino:"TO",aliquota:12.0},{ufOrigem:"PA",ufDestino:"AC",aliquota:12.0},{ufOrigem:"PA",ufDestino:"AL",aliquota:12.0},{ufOrigem:"PA",ufDestino:"AM",aliquota:12.0},{ufOrigem:"PA",ufDestino:"AP",aliquota:12.0},{ufOrigem:"PA",ufDestino:"BA",aliquota:12.0},{ufOrigem:"PA",ufDestino:"CE",aliquota:12.0},{ufOrigem:"PA",ufDestino:"DF",aliquota:12.0},{ufOrigem:"PA",ufDestino:"ES",aliquota:12.0},{ufOrigem:"PA",ufDestino:"GO",aliquota:12.0},{ufOrigem:"PA",ufDestino:"MA",aliquota:12.0},{ufOrigem:"PA",ufDestino:"MG",aliquota:12.0},{ufOrigem:"PA",ufDestino:"MS",aliquota:12.0},{ufOrigem:"PA",ufDestino:"MT",aliquota:12.0},{ufOrigem:"PA",ufDestino:"PA",aliquota:17.0},{ufOrigem:"PA",ufDestino:"PB",aliquota:12.0},{ufOrigem:"PA",ufDestino:"PE",aliquota:12.0},{ufOrigem:"PA",ufDestino:"PI",aliquota:12.0},{ufOrigem:"PA",ufDestino:"PR",aliquota:12.0},{ufOrigem:"PA",ufDestino:"RJ",aliquota:12.0},{ufOrigem:"PA",ufDestino:"RN",aliquota:12.0},{ufOrigem:"PA",ufDestino:"RO",aliquota:12.0},{ufOrigem:"PA",ufDestino:"RR",aliquota:12.0},{ufOrigem:"PA",ufDestino:"RS",aliquota:12.0},{ufOrigem:"PA",ufDestino:"SC",aliquota:12.0},{ufOrigem:"PA",ufDestino:"SE",aliquota:12.0},{ufOrigem:"PA",ufDestino:"SP",aliquota:12.0},{ufOrigem:"PA",ufDestino:"TO",aliquota:12.0},{ufOrigem:"PB",ufDestino:"AC",aliquota:12.0},{ufOrigem:"PB",ufDestino:"AL",aliquota:12.0},{ufOrigem:"PB",ufDestino:"AM",aliquota:12.0},{ufOrigem:"PB",ufDestino:"AP",aliquota:12.0},{ufOrigem:"PB",ufDestino:"BA",aliquota:12.0},{ufOrigem:"PB",ufDestino:"CE",aliquota:12.0},{ufOrigem:"PB",ufDestino:"DF",aliquota:12.0},{ufOrigem:"PB",ufDestino:"ES",aliquota:12.0},{ufOrigem:"PB",ufDestino:"GO",aliquota:12.0},{ufOrigem:"PB",ufDestino:"MA",aliquota:12.0},{ufOrigem:"PB",ufDestino:"MG",aliquota:12.0},{ufOrigem:"PB",ufDestino:"MS",aliquota:12.0},{ufOrigem:"PB",ufDestino:"MT",aliquota:12.0},{ufOrigem:"PB",ufDestino:"PA",aliquota:12.0},{ufOrigem:"PB",ufDestino:"PB",aliquota:18.0},{ufOrigem:"PB",ufDestino:"PE",aliquota:12.0},{ufOrigem:"PB",ufDestino:"PI",aliquota:12.0},{ufOrigem:"PB",ufDestino:"PR",aliquota:12.0},{ufOrigem:"PB",ufDestino:"RJ",aliquota:12.0},{ufOrigem:"PB",ufDestino:"RN",aliquota:12.0},{ufOrigem:"PB",ufDestino:"RO",aliquota:12.0},{ufOrigem:"PB",ufDestino:"RR",aliquota:12.0},{ufOrigem:"PB",ufDestino:"RS",aliquota:12.0},{ufOrigem:"PB",ufDestino:"SC",aliquota:12.0},{ufOrigem:"PB",ufDestino:"SE",aliquota:12.0},{ufOrigem:"PB",ufDestino:"SP",aliquota:12.0},{ufOrigem:"PB",ufDestino:"TO",aliquota:12.0},{ufOrigem:"PE",ufDestino:"AC",aliquota:12.0},{ufOrigem:"PE",ufDestino:"AL",aliquota:12.0},{ufOrigem:"PE",ufDestino:"AM",aliquota:12.0},{ufOrigem:"PE",ufDestino:"AP",aliquota:12.0},{ufOrigem:"PE",ufDestino:"BA",aliquota:12.0},{ufOrigem:"PE",ufDestino:"CE",aliquota:12.0},{ufOrigem:"PE",ufDestino:"DF",aliquota:12.0},{ufOrigem:"PE",ufDestino:"ES",aliquota:12.0},{ufOrigem:"PE",ufDestino:"GO",aliquota:12.0},{ufOrigem:"PE",ufDestino:"MA",aliquota:12.0},{ufOrigem:"PE",ufDestino:"MG",aliquota:12.0},{ufOrigem:"PE",ufDestino:"MS",aliquota:12.0},{ufOrigem:"PE",ufDestino:"MT",aliquota:12.0},{ufOrigem:"PE",ufDestino:"PA",aliquota:12.0},{ufOrigem:"PE",ufDestino:"PB",aliquota:12.0},{ufOrigem:"PE",ufDestino:"PE",aliquota:18.0},{ufOrigem:"PE",ufDestino:"PI",aliquota:12.0},{ufOrigem:"PE",ufDestino:"PR",aliquota:12.0},{ufOrigem:"PE",ufDestino:"RJ",aliquota:12.0},{ufOrigem:"PE",ufDestino:"RN",aliquota:12.0},{ufOrigem:"PE",ufDestino:"RO",aliquota:12.0},{ufOrigem:"PE",ufDestino:"RR",aliquota:12.0},{ufOrigem:"PE",ufDestino:"RS",aliquota:12.0},{ufOrigem:"PE",ufDestino:"SC",aliquota:12.0},{ufOrigem:"PE",ufDestino:"SE",aliquota:12.0},{ufOrigem:"PE",ufDestino:"SP",aliquota:12.0},{ufOrigem:"PE",ufDestino:"TO",aliquota:12.0},{ufOrigem:"PI",ufDestino:"AC",aliquota:12.0},{ufOrigem:"PI",ufDestino:"AL",aliquota:12.0},{ufOrigem:"PI",ufDestino:"AM",aliquota:12.0},{ufOrigem:"PI",ufDestino:"AP",aliquota:12.0},{ufOrigem:"PI",ufDestino:"BA",aliquota:12.0},{ufOrigem:"PI",ufDestino:"CE",aliquota:12.0},{ufOrigem:"PI",ufDestino:"DF",aliquota:12.0},{ufOrigem:"PI",ufDestino:"ES",aliquota:12.0},{ufOrigem:"PI",ufDestino:"GO",aliquota:12.0},{ufOrigem:"PI",ufDestino:"MA",aliquota:12.0},{ufOrigem:"PI",ufDestino:"MG",aliquota:12.0},{ufOrigem:"PI",ufDestino:"MS",aliquota:12.0},{ufOrigem:"PI",ufDestino:"MT",aliquota:12.0},{ufOrigem:"PI",ufDestino:"PA",aliquota:12.0},{ufOrigem:"PI",ufDestino:"PB",aliquota:12.0},{ufOrigem:"PI",ufDestino:"PE",aliquota:12.0},{ufOrigem:"PI",ufDestino:"PI",aliquota:17.0},{ufOrigem:"PI",ufDestino:"PR",aliquota:12.0},{ufOrigem:"PI",ufDestino:"RJ",aliquota:12.0},{ufOrigem:"PI",ufDestino:"RN",aliquota:12.0},{ufOrigem:"PI",ufDestino:"RO",aliquota:12.0},{ufOrigem:"PI",ufDestino:"RR",aliquota:12.0},{ufOrigem:"PI",ufDestino:"RS",aliquota:12.0},{ufOrigem:"PI",ufDestino:"SC",aliquota:12.0},{ufOrigem:"PI",ufDestino:"SE",aliquota:12.0},{ufOrigem:"PI",ufDestino:"SP",aliquota:12.0},{ufOrigem:"PI",ufDestino:"TO",aliquota:12.0},{ufOrigem:"PR",ufDestino:"AC",aliquota:7.0},{ufOrigem:"PR",ufDestino:"AL",aliquota:7.0},{ufOrigem:"PR",ufDestino:"AM",aliquota:7.0},{ufOrigem:"PR",ufDestino:"AP",aliquota:7.0},{ufOrigem:"PR",ufDestino:"BA",aliquota:7.0},{ufOrigem:"PR",ufDestino:"CE",aliquota:7.0},{ufOrigem:"PR",ufDestino:"DF",aliquota:7.0},{ufOrigem:"PR",ufDestino:"ES",aliquota:7.0},{ufOrigem:"PR",ufDestino:"GO",aliquota:7.0},{ufOrigem:"PR",ufDestino:"MA",aliquota:7.0},{ufOrigem:"PR",ufDestino:"MG",aliquota:12.0},{ufOrigem:"PR",ufDestino:"MS",aliquota:7.0},{ufOrigem:"PR",ufDestino:"MT",aliquota:7.0},{ufOrigem:"PR",ufDestino:"PA",aliquota:7.0},{ufOrigem:"PR",ufDestino:"PB",aliquota:7.0},{ufOrigem:"PR",ufDestino:"PE",aliquota:7.0},{ufOrigem:"PR",ufDestino:"PI",aliquota:7.0},{ufOrigem:"PR",ufDestino:"PR",aliquota:18.0},{ufOrigem:"PR",ufDestino:"RJ",aliquota:12.0},{ufOrigem:"PR",ufDestino:"RN",aliquota:7.0},{ufOrigem:"PR",ufDestino:"RO",aliquota:7.0},{ufOrigem:"PR",ufDestino:"RR",aliquota:7.0},{ufOrigem:"PR",ufDestino:"RS",aliquota:12.0},{ufOrigem:"PR",ufDestino:"SC",aliquota:12.0},{ufOrigem:"PR",ufDestino:"SE",aliquota:7.0},{ufOrigem:"PR",ufDestino:"SP",aliquota:12.0},{ufOrigem:"PR",ufDestino:"TO",aliquota:7.0},{ufOrigem:"RJ",ufDestino:"AC",aliquota:7.0},{ufOrigem:"RJ",ufDestino:"AL",aliquota:7.0},{ufOrigem:"RJ",ufDestino:"AM",aliquota:7.0},{ufOrigem:"RJ",ufDestino:"AP",aliquota:7.0},{ufOrigem:"RJ",ufDestino:"BA",aliquota:7.0},{ufOrigem:"RJ",ufDestino:"CE",aliquota:7.0},{ufOrigem:"RJ",ufDestino:"DF",aliquota:7.0},{ufOrigem:"RJ",ufDestino:"ES",aliquota:7.0},{ufOrigem:"RJ",ufDestino:"GO",aliquota:7.0},{ufOrigem:"RJ",ufDestino:"MA",aliquota:7.0},{ufOrigem:"RJ",ufDestino:"MG",aliquota:12.0},{ufOrigem:"RJ",ufDestino:"MS",aliquota:7.0},{ufOrigem:"RJ",ufDestino:"MT",aliquota:7.0},{ufOrigem:"RJ",ufDestino:"PA",aliquota:7.0},{ufOrigem:"RJ",ufDestino:"PB",aliquota:7.0},{ufOrigem:"RJ",ufDestino:"PE",aliquota:7.0},{ufOrigem:"RJ",ufDestino:"PI",aliquota:7.0},{ufOrigem:"RJ",ufDestino:"PR",aliquota:12.0},{ufOrigem:"RJ",ufDestino:"RJ",aliquota:20.0},{ufOrigem:"RJ",ufDestino:"RN",aliquota:7.0},{ufOrigem:"RJ",ufDestino:"RO",aliquota:7.0},{ufOrigem:"RJ",ufDestino:"RR",aliquota:7.0},{ufOrigem:"RJ",ufDestino:"RS",aliquota:12.0},{ufOrigem:"RJ",ufDestino:"SC",aliquota:12.0},{ufOrigem:"RJ",ufDestino:"SE",aliquota:7.0},{ufOrigem:"RJ",ufDestino:"SP",aliquota:12.0},{ufOrigem:"RJ",ufDestino:"TO",aliquota:7.0},{ufOrigem:"RN",ufDestino:"AC",aliquota:12.0},{ufOrigem:"RN",ufDestino:"AL",aliquota:12.0},{ufOrigem:"RN",ufDestino:"AM",aliquota:12.0},{ufOrigem:"RN",ufDestino:"AP",aliquota:12.0},{ufOrigem:"RN",ufDestino:"BA",aliquota:12.0},{ufOrigem:"RN",ufDestino:"CE",aliquota:12.0},{ufOrigem:"RN",ufDestino:"DF",aliquota:12.0},{ufOrigem:"RN",ufDestino:"ES",aliquota:12.0},{ufOrigem:"RN",ufDestino:"GO",aliquota:12.0},{ufOrigem:"RN",ufDestino:"MA",aliquota:12.0},{ufOrigem:"RN",ufDestino:"MG",aliquota:12.0},{ufOrigem:"RN",ufDestino:"MS",aliquota:12.0},{ufOrigem:"RN",ufDestino:"MT",aliquota:12.0},{ufOrigem:"RN",ufDestino:"PA",aliquota:12.0},{ufOrigem:"RN",ufDestino:"PB",aliquota:12.0},{ufOrigem:"RN",ufDestino:"PE",aliquota:12.0},{ufOrigem:"RN",ufDestino:"PI",aliquota:12.0},{ufOrigem:"RN",ufDestino:"PR",aliquota:12.0},{ufOrigem:"RN",ufDestino:"RJ",aliquota:12.0},{ufOrigem:"RN",ufDestino:"RN",aliquota:17.0},{ufOrigem:"RN",ufDestino:"RO",aliquota:12.0},{ufOrigem:"RN",ufDestino:"RR",aliquota:12.0},{ufOrigem:"RN",ufDestino:"RS",aliquota:12.0},{ufOrigem:"RN",ufDestino:"SC",aliquota:12.0},{ufOrigem:"RN",ufDestino:"SE",aliquota:12.0},{ufOrigem:"RN",ufDestino:"SP",aliquota:12.0},{ufOrigem:"RN",ufDestino:"TO",aliquota:12.0},{ufOrigem:"RO",ufDestino:"AC",aliquota:12.0},{ufOrigem:"RO",ufDestino:"AL",aliquota:12.0},{ufOrigem:"RO",ufDestino:"AM",aliquota:12.0},{ufOrigem:"RO",ufDestino:"AP",aliquota:12.0},{ufOrigem:"RO",ufDestino:"BA",aliquota:12.0},{ufOrigem:"RO",ufDestino:"CE",aliquota:12.0},{ufOrigem:"RO",ufDestino:"DF",aliquota:12.0},{ufOrigem:"RO",ufDestino:"ES",aliquota:12.0},{ufOrigem:"RO",ufDestino:"GO",aliquota:12.0},{ufOrigem:"RO",ufDestino:"MA",aliquota:12.0},{ufOrigem:"RO",ufDestino:"MG",aliquota:12.0},{ufOrigem:"RO",ufDestino:"MS",aliquota:12.0},{ufOrigem:"RO",ufDestino:"MT",aliquota:12.0},{ufOrigem:"RO",ufDestino:"PA",aliquota:12.0},{ufOrigem:"RO",ufDestino:"PB",aliquota:12.0},{ufOrigem:"RO",ufDestino:"PE",aliquota:12.0},{ufOrigem:"RO",ufDestino:"PI",aliquota:12.0},{ufOrigem:"RO",ufDestino:"PR",aliquota:12.0},{ufOrigem:"RO",ufDestino:"RJ",aliquota:12.0},{ufOrigem:"RO",ufDestino:"RN",aliquota:12.0},{ufOrigem:"RO",ufDestino:"RO",aliquota:17.0},{ufOrigem:"RO",ufDestino:"RR",aliquota:12.0},{ufOrigem:"RO",ufDestino:"RS",aliquota:12.0},{ufOrigem:"RO",ufDestino:"SC",aliquota:12.0},{ufOrigem:"RO",ufDestino:"SE",aliquota:12.0},{ufOrigem:"RO",ufDestino:"SP",aliquota:12.0},{ufOrigem:"RO",ufDestino:"TO",aliquota:12.0},{ufOrigem:"RR",ufDestino:"AC",aliquota:12.0},{ufOrigem:"RR",ufDestino:"AL",aliquota:12.0},{ufOrigem:"RR",ufDestino:"AM",aliquota:12.0},{ufOrigem:"RR",ufDestino:"AP",aliquota:12.0},{ufOrigem:"RR",ufDestino:"BA",aliquota:12.0},{ufOrigem:"RR",ufDestino:"CE",aliquota:12.0},{ufOrigem:"RR",ufDestino:"DF",aliquota:12.0},{ufOrigem:"RR",ufDestino:"ES",aliquota:12.0},{ufOrigem:"RR",ufDestino:"GO",aliquota:12.0},{ufOrigem:"RR",ufDestino:"MA",aliquota:12.0},{ufOrigem:"RR",ufDestino:"MG",aliquota:12.0},{ufOrigem:"RR",ufDestino:"MS",aliquota:12.0},{ufOrigem:"RR",ufDestino:"MT",aliquota:12.0},{ufOrigem:"RR",ufDestino:"PA",aliquota:12.0},{ufOrigem:"RR",ufDestino:"PB",aliquota:12.0},{ufOrigem:"RR",ufDestino:"PE",aliquota:12.0},{ufOrigem:"RR",ufDestino:"PI",aliquota:12.0},{ufOrigem:"RR",ufDestino:"PR",aliquota:12.0},{ufOrigem:"RR",ufDestino:"RJ",aliquota:12.0},{ufOrigem:"RR",ufDestino:"RN",aliquota:12.0},{ufOrigem:"RR",ufDestino:"RO",aliquota:12.0},{ufOrigem:"RR",ufDestino:"RR",aliquota:17.0},{ufOrigem:"RR",ufDestino:"RS",aliquota:12.0},{ufOrigem:"RR",ufDestino:"SC",aliquota:12.0},{ufOrigem:"RR",ufDestino:"SE",aliquota:12.0},{ufOrigem:"RR",ufDestino:"SP",aliquota:12.0},{ufOrigem:"RR",ufDestino:"TO",aliquota:12.0},{ufOrigem:"RS",ufDestino:"AC",aliquota:7.0},{ufOrigem:"RS",ufDestino:"AL",aliquota:7.0},{ufOrigem:"RS",ufDestino:"AM",aliquota:7.0},{ufOrigem:"RS",ufDestino:"AP",aliquota:7.0},{ufOrigem:"RS",ufDestino:"BA",aliquota:7.0},{ufOrigem:"RS",ufDestino:"CE",aliquota:7.0},{ufOrigem:"RS",ufDestino:"DF",aliquota:7.0},{ufOrigem:"RS",ufDestino:"ES",aliquota:7.0},{ufOrigem:"RS",ufDestino:"GO",aliquota:7.0},{ufOrigem:"RS",ufDestino:"MA",aliquota:7.0},{ufOrigem:"RS",ufDestino:"MG",aliquota:12.0},{ufOrigem:"RS",ufDestino:"MS",aliquota:7.0},{ufOrigem:"RS",ufDestino:"MT",aliquota:7.0},{ufOrigem:"RS",ufDestino:"PA",aliquota:7.0},{ufOrigem:"RS",ufDestino:"PB",aliquota:7.0},{ufOrigem:"RS",ufDestino:"PE",aliquota:7.0},{ufOrigem:"RS",ufDestino:"PI",aliquota:7.0},{ufOrigem:"RS",ufDestino:"PR",aliquota:12.0},{ufOrigem:"RS",ufDestino:"RJ",aliquota:12.0},{ufOrigem:"RS",ufDestino:"RN",aliquota:7.0},{ufOrigem:"RS",ufDestino:"RO",aliquota:7.0},{ufOrigem:"RS",ufDestino:"RR",aliquota:7.0},{ufOrigem:"RS",ufDestino:"RS",aliquota:12.0},{ufOrigem:"RS",ufDestino:"SC",aliquota:12.0},{ufOrigem:"RS",ufDestino:"SE",aliquota:7.0},{ufOrigem:"RS",ufDestino:"SP",aliquota:12.0},{ufOrigem:"RS",ufDestino:"TO",aliquota:7.0},{ufOrigem:"SC",ufDestino:"AC",aliquota:7.0},{ufOrigem:"SC",ufDestino:"AL",aliquota:7.0},{ufOrigem:"SC",ufDestino:"AM",aliquota:7.0},{ufOrigem:"SC",ufDestino:"AP",aliquota:7.0},{ufOrigem:"SC",ufDestino:"BA",aliquota:7.0},{ufOrigem:"SC",ufDestino:"CE",aliquota:7.0},{ufOrigem:"SC",ufDestino:"DF",aliquota:7.0},{ufOrigem:"SC",ufDestino:"ES",aliquota:7.0},{ufOrigem:"SC",ufDestino:"GO",aliquota:7.0},{ufOrigem:"SC",ufDestino:"MA",aliquota:7.0},{ufOrigem:"SC",ufDestino:"MG",aliquota:12.0},{ufOrigem:"SC",ufDestino:"MS",aliquota:7.0},{ufOrigem:"SC",ufDestino:"MT",aliquota:7.0},{ufOrigem:"SC",ufDestino:"PA",aliquota:7.0},{ufOrigem:"SC",ufDestino:"PB",aliquota:7.0},{ufOrigem:"SC",ufDestino:"PE",aliquota:7.0},{ufOrigem:"SC",ufDestino:"PI",aliquota:7.0},{ufOrigem:"SC",ufDestino:"PR",aliquota:12.0},{ufOrigem:"SC",ufDestino:"RJ",aliquota:12.0},{ufOrigem:"SC",ufDestino:"RN",aliquota:7.0},{ufOrigem:"SC",ufDestino:"RO",aliquota:7.0},{ufOrigem:"SC",ufDestino:"RR",aliquota:7.0},{ufOrigem:"SC",ufDestino:"RS",aliquota:12.0},{ufOrigem:"SC",ufDestino:"SC",aliquota:17.0},{ufOrigem:"SC",ufDestino:"SE",aliquota:7.0},{ufOrigem:"SC",ufDestino:"SP",aliquota:12.0},{ufOrigem:"SC",ufDestino:"TO",aliquota:7.0},{ufOrigem:"SE",ufDestino:"AC",aliquota:12.0},{ufOrigem:"SE",ufDestino:"AL",aliquota:12.0},{ufOrigem:"SE",ufDestino:"AM",aliquota:12.0},{ufOrigem:"SE",ufDestino:"AP",aliquota:12.0},{ufOrigem:"SE",ufDestino:"BA",aliquota:12.0},{ufOrigem:"SE",ufDestino:"CE",aliquota:12.0},{ufOrigem:"SE",ufDestino:"DF",aliquota:12.0},{ufOrigem:"SE",ufDestino:"ES",aliquota:12.0},{ufOrigem:"SE",ufDestino:"GO",aliquota:12.0},{ufOrigem:"SE",ufDestino:"MA",aliquota:12.0},{ufOrigem:"SE",ufDestino:"MG",aliquota:12.0},{ufOrigem:"SE",ufDestino:"MS",aliquota:12.0},{ufOrigem:"SE",ufDestino:"MT",aliquota:12.0},{ufOrigem:"SE",ufDestino:"PA",aliquota:12.0},{ufOrigem:"SE",ufDestino:"PB",aliquota:12.0},{ufOrigem:"SE",ufDestino:"PE",aliquota:12.0},{ufOrigem:"SE",ufDestino:"PI",aliquota:12.0},{ufOrigem:"SE",ufDestino:"PR",aliquota:12.0},{ufOrigem:"SE",ufDestino:"RJ",aliquota:12.0},{ufOrigem:"SE",ufDestino:"RN",aliquota:12.0},{ufOrigem:"SE",ufDestino:"RO",aliquota:12.0},{ufOrigem:"SE",ufDestino:"RR",aliquota:12.0},{ufOrigem:"SE",ufDestino:"RS",aliquota:12.0},{ufOrigem:"SE",ufDestino:"SC",aliquota:12.0},{ufOrigem:"SE",ufDestino:"SE",aliquota:17.0},{ufOrigem:"SE",ufDestino:"SP",aliquota:12.0},{ufOrigem:"SE",ufDestino:"TO",aliquota:12.0},{ufOrigem:"SP",ufDestino:"AC",aliquota:7.0},{ufOrigem:"SP",ufDestino:"AL",aliquota:7.0},{ufOrigem:"SP",ufDestino:"AM",aliquota:7.0},{ufOrigem:"SP",ufDestino:"AP",aliquota:7.0},{ufOrigem:"SP",ufDestino:"BA",aliquota:7.0},{ufOrigem:"SP",ufDestino:"CE",aliquota:7.0},{ufOrigem:"SP",ufDestino:"DF",aliquota:7.0},{ufOrigem:"SP",ufDestino:"ES",aliquota:7.0},{ufOrigem:"SP",ufDestino:"GO",aliquota:7.0},{ufOrigem:"SP",ufDestino:"MA",aliquota:7.0},{ufOrigem:"SP",ufDestino:"MG",aliquota:12.0},{ufOrigem:"SP",ufDestino:"MS",aliquota:7.0},{ufOrigem:"SP",ufDestino:"MT",aliquota:7.0},{ufOrigem:"SP",ufDestino:"PA",aliquota:7.0},{ufOrigem:"SP",ufDestino:"PB",aliquota:7.0},{ufOrigem:"SP",ufDestino:"PE",aliquota:7.0},{ufOrigem:"SP",ufDestino:"PI",aliquota:7.0},{ufOrigem:"SP",ufDestino:"PR",aliquota:12.0},{ufOrigem:"SP",ufDestino:"RJ",aliquota:12.0},{ufOrigem:"SP",ufDestino:"RN",aliquota:7.0},{ufOrigem:"SP",ufDestino:"RO",aliquota:7.0},{ufOrigem:"SP",ufDestino:"RR",aliquota:7.0},{ufOrigem:"SP",ufDestino:"RS",aliquota:12.0},{ufOrigem:"SP",ufDestino:"SC",aliquota:12.0},{ufOrigem:"SP",ufDestino:"SE",aliquota:7.0},{ufOrigem:"SP",ufDestino:"SP",aliquota:12.0},{ufOrigem:"SP",ufDestino:"TO",aliquota:7.0},{ufOrigem:"TO",ufDestino:"AC",aliquota:12.0},{ufOrigem:"TO",ufDestino:"AL",aliquota:12.0},{ufOrigem:"TO",ufDestino:"AM",aliquota:12.0},{ufOrigem:"TO",ufDestino:"AP",aliquota:12.0},{ufOrigem:"TO",ufDestino:"BA",aliquota:12.0},{ufOrigem:"TO",ufDestino:"CE",aliquota:12.0},{ufOrigem:"TO",ufDestino:"DF",aliquota:12.0},{ufOrigem:"TO",ufDestino:"ES",aliquota:12.0},{ufOrigem:"TO",ufDestino:"GO",aliquota:12.0},{ufOrigem:"TO",ufDestino:"MA",aliquota:12.0},{ufOrigem:"TO",ufDestino:"MG",aliquota:12.0},{ufOrigem:"TO",ufDestino:"MS",aliquota:12.0},{ufOrigem:"TO",ufDestino:"MT",aliquota:12.0},{ufOrigem:"TO",ufDestino:"PA",aliquota:12.0},{ufOrigem:"TO",ufDestino:"PB",aliquota:12.0},{ufOrigem:"TO",ufDestino:"PE",aliquota:12.0},{ufOrigem:"TO",ufDestino:"PI",aliquota:12.0},{ufOrigem:"TO",ufDestino:"PR",aliquota:12.0},{ufOrigem:"TO",ufDestino:"RJ",aliquota:12.0},{ufOrigem:"TO",ufDestino:"RN",aliquota:12.0},{ufOrigem:"TO",ufDestino:"RO",aliquota:12.0},{ufOrigem:"TO",ufDestino:"RR",aliquota:12.0},{ufOrigem:"TO",ufDestino:"RS",aliquota:12.0},{ufOrigem:"TO",ufDestino:"SC",aliquota:12.0},{ufOrigem:"TO",ufDestino:"SE",aliquota:12.0},{ufOrigem:"TO",ufDestino:"SP",aliquota:12.0},{ufOrigem:"TO",ufDestino:"TO",aliquota:17.0}];

const UF_LIST = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG",
  "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO",
];

// Resolução do Senado Federal nº 22/1989: alíquota interestadual reduzida (7%) quando a
// origem é Sul/Sudeste (exceto ES) e o destino é Norte, Nordeste, Centro-Oeste ou ES;
// nos demais casos interestaduais a alíquota é 12%.
const UF_SUL_SUDESTE_EXCETO_ES = ["SP", "RJ", "MG", "PR", "SC", "RS"];
const UF_DESTINO_ALIQUOTA_REDUZIDA = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS",
  "PA", "PB", "PE", "PI", "RN", "RO", "RR", "SE", "TO",
];

/* ============================================================
   Persistência compartilhada (Supabase) — os cadastros ficam num banco
   de dados compartilhado, então todo mundo que acessa o site vê os
   mesmos dados (ANTT, Custo por KM, SPOT, Vendedores, Histórico etc.),
   em vez de cada navegador guardar sua própria cópia isolada.
   ============================================================ */
const SUPABASE_URL = "https://tgurfzpdpdxpodxewotv.supabase.co";
const SUPABASE_KEY = "sb_publishable_9DHQudX1xPJEIRzSXGyCgA_u9qxgzWd";
const db = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

/** Lê um valor de configuração salvo em app_config; se não existir (ou der erro), volta o padrão. */
async function carregarConfig(chave, padrao) {
  try {
    const { data, error } = await db.from("app_config").select("value").eq("key", chave).maybeSingle();
    if (error || !data || data.value === null || data.value === undefined) return structuredClone(padrao);
    return data.value;
  } catch (e) {
    return structuredClone(padrao);
  }
}
/** Salva um valor de configuração em app_config, visível para todo mundo que acessa o site. */
async function salvarConfig(chave, valor) {
  try {
    const { error } = await db.from("app_config").upsert({ key: chave, value: valor, updated_at: new Date().toISOString() });
    if (error) console.error(`Falha ao salvar "${chave}" no banco:`, error);
  } catch (e) {
    console.error(`Falha ao salvar "${chave}" no banco:`, e);
  }
}
/** Lê todas as cotações do histórico compartilhado (mais recente primeiro). */
async function carregarHistorico() {
  try {
    const { data, error } = await db.from("historico_cotacoes").select("data").order("criado_em", { ascending: false });
    if (error || !data) return [];
    return data.map((row) => row.data);
  } catch (e) {
    return [];
  }
}
/** Insere uma nova cotação no histórico compartilhado. */
async function inserirCotacao(registro) {
  const { error } = await db
    .from("historico_cotacoes")
    .insert({ id: registro.id, numero_formatado: registro.numeroFormatado, criado_em: registro.criadoEm, data: registro });
  if (error) console.error("Falha ao salvar cotação no banco:", error);
}
/** Remove uma cotação do histórico compartilhado. */
async function removerCotacao(id) {
  const { error } = await db.from("historico_cotacoes").delete().eq("id", id);
  if (error) console.error("Falha ao remover cotação no banco:", error);
}
/** Próximo número sequencial de cotação para o ano informado — gerado de forma atômica no
    banco (função proximo_numero_cotacao), seguro mesmo com vários usuários salvando ao mesmo tempo. */
async function proximoNumeroCotacao(ano) {
  const { data, error } = await db.rpc("proximo_numero_cotacao", { p_ano: ano });
  if (error) {
    console.error("Falha ao gerar número da cotação:", error);
    throw error;
  }
  return data;
}

let anttTable = structuredClone(DEFAULT_ANTT);
let veiculosTable = structuredClone(DEFAULT_VEICULOS);
let vendaParams = structuredClone(DEFAULT_VENDA);
let icmsTable = structuredClone(DEFAULT_ICMS);
let ajusteKmPct = 0;
let orsApiKey = "";
let qualpApiKey = "";
let anttConfig = { freightType: "A", loadType: "geral", isEmptyReturn: false };
let vendedoresTable = [];
let spotTable = [];
let mkpTable = [];
let historicoCotacoes = [];
let spotBrudamUltimaAtualizacao = "";

/** Busca todos os cadastros e o histórico no Supabase; roda uma vez, antes da tela renderizar. */
async function carregarDadosIniciais() {
  const [antt, veiculos, venda, icms, ajusteKm, ors, qualp, anttCfg, vendedores, spot, mkp, historico, brudamData] = await Promise.all([
    carregarConfig("antt", DEFAULT_ANTT),
    carregarConfig("veiculos", DEFAULT_VEICULOS),
    carregarConfig("venda", DEFAULT_VENDA),
    carregarConfig("icms", DEFAULT_ICMS),
    carregarConfig("ajusteKm", 0),
    carregarConfig("orsApiKey", ""),
    carregarConfig("qualpApiKey", ""),
    carregarConfig("anttConfig", { freightType: "A", loadType: "geral", isEmptyReturn: false }),
    carregarConfig("vendedores", []),
    carregarConfig("spot", []),
    carregarConfig("mkp", []),
    carregarHistorico(),
    carregarConfig("spotBrudamUltimaAtualizacao", ""),
  ]);

  anttTable = antt;
  // Migração: cadastros salvos antes do campo "nome" existir ganham o nome padrão do eixo.
  anttTable.forEach((row) => {
    if (!row.nome) row.nome = NOMES_PADRAO_EIXOS[row.eixos] || "";
  });
  veiculosTable = veiculos;
  vendaParams = venda;
  icmsTable = icms;
  // Migração: quem salvou a aba ICMS antes de existir a tabela oficial ficou com cadastro
  // vazio — nesse caso, preenche com a tabela oficial em vez de deixar sem nenhuma alíquota.
  if (!Array.isArray(icmsTable) || icmsTable.length === 0) icmsTable = structuredClone(DEFAULT_ICMS);
  ajusteKmPct = ajusteKm;
  orsApiKey = ors;
  qualpApiKey = qualp;
  anttConfig = anttCfg;
  vendedoresTable = vendedores;
  spotTable = spot;
  mkpTable = mkp;
  historicoCotacoes = historico;
  spotBrudamUltimaAtualizacao = brudamData;
}

/* ============================================================
   Estado do último cálculo (usado pela aba de venda / painel)
   ============================================================ */
const state = {
  kmDistancia: 0,
  pedagio: 0,
  custoAntt: 0,
  custoAprox: 0,
  custoSpot: null,
  spotDisponivel: false,
  custoEfetivo: null,
  servicoAdicionalDescricao: "",
  servicoAdicionalValor: 0,
  ufOrigem: "",
  ufDestino: "",
  origemLat: null,
  origemLon: null,
  valorMercadoria: 0,
  // Detalhes do custo ANTT (preenchidos em calcular())
  eixos: null,
  anttNome: "",
  anttFonte: "cadastro", // "cadastro" ou "api"
  anttCcd: 0,
  anttCc: 0,
  anttFreightCost: null,
  anttLoadUnloadCost: null,
  anttResolucao: null,
  // Detalhes do custo Aproximado/Mercado
  veiculoTipo: "",
  veiculoValorKm: 0,
  aproxFonte: "km", // "km" ou "spot"
  aproxSpotValor: null,
  // Detalhes da rota/KM (preenchidos em aplicarAjusteEExibir())
  fonteKm: null,
  kmBruto: null,
  ajusteKmPct: 0,
  // Detalhes da composição (preenchidos em atualizarComposicao())
  mkp: null,
  mkpNome: "",
  pctCustoFixo: 0,
  pctImpostos: 0,
  pctMargem: 0,
  pctComissao: 0,
  pctAdvalorem: 0,
  advalorem: 0,
  aliquotaIcms: null,
  fonteIcms: "",
  compAntt: null,
  compMerc: null,
  compSpot: null,
};

/* ============================================================
   Utilidades
   ============================================================ */
const fmtBRL = (v) => (Number(v) || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const fmtNum = (v, dec = 1) => (Number(v) || 0).toLocaleString("pt-BR", { minimumFractionDigits: dec, maximumFractionDigits: dec });
const $ = (id) => document.getElementById(id);
const onlyDigits = (s) => (s || "").replace(/\D/g, "");

function toRad(deg) { return (deg * Math.PI) / 180; }
function haversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/* ============================================================
   Tabs (inclui os menus suspensos "Cadastros" e "Configuração")
   ============================================================ */
const MENUS_SUSPENSOS = [
  { dropdownId: "cadastrosDropdown", toggleId: "btnCadastrosToggle", menuId: "cadastrosMenu" },
  { dropdownId: "calculoDropdown", toggleId: "btnCalculoToggle", menuId: "calculoMenu" },
  { dropdownId: "configDropdown", toggleId: "btnConfigToggle", menuId: "configMenu" },
];

function fecharMenusSuspensos() {
  MENUS_SUSPENSOS.forEach((m) => ($(m.menuId).hidden = true));
}

/** Ativa uma aba pelo nome (data-tab), com ou sem clique num botão do menu — usado tanto
 * pela navegação normal quanto por links internos (ex.: número da cotação → DRE). */
function ativarAba(nomeAba, btnClicado) {
  document.querySelectorAll(".tab-btn[data-tab]").forEach((b) => b.classList.remove("active"));
  document.querySelectorAll(".tab-panel").forEach((p) => p.classList.remove("active"));
  $("tab-" + nomeAba).classList.add("active");

  const referencia = btnClicado || document.querySelector(`.tab-btn[data-tab="${nomeAba}"]`);
  if (referencia) referencia.classList.add("active");

  MENUS_SUSPENSOS.forEach((m) => {
    const ehDesteMenu = referencia ? !!referencia.closest(`#${m.menuId}`) : false;
    $(m.toggleId).classList.toggle("active", ehDesteMenu);
  });
  fecharMenusSuspensos();
}

document.querySelectorAll(".tab-btn[data-tab]").forEach((btn) => {
  btn.addEventListener("click", () => ativarAba(btn.dataset.tab, btn));
});

MENUS_SUSPENSOS.forEach((m) => {
  $(m.toggleId).addEventListener("click", (e) => {
    e.stopPropagation();
    const estavaAberto = !$(m.menuId).hidden;
    fecharMenusSuspensos();
    $(m.menuId).hidden = estavaAberto;
  });
});

document.addEventListener("click", (e) => {
  const dentroDeAlgumMenu = MENUS_SUSPENSOS.some((m) => $(m.dropdownId).contains(e.target));
  if (!dentroDeAlgumMenu) fecharMenusSuspensos();
});

/* ============================================================
   CEP -> Endereço (ViaCEP) -> Coordenadas (Nominatim/OSM)
   Fallback: sem logradouro -> geocodifica o centro da cidade
   ============================================================ */
async function buscarCEP(cep) {
  const clean = onlyDigits(cep);
  if (clean.length !== 8) return { erro: true, motivo: "CEP inválido" };
  try {
    const resp = await fetch(`https://viacep.com.br/ws/${clean}/json/`);
    const data = await resp.json();
    if (data.erro) return { erro: true, motivo: "CEP não encontrado" };
    return {
      erro: false,
      logradouro: data.logradouro || "",
      bairro: data.bairro || "",
      cidade: data.localidade || "",
      uf: data.uf || "",
    };
  } catch (e) {
    return { erro: true, motivo: "Falha ao consultar CEP (verifique internet)" };
  }
}

async function geocodificar(query) {
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=br&q=${encodeURIComponent(query)}`;
    const resp = await fetch(url, { headers: { Accept: "application/json" } });
    const data = await resp.json();
    if (!data || !data.length) return null;
    return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon), label: data[0].display_name };
  } catch (e) {
    return null;
  }
}

/**
 * Busca estruturada do Nominatim (campos separados em vez de uma frase livre).
 * É bem mais confiável que a busca livre: por exemplo, "São Paulo - SP, Brasil"
 * em texto livre pode casar com qualquer lugar cujo nome contenha essas palavras
 * (já aconteceu de resolver para um lugar chamado "Brasil" a 200km de distância),
 * enquanto os parâmetros city/state/country restringem a busca ao município certo.
 */
async function geocodificarEstruturado(params) {
  try {
    const qs = new URLSearchParams({ format: "json", limit: "1", countrycodes: "br", ...params });
    const url = `https://nominatim.openstreetmap.org/search?${qs.toString()}`;
    const resp = await fetch(url, { headers: { Accept: "application/json" } });
    const data = await resp.json();
    if (!data || !data.length) return null;
    return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon), label: data[0].display_name };
  } catch (e) {
    return null;
  }
}

async function geocodificarCidade(cidade, uf) {
  if (!cidade) return null;
  const params = uf ? { city: cidade, state: uf } : { city: cidade };
  return geocodificarEstruturado(params);
}

async function geocodificarEndereco(logradouro, cidade, uf) {
  // Busca estruturada primeiro (sem o bairro, que costuma atrapalhar o casamento da rua)
  const estruturado = await geocodificarEstruturado({ street: logradouro, city: cidade, state: uf });
  if (estruturado) return estruturado;
  // Fallback: busca livre com o texto completo do endereço
  return geocodificar(`${logradouro}, ${cidade} - ${uf}, Brasil`);
}

function separarCidadeUf(texto) {
  // Aceita hífen normal ou travessão (comum em texto colado de outros lugares)
  const m = (texto || "").trim().match(/^(.*?)\s*[-–—]\s*([A-Za-z]{2})$/);
  if (m) {
    const uf = m[2].trim().toUpperCase();
    if (UF_LIST.includes(uf)) return { cidade: m[1].trim(), uf };
  }
  return { cidade: (texto || "").trim(), uf: "" };
}

/**
 * Resolve coordenadas para um lado (origem/destino) a partir do CEP e/ou cidade digitada.
 * Retorna { coords: {lat, lon} | null, precisao: 'endereco'|'cidade'|'manual', mensagem, cidadeResolvida, uf }
 * O "uf" vem da fonte mais confiável (ViaCEP ou o nome da cidade), não de um regex sobre o
 * texto do campo — assim o ICMS continua funcionando mesmo se o campo Cidade não estiver
 * exatamente no formato "Nome - UF" (por exemplo, se o usuário editou o texto manualmente).
 */
async function resolverLocal(cepInputId, cidadeInputId, feedbackId) {
  const feedback = $(feedbackId);
  const cepValor = $(cepInputId).value;
  const cidadeValor = $(cidadeInputId).value.trim();
  const clean = onlyDigits(cepValor);

  feedback.className = "address-feedback";

  if (clean.length === 8) {
    feedback.textContent = "Consultando CEP...";
    const dadosCep = await buscarCEP(clean);
    if (!dadosCep.erro) {
      const cidadeCep = `${dadosCep.cidade} - ${dadosCep.uf}`;
      if (!cidadeValor) $(cidadeInputId).value = cidadeCep;

      if (dadosCep.logradouro) {
        const geo = await geocodificarEndereco(dadosCep.logradouro, dadosCep.cidade, dadosCep.uf);
        if (geo) {
          feedback.textContent = `✓ ${dadosCep.logradouro}, ${dadosCep.bairro} — ${cidadeCep} (endereço)`;
          feedback.classList.add("ok");
          return { coords: geo, precisao: "endereco", cidadeResolvida: cidadeCep, uf: dadosCep.uf };
        }
      }
      // Sem logradouro no CEP OU geocodificação do endereço falhou -> centro da cidade
      const geoCidade = await geocodificarCidade(dadosCep.cidade, dadosCep.uf);
      if (geoCidade) {
        feedback.textContent = `✓ CEP sem endereço detalhado — usando centro de ${cidadeCep}`;
        feedback.classList.add("warn");
        return { coords: geoCidade, precisao: "cidade", cidadeResolvida: cidadeCep, uf: dadosCep.uf };
      }
      feedback.textContent = `CEP válido, mas não foi possível localizar coordenadas de ${cidadeCep}`;
      feedback.classList.add("err");
      return { coords: null, precisao: null, cidadeResolvida: cidadeCep, uf: dadosCep.uf };
    }
    feedback.textContent = dadosCep.motivo + " — tentando pela cidade digitada...";
    feedback.classList.add("warn");
  }

  // Sem CEP válido: usa o nome da cidade digitado como centro
  if (cidadeValor) {
    const { cidade, uf } = separarCidadeUf(cidadeValor);
    const geoCidade = await geocodificarCidade(cidade, uf);
    if (geoCidade) {
      feedback.textContent = `✓ Usando centro de ${cidadeValor} (sem CEP)`;
      feedback.classList.add("warn");
      return { coords: geoCidade, precisao: "cidade", cidadeResolvida: cidadeValor, uf };
    }
    feedback.textContent = `Não foi possível localizar "${cidadeValor}"`;
    feedback.classList.add("err");
    return { coords: null, precisao: null, cidadeResolvida: cidadeValor, uf };
  }

  feedback.textContent = "Informe o CEP ou a cidade";
  feedback.classList.add("err");
  return { coords: null, precisao: null, cidadeResolvida: "", uf: "" };
}

/* ============================================================
   Distância rodoviária (OSRM) com fallback linha reta x fator
   Quando há mais de uma rota plausível, pergunta ao usuário
   qual delas deve ser usada.
   ============================================================ */
function formatarDuracao(segundos) {
  const totalMin = Math.round(segundos / 60);
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  if (h === 0) return `${m} min`;
  return m > 0 ? `${h}h ${m}min` : `${h}h`;
}

// Tempo de viagem estimado: velocidade média de 70 km/h + 1h fixa de parada
// (abastecimento, almoço), em vez do tempo "ideal" sem paradas que o OSRM devolve.
function tempoViagemEstimadoSeg(km) {
  const horas = km / 70 + 1;
  return horas * 3600;
}

function escolherRota(routes) {
  return new Promise((resolve) => {
    const overlay = $("rotaModalOverlay");
    const opcoes = $("rotaOpcoes");
    opcoes.innerHTML = "";

    routes.forEach((r, idx) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "rota-opcao";
      btn.innerHTML = `<span class="rota-opcao-titulo">Rota ${idx + 1}${idx === 0 ? " (sugerida)" : ""}</span>
        <span class="rota-opcao-detalhe">${fmtNum(r.distance / 1000, 1)} km &middot; ${formatarDuracao(tempoViagemEstimadoSeg(r.distance / 1000))} de viagem</span>`;
      btn.addEventListener("click", () => {
        overlay.hidden = true;
        resolve(r);
      });
      opcoes.appendChild(btn);
    });

    overlay.hidden = false;
    $("btnCancelarRota").onclick = () => {
      overlay.hidden = true;
      resolve(null);
    };
  });
}

/**
 * Rota de caminhão via OpenRouteService (perfil HGV), quando o usuário cadastrou
 * uma chave gratuita na aba "Rota". Já considera restrições de veículo pesado,
 * então não depende de um "% de ajuste" calibrado manualmente por trecho.
 */
async function calcularDistanciaOrsHgv(origem, destino, apiKey) {
  try {
    // Endpoint "/geojson" traz a geometria da rota já pronta pro mapa (coordinates em
    // [lon, lat], padrão GeoJSON), sem precisar decodificar polyline.
    const resp = await fetch("https://api.openrouteservice.org/v2/directions/driving-hgv/geojson", {
      method: "POST",
      headers: { Authorization: apiKey, "Content-Type": "application/json" },
      body: JSON.stringify({
        coordinates: [
          [origem.lon, origem.lat],
          [destino.lon, destino.lat],
        ],
      }),
    });
    if (!resp.ok) return null;
    const data = await resp.json();
    const feature = data && data.features && data.features[0];
    const resumo = feature && feature.properties && feature.properties.summary;
    if (!resumo || typeof resumo.distance !== "number") return null;
    const km = resumo.distance / 1000;
    const coords = (feature.geometry && feature.geometry.coordinates) || [];
    const geometria = coords.map(([lon, lat]) => [lat, lon]);
    return { km, duracaoSeg: tempoViagemEstimadoSeg(km), fonte: "rota-caminhao", geometria };
  } catch (e) {
    return null;
  }
}

/**
 * Rota + pedágio via API QualP (mesmo motor do site), quando o usuário cadastrou uma
 * chave paga na aba "Rota". Uma única consulta já traz KM, duração e o pedágio somado
 * (praça a praça, pela quantidade de eixos selecionada) — a fonte mais precisa disponível.
 * Aceita CEP ou "Cidade - UF" direto como origem/destino (sem precisar geocodificar).
 */
async function calcularRotaQualp(origemTexto, destinoTexto, eixos, apiKey) {
  try {
    const resp = await fetch("https://api.qualp.com.br/rotas/v4", {
      method: "POST",
      headers: { "Content-Type": "application/json", "access-token": apiKey },
      body: JSON.stringify({
        locations: [origemTexto, destinoTexto],
        config: { vehicle: { type: "truck", axis: eixos } },
        show: { tolls: true },
      }),
    });
    if (!resp.ok) return null;
    const data = await resp.json();
    if (!data || !data.distancia || typeof data.distancia.valor !== "number") return null;

    const km = data.distancia.valor;
    const duracaoSeg = data.duracao && typeof data.duracao.valor === "number" ? data.duracao.valor : tempoViagemEstimadoSeg(km);
    const pracas = (data.pedagios || []).map((p) => ({
      nome: p.nome,
      uf: p.uf,
      rodovia: p.rodovia,
      valor: (p.tarifa && Number(p.tarifa[String(eixos)])) || 0,
    }));
    const pedagio = pracas.reduce((soma, p) => soma + p.valor, 0);

    return { km, duracaoSeg, pedagio, pracas, fonte: "qualp" };
  } catch (e) {
    return null;
  }
}

function textoLocalParaQualp(cepInputId, cidadeInputId) {
  const cep = onlyDigits($(cepInputId).value);
  if (cep.length === 8) return $(cepInputId).value.trim();
  const cidade = $(cidadeInputId).value.trim();
  return cidade || null;
}

/**
 * Tabela de frete mínimo ANTT oficial via API QualP — valores da resolução vigente para o
 * km e a quantidade de eixos informados, sem depender de cadastro manual de CCD/CC.
 */
async function calcularAnttQualp(km, eixos, apiKey) {
  try {
    const resp = await fetch("https://api.qualp.com.br/tabela-frete/v1", {
      method: "POST",
      headers: { "Content-Type": "application/json", "access-token": apiKey },
      body: JSON.stringify({
        distance: km,
        axis: eixos,
        freight_type: anttConfig.freightType,
        load_type: anttConfig.loadType,
        is_empty_return: !!anttConfig.isEmptyReturn,
      }),
    });
    if (!resp.ok) return null;
    const data = await resp.json();
    const custos = data && data.costs;
    if (!custos || typeof custos.freight_cost !== "number") return null;
    return {
      freightCost: custos.freight_cost,
      loadUnloadCost: Number(custos.load_unload_cost) || 0,
      resolucao: data.antt_resolution ? data.antt_resolution.name : null,
    };
  } catch (e) {
    return null;
  }
}

async function calcularDistanciaRodoviaria(origem, destino) {
  if (orsApiKey) {
    const resultadoOrs = await calcularDistanciaOrsHgv(origem, destino, orsApiKey);
    if (resultadoOrs) return resultadoOrs;
    // Chave ausente/inválida ou serviço fora do ar: cai para o OSRM abaixo, sem travar o cálculo.
  }
  try {
    // "geometries=geojson" traz o traçado da rota (coordinates em [lon, lat]) pro mapa,
    // além da distância que já era usada.
    const url = `https://router.project-osrm.org/route/v1/driving/${origem.lon},${origem.lat};${destino.lon},${destino.lat}?overview=full&geometries=geojson&alternatives=true`;
    const resp = await fetch(url);
    const data = await resp.json();
    if (data && data.routes && data.routes.length) {
      let rota = data.routes[0];
      if (data.routes.length > 1) {
        const escolhida = await escolherRota(data.routes);
        if (escolhida) rota = escolhida;
      }
      const km = rota.distance / 1000;
      const coords = (rota.geometry && rota.geometry.coordinates) || [];
      const geometria = coords.map(([lon, lat]) => [lat, lon]);
      return { km, duracaoSeg: tempoViagemEstimadoSeg(km), fonte: "rota", geometria };
    }
  } catch (e) {
    /* ignora e cai no fallback */
  }
  const reta = haversineKm(origem.lat, origem.lon, destino.lat, destino.lon);
  const km = reta * 1.3;
  return { km, duracaoSeg: tempoViagemEstimadoSeg(km), fonte: "estimativa", geometria: [[origem.lat, origem.lon], [destino.lat, destino.lon]] };
}

/** Com múltiplos pontos de entrega: soma o KM real trecho a trecho na ordem Origem → mais
 * perto → ... → mais distante (pontosOrdenados já vem nessa ordem, ver calcularDestinoAtivo),
 * em vez da distância direta Origem→mais distante — fica mais perto do trajeto real quando
 * há entregas no meio do caminho. Concatena as geometrias de cada trecho (sem duplicar o
 * ponto de junção) pro Mapa da Rota desenhar o trajeto completo, não só uma linha reta. */
async function calcularKmMultiTrecho(origemCoords, pontosOrdenados) {
  let kmTotal = 0;
  let geometriaTotal = [];
  const fontesUsadas = [];
  let pontoAnterior = origemCoords;
  for (const ponto of pontosOrdenados) {
    const resultado = await calcularDistanciaRodoviaria(pontoAnterior, { lat: ponto.lat, lon: ponto.lon });
    kmTotal += resultado.km;
    fontesUsadas.push(resultado.fonte);
    if (resultado.geometria && resultado.geometria.length) {
      geometriaTotal = geometriaTotal.length ? geometriaTotal.concat(resultado.geometria.slice(1)) : resultado.geometria.slice();
    }
    pontoAnterior = { lat: ponto.lat, lon: ponto.lon };
  }
  const fonte = fontesUsadas.includes("estimativa")
    ? "estimativa"
    : fontesUsadas.every((f) => f === fontesUsadas[0])
    ? fontesUsadas[0]
    : "rota-caminhao";
  return { km: kmTotal, fonte, geometria: geometriaTotal.length ? geometriaTotal : null };
}

// Guarda o último KM bruto (antes do ajuste) e sua fonte, para recalcular na hora
// quando o usuário mexer no % de ajuste, sem precisar refazer a consulta de rota.
let ultimoKmBruto = null;
let ultimaFonteKm = null;
// Traçado real da rota (lista de [lat, lon]), quando a fonte devolve geometria (OSRM/ORS).
// null quando a fonte não traz geometria (QualP) ou a rota ainda não foi calculada — nesse
// caso o Mapa da Rota cai pra linha reta entre Origem e Destino.
let ultimaRotaGeometria = null;

function aplicarAjusteEExibir() {
  if (ultimoKmBruto === null) return;
  const kmFinal = ultimoKmBruto * (1 + ajusteKmPct / 100);
  const duracaoFinal = tempoViagemEstimadoSeg(kmFinal);
  $("kmDistancia").value = kmFinal.toFixed(1);

  state.fonteKm = ultimaFonteKm;
  state.kmBruto = ultimoKmBruto;
  state.ajusteKmPct = ajusteKmPct;

  const ajusteTxto = ajusteKmPct ? ` (${fmtNum(ultimoKmBruto, 1)} km ${ajusteKmPct > 0 ? "+" : ""}${fmtNum(ajusteKmPct, 1)}% de ajuste)` : "";
  const dur = ` (~${formatarDuracao(duracaoFinal)} de viagem)`;
  const mensagens = {
    qualp: `Distância e pedágio calculados via API QualP${ajusteTxto}${dur}.`,
    "rota-caminhao": `Distância calculada com perfil de caminhão (OpenRouteService/HGV)${ajusteTxto}${dur}.`,
    rota: `Distância rodoviária calculada automaticamente${ajusteTxto}${dur}.`,
    estimativa: `Estimativa (linha reta × fator de estrada) — rota indisponível no momento${ajusteTxto}${dur}.`,
  };
  $("kmInfo").textContent = mensagens[ultimaFonteKm] || mensagens.estimativa;
  calcular();
  atualizarMapa();
}

/* ============================================================
   Mapa da Rota (Leaflet + OpenStreetMap) — mostra Origem, Destino (ponto
   mais distante) e os pontos de entrega adicionais como bandeirinhas.
   Linhas retas entre os pontos, só de referência (não seguem a estrada).
   ============================================================ */
let mapaLeaflet = null;
let mapaCamadaMarcadores = null;
let ultimoOrigemMapa = null;
let ultimoDestinoMapa = null;

function inicializarMapaSeNecessario() {
  if (mapaLeaflet || typeof L === "undefined") return;
  mapaLeaflet = L.map("mapaRota");
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 18,
  }).addTo(mapaLeaflet);
  mapaCamadaMarcadores = L.layerGroup().addTo(mapaLeaflet);
}

function iconeMapaEmoji(emoji) {
  return L.divIcon({
    html: `<span style="font-size:26px; line-height:1;">${emoji}</span>`,
    className: "mapa-icone-emoji",
    iconSize: [28, 28],
    iconAnchor: [14, 26],
    popupAnchor: [0, -26],
  });
}

/** Redesenha o Mapa da Rota com os pontos do último cálculo de KM (origem, destino e, se
 * houver, os pontos de entrega adicionais que não foram o mais distante). */
function atualizarMapa() {
  if (!$("mapaRota") || $("resultsCard").hidden) return;
  if (!ultimoOrigemMapa || !ultimoDestinoMapa) return;

  inicializarMapaSeNecessario();
  if (!mapaLeaflet) return; // Leaflet não carregou (ex.: sem internet no momento)

  mapaCamadaMarcadores.clearLayers();
  const pontosParaEnquadrar = [];

  const origemLatLon = [ultimoOrigemMapa.lat, ultimoOrigemMapa.lon];
  L.marker(origemLatLon, { icon: iconeMapaEmoji("🟢") })
    .addTo(mapaCamadaMarcadores)
    .bindPopup(`<b>Origem</b><br>${ultimoOrigemMapa.label}`);
  pontosParaEnquadrar.push(origemLatLon);

  // Com o trajeto real disponível (soma trecho a trecho, ver calcularKmMultiTrecho), a linha
  // azul abaixo já passa pelas paradas — a linha tracejada de referência só faz sentido
  // quando não há traçado real (cai numa linha reta Origem→Destino).
  const temRotaReal = ultimaRotaGeometria && ultimaRotaGeometria.length > 1;

  const destinoNorm = normalizeStr(ultimoDestinoMapa.label);
  ultimosCandidatosDestinoGeo
    .filter((c) => normalizeStr(c.texto) !== destinoNorm)
    .forEach((p) => {
      const latlon = [p.lat, p.lon];
      L.marker(latlon, { icon: iconeMapaEmoji("🚩") })
        .addTo(mapaCamadaMarcadores)
        .bindPopup(`<b>Parada</b><br>${p.texto}`);
      if (!temRotaReal) {
        // Linha fina tracejada só de referência, ligando a origem à parada (não é a rota real).
        L.polyline([origemLatLon, latlon], { color: "#8a94a6", weight: 2, dashArray: "4 6", opacity: 0.6 }).addTo(mapaCamadaMarcadores);
      }
      pontosParaEnquadrar.push(latlon);
    });

  const destinoLatLon = [ultimoDestinoMapa.lat, ultimoDestinoMapa.lon];
  L.marker(destinoLatLon, { icon: iconeMapaEmoji("🏁") })
    .addTo(mapaCamadaMarcadores)
    .bindPopup(`<b>Destino</b><br>${ultimoDestinoMapa.label}`);
  pontosParaEnquadrar.push(destinoLatLon);

  // Traçado real da rota (rodoviário), quando a fonte do KM trouxe a geometria (OSRM/ORS) —
  // com múltiplos pontos, já é o trajeto completo por todos eles. Sem geometria disponível
  // (ex.: fonte QualP), cai numa linha reta só de referência.
  if (temRotaReal) {
    L.polyline(ultimaRotaGeometria, { color: "#1d5db1", weight: 4, opacity: 0.85 }).addTo(mapaCamadaMarcadores);
    pontosParaEnquadrar.push(...ultimaRotaGeometria);
  } else {
    L.polyline([origemLatLon, destinoLatLon], { color: "#1d5db1", weight: 3, dashArray: "6 8", opacity: 0.75 }).addTo(mapaCamadaMarcadores);
  }

  mapaLeaflet.fitBounds(pontosParaEnquadrar, { padding: [30, 30], maxZoom: 12 });
  setTimeout(() => mapaLeaflet && mapaLeaflet.invalidateSize(), 150);
}

$("ajusteKm").addEventListener("input", async () => {
  ajusteKmPct = parseFloat($("ajusteKm").value) || 0;
  await salvarConfig("ajusteKm", ajusteKmPct);
  aplicarAjusteEExibir();
});

/* ============================================================
   Múltiplos pontos de entrega (botão "+" no Destino)
   Cada ponto fica sempre exatamente onde foi digitado — a ordem nunca muda e
   nenhum campo é sobrescrito. A distância considerada para o cálculo é a do
   trecho mais longo (Origem → ponto mais distante), decidida à parte e
   guardada nos campos ocultos cepDestinoAtivo/cidadeDestinoAtivo, que passam
   a alimentar o resto do app (SPOT, composição, DRE, histórico). Sem pontos
   extras, esses campos ocultos ficam vazios e tudo usa "cepDestino"/
   "cidadeDestino" normalmente, exatamente como sempre foi.
   ============================================================ */
let pontosEntregaExtrasCount = 0;

function adicionarPontoEntregaExtra() {
  const idx = pontosEntregaExtrasCount++;
  const div = document.createElement("div");
  div.className = "destino-extra-group";
  div.dataset.idx = idx;
  div.innerHTML = `
    <div class="destino-extra-row">
      <input type="text" id="destinoExtraCep${idx}" class="destino-extra-cep" placeholder="00000-000" maxlength="9" inputmode="numeric">
      <div class="autocomplete-wrap">
        <input type="text" id="destinoExtraCidade${idx}" autocomplete="off" placeholder="Digite a cidade do ponto de entrega adicional">
        <ul class="autocomplete-list" hidden></ul>
      </div>
      <button type="button" class="btn-remove" title="Remover">&times;</button>
    </div>
    <div class="address-feedback" id="destinoExtraFeedback${idx}"></div>
  `;
  $("destinosExtrasContainer").appendChild(div);

  const cepEl = div.querySelector(`#destinoExtraCep${idx}`);
  const cidadeEl = div.querySelector(`#destinoExtraCidade${idx}`);
  const listEl = div.querySelector(".autocomplete-list");
  mascararCEP(cepEl, cidadeEl.id, `destinoExtraFeedback${idx}`);
  configurarAutocompleteCidadeElementos(cidadeEl, listEl, () => tentarAutoCalculoKm());
  div.querySelector(".btn-remove").addEventListener("click", () => {
    div.remove();
    recalcularSeJaTiverResultado();
  });
}

$("btnAddDestino").addEventListener("click", () => adicionarPontoEntregaExtra());

/** Lê os pontos extras exatamente como estão na tela, sem alterar nada. */
function listarPontosEntregaExtras() {
  return [...document.querySelectorAll("#destinosExtrasContainer .destino-extra-group")]
    .map((div) => ({
      cep: $(`destinoExtraCep${div.dataset.idx}`).value.trim(),
      cidade: $(`destinoExtraCidade${div.dataset.idx}`).value.trim(),
    }))
    .filter((p) => p.cidade);
}

function limparPontosEntregaExtras() {
  $("destinosExtrasContainer").innerHTML = "";
  pontosEntregaExtrasCount = 0;
  $("cepDestinoAtivo").value = "";
  $("cidadeDestinoAtivo").value = "";
  $("destinoAtivoInfo").textContent = "";
}

/** Coordenadas de cada candidato a destino geocodificado na última chamada de
 * calcularDestinoAtivo (inclui o vencedor) — reaproveitado pelo Mapa da Rota, pra não
 * geocodificar tudo de novo só pra desenhar os marcadores. */
let ultimosCandidatosDestinoGeo = [];

/** Entre a origem e todos os candidatos a destino (o campo "Cidade Destino" + os pontos
 * extras — nenhum deles é lido de forma destrutiva), geocodifica cada um, ordena do mais
 * perto pro mais longe (linha reta até a Origem, só pra ordenar) e grava o mais distante nos
 * campos ocultos cepDestinoAtivo/cidadeDestinoAtivo — ele continua sendo o "destino ativo"
 * (SPOT, ANTT, histórico). Se o campo "Cidade Destino" original já é o mais distante (ou não
 * há pontos extras), os campos ocultos ficam vazios e nada muda no restante do cálculo.
 * Devolve a lista ordenada (com lat/lon), usada pra somar o KM trecho a trecho. */
async function calcularDestinoAtivo(origemCoords) {
  $("cepDestinoAtivo").value = "";
  $("cidadeDestinoAtivo").value = "";
  $("destinoAtivoInfo").textContent = "";
  ultimosCandidatosDestinoGeo = [];

  const extras = listarPontosEntregaExtras();
  if (!extras.length || !origemCoords) return [];

  const principal = { cep: $("cepDestino").value.trim(), cidade: $("cidadeDestino").value.trim() };
  const candidatos = [principal, ...extras].filter((c) => c.cidade);
  if (candidatos.length < 2) return [];

  const geocodificados = [];
  for (const cand of candidatos) {
    const { cidade, uf } = separarCidadeUf(cand.cidade);
    const geo = await geocodificarCidade(cidade || cand.cidade, uf);
    if (!geo) continue;
    ultimosCandidatosDestinoGeo.push({ texto: cand.cidade, lat: geo.lat, lon: geo.lon });
    const dist = haversineKm(origemCoords.lat, origemCoords.lon, geo.lat, geo.lon);
    geocodificados.push({ ...cand, lat: geo.lat, lon: geo.lon, dist });
  }
  geocodificados.sort((a, b) => a.dist - b.dist);

  const vencedor = geocodificados[geocodificados.length - 1];
  if (vencedor && vencedor.cidade !== principal.cidade) {
    $("cepDestinoAtivo").value = vencedor.cep;
    $("cidadeDestinoAtivo").value = vencedor.cidade;
    $("destinoAtivoInfo").textContent = `✓ Múltiplos pontos de entrega — considerando o mais distante: ${vencedor.cidade}`;
  }

  return geocodificados;
}

/** IDs do CEP/Cidade que devem alimentar o cálculo: os campos ocultos calculados quando um
 * ponto extra é o mais distante, ou os campos normais "cepDestino"/"cidadeDestino" caso
 * contrário (sem pontos extras, ou quando o campo principal já é o mais distante). */
function idsDestinoAtivo() {
  return $("cidadeDestinoAtivo").value.trim()
    ? { cep: "cepDestinoAtivo", cidade: "cidadeDestinoAtivo" }
    : { cep: "cepDestino", cidade: "cidadeDestino" };
}

/** Texto da cidade/CEP realmente usados no cálculo (ponto mais distante), para SPOT e para
 * salvar a cotação — sem depender de resolverLocal já ter rodado. */
function textoDestinoAtivo() {
  return $("cidadeDestinoAtivo").value.trim() || $("cidadeDestino").value.trim();
}
function cepDestinoAtivoValor() {
  return $("cidadeDestinoAtivo").value.trim() ? $("cepDestinoAtivo").value.trim() : $("cepDestino").value.trim();
}

/** Todos os pontos de entrega digitados (campo "Cidade Destino" + extras), exatamente como
 * estão na tela. Usado só para montar a lista a salvar — nunca para alterar a tela. */
function listarTodosPontosEntrega() {
  const principal = { cep: $("cepDestino").value.trim(), cidade: $("cidadeDestino").value.trim() };
  return [principal, ...listarPontosEntregaExtras()].filter((p) => p.cidade);
}

/** Pontos de entrega a salvar como "extras": todos os digitados MENOS o que foi usado no
 * cálculo (esse já fica registrado em "destino") — assim nenhum ponto se perde e nenhum
 * aparece duplicado. */
function pontosEntregaExtrasParaSalvar() {
  const ativo = textoDestinoAtivo();
  return listarTodosPontosEntrega().filter((p) => p.cidade !== ativo);
}

let calculandoKm = false;
async function executarCalculoKm() {
  if (calculandoKm) return;
  calculandoKm = true;
  const btn = $("btnCalcularKm");
  const info = $("kmInfo");
  const textoOriginal = btn.textContent;
  btn.disabled = true;
  btn.textContent = "Calculando...";
  info.textContent = "";
  $("pedagioInfo").textContent = "";
  try {
    let origem, destino, idsDestino, pontosOrdenados;
    if (listarPontosEntregaExtras().length === 0) {
      // Caminho normal (sem pontos de entrega extras): resolve os dois lados em paralelo,
      // exatamente como sempre foi.
      [origem, destino] = await Promise.all([
        resolverLocal("cepOrigem", "cidadeOrigem", "feedbackOrigem"),
        resolverLocal("cepDestino", "cidadeDestino", "feedbackDestino"),
      ]);
      idsDestino = { cep: "cepDestino", cidade: "cidadeDestino" };
      pontosOrdenados = [];
    } else {
      // Com pontos extras, precisa da origem primeiro pra ordenar os pontos do mais perto pro
      // mais distante (sem alterar nenhum campo visível) — o mais distante continua sendo o
      // "destino ativo" (via os campos ocultos); o KM soma o trajeto real por todos eles.
      origem = await resolverLocal("cepOrigem", "cidadeOrigem", "feedbackOrigem");
      pontosOrdenados = await calcularDestinoAtivo(origem.coords);
      idsDestino = idsDestinoAtivo();
      destino = await resolverLocal(idsDestino.cep, idsDestino.cidade, "feedbackDestino");
    }
    const multiTrecho = pontosOrdenados.length > 1 && origem.coords;
    state.ufOrigem = origem.uf || "";
    state.ufDestino = destino.uf || "";
    state.origemLat = origem.coords ? origem.coords.lat : null;
    state.origemLon = origem.coords ? origem.coords.lon : null;
    atualizarComposicao();

    // Guarda os pontos pro Mapa da Rota (desenhado em aplicarAjusteEExibir, já com o KM final).
    const destinoLabelMapa = idsDestino.cidade === "cidadeDestino" ? $("cidadeDestino").value.trim() : $("cidadeDestinoAtivo").value.trim();
    ultimoOrigemMapa = origem.coords ? { lat: origem.coords.lat, lon: origem.coords.lon, label: origem.cidadeResolvida || $("cidadeOrigem").value.trim() } : null;
    ultimoDestinoMapa = destino.coords ? { lat: destino.coords.lat, lon: destino.coords.lon, label: destino.cidadeResolvida || destinoLabelMapa } : null;

    // 1) API QualP (se configurada): pedágio (sempre do trecho direto Origem→destino ativo,
    // mesmo com múltiplos pontos) e, sem múltiplos pontos, também o KM — a fonte mais
    // precisa, pois usa o mesmo motor de rota e a mesma base de praças do site da QualP.
    if (qualpApiKey) {
      const origemTxt = textoLocalParaQualp("cepOrigem", "cidadeOrigem");
      const destinoTxt = textoLocalParaQualp(idsDestino.cep, idsDestino.cidade);
      if (origemTxt && destinoTxt) {
        const eixosAtual = parseInt($("qtdEixos").value, 10) || 2;
        const resultadoQualp = await calcularRotaQualp(origemTxt, destinoTxt, eixosAtual, qualpApiKey);
        if (resultadoQualp) {
          $("pedagio").value = resultadoQualp.pedagio.toFixed(2);
          $("pedagioInfo").textContent = resultadoQualp.pracas.length
            ? `${resultadoQualp.pracas.length} praça(s) via QualP: ${resultadoQualp.pracas.map((p) => `${p.nome}-${p.uf} (${fmtBRL(p.valor)})`).join(", ")}`
            : "Nenhuma praça de pedágio detectada no trajeto (via QualP).";

          if (!multiTrecho) {
            ultimoKmBruto = resultadoQualp.km;
            ultimaFonteKm = "qualp";
            // A API QualP não devolve a geometria da rota — o mapa cai pra linha reta nesse caso.
            ultimaRotaGeometria = null;
            aplicarAjusteEExibir();
            calcular();
            return;
          }
          // Com múltiplos pontos, o pedágio acima já é o do trecho direto — o KM vem do
          // somatório trecho a trecho logo abaixo, então ainda não retorna.
        } else {
          info.textContent = "Chave QualP configurada, mas a consulta falhou — usando OpenRouteService/OSRM.";
        }
      }
    }

    if (multiTrecho) {
      const resultado = await calcularKmMultiTrecho(origem.coords, pontosOrdenados);
      ultimoKmBruto = resultado.km;
      ultimaFonteKm = resultado.fonte;
      ultimaRotaGeometria = resultado.geometria;
      aplicarAjusteEExibir();
      return;
    }

    if (!origem.coords || !destino.coords) {
      info.textContent = "Não foi possível calcular: verifique CEP/cidade de origem e destino.";
      return;
    }
    const resultado = await calcularDistanciaRodoviaria(origem.coords, destino.coords);
    ultimoKmBruto = resultado.km;
    ultimaFonteKm = resultado.fonte;
    ultimaRotaGeometria = resultado.geometria || null;
    aplicarAjusteEExibir();
  } finally {
    btn.disabled = false;
    btn.textContent = textoOriginal;
    calculandoKm = false;
  }
}

$("btnCalcularKm").addEventListener("click", executarCalculoKm);

/** Abre o QualP numa aba nova já com Origem/Destino/Eixos preenchidos (via userscript
 * do Tampermonkey instalado no navegador — sem isso instalado, só abre a página normal
 * do QualP vazia). Não calcula pedágio sozinho: fica só o botão CALCULAR lá pro usuário
 * apertar, como conferência manual da rota. */
$("btnAbrirQualp").addEventListener("click", () => {
  const origem = $("cidadeOrigem").value.trim();
  const destino = $("cidadeDestino").value.trim();
  const eixos = parseInt($("qtdEixos").value, 10);
  if (!origem || !destino) {
    alert("Preencha Origem e Destino antes de abrir no QualP.");
    return;
  }
  const url = new URL("https://qualp.com.br/");
  url.searchParams.set("autoOrigem", origem);
  url.searchParams.set("autoDestino", destino);
  if (eixos) url.searchParams.set("autoEixos", String(eixos));
  window.open(url.toString() + "#/", "_blank");
});

/** Recalcula os custos na hora se já existir um resultado na tela (evita mostrar um
 * resultado "do nada", com R$0,00, antes do primeiro clique em "Calcular Custos"). */
function recalcularSeJaTiverResultado() {
  if (!$("resultsCard").hidden) calcular();
}

$("qtdEixos").addEventListener("change", () => {
  // Com QualP configurado, o pedágio muda por eixo — refaz a consulta de rota/pedágio,
  // que já recalcula os custos no final. Sem QualP, só precisa recalcular com o KM atual.
  if (qualpApiKey) tentarAutoCalculoKm();
  else recalcularSeJaTiverResultado();
});
$("tipoVeiculo").addEventListener("change", recalcularSeJaTiverResultado);
$("servicoAdicionalValor").addEventListener("input", recalcularSeJaTiverResultado);

/* Dispara o cálculo de KM automaticamente assim que origem e destino
   estiverem preenchidos (via CEP ou seleção no autocomplete de cidade). */
let autoCalcTimer;
function tentarAutoCalculoKm() {
  const origemPronta = onlyDigits($("cepOrigem").value).length === 8 || $("cidadeOrigem").value.trim().length > 2;
  const destinoPronta = onlyDigits($("cepDestino").value).length === 8 || $("cidadeDestino").value.trim().length > 2;
  if (!origemPronta || !destinoPronta) return;
  clearTimeout(autoCalcTimer);
  autoCalcTimer = setTimeout(executarCalculoKm, 300);
}

/* ============================================================
   Selects: eixos (do cadastro ANTT) e tipo de veículo
   ============================================================ */
function preencherSelects() {
  const selEixos = $("qtdEixos");
  const eixoAtual = selEixos.value;
  selEixos.innerHTML = anttTable
    .map((r) => `<option value="${r.eixos}">${r.eixos} eixos${r.nome ? " — " + r.nome : ""}</option>`)
    .join("");
  if (eixoAtual && anttTable.some((r) => String(r.eixos) === eixoAtual)) selEixos.value = eixoAtual;

  const selVeiculo = $("tipoVeiculo");
  const veiculoAtual = selVeiculo.value;
  selVeiculo.innerHTML = veiculosTable
    .map((v) => `<option value="${v.tipo}">${v.tipo}</option>`)
    .join("");
  if (veiculoAtual && veiculosTable.some((v) => v.tipo === veiculoAtual)) selVeiculo.value = veiculoAtual;
}

/* ============================================================
   Cálculo principal
   ============================================================ */
// MKP = 1 - (soma de Custo Fixo + Impostos + Margem + Comissão / 100). Ad Valorem não entra
// nessa soma — é aplicado à parte, sobre o valor da mercadoria. Mesma fórmula tanto pro
// cadastro "Padrão" (aba Parâmetros de Venda) quanto pra cada MKP cadastrado abaixo dele.
function mkpDePercentuais(p) {
  const soma = (Number(p.pctCustoFixo) || 0) + (Number(p.pctImpostos) || 0) + (Number(p.pctMargem) || 0) + (Number(p.pctComissao) || 0);
  const mkp = 1 - soma / 100;
  return { soma, mkp: mkp > 0 ? mkp : null };
}

function calcularMkp() {
  return mkpDePercentuais(vendaParams);
}

/** Cenário de venda em uso na Calculadora: o "Padrão" (percentuais da aba Parâmetros de
    Venda) ou um dos MKPs cadastrados, conforme o seletor "MKP aplicado nesta cotação"
    (abaixo da Composição do Valor do Frete) — traz consigo os mesmos campos do Padrão
    (Custo Fixo/Impostos/Margem/Comissão/Ad Valorem), pro DRE também refletir o cenário
    escolhido. Nunca muda o cadastro Padrão — só troca o que é usado nesta cotação. */
/** Nome do MKP Padrão mostrado no seletor e em qualquer lugar que registre qual MKP foi
    usado — "MKP - 0,76", sempre com o valor atual calculado dos percentuais. */
function nomeMkpPadrao() {
  const { mkp } = calcularMkp();
  return `MKP - ${mkp ? fmtNum(mkp, 2) : "indefinido"}`;
}

function mkpAtivo() {
  const idx = $("mkpSelecionado").value;
  if (idx !== "") {
    const escolhido = mkpTable[parseInt(idx, 10)];
    if (escolhido) return { ...escolhido, ...mkpDePercentuais(escolhido), nome: escolhido.nome, ehPadrao: false };
  }
  return { ...vendaParams, ...calcularMkp(), nome: nomeMkpPadrao(), ehPadrao: true };
}

/* ------------------------------------------------------------
   ICMS interestadual: regra padrão (Resolução SF 22/89) + cadastro
   de exceções (icmsTable), usado para o cálculo "por dentro".
   ------------------------------------------------------------ */
function regraInterestadualIcms(ufOrigem, ufDestino) {
  if (!ufOrigem || !ufDestino || ufOrigem === ufDestino) return null;
  if (UF_SUL_SUDESTE_EXCETO_ES.includes(ufOrigem) && UF_DESTINO_ALIQUOTA_REDUZIDA.includes(ufDestino)) {
    return 7;
  }
  return 12;
}

function obterAliquotaIcms(ufOrigem, ufDestino) {
  if (!ufOrigem || !ufDestino) {
    return { aliquota: null, fonte: "informe origem e destino com UF (CEP ou cidade selecionada na lista)" };
  }
  const cadastro = icmsTable.find((r) => r.ufOrigem === ufOrigem && r.ufDestino === ufDestino);
  if (cadastro) return { aliquota: Number(cadastro.aliquota) || 0, fonte: "tabela ICMS" };
  // Fallback de segurança: só é usado se a combinação de UF tiver sido removida da tabela.
  const regra = regraInterestadualIcms(ufOrigem, ufDestino);
  if (regra !== null) return { aliquota: regra, fonte: "regra padrão (Resolução SF 22/89)" };
  return { aliquota: null, fonte: `${ufOrigem} → ${ufDestino} não está na tabela ICMS — cadastre a alíquota na aba ICMS` };
}

/* ------------------------------------------------------------
   Cálculo principal: custo da operação + composição do frete
   (Frete Peso + Ad Valorem + Pedágio, com ICMS "por dentro")
   ------------------------------------------------------------ */
/** Mostra um aviso destacado sobre a disponibilidade de SPOT para este trecho, para deixar
 * claro para quem está cotando se o quadro SPOT tem valor cadastrado ou não. */
function atualizarSpotInfoBox(spot, km, viaHub) {
  const box = $("spotInfoBox");
  box.hidden = false;
  if (spot) {
    box.className = "spot-info-box ok";
    box.textContent = viaHub
      ? "✓ Valor SPOT aplicado via hub Itajaí - SC (origem no raio de 50 km) — tabela com assertividade de 100% para trechos acima de 600 km."
      : "✓ Valor SPOT cadastrado para este trecho e veículo — tabela com assertividade de 100% para trechos acima de 600 km.";
  } else {
    box.className = "spot-info-box warn";
    box.textContent = "⚠ Sem valor SPOT cadastrado para este trecho — apenas o Custo ANTT e o Custo por KM estão disponíveis, sem apresentação de valores pela controladoria de SPOT.";
  }
}

let calculoAnttSeq = 0;
async function calcular() {
  const km = parseFloat($("kmDistancia").value) || 0;
  const pedagio = parseFloat($("pedagio").value) || 0;
  const eixos = parseInt($("qtdEixos").value, 10);
  const veiculo = $("tipoVeiculo").value;
  const valorMercadoria = parseFloat($("valorMercadoria").value) || 0;

  const linhaAntt = anttTable.find((r) => r.eixos === eixos) || { ccd: 0, cc: 0, nome: "" };
  const linhaVeiculo = veiculosTable.find((v) => v.tipo === veiculo) || { valorKm: 0 };

  // Serviço Adicional: custo extra (ajudante, seguro, taxa de espera etc.) que soma direto no
  // valor da contratação de ambos os cenários — não é rota nem pedágio, é um custo à parte.
  const servicoAdicionalDescricao = $("servicoAdicionalDescricao").value.trim();
  const servicoAdicionalValor = parseFloat($("servicoAdicionalValor").value) || 0;
  const servicoAdicionalTexto = servicoAdicionalValor
    ? ` + ${fmtBRL(servicoAdicionalValor)} (serviço adicional${servicoAdicionalDescricao ? ": " + servicoAdicionalDescricao : ""})`
    : "";

  // Custo por KM: sempre calculado por R$/km × distância + pedágio, nunca usa o SPOT (que agora
  // tem seu próprio quadro/coluna, ver custoSpot abaixo).
  const custoAprox = linhaVeiculo.valorKm * km + pedagio + servicoAdicionalValor;

  // Custo SPOT: valor fixo negociado para este trecho + veículo, se houver cadastro — mostrado
  // à parte, sem misturar com o Custo por KM, para comparar os três cenários lado a lado.
  // SPOT é Origem → cidade mais distante (o mesmo par usado no KM) — se houver cadastro pra
  // esse par, traz o valor; o aviso abaixo continua pedindo pra somar o custo das entregas
  // adicionais (pontos intermediários podem não estar cobertos pelo valor fechado do SPOT).
  // Sem cadastro exato pra cidade digitada, mas dentro do raio de 50 km de Itajaí/SC ou São
  // Paulo capital, usa o SPOT cadastrado com origem Itajaí - SC pro mesmo destino/veículo.
  const { spot, viaHub: spotViaHub } = buscarSpotComHub(
    $("cidadeOrigem").value,
    textoDestinoAtivo(),
    veiculo,
    state.origemLat,
    state.origemLon
  );
  const custoSpot = spot ? spot.valor + servicoAdicionalValor : null;
  atualizarSpotInfoBox(spot, km, spotViaHub);

  let custoAntt = linhaAntt.ccd * km + linhaAntt.cc + pedagio + servicoAdicionalValor;

  const nomeVeiculoAntt = linhaAntt.nome ? `— ${linhaAntt.nome}` : "";
  const formulaAnttCadastro =
    `(${fmtBRL(linhaAntt.ccd)}/km × ${fmtNum(km)} km) + ${fmtBRL(linhaAntt.cc)} (CC) + ${fmtBRL(pedagio)} (pedágio)${servicoAdicionalTexto} — ${linhaAntt.nome ? linhaAntt.nome + " · " : ""}${eixos} eixos (cadastro manual)`;

  state.kmDistancia = km;
  state.pedagio = pedagio;
  state.custoAntt = custoAntt;
  state.custoAprox = custoAprox;
  state.custoSpot = custoSpot;
  state.spotDisponivel = !!spot;
  state.servicoAdicionalDescricao = servicoAdicionalDescricao;
  state.servicoAdicionalValor = servicoAdicionalValor;
  state.valorMercadoria = valorMercadoria;
  state.eixos = eixos;
  state.anttNome = linhaAntt.nome || "";
  state.anttFonte = "cadastro";
  state.anttCcd = linhaAntt.ccd;
  state.anttCc = linhaAntt.cc;
  state.anttFreightCost = null;
  state.anttLoadUnloadCost = null;
  state.anttResolucao = null;
  state.veiculoTipo = veiculo;
  state.veiculoValorKm = linhaVeiculo.valorKm;
  state.aproxFonte = "km";
  state.aproxSpotValor = spot ? spot.valor : null;

  $("resAntt").textContent = fmtBRL(custoAntt);
  $("resAnttVeiculo").textContent = nomeVeiculoAntt;
  $("resAnttFormula").textContent = formulaAnttCadastro;

  $("resAprox").textContent = fmtBRL(custoAprox);
  $("resAproxFormula").textContent =
    `(${fmtBRL(linhaVeiculo.valorKm)}/km × ${fmtNum(km)} km) + ${fmtBRL(pedagio)} (pedágio)${servicoAdicionalTexto} — ${veiculo}`;

  if (spot) {
    $("resSpot").textContent = fmtBRL(custoSpot);
    $("resSpotFormula").textContent = spotViaHub
      ? `${fmtBRL(spot.valor)} (SPOT de Itajaí - SC, aplicado por origem no raio de 50 km do hub)${servicoAdicionalTexto} — ${veiculo}`
      : `${fmtBRL(spot.valor)} (SPOT cadastrado, sem pedágio)${servicoAdicionalTexto} — ${veiculo}`;
    // SPOT cobre só Origem → o ponto usado no cálculo — com pontos adicionais cadastrados,
    // o valor pode não incluir o custo deles (ex.: paradas intermediárias), então precisa
    // avisar pra somar à parte. Quando vem do hub Itajaí (sem cadastro exato pra cidade
    // digitada), avisa isso também.
    const temEntregasAdicionais = listarPontosEntregaExtras().length > 0;
    const avisos = [];
    if (spotViaHub) {
      avisos.push(`ℹ Sem cadastro exato para "${$("cidadeOrigem").value.trim()}" — usando o SPOT de Itajaí - SC (origem no raio de 50 km do hub).`);
    }
    if (temEntregasAdicionais) {
      avisos.push(`⚠ Este SPOT cobre só Origem → ${textoDestinoAtivo()} (ponto mais distante). Inclua o custo das entregas adicionais em "Serviço Adicional".`);
    }
    $("resSpotAviso").hidden = avisos.length === 0;
    $("resSpotAviso").textContent = avisos.join(" ");
  } else {
    $("resSpot").textContent = "—";
    $("resSpotFormula").textContent = "Sem SPOT cadastrado para este trecho e veículo.";
    $("resSpotAviso").hidden = true;
    $("resSpotAviso").textContent = "";
  }

  atualizarCustoEfetivo();
  $("resultsCard").hidden = false;
  atualizarComposicao();

  // Se houver chave QualP, busca o piso mínimo ANTT oficial (resolução vigente) e substitui
  // o cadastro manual. "Sequência" evita que uma resposta atrasada sobrescreva um cálculo mais novo.
  if (qualpApiKey && km > 0 && eixos >= 2) {
    const minhaSeq = ++calculoAnttSeq;
    const resultadoAntt = await calcularAnttQualp(km, eixos, qualpApiKey);
    if (minhaSeq !== calculoAnttSeq) return; // já rodou outro cálculo depois deste

    if (resultadoAntt) {
      custoAntt = resultadoAntt.freightCost + resultadoAntt.loadUnloadCost + pedagio + servicoAdicionalValor;
      state.custoAntt = custoAntt;
      state.anttFonte = "api";
      state.anttFreightCost = resultadoAntt.freightCost;
      state.anttLoadUnloadCost = resultadoAntt.loadUnloadCost;
      state.anttResolucao = resultadoAntt.resolucao || null;
      $("resAntt").textContent = fmtBRL(custoAntt);
      $("resAnttVeiculo").textContent = `— via API QualP${linhaAntt.nome ? " · " + linhaAntt.nome : ""}`;
      $("resAnttFormula").textContent =
        `${fmtBRL(resultadoAntt.freightCost)} (frete-peso) + ${fmtBRL(resultadoAntt.loadUnloadCost)} (carga/descarga) + ${fmtBRL(pedagio)} (pedágio)${servicoAdicionalTexto} — ${resultadoAntt.resolucao || "ANTT"} · ${eixos} eixos`;
      atualizarCustoEfetivo();
      atualizarComposicao();
    }
  }
}

/** Arredonda para cima na centena (ex.: 2305 → 2400; 2400 → 2400). */
function arredondarCentenaCima(v) {
  return Math.ceil((Number(v) || 0) / 100) * 100;
}

/** Custo Efetivo: o valor considerado de fato para a operação.
 *  - KM ≥ 200: o maior entre Custo ANTT, Custo por KM e Custo SPOT (quando cadastrado),
 *    arredondado para cima na centena.
 *  - KM < 200: rotas curtas não usam ANTT/Custo por KM como referência — considera só o
 *    SPOT cadastrado (arredondado do mesmo jeito); sem SPOT cadastrado, mostra aviso. */
function atualizarCustoEfetivo() {
  const km = state.kmDistancia || 0;
  const curto = km > 0 && km < 200;

  let base = null;
  let formula = "";

  if (curto) {
    if (state.spotDisponivel) {
      base = state.custoSpot;
      formula = `KM < 200 (${fmtNum(km)} km) — considerado apenas o SPOT (${fmtBRL(state.custoSpot)}), arredondado para cima na centena`;
    }
  } else {
    const candidatos = [
      { nome: "ANTT", valor: state.custoAntt || 0 },
      { nome: "Custo por KM", valor: state.custoAprox || 0 },
    ];
    if (state.spotDisponivel) candidatos.push({ nome: "SPOT", valor: state.custoSpot || 0 });
    const maior = candidatos.reduce((a, b) => (b.valor > a.valor ? b : a));
    base = maior.valor;
    formula = `Maior entre ${candidatos.map((c) => `${c.nome} (${fmtBRL(c.valor)})`).join(", ")}, arredondado para cima na centena`;
  }

  if (base === null) {
    $("resEfetivo").textContent = "—";
    $("resEfetivoFormula").textContent = "";
    $("resEfetivoAviso").hidden = false;
    $("resEfetivoAviso").textContent = "⚠ Sem SPOT cadastrado para este trecho e veículo — necessário para rotas com menos de 200 km.";
    state.custoEfetivo = null;
    return;
  }

  const efetivo = arredondarCentenaCima(base);
  $("resEfetivo").textContent = fmtBRL(efetivo);
  $("resEfetivoFormula").textContent = formula;
  $("resEfetivoAviso").hidden = true;
  $("resEfetivoAviso").textContent = "";
  state.custoEfetivo = efetivo;
}

function calcularLinhaComposicao(custoBase, mkp, advalorem, pedagio, aliquota) {
  if (!mkp) return null;
  const fretePeso = custoBase / mkp;
  const subtotal = fretePeso + advalorem + pedagio;
  if (aliquota === null || aliquota === undefined || aliquota >= 100) {
    return { fretePeso, advalorem, pedagio, icms: null, total: null };
  }
  const total = subtotal / (1 - aliquota / 100);
  const icms = total - subtotal;
  return { fretePeso, advalorem, pedagio, icms, total };
}

function preencherColunaComposicao(prefixo, linha) {
  $(`comp${prefixo}FretePeso`).textContent = linha ? fmtBRL(linha.fretePeso) : "—";
  $(`comp${prefixo}Advalorem`).textContent = linha ? fmtBRL(linha.advalorem) : "—";
  $(`comp${prefixo}Pedagio`).textContent = linha ? fmtBRL(linha.pedagio) : "—";
  $(`comp${prefixo}Icms`).textContent = linha && linha.icms !== null ? fmtBRL(linha.icms) : "—";
  $(`comp${prefixo}Total`).textContent = linha && linha.total !== null ? fmtBRL(linha.total) : "—";
}

/** Coluna de Composição que pode não ter dado disponível (SPOT sem cadastro, Custo Efetivo
 * sem SPOT numa rota curta): mostra a tabela normal, ou uma mensagem no lugar — evita
 * comparar contra um R$ 0,00 enganoso. */
function preencherColunaOpcional(tbodyId, prefixo, linha, mensagemVazia) {
  const tbody = $(tbodyId);
  if (!linha) {
    tbody.innerHTML = `<tr><td colspan="2" class="sem-spot">${mensagemVazia}</td></tr>`;
    return;
  }
  tbody.innerHTML = `
    <tr><td>Frete Peso</td><td id="comp${prefixo}FretePeso">${fmtBRL(linha.fretePeso)}</td></tr>
    <tr><td>Ad Valorem</td><td id="comp${prefixo}Advalorem">${fmtBRL(linha.advalorem)}</td></tr>
    <tr><td>Pedágio</td><td id="comp${prefixo}Pedagio">${fmtBRL(linha.pedagio)}</td></tr>
    <tr><td>ICMS</td><td id="comp${prefixo}Icms">${linha.icms !== null ? fmtBRL(linha.icms) : "—"}</td></tr>
    <tr class="total"><td>Total Venda</td><td id="comp${prefixo}Total">${linha.total !== null ? fmtBRL(linha.total) : "—"}</td></tr>
  `;
}

function atualizarComposicao() {
  if ($("resultsCard").hidden) return;

  const ativo = mkpAtivo();
  const { mkp, nome: mkpNome } = ativo;
  const pctAdval = Number(ativo.pctAdvalorem) || 0;
  const valorMercadoria = parseFloat($("valorMercadoria").value) || 0;
  const advalorem = valorMercadoria * (pctAdval / 100);
  const pedagio = state.pedagio || 0;

  // Prioriza a UF resolvida pelo CEP/geocodificação (mais confiável); só recorre a ler o
  // texto do campo "Cidade" se o KM ainda não foi calculado para este par origem/destino.
  const ufOrigem = state.ufOrigem || separarCidadeUf($("cidadeOrigem").value).uf;
  const ufDestino = state.ufDestino || separarCidadeUf($("cidadeDestino").value).uf;
  const { aliquota, fonte } = obterAliquotaIcms(ufOrigem, ufDestino);

  const linhaAntt = calcularLinhaComposicao(state.custoAntt, mkp, advalorem, pedagio, aliquota);
  const linhaMerc = calcularLinhaComposicao(state.custoAprox, mkp, advalorem, pedagio, aliquota);
  const linhaSpot = state.spotDisponivel ? calcularLinhaComposicao(state.custoSpot, mkp, advalorem, pedagio, aliquota) : null;
  const linhaEfetivo =
    state.custoEfetivo !== null && state.custoEfetivo !== undefined
      ? calcularLinhaComposicao(state.custoEfetivo, mkp, advalorem, pedagio, aliquota)
      : null;

  preencherColunaComposicao("Antt", linhaAntt);
  preencherColunaComposicao("Merc", linhaMerc);
  preencherColunaOpcional("composicaoSpotBody", "Spot", linhaSpot, "Sem SPOT cadastrado para este trecho e veículo.");
  preencherColunaOpcional("composicaoEfetivoBody", "Efetivo", linhaEfetivo, "Sem Custo Efetivo disponível (rota com menos de 200 km sem SPOT cadastrado).");

  state.mkp = mkp;
  state.mkpNome = mkpNome;
  state.pctCustoFixo = Number(ativo.pctCustoFixo) || 0;
  state.pctImpostos = Number(ativo.pctImpostos) || 0;
  state.pctMargem = Number(ativo.pctMargem) || 0;
  state.pctComissao = Number(ativo.pctComissao) || 0;
  state.pctAdvalorem = pctAdval;
  state.advalorem = advalorem;
  state.aliquotaIcms = aliquota;
  state.fonteIcms = fonte;
  state.compAntt = linhaAntt;
  state.compMerc = linhaMerc;
  state.compSpot = linhaSpot;
  state.compEfetivo = linhaEfetivo;

  const rotuloMkp = mkp ? (ativo.ehPadrao ? fmtNum(mkp, 4) : `${fmtNum(mkp, 4)} (${mkpNome})`) : "indefinido (percentuais somam 100% ou mais)";
  const partes = [`MKP: ${rotuloMkp}`];
  if (aliquota !== null) {
    partes.push(`ICMS ${ufOrigem || "?"} → ${ufDestino || "?"}: ${fmtNum(aliquota, 2)}% (${fonte})`);
  } else {
    partes.push(`ICMS: ${fonte}`);
  }
  $("icmsInfo").textContent = partes.join(" · ");
}

$("btnCalcular").addEventListener("click", calcular);
$("valorMercadoria").addEventListener("input", atualizarComposicao);
$("mkpSelecionado").addEventListener("change", atualizarComposicao);

/* ============================================================
   Aba Cadastro ANTT — parâmetros da API QualP (Tabela/Carga/Retorno vazio)
   ============================================================ */
function renderAnttConfig() {
  $("anttFreightType").value = anttConfig.freightType;
  $("anttLoadType").value = anttConfig.loadType;
  $("anttEmptyReturn").value = anttConfig.isEmptyReturn ? "true" : "false";
}

$("btnSalvarAnttConfig").addEventListener("click", async () => {
  anttConfig = {
    freightType: $("anttFreightType").value,
    loadType: $("anttLoadType").value,
    isEmptyReturn: $("anttEmptyReturn").value === "true",
  };
  await salvarConfig("anttConfig", anttConfig);
  $("msgAnttConfig").textContent = "Parâmetros salvos.";
  setTimeout(() => ($("msgAnttConfig").textContent = ""), 2500);
});

/* ============================================================
   Aba Cadastro ANTT — tabela manual (reserva sem API)
   ============================================================ */
function renderTabelaAntt() {
  const tbody = $("tabelaAntt").querySelector("tbody");
  tbody.innerHTML = "";
  anttTable.forEach((row, idx) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><input type="number" min="1" step="1" value="${row.eixos}" data-field="eixos" data-idx="${idx}"></td>
      <td><input type="text" value="${row.nome || ""}" placeholder="Nome do veículo" data-field="nome" data-idx="${idx}"></td>
      <td><input type="number" min="0" step="0.0001" value="${row.ccd}" data-field="ccd" data-idx="${idx}"></td>
      <td><input type="number" min="0" step="0.01" value="${row.cc}" data-field="cc" data-idx="${idx}"></td>
      <td><button type="button" class="btn-remove" data-remove="${idx}" title="Remover">&times;</button></td>
    `;
    tbody.appendChild(tr);
  });

  tbody.querySelectorAll("input").forEach((inp) => {
    inp.addEventListener("input", () => {
      const idx = parseInt(inp.dataset.idx, 10);
      const field = inp.dataset.field;
      if (field === "nome") {
        anttTable[idx][field] = inp.value;
      } else {
        anttTable[idx][field] = field === "eixos" ? parseInt(inp.value, 10) || 0 : parseFloat(inp.value) || 0;
      }
    });
  });
  tbody.querySelectorAll("[data-remove]").forEach((btn) => {
    btn.addEventListener("click", () => {
      anttTable.splice(parseInt(btn.dataset.remove, 10), 1);
      renderTabelaAntt();
    });
  });
}

$("btnAddEixo").addEventListener("click", () => {
  anttTable.push({ eixos: 0, ccd: 0, cc: 0, nome: "" });
  renderTabelaAntt();
});

$("btnSalvarAntt").addEventListener("click", async () => {
  await salvarConfig("antt", anttTable);
  preencherSelects();
  $("msgAntt").textContent = "Cadastro salvo.";
  setTimeout(() => ($("msgAntt").textContent = ""), 2500);
});

/* ============================================================
   Aba Custo por KM (veículos)
   ============================================================ */
function renderTabelaVeiculos() {
  const tbody = $("tabelaVeiculos").querySelector("tbody");
  tbody.innerHTML = "";
  veiculosTable.forEach((row, idx) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><input type="text" value="${row.tipo}" data-field="tipo" data-idx="${idx}"></td>
      <td><input type="number" min="0" step="0.01" value="${row.valorKm}" data-field="valorKm" data-idx="${idx}"></td>
      <td><button type="button" class="btn-remove" data-remove="${idx}" title="Remover">&times;</button></td>
    `;
    tbody.appendChild(tr);
  });

  tbody.querySelectorAll("input").forEach((inp) => {
    inp.addEventListener("input", () => {
      const idx = parseInt(inp.dataset.idx, 10);
      const field = inp.dataset.field;
      veiculosTable[idx][field] = field === "valorKm" ? parseFloat(inp.value) || 0 : inp.value;
    });
  });
  tbody.querySelectorAll("[data-remove]").forEach((btn) => {
    btn.addEventListener("click", () => {
      veiculosTable.splice(parseInt(btn.dataset.remove, 10), 1);
      renderTabelaVeiculos();
    });
  });
}

$("btnAddVeiculo").addEventListener("click", () => {
  veiculosTable.push({ tipo: "Novo veículo", valorKm: 0 });
  renderTabelaVeiculos();
});

$("btnSalvarVeiculos").addEventListener("click", async () => {
  await salvarConfig("veiculos", veiculosTable);
  preencherSelects();
  renderTabelaSpot(); // a lista de veículos do SPOT depende deste cadastro
  $("msgVeiculos").textContent = "Cadastro salvo.";
  setTimeout(() => ($("msgVeiculos").textContent = ""), 2500);
});

/* ============================================================
   Aba Custo de Operação SPOT (valor fixo por trecho + veículo)
   ============================================================ */
function optionsVeiculoSpot(selecionado) {
  return veiculosTable.map((v) => `<option value="${v.tipo}" ${v.tipo === selecionado ? "selected" : ""}>${v.tipo}</option>`).join("");
}

function renderTabelaSpot() {
  const tbody = $("tabelaSpot").querySelector("tbody");
  tbody.innerHTML = "";
  spotTable.forEach((row, idx) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>
        <div class="autocomplete-wrap">
          <input type="text" value="${row.origem || ""}" placeholder="Digite a cidade" autocomplete="off" data-field="origem" data-idx="${idx}">
          <ul class="autocomplete-list" hidden></ul>
        </div>
      </td>
      <td>
        <div class="autocomplete-wrap">
          <input type="text" value="${row.destino || ""}" placeholder="Digite a cidade" autocomplete="off" data-field="destino" data-idx="${idx}">
          <ul class="autocomplete-list" hidden></ul>
        </div>
      </td>
      <td><select data-field="veiculo" data-idx="${idx}">${optionsVeiculoSpot(row.veiculo)}</select></td>
      <td><input type="number" min="0" step="0.01" value="${row.valor}" data-field="valor" data-idx="${idx}"></td>
      <td><button type="button" class="btn-remove" data-remove="${idx}" title="Remover">&times;</button></td>
    `;
    tbody.appendChild(tr);
  });

  tbody.querySelectorAll("input, select").forEach((el) => {
    el.addEventListener("input", () => {
      const idx = parseInt(el.dataset.idx, 10);
      const field = el.dataset.field;
      spotTable[idx][field] = field === "valor" ? parseFloat(el.value) || 0 : el.value;
    });
  });

  aplicarFiltroSpot();

  // Autocomplete de cidade nas colunas Origem/Destino, igual ao da Calculadora —
  // evita cadastrar um nome de cidade/UF que nunca vai bater com o trecho calculado.
  tbody.querySelectorAll("input[data-field='origem'], input[data-field='destino']").forEach((inputEl) => {
    const listEl = inputEl.closest(".autocomplete-wrap").querySelector(".autocomplete-list");
    const idx = parseInt(inputEl.dataset.idx, 10);
    const campo = inputEl.dataset.field;
    configurarAutocompleteCidadeElementos(inputEl, listEl, (m) => {
      spotTable[idx][campo] = `${m.nome} - ${m.uf}`;
    });
  });

  tbody.querySelectorAll("[data-remove]").forEach((btn) => {
    btn.addEventListener("click", () => {
      spotTable.splice(parseInt(btn.dataset.remove, 10), 1);
      renderTabelaSpot();
    });
  });
}

/** Filtra as linhas já renderizadas da tabela SPOT pelos 3 campos de busca
 * (Origem/Destino/Veículo, cada um funcionando independente, "E" entre eles) —
 * não mexe nos dados, só esconde/mostra linhas na tela (útil com o cadastro
 * grande, ~500 trechos). Ignora acento/maiúscula, igual ao resto do app. */
function aplicarFiltroSpot() {
  const fOrigem = normalizeStr($("filtroSpotOrigem")?.value || "");
  const fDestino = normalizeStr($("filtroSpotDestino")?.value || "");
  const fVeiculo = normalizeStr($("filtroSpotVeiculo")?.value || "");
  const tbody = $("tabelaSpot").querySelector("tbody");
  tbody.querySelectorAll("tr").forEach((tr) => {
    const origem = normalizeStr(tr.querySelector("input[data-field='origem']")?.value || "");
    const destino = normalizeStr(tr.querySelector("input[data-field='destino']")?.value || "");
    const veiculo = normalizeStr(tr.querySelector("select[data-field='veiculo']")?.value || "");
    const ok = origem.includes(fOrigem) && destino.includes(fDestino) && veiculo.includes(fVeiculo);
    tr.style.display = ok ? "" : "none";
  });
}
["filtroSpotOrigem", "filtroSpotDestino", "filtroSpotVeiculo"].forEach((id) => {
  $(id).addEventListener("input", aplicarFiltroSpot);
});

$("btnAddSpot").addEventListener("click", () => {
  spotTable.push({ origem: "", destino: "", veiculo: veiculosTable[0] ? veiculosTable[0].tipo : "", valor: 0 });
  renderTabelaSpot();
});

$("btnSalvarSpot").addEventListener("click", async () => {
  await salvarConfig("spot", spotTable);
  $("msgSpot").textContent = "Cadastro salvo.";
  setTimeout(() => ($("msgSpot").textContent = ""), 2500);
});

// Ignora acento também (não só maiúscula/minúscula e espaços) — evita falha de match só
// porque alguém digitou "Itajai" numa hora e "Itajaí" noutra.
function normalizarLocalSpot(s) {
  return normalizeStr(s);
}

/** Procura um valor SPOT cadastrado para o trecho (origem → destino) e veículo exatos. */
function buscarSpot(origemTxt, destinoTxt, veiculo) {
  const o = normalizarLocalSpot(origemTxt);
  const d = normalizarLocalSpot(destinoTxt);
  if (!o || !d) return null;
  return spotTable.find((r) => normalizarLocalSpot(r.origem) === o && normalizarLocalSpot(r.destino) === d && r.veiculo === veiculo) || null;
}

// Hubs de origem do SPOT: cidade digitada num raio de 50 km de Itajaí/SC ou de São Paulo
// capital pode usar o SPOT cadastrado com origem "Itajaí - SC" pro mesmo destino/veículo,
// mesmo sem cadastro exato pra ela — cobre a região de atuação sem precisar cadastrar cidade
// por cidade (ex.: Balneário Camboriú, Navegantes, Camboriú etc. herdam o SPOT de Itajaí).
const HUB_SPOT_ITAJAI = { lat: -26.9078, lon: -48.6708, nome: "Itajaí - SC" };
const HUB_SPOT_SAO_PAULO = { lat: -23.5505, lon: -46.6333, nome: "São Paulo - SP" };
const RAIO_HUB_SPOT_KM = 50;

function origemNoRaioDeHubSpot(origemLat, origemLon) {
  if (origemLat == null || origemLon == null) return false;
  return (
    haversineKm(origemLat, origemLon, HUB_SPOT_ITAJAI.lat, HUB_SPOT_ITAJAI.lon) <= RAIO_HUB_SPOT_KM ||
    haversineKm(origemLat, origemLon, HUB_SPOT_SAO_PAULO.lat, HUB_SPOT_SAO_PAULO.lon) <= RAIO_HUB_SPOT_KM
  );
}

/** Procura o SPOT do trecho: primeiro pela cidade exata digitada; sem cadastro pra ela e com
 * a origem no raio de 50 km de Itajaí/SC ou São Paulo capital, tenta de novo usando
 * "Itajaí - SC" como origem (mesmo destino/veículo) — ver origemNoRaioDeHubSpot acima.
 * Retorna { spot, viaHub } — viaHub avisa que o valor veio do hub, não de um cadastro exato
 * pra cidade digitada, pra não passar a impressão de que há cadastro específico pra ela. */
function buscarSpotComHub(origemTxt, destinoTxt, veiculo, origemLat, origemLon) {
  const direto = buscarSpot(origemTxt, destinoTxt, veiculo);
  if (direto) return { spot: direto, viaHub: false };
  if (normalizarLocalSpot(origemTxt) === normalizarLocalSpot(HUB_SPOT_ITAJAI.nome)) return { spot: null, viaHub: false };
  if (!origemNoRaioDeHubSpot(origemLat, origemLon)) return { spot: null, viaHub: false };
  const viaHub = buscarSpot(HUB_SPOT_ITAJAI.nome, destinoTxt, veiculo);
  return { spot: viaHub, viaHub: !!viaHub };
}

/* ============================================================
   Importar Custo de Operação SPOT de planilha Excel
   Formato esperado (colunas A/B/C): "Cidade-UF X Cidade-UF" | Tipo | Valor (R$)
   ============================================================ */

/** Desembrulha o valor de uma célula do ExcelJS (fórmula, rich text ou valor cru). */
function valorCelulaImportada(v) {
  if (v instanceof Date) return v;
  if (v && typeof v === "object") {
    if ("result" in v) return v.result;
    if (v.richText) return v.richText.map((t) => t.text).join("");
  }
  return v;
}

/** Capitaliza um tipo de veículo importado (ex.: "van" → "Van", "ctnr" → "CTNR"). */
function formatarTipoVeiculoImportado(raw) {
  const s = String(raw).trim();
  if (/^\d+\/\d+$/.test(s)) return s; // ex.: "3/4"
  const SIGLAS = { ctnr: "CTNR", vuc: "VUC", dta: "DTA" };
  return s
    .split(/\s+/)
    .map((palavra) => SIGLAS[palavra.toLowerCase()] || palavra.charAt(0).toUpperCase() + palavra.slice(1).toLowerCase())
    .join(" ");
}

/** Formata "Cidade-UF" (como vem na planilha) para "Cidade - UF", igual ao padrão do autocomplete. */
function formatarLocalImportado(parte) {
  const m = String(parte || "").trim().match(/^(.+)-\s*([A-Za-zÀ-ÿ]{2})$/);
  if (!m) return null;
  return `${m[1].trim()} - ${m[2].toUpperCase()}`;
}

/** Separa "Cidade-UF X Cidade-UF" em { origem, destino }, já formatados. */
function separarTrechoImportado(trecho) {
  const m = String(trecho || "").trim().match(/^(.*?)\s+x\s+(.*)$/i);
  if (!m) return null;
  const origem = formatarLocalImportado(m[1]);
  const destino = formatarLocalImportado(m[2]);
  if (!origem || !destino) return null;
  return { origem, destino };
}

async function importarPlanilhaSpot(file) {
  const buffer = await file.arrayBuffer();
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(buffer);
  const ws = workbook.worksheets[0];
  if (!ws) return { erro: "Planilha vazia ou em formato não reconhecido." };

  let importados = 0;
  let atualizados = 0;
  const novosVeiculos = [];
  const ignorados = [];

  ws.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return; // cabeçalho

    const trechoVal = valorCelulaImportada(row.getCell(1).value);
    const tipoVal = valorCelulaImportada(row.getCell(2).value);
    const valorVal = valorCelulaImportada(row.getCell(3).value);

    if (!trechoVal || valorVal === null || valorVal === undefined || valorVal === "") return;

    const partes = separarTrechoImportado(trechoVal);
    if (!partes) { ignorados.push(`Linha ${rowNumber}: "${trechoVal}" (formato "Cidade-UF X Cidade-UF" não reconhecido)`); return; }

    // Bug clássico do Excel: "3/4" digitado na coluna de tipo vira data (autocorreção). Reconstrói
    // a fração original a partir do dia/mês em UTC (a data vem sem fuso horário; usar getDate()/
    // getMonth() locais pode voltar um dia se o fuso local for atrás de UTC).
    const tipoRaw = tipoVal instanceof Date ? `${tipoVal.getUTCDate()}/${tipoVal.getUTCMonth() + 1}` : tipoVal;
    if (!tipoRaw) { ignorados.push(`Linha ${rowNumber}: "${trechoVal}" (tipo de veículo vazio)`); return; }
    const tipo = formatarTipoVeiculoImportado(tipoRaw);

    const valor = Number(valorVal);
    if (!valor || Number.isNaN(valor)) { ignorados.push(`Linha ${rowNumber}: "${trechoVal}" (valor inválido: "${valorVal}")`); return; }

    // Garante que o tipo de veículo existe no cadastro "Custo por KM" (usado no <select> do SPOT
    // e na Calculadora); reaproveita a grafia já cadastrada se já existir (case-insensitive).
    let veiculoExistente = veiculosTable.find((v) => v.tipo.toLowerCase() === tipo.toLowerCase());
    if (!veiculoExistente) {
      veiculoExistente = { tipo, valorKm: 0 };
      veiculosTable.push(veiculoExistente);
      novosVeiculos.push(tipo);
    }

    const existente = spotTable.find(
      (r) =>
        normalizarLocalSpot(r.origem) === normalizarLocalSpot(partes.origem) &&
        normalizarLocalSpot(r.destino) === normalizarLocalSpot(partes.destino) &&
        r.veiculo === veiculoExistente.tipo
    );
    if (existente) {
      existente.valor = valor;
      atualizados++;
    } else {
      spotTable.push({ origem: partes.origem, destino: partes.destino, veiculo: veiculoExistente.tipo, valor });
      importados++;
    }
  });

  await Promise.all([salvarConfig("spot", spotTable), salvarConfig("veiculos", veiculosTable)]);
  renderTabelaSpot();
  renderTabelaVeiculos();
  preencherSelects();

  return { importados, atualizados, ignorados, novosVeiculos };
}

$("btnImportarSpot").addEventListener("click", async () => {
  const input = $("spotImportFile");
  const msg = $("msgSpotImport");
  const file = input.files[0];
  if (!file) {
    msg.textContent = "Selecione um arquivo .xlsx primeiro.";
    return;
  }
  msg.textContent = "Importando...";
  try {
    const r = await importarPlanilhaSpot(file);
    if (r.erro) {
      msg.textContent = r.erro;
      return;
    }
    const partesMsg = [`${r.importados} trecho(s) novo(s)`, `${r.atualizados} atualizado(s)`];
    if (r.ignorados.length) partesMsg.push(`${r.ignorados.length} linha(s) ignorada(s) por formato inválido (veja o console)`);
    if (r.novosVeiculos.length) {
      partesMsg.push(`${r.novosVeiculos.length} novo(s) tipo(s) de veículo criado(s) no Custo por KM: ${r.novosVeiculos.join(", ")}`);
    }
    msg.textContent = partesMsg.join(" · ");
    if (r.ignorados.length) console.warn("Linhas ignoradas na importação SPOT:\n" + r.ignorados.join("\n"));
    input.value = "";
  } catch (e) {
    msg.textContent = "Erro ao importar: " + e.message;
  }
});

/* ============================================================
   Atualizar Custo de Operação SPOT a partir do Brudam
   (Comercial → Tabela 24 → Excel → Exportação por trecho)
   ============================================================ */

const BRUDAM_SERVICO_PARA_TIPO = {
  CARRETA: "Carreta",
  VAN: "Van",
  "3/4": "3/4",
  TOCO: "Toco",
  BITRUCK: "Bitruck",
  FIORINO: "Fiorino",
  TRUCK: "Truck",
  CNTR: "Cntr",
};

/** O Brudam prefixa todo serviço com "PERSONALIZADO_L " (ex.: "PERSONALIZADO_L CARRETA",
 * "PERSONALIZADO_L VAN") — remove o prefixo antes de mapear pro tipo de veículo do cadastro. */
function normalizarServicoBrudam(raw) {
  return String(raw || "")
    .trim()
    .toUpperCase()
    .replace(/^PERSONALIZADO_L\s+/, "");
}

const CONECTIVOS_CIDADE = new Set(["de", "da", "do", "das", "dos", "e"]);

/** Formata "CIDADE - UF" (como o Brudam manda, em caixa alta) para "Cidade - UF", igual ao
 * padrão do cadastro — usado só ao criar linha nova; linha já cadastrada mantém a grafia atual. */
function tituloLocalBrudam(raw) {
  const partes = String(raw || "").trim().split(" - ");
  if (partes.length !== 2) return raw;
  const cidade = partes[0]
    .toLowerCase()
    .split(" ")
    .map((w, i) => (i > 0 && CONECTIVOS_CIDADE.has(w) ? w : w.charAt(0).toUpperCase() + w.slice(1)))
    .join(" ");
  return `${cidade} - ${partes[1].trim().toUpperCase()}`;
}

/** Corrige o erro de digitação do próprio Brudam onde a UF vem duplicada no fim
 * (ex.: "BRASILIA - DF - DF" → "BRASILIA - DF"). */
function limparLocalBrudam(raw) {
  const partes = String(raw || "").trim().split(" - ");
  if (partes.length === 3 && partes[1].trim().toUpperCase() === partes[2].trim().toUpperCase()) {
    return `${partes[0]} - ${partes[1]}`.trim();
  }
  return String(raw || "").trim();
}

/** true só para "Cidade - UF" reconhecível; false para os códigos de UF isolada (ex.: "SP"
 * sozinho) que o Brudam às vezes usa pra regra genérica por estado, sem cidade real — não dá
 * pra geocodificar isso, então essas linhas são ignoradas na importação. */
function localBrudamValido(raw) {
  return /^.+ - [A-Za-zÀ-ÿ]{2}$/.test(String(raw || "").trim());
}

/** Lê o Excel de "Exportação por trecho" do Brudam e sincroniza com o Custo de Operação SPOT.
 * Cada trecho ocupa 3 linhas consecutivas (Mínimo / Franquia / Excedente); usa-se só a linha
 * "Mínimo": coluna 2 = Origem, coluna 6 = Destino, coluna 8 = Serviço (mapeado pro tipo de
 * veículo do cadastro), e o valor é a única célula preenchida entre as colunas 10-36 (a tarifa
 * mínima do item "2. Frete Entrega" daquele serviço).
 *
 * O mesmo trecho/veículo às vezes aparece MAIS DE UMA VEZ na planilha (faixas de peso
 * duplicadas/substituídas do lado do Brudam, sem relação com o layout usado aqui) — nesse caso
 * usa-se sempre a PRIMEIRA ocorrência (a que aparece mais acima na planilha), que é a mesma
 * convenção já usada desde a primeira importação manual e que bate com os valores já validados
 * no cadastro atual.
 *
 * Mesma regra do cadastro: trecho já cadastrado com o MESMO valor não conta como mudança;
 * valor diferente atualiza; trecho novo é adicionado. */
async function importarBrudamXlsx(file) {
  const buffer = await file.arrayBuffer();
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(buffer);
  const ws = workbook.worksheets[0];
  if (!ws) return { erro: "Planilha vazia ou em formato não reconhecido." };

  const ignorados = [];
  const candidatos = new Map(); // key normalizado -> { origemRaw, destinoRaw, tipo, valor }

  for (let r = 3; r + 2 <= ws.rowCount; r += 3) {
    const rotulo = String(valorCelulaImportada(ws.getRow(r).getCell(9).value) || "").trim().toLowerCase();
    if (!rotulo.startsWith("min")) continue; // só a linha "Mínimo"; outro layout é ignorado

    const origemRaw = limparLocalBrudam(valorCelulaImportada(ws.getRow(r).getCell(2).value));
    const destinoRaw = limparLocalBrudam(valorCelulaImportada(ws.getRow(r).getCell(6).value));
    const servico = normalizarServicoBrudam(valorCelulaImportada(ws.getRow(r).getCell(8).value));

    if (!localBrudamValido(origemRaw) || !localBrudamValido(destinoRaw)) {
      ignorados.push(`Linha ${r}: "${origemRaw}" → "${destinoRaw}" (sem cidade real, provável regra genérica por UF)`);
      continue;
    }

    const tipo = BRUDAM_SERVICO_PARA_TIPO[servico];
    if (!tipo) {
      ignorados.push(`Linha ${r}: serviço "${servico}" não mapeado para tipo de veículo`);
      continue;
    }

    let valor = null;
    for (let c = 10; c <= 36; c++) {
      const v = Number(valorCelulaImportada(ws.getRow(r).getCell(c).value));
      if (v > 0) {
        valor = v;
        break;
      }
    }
    if (!valor) {
      ignorados.push(`Linha ${r}: "${origemRaw}" → "${destinoRaw}" / ${tipo} (sem tarifa mínima preenchida)`);
      continue;
    }

    const key = `${normalizarLocalSpot(origemRaw)}|${normalizarLocalSpot(destinoRaw)}|${tipo}`;
    if (candidatos.has(key)) continue; // duplicata na planilha: mantém a primeira ocorrência
    candidatos.set(key, { origemRaw, destinoRaw, tipo, valor });
  }

  let identicos = 0;
  let atualizados = 0;
  let novos = 0;
  const novosVeiculos = [];

  for (const { origemRaw, destinoRaw, tipo, valor } of candidatos.values()) {
    let veiculoExistente = veiculosTable.find((v) => v.tipo.toLowerCase() === tipo.toLowerCase());
    if (!veiculoExistente) {
      veiculoExistente = { tipo, valorKm: 0 };
      veiculosTable.push(veiculoExistente);
      if (!novosVeiculos.includes(tipo)) novosVeiculos.push(tipo);
    }

    const existente = spotTable.find(
      (row) =>
        normalizarLocalSpot(row.origem) === normalizarLocalSpot(origemRaw) &&
        normalizarLocalSpot(row.destino) === normalizarLocalSpot(destinoRaw) &&
        row.veiculo === veiculoExistente.tipo
    );
    if (existente) {
      if (Number(existente.valor) === valor) {
        identicos++;
      } else {
        existente.valor = valor;
        atualizados++;
      }
    } else {
      spotTable.push({
        origem: tituloLocalBrudam(origemRaw),
        destino: tituloLocalBrudam(destinoRaw),
        veiculo: veiculoExistente.tipo,
        valor,
      });
      novos++;
    }
  }

  spotBrudamUltimaAtualizacao = new Date().toISOString();
  await Promise.all([
    salvarConfig("spot", spotTable),
    salvarConfig("veiculos", veiculosTable),
    salvarConfig("spotBrudamUltimaAtualizacao", spotBrudamUltimaAtualizacao),
  ]);
  renderTabelaSpot();
  renderTabelaVeiculos();
  preencherSelects();
  atualizarLabelBrudam();

  return { identicos, atualizados, novos, ignorados, novosVeiculos };
}

function atualizarLabelBrudam() {
  const el = $("msgBrudamUltimaAtualizacao");
  if (!el) return;
  if (!spotBrudamUltimaAtualizacao) {
    el.textContent = "Nunca sincronizado com o Brudam.";
    return;
  }
  const d = new Date(spotBrudamUltimaAtualizacao);
  el.textContent = `Última sincronização com o Brudam: ${d.toLocaleDateString("pt-BR")} ${d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`;
}

$("btnAtualizarBrudam").addEventListener("click", () => $("brudamImportFile").click());

$("brudamImportFile").addEventListener("change", async () => {
  const input = $("brudamImportFile");
  const msg = $("msgBrudam");
  const file = input.files[0];
  if (!file) return;
  msg.textContent = "Lendo planilha do Brudam e sincronizando...";
  try {
    const r = await importarBrudamXlsx(file);
    if (r.erro) {
      msg.textContent = r.erro;
      return;
    }
    const partes = [`${r.identicos} já estavam iguais`, `${r.atualizados} atualizado(s)`, `${r.novos} novo(s)`];
    if (r.ignorados.length) partes.push(`${r.ignorados.length} linha(s) ignorada(s) (veja o console)`);
    if (r.novosVeiculos.length) partes.push(`novo(s) tipo(s) de veículo criado(s) no Custo por KM: ${r.novosVeiculos.join(", ")}`);
    msg.textContent = partes.join(" · ");
    if (r.ignorados.length) console.warn("Linhas ignoradas na sincronização com o Brudam:\n" + r.ignorados.join("\n"));
    input.value = "";
  } catch (e) {
    msg.textContent = "Erro ao sincronizar: " + e.message;
  }
});

/* ============================================================
   Aba Parâmetros de Venda
   ============================================================ */
function renderVenda() {
  $("pctCustoFixo").value = vendaParams.pctCustoFixo;
  $("pctImpostos").value = vendaParams.pctImpostos;
  $("pctMargem").value = vendaParams.pctMargem;
  $("pctComissao").value = vendaParams.pctComissao;
  $("pctAdvalorem").value = vendaParams.pctAdvalorem;
  atualizarPreviewVenda();
}

function atualizarPreviewVenda() {
  vendaParams.pctCustoFixo = parseFloat($("pctCustoFixo").value) || 0;
  vendaParams.pctImpostos = parseFloat($("pctImpostos").value) || 0;
  vendaParams.pctMargem = parseFloat($("pctMargem").value) || 0;
  vendaParams.pctComissao = parseFloat($("pctComissao").value) || 0;
  vendaParams.pctAdvalorem = parseFloat($("pctAdvalorem").value) || 0;
  const { soma, mkp } = calcularMkp();
  $("somaPct").textContent = fmtNum(soma, 1) + "%";
  $("mkpValor").textContent = mkp ? fmtNum(mkp, 4) : "indefinido";
  preencherSelectMkp();
  preencherSelectMkpManual();
  atualizarComposicao();
}

["pctCustoFixo", "pctImpostos", "pctMargem", "pctComissao", "pctAdvalorem"].forEach((id) => {
  $(id).addEventListener("input", atualizarPreviewVenda);
});

$("btnSalvarVenda").addEventListener("click", async () => {
  await salvarConfig("venda", vendaParams);
  $("msgVenda").textContent = "Parâmetros salvos.";
  setTimeout(() => ($("msgVenda").textContent = ""), 2500);
});

/* ============================================================
   MKPs Cadastrados (dentro da aba Parâmetros de Venda) — outras margens
   negociadas, escolhidas na Calculadora sem mudar os percentuais acima.
   ============================================================ */
function renderTabelaMkp() {
  const tbody = $("tabelaMkp").querySelector("tbody");
  tbody.innerHTML = "";
  mkpTable.forEach((row, idx) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><input type="text" value="${row.nome || ""}" placeholder="Ex.: Negociado cliente X" data-field="nome" data-idx="${idx}"></td>
      <td><input type="number" min="0" max="99" step="0.1" value="${row.pctCustoFixo ?? 0}" data-field="pctCustoFixo" data-idx="${idx}"></td>
      <td><input type="number" min="0" max="99" step="0.1" value="${row.pctImpostos ?? 0}" data-field="pctImpostos" data-idx="${idx}"></td>
      <td><input type="number" min="0" max="99" step="0.1" value="${row.pctMargem ?? 0}" data-field="pctMargem" data-idx="${idx}"></td>
      <td><input type="number" min="0" max="99" step="0.1" value="${row.pctComissao ?? 0}" data-field="pctComissao" data-idx="${idx}"></td>
      <td><input type="number" min="0" max="99" step="0.01" value="${row.pctAdvalorem ?? 0}" data-field="pctAdvalorem" data-idx="${idx}"></td>
      <td class="mkp-calculado" data-mkp-calculado="${idx}">${fmtNum(mkpDePercentuais(row).mkp, 4)}</td>
      <td><button type="button" class="btn-remove" data-remove="${idx}" title="Remover">&times;</button></td>
    `;
    tbody.appendChild(tr);
  });

  tbody.querySelectorAll("input").forEach((inp) => {
    inp.addEventListener("input", () => {
      const idx = parseInt(inp.dataset.idx, 10);
      const field = inp.dataset.field;
      mkpTable[idx][field] = field === "nome" ? inp.value : parseFloat(inp.value) || 0;
      const { mkp } = mkpDePercentuais(mkpTable[idx]);
      tbody.querySelector(`[data-mkp-calculado="${idx}"]`).textContent = mkp ? fmtNum(mkp, 4) : "indefinido";
    });
  });
  tbody.querySelectorAll("[data-remove]").forEach((btn) => {
    btn.addEventListener("click", () => {
      mkpTable.splice(parseInt(btn.dataset.remove, 10), 1);
      renderTabelaMkp();
    });
  });
}

/** Preenche o seletor "MKP aplicado nesta cotação" na Calculadora — "Padrão" (percentuais
    acima) sempre primeiro, seguido dos MKPs cadastrados. Mantém a escolha atual se possível. */
function preencherSelectMkp() {
  const sel = $("mkpSelecionado");
  const atual = sel.value;
  const opcoes = mkpTable.map((m, idx) => {
    const { mkp } = mkpDePercentuais(m);
    return `<option value="${idx}">${m.nome || "MKP " + (idx + 1)} — ${mkp ? fmtNum(mkp, 4) : "indefinido"}</option>`;
  });
  sel.innerHTML = [`<option value="">${nomeMkpPadrao()}</option>`, ...opcoes].join("");
  if (atual && atual < mkpTable.length) sel.value = atual;
}

$("btnAddMkp").addEventListener("click", () => {
  mkpTable.push({ nome: "", pctCustoFixo: 0, pctImpostos: 0, pctMargem: 0, pctComissao: 0, pctAdvalorem: 0 });
  renderTabelaMkp();
});

$("btnSalvarMkp").addEventListener("click", async () => {
  mkpTable = mkpTable.filter((m) => m.nome && m.nome.trim());
  await salvarConfig("mkp", mkpTable);
  renderTabelaMkp();
  preencherSelectMkp();
  preencherSelectMkpManual();
  $("msgMkp").textContent = "Cadastro salvo.";
  setTimeout(() => ($("msgMkp").textContent = ""), 2500);
});

/* ============================================================
   Aba Backup / Migração de Dados (exporta/importa tudo em .json — serve
   tanto de cópia de segurança quanto para trazer dados salvos antes desta
   versão, de quando cada navegador guardava seu próprio localStorage, para
   o banco compartilhado usado agora por todo mundo que acessa o site)
   ============================================================ */
const CHAVES_CONFIG_BACKUP = ["antt", "veiculos", "venda", "icms", "ajusteKm", "orsApiKey", "qualpApiKey", "anttConfig", "vendedores", "spot", "mkp"];

function exportarBackupCompleto() {
  const dados = {
    antt: anttTable,
    veiculos: veiculosTable,
    venda: vendaParams,
    icms: icmsTable,
    ajusteKm: ajusteKmPct,
    orsApiKey,
    qualpApiKey,
    anttConfig,
    vendedores: vendedoresTable,
    spot: spotTable,
    historico: historicoCotacoes,
  };

  const payload = { app: "calculadora-frete", versao: 1, exportadoEm: new Date().toISOString(), dados };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `calculadora-frete-backup-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

$("btnExportarBackup").addEventListener("click", exportarBackupCompleto);

/** Importa um backup para o banco compartilhado (substitui os cadastros e, se o arquivo
    trouxer histórico, substitui o histórico inteiro e reajusta o contador de numeração das
    cotações para continuar a partir do maior número importado). Aceita tanto um backup desta
    versão quanto um exportado por uma versão anterior, de quando os dados ficavam no navegador. */
async function importarBackupCompleto(file) {
  const texto = await file.text();
  const payload = JSON.parse(texto);
  const dados = payload && payload.dados ? payload.dados : payload; // aceita tb um JSON "cru" {antt:..., veiculos:...}

  let importadas = 0;
  for (const chave of CHAVES_CONFIG_BACKUP) {
    if (dados[chave] !== undefined) {
      await salvarConfig(chave, dados[chave]);
      importadas++;
    }
  }

  if (Array.isArray(dados.historico)) {
    await db.from("historico_cotacoes").delete().neq("id", "__nenhum__");
    if (dados.historico.length) {
      const linhas = dados.historico.map((c) => ({
        id: c.id,
        numero_formatado: c.numeroFormatado || null,
        criado_em: c.criadoEm || new Date().toISOString(),
        data: c,
      }));
      const { error } = await db.from("historico_cotacoes").insert(linhas);
      if (error) console.error("Falha ao importar histórico:", error);
    }
    const porAno = {};
    dados.historico.forEach((c) => {
      if (c.ano && c.numero) porAno[c.ano] = Math.max(porAno[c.ano] || 0, c.numero);
    });
    await salvarConfig("contadorCotacoes", porAno);
    importadas++;
  }

  return importadas;
}

$("btnImportarBackup").addEventListener("click", async () => {
  const input = $("backupImportFile");
  const msg = $("msgBackupImport");
  const file = input.files[0];
  if (!file) {
    msg.textContent = "Selecione um arquivo .json primeiro.";
    return;
  }
  if (!confirm("Isso vai substituir os cadastros (e o histórico, se houver no arquivo) para TODOS que acessam o site, pelos dados do arquivo. Continuar?")) return;
  msg.textContent = "Importando...";
  try {
    const importadas = await importarBackupCompleto(file);
    if (!importadas) {
      msg.textContent = "Nenhum dado reconhecido nesse arquivo.";
      return;
    }
    msg.textContent = `${importadas} cadastro(s) importado(s). Recarregando...`;
    setTimeout(() => location.reload(), 1200);
  } catch (e) {
    msg.textContent = "Erro ao importar: " + e.message;
  }
});

/* ============================================================
   Aba ICMS (cadastro de exceções por UF origem/destino)
   ============================================================ */
function optionsUf(selecionado) {
  return UF_LIST.map((uf) => `<option value="${uf}" ${uf === selecionado ? "selected" : ""}>${uf}</option>`).join("");
}

function preencherFiltroIcms() {
  const sel = $("filtroIcmsOrigem");
  const atual = sel.value;
  sel.innerHTML = `<option value="">Todas as UFs (729 linhas)</option>` + UF_LIST.map((uf) => `<option value="${uf}">${uf}</option>`).join("");
  sel.value = atual || "";
}

function renderTabelaIcms() {
  const tbody = $("tabelaIcms").querySelector("tbody");
  tbody.innerHTML = "";
  const filtro = $("filtroIcmsOrigem").value;

  icmsTable.forEach((row, idx) => {
    if (filtro && row.ufOrigem !== filtro) return;
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><select data-field="ufOrigem" data-idx="${idx}">${optionsUf(row.ufOrigem)}</select></td>
      <td><select data-field="ufDestino" data-idx="${idx}">${optionsUf(row.ufDestino)}</select></td>
      <td><input type="number" min="0" max="99" step="0.01" value="${row.aliquota}" data-field="aliquota" data-idx="${idx}"></td>
      <td><button type="button" class="btn-remove" data-remove="${idx}" title="Remover">&times;</button></td>
    `;
    tbody.appendChild(tr);
  });

  tbody.querySelectorAll("select, input").forEach((el) => {
    el.addEventListener("input", () => {
      const idx = parseInt(el.dataset.idx, 10);
      const field = el.dataset.field;
      icmsTable[idx][field] = field === "aliquota" ? parseFloat(el.value) || 0 : el.value;
      if (field === "ufOrigem") renderTabelaIcms(); // pode sair do filtro atual
    });
  });
  tbody.querySelectorAll("[data-remove]").forEach((btn) => {
    btn.addEventListener("click", () => {
      icmsTable.splice(parseInt(btn.dataset.remove, 10), 1);
      renderTabelaIcms();
    });
  });
}

$("filtroIcmsOrigem").addEventListener("change", renderTabelaIcms);

$("btnAddIcms").addEventListener("click", () => {
  icmsTable.push({ ufOrigem: "SP", ufDestino: "SP", aliquota: 0 });
  renderTabelaIcms();
});

$("btnSalvarIcms").addEventListener("click", async () => {
  await salvarConfig("icms", icmsTable);
  atualizarComposicao();
  $("msgIcms").textContent = "Cadastro salvo.";
  setTimeout(() => ($("msgIcms").textContent = ""), 2500);
});

/* ============================================================
   Aba Rota (chave OpenRouteService — perfil de caminhão/HGV)
   ============================================================ */
$("btnSalvarOrs").addEventListener("click", async () => {
  orsApiKey = $("orsApiKey").value.trim();
  await salvarConfig("orsApiKey", orsApiKey);
  $("msgOrs").textContent = orsApiKey ? "Chave salva." : "Chave removida.";
  setTimeout(() => ($("msgOrs").textContent = ""), 2500);
});

$("btnLimparOrs").addEventListener("click", async () => {
  orsApiKey = "";
  $("orsApiKey").value = "";
  await salvarConfig("orsApiKey", "");
  $("msgOrs").textContent = "Chave removida.";
  setTimeout(() => ($("msgOrs").textContent = ""), 2500);
});

$("btnSalvarQualp").addEventListener("click", async () => {
  qualpApiKey = $("qualpApiKey").value.trim();
  await salvarConfig("qualpApiKey", qualpApiKey);
  $("msgQualp").textContent = qualpApiKey ? "Chave salva." : "Chave removida.";
  setTimeout(() => ($("msgQualp").textContent = ""), 2500);
});

$("btnLimparQualp").addEventListener("click", async () => {
  qualpApiKey = "";
  $("qualpApiKey").value = "";
  await salvarConfig("qualpApiKey", "");
  $("msgQualp").textContent = "Chave removida.";
  setTimeout(() => ($("msgQualp").textContent = ""), 2500);
});

/* ============================================================
   Aba Vendedores
   ============================================================ */
function renderTabelaVendedores() {
  const tbody = $("tabelaVendedores").querySelector("tbody");
  tbody.innerHTML = "";
  vendedoresTable.forEach((row, idx) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><input type="text" value="${row.nome || ""}" placeholder="Nome do vendedor" data-idx="${idx}"></td>
      <td><button type="button" class="btn-remove" data-remove="${idx}" title="Remover">&times;</button></td>
    `;
    tbody.appendChild(tr);
  });

  tbody.querySelectorAll("input").forEach((inp) => {
    inp.addEventListener("input", () => {
      vendedoresTable[parseInt(inp.dataset.idx, 10)].nome = inp.value;
    });
  });
  tbody.querySelectorAll("[data-remove]").forEach((btn) => {
    btn.addEventListener("click", () => {
      vendedoresTable.splice(parseInt(btn.dataset.remove, 10), 1);
      renderTabelaVendedores();
    });
  });
}

function preencherSelectVendedor() {
  const sel = $("vendedorSelecionado");
  const atual = sel.value;
  const nomes = vendedoresTable.map((v) => v.nome).filter(Boolean);
  if (!nomes.length) {
    sel.innerHTML = `<option value="">Nenhum vendedor cadastrado</option>`;
    $("vendedorAviso").textContent = 'Cadastre vendedores na aba "Vendedores" para selecionar aqui.';
  } else {
    sel.innerHTML = nomes.map((n) => `<option value="${n}">${n}</option>`).join("");
    if (nomes.includes(atual)) sel.value = atual;
    $("vendedorAviso").textContent = "";
  }
}

$("btnAddVendedor").addEventListener("click", () => {
  vendedoresTable.push({ nome: "" });
  renderTabelaVendedores();
});

$("btnSalvarVendedores").addEventListener("click", async () => {
  vendedoresTable = vendedoresTable.filter((v) => v.nome && v.nome.trim());
  await salvarConfig("vendedores", vendedoresTable);
  renderTabelaVendedores();
  preencherSelectVendedor();
  $("msgVendedores").textContent = "Cadastro salvo.";
  setTimeout(() => ($("msgVendedores").textContent = ""), 2500);
});

/* ============================================================
   Aba Histórico (cotações salvas)
   ============================================================ */
function fmtDataHora(iso) {
  const d = new Date(iso);
  return d.toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

function renderHistorico() {
  const tbody = $("tabelaHistorico").querySelector("tbody");
  tbody.innerHTML = "";
  const lista = [...historicoCotacoes].sort((a, b) => new Date(b.criadoEm) - new Date(a.criadoEm));

  $("historicoVazio").hidden = lista.length > 0;
  $("tabelaHistorico").closest(".tabela-scroll").hidden = lista.length === 0;

  lista.forEach((c) => {
    const tr = document.createElement("tr");
    tr.dataset.cotacaoId = c.id;
    tr.innerHTML = `
      <td>${c.numeroFormatado ? `<span class="numero-cotacao-link" data-dre-cotacao="${c.id}">${c.numeroFormatado}</span>` : "—"}</td>
      <td>${fmtDataHora(c.criadoEm)}</td>
      <td>${c.vendedor || "—"}</td>
      <td>${c.origem || "—"}</td>
      <td>${c.destino || "—"}</td>
      <td>${fmtNum(c.km, 1)}</td>
      <td>${fmtBRL(c.pedagio)}</td>
      <td>${fmtBRL(c.valorMercadoria)}</td>
      <td>${fmtBRL(c.totalAntt)}</td>
      <td>${fmtBRL(c.totalMerc)}</td>
      <td>${c.spotDisponivel ? fmtBRL(c.totalSpot) : "—"}</td>
      <td><button type="button" class="btn-remove" data-remove-cotacao="${c.id}" title="Remover">&times;</button></td>
    `;
    tbody.appendChild(tr);
  });

  tbody.querySelectorAll("[data-remove-cotacao]").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      e.stopPropagation();
      const id = btn.dataset.removeCotacao;
      historicoCotacoes = historicoCotacoes.filter((c) => c.id !== id);
      renderHistorico();
      await removerCotacao(id);
    });
  });

  tbody.querySelectorAll("tr[data-cotacao-id]").forEach((tr) => {
    tr.addEventListener("click", () => abrirDetalheCotacao(tr.dataset.cotacaoId));
  });

  tbody.querySelectorAll("[data-dre-cotacao]").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.stopPropagation();
      abrirDreProjetado(link.dataset.dreCotacao);
    });
  });
}

const NOMES_FONTE_KM = {
  qualp: "API QualP",
  "rota-caminhao": "OpenRouteService (perfil caminhão)",
  rota: "OSRM (rota rodoviária)",
  estimativa: "Estimativa (linha reta × fator)",
};

function linhaSecao(titulo) {
  return `<tr class="detalhe-secao"><td colspan="2">${titulo}</td></tr>`;
}
function linhaCampo(rotulo, valor) {
  return `<tr><td>${rotulo}</td><td>${valor ?? "—"}</td></tr>`;
}

function abrirDetalheCotacao(id) {
  const c = historicoCotacoes.find((item) => item.id === id);
  if (!c) return;

  // Cotações salvas antes desta atualização do histórico não têm os campos detalhados
  // (markup, ICMS, composição, fonte do KM/ANTT). Mostrar "0" ou "indefinido" nesse caso
  // seria enganoso — em vez disso, avisamos que o dado não foi capturado na época.
  const legado = !("mkp" in c);
  const NAO_DISPONIVEL = "não disponível (cotação salva antes desta atualização)";
  // Cotações salvas antes da separação do quadro SPOT (mesmo já com markup/ICMS) não têm
  // "spotDisponivel" — trata como um caso à parte, diferente de "sem SPOT cadastrado".
  const spotSuportado = "spotDisponivel" in c;
  const NAO_DISPONIVEL_SPOT = "não disponível (cotação salva antes da separação do quadro SPOT)";
  // Cotações salvas antes do 4º quadrante "Custo Efetivo" não têm "totalEfetivo".
  const efetivoSuportado = "totalEfetivo" in c;
  const NAO_DISPONIVEL_EFETIVO = "não disponível (cotação salva antes do Custo Efetivo)";

  const partes = [];

  partes.push(linhaSecao("Geral"));
  partes.push(linhaCampo("Nº Cotação", c.numeroFormatado || "—"));
  partes.push(linhaCampo("Data/Hora", fmtDataHora(c.criadoEm)));
  partes.push(linhaCampo("Vendedor", c.vendedor || "—"));

  partes.push(linhaSecao("Origem / Destino"));
  partes.push(linhaCampo("CEP Origem", c.cepOrigem || "—"));
  partes.push(linhaCampo("Cidade Origem", c.origem || "—"));
  const temPontosExtras = c.pontosEntregaExtras && c.pontosEntregaExtras.length > 0;
  partes.push(linhaCampo("CEP Destino", c.cepDestino || "—"));
  partes.push(linhaCampo(temPontosExtras ? "Cidade Destino (ponto mais distante)" : "Cidade Destino", c.destino || "—"));
  if (temPontosExtras) {
    const textoExtras = c.pontosEntregaExtras
      .map((p) => (typeof p === "string" ? p : `${p.cidade}${p.cep ? " (CEP " + p.cep + ")" : ""}`))
      .join(", ");
    partes.push(linhaCampo("Outros pontos de entrega", textoExtras));
  }
  partes.push(linhaCampo("UF Origem → UF Destino", `${c.ufOrigem || "?"} → ${c.ufDestino || "?"}`));

  partes.push(linhaSecao("Rota"));
  partes.push(linhaCampo("Km (final)", `${fmtNum(c.km, 1)} km`));
  if (!legado && c.ajusteKmPct) {
    partes.push(linhaCampo("Km bruto (antes do ajuste)", c.kmBruto != null ? `${fmtNum(c.kmBruto, 1)} km` : "—"));
    partes.push(linhaCampo("Ajuste de rota aplicado", `${c.ajusteKmPct > 0 ? "+" : ""}${fmtNum(c.ajusteKmPct, 1)}%`));
  }

  partes.push(linhaSecao("Operação"));
  partes.push(linhaCampo("Quantidade de Eixos", `${c.eixos ?? "—"} eixos${c.nomeVeiculoAntt ? " — " + c.nomeVeiculoAntt : ""}`));
  partes.push(linhaCampo("Tipo de Veículo (Mercado)", `${c.tipoVeiculoMercado || "—"}${c.veiculoValorKm ? ` (${fmtBRL(c.veiculoValorKm)}/km)` : ""}`));
  partes.push(linhaCampo("Valor da Mercadoria", fmtBRL(c.valorMercadoria)));

  partes.push(linhaSecao("Custo ANTT (piso mínimo)"));
  if (legado) {
    partes.push(linhaCampo("Fonte (cadastro/API)", NAO_DISPONIVEL));
  } else {
    partes.push(linhaCampo("Fonte", c.anttFonte === "api" ? "API QualP (resolução vigente)" : "Cadastro manual"));
    if (c.anttFonte === "api") {
      partes.push(linhaCampo("Frete-peso (API)", fmtBRL(c.anttFreightCost)));
      partes.push(linhaCampo("Carga/Descarga (API)", fmtBRL(c.anttLoadUnloadCost)));
      partes.push(linhaCampo("Resolução ANTT", c.anttResolucao || "—"));
    } else {
      partes.push(linhaCampo("CCD (R$/km)", fmtBRL(c.anttCcd)));
      partes.push(linhaCampo("CC (R$ fixo)", fmtBRL(c.anttCc)));
    }
  }
  partes.push(linhaCampo("Custo ANTT (operação, sem markup)", fmtBRL(c.custoAntt)));
  partes.push(linhaCampo("Custo por KM (operação, sem markup)", fmtBRL(c.custoAprox)));
  if (spotSuportado) {
    partes.push(linhaCampo(
      "Custo SPOT (operação, sem markup)",
      c.spotDisponivel ? fmtBRL(c.custoSpot) : "Sem SPOT cadastrado para este trecho e veículo."
    ));
    if (c.spotDisponivel && c.pontosEntregaExtras && c.pontosEntregaExtras.length) {
      partes.push(linhaCampo(
        "Aviso SPOT",
        `⚠ Cobre só Origem → ${c.destino || "ponto mais distante"}. Não inclui o custo das entregas adicionais.`
      ));
    }
  }
  if (efetivoSuportado) {
    partes.push(linhaCampo(
      "Custo Efetivo (operação, sem markup)",
      c.custoEfetivo != null ? fmtBRL(c.custoEfetivo) : "Sem Custo Efetivo disponível (rota com menos de 200 km sem SPOT cadastrado)."
    ));
  }
  if (c.servicoAdicionalValor) {
    partes.push(linhaCampo("Serviço Adicional", `${fmtBRL(c.servicoAdicionalValor)}${c.servicoAdicionalDescricao ? " — " + c.servicoAdicionalDescricao : ""}`));
  }

  partes.push(linhaSecao("Markup / Ad Valorem"));
  if (legado) {
    partes.push(linhaCampo("Detalhes de markup", NAO_DISPONIVEL));
  } else {
    partes.push(linhaCampo("% Custo Fixo", `${fmtNum(c.pctCustoFixo, 1)}%`));
    partes.push(linhaCampo("% Impostos Federais", `${fmtNum(c.pctImpostos, 1)}%`));
    partes.push(linhaCampo("% Margem Esperada", `${fmtNum(c.pctMargem, 1)}%`));
    partes.push(linhaCampo("% Comissão", `${fmtNum(c.pctComissao, 1)}%`));
    partes.push(linhaCampo("MKP utilizado", c.mkp ? `${fmtNum(c.mkp, 4)}${c.mkpNome && !c.mkpNome.startsWith("MKP - ") ? " — " + c.mkpNome : ""}` : "indefinido"));
    partes.push(linhaCampo("% Ad Valorem", `${fmtNum(c.pctAdvalorem, 2)}%`));
  }

  partes.push(linhaSecao("ICMS"));
  if (legado) {
    partes.push(linhaCampo("Alíquota / fonte", NAO_DISPONIVEL));
  } else {
    partes.push(linhaCampo("Alíquota aplicada", c.aliquotaIcms != null ? `${fmtNum(c.aliquotaIcms, 2)}%` : "indefinida"));
    partes.push(linhaCampo("Fonte da alíquota", c.fonteIcms || "—"));
  }

  partes.push(linhaSecao("Composição Final — ANTT"));
  if (legado) {
    partes.push(linhaCampo("Frete Peso / Ad Valorem / ICMS", NAO_DISPONIVEL));
    partes.push(linhaCampo("Pedágio", fmtBRL(c.pedagio)));
    partes.push(linhaCampo("Total Venda", fmtBRL(c.totalAntt)));
  } else {
    partes.push(linhaCampo("Frete Peso", fmtBRL(c.fretePesoAntt)));
    partes.push(linhaCampo("Ad Valorem", fmtBRL(c.advalorem)));
    partes.push(linhaCampo("Pedágio", fmtBRL(c.pedagio)));
    partes.push(linhaCampo("ICMS", fmtBRL(c.icmsAntt)));
    partes.push(linhaCampo("Total Venda", fmtBRL(c.totalAntt)));
  }

  partes.push(linhaSecao("Composição Final — Mercado (Custo por KM)"));
  if (legado) {
    partes.push(linhaCampo("Frete Peso / Ad Valorem / ICMS", NAO_DISPONIVEL));
    partes.push(linhaCampo("Pedágio", fmtBRL(c.pedagio)));
    partes.push(linhaCampo("Total Venda", fmtBRL(c.totalMerc)));
  } else {
    partes.push(linhaCampo("Frete Peso", fmtBRL(c.fretePesoMerc)));
    partes.push(linhaCampo("Ad Valorem", fmtBRL(c.advalorem)));
    partes.push(linhaCampo("Pedágio", fmtBRL(c.pedagio)));
    partes.push(linhaCampo("ICMS", fmtBRL(c.icmsMerc)));
    partes.push(linhaCampo("Total Venda", fmtBRL(c.totalMerc)));
  }

  partes.push(linhaSecao("Composição Final — SPOT"));
  if (legado) {
    partes.push(linhaCampo("Composição SPOT", NAO_DISPONIVEL));
  } else if (!spotSuportado) {
    partes.push(linhaCampo("Composição SPOT", NAO_DISPONIVEL_SPOT));
  } else if (!c.spotDisponivel) {
    partes.push(linhaCampo("Composição SPOT", "Sem SPOT cadastrado para este trecho e veículo."));
  } else {
    partes.push(linhaCampo("Frete Peso", fmtBRL(c.fretePesoSpot)));
    partes.push(linhaCampo("Ad Valorem", fmtBRL(c.advalorem)));
    partes.push(linhaCampo("Pedágio", fmtBRL(c.pedagio)));
    partes.push(linhaCampo("ICMS", fmtBRL(c.icmsSpot)));
    partes.push(linhaCampo("Total Venda", fmtBRL(c.totalSpot)));
  }

  partes.push(linhaSecao("Composição Final — Custo Efetivo"));
  if (legado) {
    partes.push(linhaCampo("Composição Efetivo", NAO_DISPONIVEL));
  } else if (!efetivoSuportado) {
    partes.push(linhaCampo("Composição Efetivo", NAO_DISPONIVEL_EFETIVO));
  } else if (c.custoEfetivo == null) {
    partes.push(linhaCampo("Composição Efetivo", "Sem Custo Efetivo disponível (rota com menos de 200 km sem SPOT cadastrado)."));
  } else {
    partes.push(linhaCampo("Frete Peso", fmtBRL(c.fretePesoEfetivo)));
    partes.push(linhaCampo("Ad Valorem", fmtBRL(c.advalorem)));
    partes.push(linhaCampo("Pedágio", fmtBRL(c.pedagio)));
    partes.push(linhaCampo("ICMS", fmtBRL(c.icmsEfetivo)));
    partes.push(linhaCampo("Total Venda", fmtBRL(c.totalEfetivo)));
  }

  $("detalheCotacaoTabela").innerHTML = partes.join("");
  $("detalheCotacaoOverlay").hidden = false;
}

$("btnFecharDetalheCotacao").addEventListener("click", () => {
  $("detalheCotacaoOverlay").hidden = true;
});
$("detalheCotacaoOverlay").addEventListener("click", (e) => {
  if (e.target === $("detalheCotacaoOverlay")) $("detalheCotacaoOverlay").hidden = true;
});

/* ============================================================
   DRE Projetado (aberto a partir do número da cotação no Histórico)
   ============================================================ */
const PCT_SEGURO = 0.0004; // 0,04% do valor da mercadoria

/**
 * Monta o DRE de um lado (ANTT ou Mercado) a partir dos dados já salvos na cotação.
 * "custoContratacao" é o custo puro do transporte (CCD×km+CC, valor do SPOT cadastrado, ou
 * R$/km×km), sempre SEM pedágio e SEM serviço adicional — cada um entra à parte, como sua
 * própria linha, para não ser contado duas vezes.
 */
function calcularDreLado(freteTotal, custoOperacao, icmsRS, pedagio, valorMercadoria, pctImpostos, pctComissao, pctCustoFixo, servicoAdicionalValor, servicoAdicionalDescricao) {
  const impostosFederais = freteTotal * (pctImpostos / 100);
  const icms = Number(icmsRS) || 0;
  const rob = freteTotal - impostosFederais - icms;

  const servicoAdicional = Number(servicoAdicionalValor) || 0;

  // custoOperacao já inclui o pedágio e o serviço adicional (é o custo cheio usado na
  // Calculadora) — separa aqui em "Custo da Contratação" (sem pedágio, sem serviço adicional)
  // + "Pedágio" + "Custo Extra" (cada um com sua própria linha), que somados voltam a fechar
  // exatamente no custoOperacao. Nada é contado 2x.
  const custoContratacao = Math.max((Number(custoOperacao) || 0) - (Number(pedagio) || 0) - servicoAdicional, 0);
  const custoSeguro = (Number(valorMercadoria) || 0) * PCT_SEGURO;
  const comissao = (freteTotal - icms) * (pctComissao / 100);
  const custoVariavel = custoContratacao + pedagio + servicoAdicional + custoSeguro + comissao;

  const receitaOperacionalLiquida = rob - custoVariavel;

  const custoFixo = freteTotal * (pctCustoFixo / 100);
  const resultado = receitaOperacionalLiquida - custoFixo;
  const resultadoPct = freteTotal ? (resultado / freteTotal) * 100 : 0;

  return {
    freteTotal, impostosFederais, icms, rob,
    custoContratacao, pedagio, servicoAdicional, servicoAdicionalDescricao: servicoAdicionalDescricao || "",
    custoSeguro, comissao, custoVariavel,
    receitaOperacionalLiquida, custoFixo, resultado, resultadoPct,
  };
}

function linhaDre(rotulo, valor, classe) {
  return `<tr class="${classe || ""}"><td>${rotulo}</td><td>${fmtBRL(valor)}</td></tr>`;
}

function preencherTabelaDre(elId, d) {
  const rotuloExtra = `Custo Extra${d.servicoAdicionalDescricao ? " — " + d.servicoAdicionalDescricao : ""}`;
  const linhas = [
    linhaDre("Frete Total", d.freteTotal),
    linhaDre("(&minus;) Impostos Federais", -d.impostosFederais),
    linhaDre("(&minus;) ICMS", -d.icms),
    linhaDre("(=) ROB", d.rob, "dre-subtotal"),
    linhaDre("Custo da Contratação", -d.custoContratacao, "dre-subitem"),
    linhaDre("Pedágio", -d.pedagio, "dre-subitem"),
    linhaDre(rotuloExtra, -d.servicoAdicional, "dre-subitem"),
    linhaDre("Custo com Seguro (0,04% da mercadoria)", -d.custoSeguro, "dre-subitem"),
    linhaDre("Comissão", -d.comissao, "dre-subitem"),
    linhaDre("(=) Custo Variável", -d.custoVariavel, "dre-subtotal"),
    linhaDre("(=) Receita Operacional Líquida", d.receitaOperacionalLiquida, "dre-subtotal"),
    linhaDre("(&minus;) Custo Fixo", -d.custoFixo),
    linhaDre("(=) Resultado", d.resultado, `dre-resultado${d.resultado < 0 ? " dre-negativo" : ""}`),
    `<tr class="dre-resultado-pct${d.resultado < 0 ? " dre-negativo" : ""}"><td></td><td>${fmtNum(d.resultadoPct, 2)}% do faturamento</td></tr>`,
  ];
  $(elId).innerHTML = linhas.join("");
}

let dreAtualCotacaoId = null;

function abrirDreProjetado(id) {
  const c = historicoCotacoes.find((item) => item.id === id);
  if (!c) return;

  dreAtualCotacaoId = id;
  $("dreNumeroCotacao").textContent = `— Cotação Nº ${c.numeroFormatado}`;

  const legado = !("mkp" in c);
  // Cotações salvas antes do 4º quadrante "Custo Efetivo" não têm "totalEfetivo".
  const efetivoNaoSuportado = !legado && !("totalEfetivo" in c);
  const semEfetivo = !legado && !efetivoNaoSuportado && c.custoEfetivo == null;
  $("btnExportarDreExcel").hidden = legado || efetivoNaoSuportado || semEfetivo;

  if (legado) {
    $("dreSubtitulo").textContent = `${c.origem || "?"} → ${c.destino || "?"} · DRE não disponível (cotação salva antes desta atualização — faltam percentuais e ICMS detalhados).`;
    $("dreTabelaEfetivo").innerHTML = "";
    $("dreEfetivoVazio").hidden = true;
    ativarAba("dre");
    return;
  }

  $("dreSubtitulo").textContent = `${c.origem || "?"} → ${c.destino || "?"} · ${fmtDataHora(c.criadoEm)} · Vendedor: ${c.vendedor || "—"} · MKP: ${c.mkp ? fmtNum(c.mkp, 4) : "—"}${c.mkpNome && !c.mkpNome.startsWith("MKP - ") ? " (" + c.mkpNome + ")" : ""}`;

  if (efetivoNaoSuportado || semEfetivo) {
    $("dreTabelaEfetivo").innerHTML = "";
    $("dreEfetivoVazio").hidden = false;
    $("dreEfetivoVazio").textContent = efetivoNaoSuportado
      ? "Não disponível (cotação salva antes do Custo Efetivo)."
      : "Sem Custo Efetivo disponível nesta cotação (rota com menos de 200 km sem SPOT cadastrado).";
    ativarAba("dre");
    return;
  }

  const dEfetivo = calcularDreLado(c.totalEfetivo, c.custoEfetivo, c.icmsEfetivo, c.pedagio, c.valorMercadoria, c.pctImpostos, c.pctComissao, c.pctCustoFixo, c.servicoAdicionalValor, c.servicoAdicionalDescricao);
  preencherTabelaDre("dreTabelaEfetivo", dEfetivo);
  $("dreEfetivoVazio").hidden = true;

  ativarAba("dre");
}

$("btnVoltarHistorico").addEventListener("click", () => ativarAba("historico"));

/**
 * Exporta o DRE Projetado para .xlsx com FÓRMULAS de verdade (não valores fixos), para poder
 * auditar: os "Dados de entrada" ficam em células separadas, e cada linha do DRE (Impostos,
 * ICMS, ROB, Custo Variável, Resultado etc.) é uma fórmula do Excel referenciando essas
 * células — dá pra abrir, clicar numa célula e ver exatamente de onde veio o número, ou até
 * mudar um percentual e ver o resultado recalcular sozinho.
 */
async function exportarDreExcel() {
  const c = historicoCotacoes.find((item) => item.id === dreAtualCotacaoId);
  if (!c || !("mkp" in c) || !("totalEfetivo" in c) || c.custoEfetivo == null) return;

  const workbook = new ExcelJS.Workbook();
  const ws = workbook.addWorksheet("DRE");
  ws.columns = [{ width: 34 }, { width: 18 }];

  const brl = "R$ #,##0.00;[RED]-R$ #,##0.00";
  const pct = "0.00%";

  function linha(rowNum, rotulo, valB, opts = {}) {
    const row = ws.getRow(rowNum);
    row.getCell(1).value = rotulo;
    row.getCell(2).value = valB;
    if (opts.negrito) row.font = { bold: true };
    if (opts.formato) row.getCell(2).numFmt = opts.formato;
    return row;
  }

  ws.mergeCells("A1:B1");
  ws.getCell("A1").value = `DRE Projetado — Cotação Nº ${c.numeroFormatado}`;
  ws.getCell("A1").font = { bold: true, size: 14 };

  ws.mergeCells("A2:B2");
  ws.getCell("A2").value = `${c.origem || "?"} → ${c.destino || "?"} · ${fmtDataHora(c.criadoEm)} · Vendedor: ${c.vendedor || "—"}`;
  ws.getCell("A2").font = { italic: true, color: { argb: "FF6B7686" } };

  linha(4, "Baseado no Custo Efetivo", null, { negrito: true });

  linha(5, "Dados de entrada", null, { negrito: true });
  // Inputs (valores azuis = vêm direto da cotação salva, não são calculados aqui)
  const custoExtraDescricao = c.servicoAdicionalDescricao ? ` — ${c.servicoAdicionalDescricao}` : "";
  linha(6, "Custo da Operação (com pedágio e custo extra)", c.custoEfetivo, { formato: brl });
  linha(7, "Pedágio", c.pedagio, { formato: brl });
  linha(8, `Custo Extra${custoExtraDescricao}`, c.servicoAdicionalValor || 0, { formato: brl });
  linha(9, "Valor da Mercadoria", c.valorMercadoria, { formato: brl });
  linha(10, "ICMS (R$)", c.icmsEfetivo, { formato: brl });
  linha(11, "% Impostos Federais", (c.pctImpostos || 0) / 100, { formato: pct });
  linha(12, "% Comissão", (c.pctComissao || 0) / 100, { formato: pct });
  linha(13, "% Custo Fixo", (c.pctCustoFixo || 0) / 100, { formato: pct });
  [6, 7, 8, 9, 10, 11, 12, 13].forEach((r) => {
    ws.getCell(`B${r}`).font = { color: { argb: "FF1D5DB1" } };
  });

  linha(15, "Cálculo do DRE", null, { negrito: true });

  linha(16, "Frete Total", c.totalEfetivo, { formato: brl });
  ws.getCell("B16").font = { color: { argb: "FF1D5DB1" } };

  linha(17, "(-) Impostos Federais", { formula: "-B16*B11" }, { formato: brl });
  linha(18, "(-) ICMS", { formula: "-B10" }, { formato: brl });
  linha(19, "(=) ROB", { formula: "SUM(B16:B18)" }, { negrito: true, formato: brl });

  linha(20, "Custo da Contratação", { formula: "-(B6-B7-B8)" }, { formato: brl });
  linha(21, "Pedágio", { formula: "-B7" }, { formato: brl });
  linha(22, `Custo Extra${custoExtraDescricao}`, { formula: "-B8" }, { formato: brl });
  linha(23, "Custo com Seguro (0,04% da mercadoria)", { formula: "-B9*0.0004" }, { formato: brl });
  linha(24, "Comissão", { formula: "-(B16-B10)*B12" }, { formato: brl });
  linha(25, "(=) Custo Variável", { formula: "SUM(B20:B24)" }, { negrito: true, formato: brl });

  linha(26, "(=) Receita Operacional Líquida", { formula: "B19+B25" }, { negrito: true, formato: brl });

  linha(27, "(-) Custo Fixo", { formula: "-B16*B13" }, { formato: brl });
  linha(28, "(=) Resultado", { formula: "B26+B27" }, { negrito: true, formato: brl });
  linha(29, "Resultado % do Faturamento", { formula: "B28/B16" }, { formato: pct });

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `dre-cotacao-${c.numeroFormatado.replace("/", "-")}.xlsx`;
  a.click();
  URL.revokeObjectURL(url);
}

$("btnExportarDreExcel").addEventListener("click", () => {
  exportarDreExcel();
  $("msgDreExcel").textContent = "Excel exportado.";
  setTimeout(() => ($("msgDreExcel").textContent = ""), 2500);
});

async function salvarCotacao() {
  if ($("resultsCard").hidden) return;

  $("msgCotacao").textContent = "Salvando...";
  const agora = new Date();
  const ano = agora.getFullYear();
  let numero;
  try {
    numero = await proximoNumeroCotacao(ano);
  } catch (e) {
    $("msgCotacao").textContent = "Erro ao salvar: não foi possível gerar o número da cotação.";
    return;
  }

  const registro = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    numero,
    ano,
    numeroFormatado: `${numero}/${ano}`,
    criadoEm: agora.toISOString(),
    vendedor: $("vendedorSelecionado").value || "",

    // Origem / Destino
    cepOrigem: $("cepOrigem").value.trim(),
    origem: $("cidadeOrigem").value.trim(),
    cepDestino: cepDestinoAtivoValor(),
    destino: textoDestinoAtivo(),
    pontosEntregaExtras: pontosEntregaExtrasParaSalvar(),
    ufOrigem: state.ufOrigem || "",
    ufDestino: state.ufDestino || "",

    // Rota / KM
    km: state.kmDistancia || 0,
    kmBruto: state.kmBruto,
    fonteKm: state.fonteKm,
    ajusteKmPct: state.ajusteKmPct || 0,
    pedagio: state.pedagio || 0,

    // Operação
    eixos: state.eixos,
    nomeVeiculoAntt: state.anttNome || "",
    tipoVeiculoMercado: state.veiculoTipo || "",
    veiculoValorKm: state.veiculoValorKm || 0,
    aproxFonte: state.aproxFonte || "km",
    aproxSpotValor: state.aproxSpotValor,
    spotDisponivel: state.spotDisponivel || false,
    custoSpot: state.custoSpot,
    valorMercadoria: state.valorMercadoria || 0,
    servicoAdicionalDescricao: state.servicoAdicionalDescricao || "",
    servicoAdicionalValor: state.servicoAdicionalValor || 0,

    // Custo ANTT (fonte: cadastro manual ou API QualP)
    anttFonte: state.anttFonte,
    anttCcd: state.anttCcd || 0,
    anttCc: state.anttCc || 0,
    anttFreightCost: state.anttFreightCost,
    anttLoadUnloadCost: state.anttLoadUnloadCost,
    anttResolucao: state.anttResolucao,
    custoAntt: state.custoAntt || 0,
    custoAprox: state.custoAprox || 0,
    custoEfetivo: state.custoEfetivo,

    // Markup / Ad Valorem
    mkp: state.mkp,
    mkpNome: state.mkpNome || "",
    pctCustoFixo: state.pctCustoFixo || 0,
    pctImpostos: state.pctImpostos || 0,
    pctMargem: state.pctMargem || 0,
    pctComissao: state.pctComissao || 0,
    pctAdvalorem: state.pctAdvalorem || 0,
    advalorem: state.advalorem || 0,

    // ICMS
    aliquotaIcms: state.aliquotaIcms,
    fonteIcms: state.fonteIcms || "",

    // Composição final (ANTT e Mercado)
    fretePesoAntt: state.compAntt ? state.compAntt.fretePeso : null,
    icmsAntt: state.compAntt ? state.compAntt.icms : null,
    totalAntt: state.compAntt ? state.compAntt.total : null,
    fretePesoMerc: state.compMerc ? state.compMerc.fretePeso : null,
    icmsMerc: state.compMerc ? state.compMerc.icms : null,
    totalMerc: state.compMerc ? state.compMerc.total : null,
    fretePesoSpot: state.compSpot ? state.compSpot.fretePeso : null,
    icmsSpot: state.compSpot ? state.compSpot.icms : null,
    totalSpot: state.compSpot ? state.compSpot.total : null,
    fretePesoEfetivo: state.compEfetivo ? state.compEfetivo.fretePeso : null,
    icmsEfetivo: state.compEfetivo ? state.compEfetivo.icms : null,
    totalEfetivo: state.compEfetivo ? state.compEfetivo.total : null,
  };

  historicoCotacoes.push(registro);
  renderHistorico();
  $("msgCotacao").textContent = `Cotação nº ${registro.numeroFormatado} salva no histórico.`;
  setTimeout(() => ($("msgCotacao").textContent = ""), 3500);

  limparFormularioParaNovaCotacao();

  await inserirCotacao(registro);
}

/** Volta a Calculadora ao estado inicial depois de salvar, pronta para uma nova cotação. */
function limparFormularioParaNovaCotacao() {
  ["cepOrigem", "cidadeOrigem", "cepDestino", "cidadeDestino"].forEach((id) => {
    $(id).value = "";
  });
  $("feedbackOrigem").textContent = "";
  $("feedbackOrigem").className = "address-feedback";
  $("feedbackDestino").textContent = "";
  $("feedbackDestino").className = "address-feedback";
  limparPontosEntregaExtras();

  $("kmDistancia").value = "";
  $("kmInfo").textContent = "";
  $("pedagio").value = "0";
  $("pedagioInfo").textContent = "";
  $("valorMercadoria").value = "0";
  $("qtdEixos").selectedIndex = 0;
  $("tipoVeiculo").selectedIndex = 0;
  $("servicoAdicionalDescricao").value = "";
  $("servicoAdicionalValor").value = "0";
  $("mkpSelecionado").value = "";

  ultimoKmBruto = null;
  ultimaFonteKm = null;

  state.kmDistancia = 0;
  state.pedagio = 0;
  state.custoAntt = 0;
  state.custoAprox = 0;
  state.custoSpot = null;
  state.spotDisponivel = false;
  state.custoEfetivo = null;
  state.compSpot = null;
  state.compEfetivo = null;
  state.servicoAdicionalDescricao = "";
  state.servicoAdicionalValor = 0;
  state.ufOrigem = "";
  state.ufDestino = "";
  state.origemLat = null;
  state.origemLon = null;
  state.valorMercadoria = 0;
  state.eixos = null;

  $("resSpot").textContent = "R$ 0,00";
  $("resSpotFormula").textContent = "";
  $("resSpotAviso").hidden = true;
  $("resSpotAviso").textContent = "";
  preencherColunaOpcional("composicaoSpotBody", "Spot", null, "Sem SPOT cadastrado para este trecho e veículo.");
  preencherColunaOpcional("composicaoEfetivoBody", "Efetivo", null, "Sem Custo Efetivo disponível (rota com menos de 200 km sem SPOT cadastrado).");

  $("resEfetivo").textContent = "R$ 0,00";
  $("resEfetivoFormula").textContent = "";
  $("resEfetivoAviso").hidden = true;
  $("resEfetivoAviso").textContent = "";

  ultimoOrigemMapa = null;
  ultimoDestinoMapa = null;
  ultimosCandidatosDestinoGeo = [];
  ultimaRotaGeometria = null;
  if (mapaCamadaMarcadores) mapaCamadaMarcadores.clearLayers();

  $("resultsCard").hidden = true;
  $("spotInfoBox").hidden = true;
}

$("btnSalvarCotacao").addEventListener("click", salvarCotacao);

$("btnExportarHistorico").addEventListener("click", () => {
  if (!historicoCotacoes.length) return;
  const colunas = [
    "Nº Cotação", "Data/Hora", "Vendedor", "CEP Origem", "Origem", "CEP Destino", "Destino", "UF Origem", "UF Destino",
    "Km", "Km Bruto", "Fonte Km", "Ajuste Km %", "Pedágio",
    "Eixos", "Veículo ANTT", "Veículo Mercado", "R$/km Mercado", "SPOT Disponível", "Valor SPOT", "Valor Mercadoria",
    "Fonte ANTT", "CCD", "CC", "Frete-peso API", "Carga/Descarga API", "Resolução ANTT",
    "Custo ANTT (operação)", "Custo por KM (operação)", "Custo SPOT (operação)", "Custo Efetivo (operação)", "Serviço Adicional (descrição)", "Serviço Adicional (R$)",
    "% Custo Fixo", "% Impostos", "% Margem", "% Comissão", "MKP", "MKP Nome", "% Ad Valorem", "Ad Valorem (R$)",
    "Alíquota ICMS", "Fonte ICMS",
    "Frete Peso ANTT", "ICMS ANTT", "Total ANTT",
    "Frete Peso Mercado", "ICMS Mercado", "Total Mercado",
    "Frete Peso SPOT", "ICMS SPOT", "Total SPOT",
    "Frete Peso Efetivo", "ICMS Efetivo", "Total Efetivo",
  ];
  const linhas = [...historicoCotacoes]
    .sort((a, b) => new Date(b.criadoEm) - new Date(a.criadoEm))
    .map((c) => [
      c.numeroFormatado, fmtDataHora(c.criadoEm), c.vendedor, c.cepOrigem, c.origem, c.cepDestino, c.destino, c.ufOrigem, c.ufDestino,
      c.km, c.kmBruto, NOMES_FONTE_KM[c.fonteKm] || c.fonteKm, c.ajusteKmPct, c.pedagio,
      c.eixos, c.nomeVeiculoAntt, c.tipoVeiculoMercado, c.veiculoValorKm,
      c.spotDisponivel ? "Sim" : "Não", c.aproxSpotValor, c.valorMercadoria,
      c.anttFonte === "api" ? "API QualP" : "Cadastro manual", c.anttCcd, c.anttCc,
      c.anttFreightCost, c.anttLoadUnloadCost, c.anttResolucao,
      c.custoAntt, c.custoAprox, c.custoSpot, c.custoEfetivo, c.servicoAdicionalDescricao, c.servicoAdicionalValor,
      c.pctCustoFixo, c.pctImpostos, c.pctMargem, c.pctComissao, c.mkp, c.mkpNome, c.pctAdvalorem, c.advalorem,
      c.aliquotaIcms, c.fonteIcms,
      c.fretePesoAntt, c.icmsAntt, c.totalAntt,
      c.fretePesoMerc, c.icmsMerc, c.totalMerc,
      c.fretePesoSpot, c.icmsSpot, c.totalSpot,
      c.fretePesoEfetivo, c.icmsEfetivo, c.totalEfetivo,
    ]);
  const csv = [colunas, ...linhas]
    .map((linha) => linha.map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`).join(";"))
    .join("\r\n");
  const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `historico-cotacoes-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
});

/* ============================================================
   Máscara de CEP + preenchimento automático de endereço/cidade/UF
   ============================================================ */
async function preencherEnderecoPorCEP(cepInputId, cidadeInputId, feedbackId) {
  const feedback = $(feedbackId);
  const clean = onlyDigits($(cepInputId).value);
  if (clean.length !== 8) return;

  feedback.className = "address-feedback";
  feedback.textContent = "Consultando CEP...";

  const dadosCep = await buscarCEP(clean);

  // Evita sobrescrever se o usuário já digitou outro CEP enquanto a consulta rodava
  if (onlyDigits($(cepInputId).value) !== clean) return;

  if (dadosCep.erro) {
    feedback.textContent = dadosCep.motivo;
    feedback.classList.add("err");
    return;
  }

  const cidadeUf = `${dadosCep.cidade} - ${dadosCep.uf}`;
  $(cidadeInputId).value = cidadeUf;

  if (dadosCep.logradouro) {
    feedback.textContent = `✓ ${dadosCep.logradouro}${dadosCep.bairro ? ", " + dadosCep.bairro : ""} — ${cidadeUf}`;
  } else {
    feedback.textContent = `✓ ${cidadeUf} (CEP sem logradouro detalhado — será usado o centro da cidade)`;
  }
  feedback.classList.add("ok");
  tentarAutoCalculoKm();
}

function mascararCEP(input, cidadeInputId, feedbackId) {
  input.addEventListener("input", () => {
    let v = onlyDigits(input.value).slice(0, 8);
    if (v.length > 5) v = v.slice(0, 5) + "-" + v.slice(5);
    input.value = v;
    if (onlyDigits(v).length === 8) {
      preencherEnderecoPorCEP(input.id, cidadeInputId, feedbackId);
    }
  });
}
mascararCEP($("cepOrigem"), "cidadeOrigem", "feedbackOrigem");
mascararCEP($("cepDestino"), "cidadeDestino", "feedbackDestino");

/* ============================================================
   Autocomplete de Cidade (IBGE) — evita erro de digitação de
   cidade/estado, mostrando sugestões enquanto o usuário digita.
   ============================================================ */
const IBGE_CACHE_KEY = "cf_ibge_municipios_v1";
const IBGE_CACHE_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 dias
let municipiosCache = null;
let municipiosPromise = null;

function normalizeStr(s) {
  return (s || "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();
}

async function carregarMunicipios() {
  if (municipiosCache) return municipiosCache;
  if (municipiosPromise) return municipiosPromise;

  municipiosPromise = (async () => {
    try {
      const raw = localStorage.getItem(IBGE_CACHE_KEY);
      if (raw) {
        const cached = JSON.parse(raw);
        if (cached && Array.isArray(cached.data) && cached.data.length > 1000 && Date.now() - cached.ts < IBGE_CACHE_TTL_MS) {
          municipiosCache = cached.data;
          return municipiosCache;
        }
      }
    } catch (e) {
      /* cache corrompido: ignora e busca de novo */
    }

    try {
      const resp = await fetch("https://servicodados.ibge.gov.br/api/v1/localidades/municipios");
      const data = await resp.json();
      const lista = data
        .map((m) => ({
          nome: m.nome,
          uf: m.microrregiao && m.microrregiao.mesorregiao && m.microrregiao.mesorregiao.UF ? m.microrregiao.mesorregiao.UF.sigla : "",
        }))
        .filter((m) => m.uf);
      lista.sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));
      lista.forEach((m) => (m.norm = normalizeStr(m.nome)));
      municipiosCache = lista;
      try {
        localStorage.setItem(IBGE_CACHE_KEY, JSON.stringify({ ts: Date.now(), data: lista }));
      } catch (e) {
        /* localStorage cheio: segue funcionando sem cache persistente */
      }
      return municipiosCache;
    } catch (e) {
      municipiosCache = [];
      return municipiosCache;
    }
  })();

  return municipiosPromise;
}

/**
 * Liga o autocomplete de cidade a um par input/lista já existentes no DOM.
 * `aoSelecionar(municipio)` roda depois de preencher o campo — cada chamador decide o que
 * fazer (recalcular KM na Calculadora, atualizar uma linha da tabela SPOT, etc.).
 */
function configurarAutocompleteCidadeElementos(input, list, aoSelecionar) {
  let ativo = -1;
  let itens = [];

  function atualizarAtivo() {
    [...list.children].forEach((li, idx) => li.classList.toggle("active", idx === ativo));
    const el = list.children[ativo];
    if (el) el.scrollIntoView({ block: "nearest" });
  }

  function fechar() {
    list.hidden = true;
    list.innerHTML = "";
    ativo = -1;
    itens = [];
  }

  function selecionar(m) {
    input.value = `${m.nome} - ${m.uf}`;
    fechar();
    if (aoSelecionar) aoSelecionar(m);
  }

  function renderizar(matches, termo) {
    list.innerHTML = "";
    itens = matches;
    ativo = -1;

    if (!matches.length) {
      const li = document.createElement("li");
      li.className = "empty";
      li.textContent = termo.length < 2 ? "Digite ao menos 2 letras" : "Nenhuma cidade encontrada";
      list.appendChild(li);
      list.hidden = false;
      return;
    }

    matches.forEach((m) => {
      const li = document.createElement("li");
      li.textContent = `${m.nome} - ${m.uf}`;
      li.addEventListener("mousedown", (e) => {
        e.preventDefault();
        selecionar(m);
      });
      list.appendChild(li);
    });
    list.hidden = false;
  }

  async function buscar() {
    const termoBruto = input.value.trim();
    if (termoBruto.length < 2) {
      fechar();
      return;
    }
    // Se o campo já tem "Cidade - UF" completo (preenchido pelo CEP, ou selecionado antes),
    // busca só pelo nome da cidade — o "- UF" no final nunca bate com nada na lista de
    // municípios (que guarda só o nome), e mostrava "Nenhuma cidade encontrada" à toa quando
    // o campo só recebia foco de novo (ex.: Tab), sem o usuário ter digitado nada nele.
    const { cidade, uf } = separarCidadeUf(termoBruto);
    const termo = uf ? cidade : termoBruto;
    const municipios = await carregarMunicipios();
    const norm = normalizeStr(termo);
    const iniciaCom = [];
    const contem = [];
    for (const m of municipios) {
      if (m.norm.startsWith(norm)) iniciaCom.push(m);
      else if (m.norm.includes(norm)) contem.push(m);
    }
    // Nomes mais curtos (mais próximos do termo digitado) aparecem primeiro —
    // evita que uma cidade grande e conhecida (ex. "Campinas") fique escondida
    // atrás de várias cidades pequenas com prefixo parecido (ex. "Campina Verde").
    const porRelevancia = (a, b) => a.nome.length - b.nome.length || a.nome.localeCompare(b.nome, "pt-BR");
    iniciaCom.sort(porRelevancia);
    contem.sort(porRelevancia);
    const matches = iniciaCom.concat(contem).slice(0, 8);
    // Só renderiza se o campo ainda tiver o mesmo valor de quando a busca começou (evita
    // resposta atrasada sobrescrever o que o usuário já digitou por cima)
    if (input.value.trim() === termoBruto) renderizar(matches, termo);
  }

  let debounceTimer;
  input.addEventListener("input", () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(buscar, 150);
  });
  input.addEventListener("focus", () => {
    if (input.value.trim().length >= 2) buscar();
  });
  input.addEventListener("blur", () => {
    setTimeout(fechar, 120); // dá tempo do mousedown no item rodar antes de fechar
  });
  input.addEventListener("keydown", (e) => {
    if (list.hidden || !itens.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      ativo = Math.min(ativo + 1, itens.length - 1);
      atualizarAtivo();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      ativo = Math.max(ativo - 1, 0);
      atualizarAtivo();
    } else if (e.key === "Enter") {
      if (ativo >= 0) {
        e.preventDefault();
        selecionar(itens[ativo]);
      }
    } else if (e.key === "Escape") {
      fechar();
    }
  });
}

function configurarAutocompleteCidade(inputId, listId) {
  configurarAutocompleteCidadeElementos($(inputId), $(listId), () => tentarAutoCalculoKm());
}

configurarAutocompleteCidade("cidadeOrigem", "listCidadeOrigem");
configurarAutocompleteCidade("cidadeDestino", "listCidadeDestino");
carregarMunicipios(); // pré-carrega a lista de cidades em segundo plano

/* ============================================================
   Aba DRE Manual — independente da Calculadora e do Histórico:
   não lê nem grava nenhuma cotação, só usa o que for digitado aqui.
   Reaproveita as mesmas funções de cálculo (MKP, ICMS, DRE) da
   Calculadora, sem mexer em nenhum estado/elemento dela.
   ============================================================ */
function preencherTipoVeiculoManual() {
  const sel = $("tipoVeiculoManual");
  const atual = sel.value;
  sel.innerHTML = optionsVeiculoSpot();
  if (atual) sel.value = atual;
}

/** Mesma ideia do preencherSelectMkp(), mas pro seletor independente da aba DRE Manual. */
function preencherSelectMkpManual() {
  const sel = $("mkpSelecionadoManual");
  const atual = sel.value;
  const opcoes = mkpTable.map((m, idx) => {
    const { mkp } = mkpDePercentuais(m);
    return `<option value="${idx}">${m.nome || "MKP " + (idx + 1)} — ${mkp ? fmtNum(mkp, 4) : "indefinido"}</option>`;
  });
  sel.innerHTML = [`<option value="">${nomeMkpPadrao()}</option>`, ...opcoes].join("");
  if (atual && atual < mkpTable.length) sel.value = atual;
}

/** Mesma ideia do mkpAtivo(), mas lendo o seletor independente da aba DRE Manual. */
function mkpAtivoManual() {
  const idx = $("mkpSelecionadoManual").value;
  if (idx !== "") {
    const escolhido = mkpTable[parseInt(idx, 10)];
    if (escolhido) return { ...escolhido, ...mkpDePercentuais(escolhido), nome: escolhido.nome, ehPadrao: false };
  }
  return { ...vendaParams, ...calcularMkp(), nome: nomeMkpPadrao(), ehPadrao: true };
}

let dreManualUfOrigem = "";
let dreManualUfDestino = "";

configurarAutocompleteCidadeElementos($("dreManualOrigem"), $("listDreManualOrigem"), (m) => {
  dreManualUfOrigem = m.uf;
  calcularDreManual();
});
configurarAutocompleteCidadeElementos($("dreManualDestino"), $("listDreManualDestino"), (m) => {
  dreManualUfDestino = m.uf;
  calcularDreManual();
});

/** Calcula e mostra o DRE Manual a partir só do que foi digitado nesta aba. O Valor do Frete
 * é digitado direto (nenhuma conta em cima dele, nem MKP nem nada) e usado como Frete Total
 * do DRE; o ICMS em cima dele é calculado "por dentro" (icms = frete × alíquota/100) pela
 * mesma alíquota cadastrada na aba ICMS pra essa Origem/Destino. O resto do DRE (Impostos
 * Federais, Comissão, Custo Fixo) usa os percentuais do MKP escolhido, igual ao resto do app. */
function calcularDreManual() {
  const freteTotal = parseFloat($("dreManualFreteTotal").value) || 0;
  const custoContratacao = parseFloat($("dreManualCustoContratacao").value) || 0;
  const pedagio = parseFloat($("dreManualPedagio").value) || 0;
  const custoExtra = parseFloat($("dreManualCustoExtra").value) || 0;
  const valorMercadoria = parseFloat($("dreManualValorMercadoria").value) || 0;

  if (!dreManualUfOrigem || !dreManualUfDestino || !freteTotal) {
    $("dreManualTabela").innerHTML = "";
    $("dreManualVazio").hidden = false;
    $("dreManualVazio").textContent = "Preencha Origem, Destino e o Valor do Frete para calcular.";
    $("dreManualPctBox").hidden = true;
    $("dreManualIcmsInfo").textContent = "";
    return;
  }

  const ativo = mkpAtivoManual();
  const { aliquota, fonte } = obterAliquotaIcms(dreManualUfOrigem, dreManualUfDestino);

  const rotuloMkp = ativo.ehPadrao ? ativo.nome : `${ativo.nome} (percentuais)`;
  const partesInfo = [`Percentuais: ${rotuloMkp}`];
  partesInfo.push(aliquota !== null ? `ICMS ${dreManualUfOrigem} → ${dreManualUfDestino}: ${fmtNum(aliquota, 2)}% (${fonte})` : `ICMS: ${fonte}`);
  $("dreManualIcmsInfo").textContent = partesInfo.join(" · ");

  if (aliquota === null) {
    $("dreManualTabela").innerHTML = "";
    $("dreManualVazio").hidden = false;
    $("dreManualVazio").textContent = "Sem alíquota de ICMS cadastrada para essa Origem/Destino — cadastre na aba ICMS.";
    $("dreManualPctBox").hidden = true;
    return;
  }

  $("dreManualVazio").hidden = true;
  const icms = freteTotal * (aliquota / 100);
  // O Custo Contratação digitado já é tratado como incluindo o pedágio embutido — o
  // calcularDreLado desfaz isso (custoOperacao − pedágio − extra) pra mostrar, na linha
  // "Custo da Contratação" do DRE, só o valor digitado MENOS o pedágio digitado; o Custo
  // Extra continua à parte, como sua própria linha, sem entrar nessa subtração.
  const custoBase = custoContratacao + custoExtra;
  const dManual = calcularDreLado(
    freteTotal,
    custoBase,
    icms,
    pedagio,
    valorMercadoria,
    ativo.pctImpostos,
    ativo.pctComissao,
    ativo.pctCustoFixo,
    custoExtra,
    ""
  );
  preencherTabelaDre("dreManualTabela", dManual);

  if (valorMercadoria > 0) {
    $("dreManualPctBox").hidden = false;
    $("dreManualPct").textContent = fmtNum((freteTotal / valorMercadoria) * 100, 2) + "%";
  } else {
    $("dreManualPctBox").hidden = true;
  }
}

[
  "dreManualFreteTotal",
  "dreManualCustoContratacao",
  "dreManualPedagio",
  "dreManualCustoExtra",
  "dreManualValorMercadoria",
].forEach((id) => $(id).addEventListener("input", calcularDreManual));
$("mkpSelecionadoManual").addEventListener("change", calcularDreManual);

/* ============================================================
   Init — busca os dados no banco compartilhado ANTES de renderizar
   qualquer cadastro, para nunca mostrar telas vazias por um instante.
   ============================================================ */
async function iniciarApp() {
  try {
    await carregarDadosIniciais();
  } catch (e) {
    console.error("Falha ao carregar dados do banco:", e);
    alert("Não foi possível carregar os dados do banco. Verifique sua conexão e recarregue a página.");
  }

  preencherSelects();
  renderAnttConfig();
  renderTabelaAntt();
  renderTabelaVeiculos();
  renderTabelaSpot();
  atualizarLabelBrudam();
  renderVenda();
  renderTabelaMkp();
  preencherSelectMkp();
  preencherSelectMkpManual();
  preencherTipoVeiculoManual();
  preencherFiltroIcms();
  renderTabelaIcms();
  $("ajusteKm").value = ajusteKmPct;
  $("orsApiKey").value = orsApiKey;
  $("qualpApiKey").value = qualpApiKey;
  renderTabelaVendedores();
  preencherSelectVendedor();
  renderHistorico();
  $("ultimaAtualizacao").textContent = BUILD_TIMESTAMP;

  $("carregandoOverlay").hidden = true;
}

iniciarApp();
