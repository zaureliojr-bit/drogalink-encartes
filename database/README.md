# database/

Esquema de referência para a fase em que o encarte deixar de viver só no
navegador. **Nada aqui está em uso pelo app hoje**: o MVP guarda catálogo,
seleção, temas e imagens no `localStorage`.

- `schema.sql` — tabelas de lojas, produtos, campanhas, itens da campanha e
  temas. Os campos espelham o formato que o app já usa em memória, para a
  migração ser um mapeamento direto.
- `seed/produtos-exemplo.json` — 20 produtos no formato `produtos.json` do
  padronizador, para testar a importação sem depender da rede.

Quando a integração com o painel acontecer, o caminho mais curto é o app
continuar como está e passar a ler de um endpoint: ver
`INTEGRACAO-PADRONIZADOR.md` na raiz.
