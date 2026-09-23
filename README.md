# Calculadora de Frete (versão local)

Protótipo local (sem backend) para comparar o custo ANTT (piso mínimo legal) com o custo
aproximado por tipo de veículo, e sugerir preço de venda via markup.

## Como rodar

Os cálculos de CEP/distância usam APIs públicas via `fetch`, que alguns navegadores bloqueiam
quando o arquivo é aberto direto (`file://`). Por isso, suba um servidor local simples:

```bash
cd calculadora-frete
python -m http.server 8791
```

Depois abra `http://localhost:8791` no navegador.

(Alternativas: `npx serve .` ou a extensão "Live Server" do VS Code.)

## O que cada aba faz

- **Calculadora**: CEP/cidade de origem e destino (endereço via ViaCEP + geocodificação
  OpenStreetMap; se o CEP não tiver logradouro, usa o centro da cidade), cálculo automático de
  KM rodoviário (OSRM, com fallback de linha reta × 1,3 se a rota falhar), pedágio manual,
  eixos e tipo de veículo. Mostra custo ANTT, custo aproximado e preço de venda sugerido para
  os dois.
- **Cadastro ANTT**: tabela editável de CCD (R$/km) e CC (taxa fixa) por número de eixos —
  Tabela A de Carga Lotação. Preencha com os valores da resolução ANTT vigente; o app não
  cadastra valores oficiais automaticamente, pois eles mudam por portaria.
- **Custo por KM**: valores de referência por km por tipo de veículo (fiorino, van, 3/4, truck,
  carreta), já pré-preenchidos, editáveis.
- **Parâmetros de Venda**: % custo fixo + % impostos federais + % margem esperada → calcula o
  MKP (divisor de markup) e o preço de venda sugerido.

## Dados

Tudo é salvo no `localStorage` do navegador (por origem/porta). Não há login nem backend —
é um protótipo para validar a lógica antes de virar um serviço com acesso externo.

## Próximos passos para virar SaaS

- Trocar `localStorage` por uma API real (banco de dados) com autenticação por usuário/empresa.
- Mover as chamadas de CEP/geocodificação/rota para o backend (evita depender de CORS do
  navegador e permite cache/rate-limit).
- Adicionar histórico de cotações e exportação (PDF/Excel).
