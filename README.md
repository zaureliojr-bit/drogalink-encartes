# Drogalink Encartes

Gerador de encartes de ofertas da Drogaria Mais Barato.

Aplicação estática em **módulos ES nativos**: sem bundler, sem build e sem
servidor. O navegador resolve os imports; o deploy é um push na `main`.

- **Publicado em:** https://encartes.drogalink.com.br
- **Entrada:** `index.html` → `src/main.js`

## Rodar localmente

Módulos ES exigem HTTP (abrir o arquivo direto com `file://` não funciona):

```bash
npm run dev          # http://localhost:5173
# ou, sem npm:
python3 -m http.server 8099
```

## Estrutura

```
src/
  main.js              entrada; expõe window.Drogalink (API pública)
  state.js             estado único (catálogo, seleção, imagens)
  render.js            registro dos renders (evita dependência circular)
  utils.js             $, money, esc, cores, gerador determinístico
  components/          catálogo, ordem do encarte, formulário de produto
  editor/              desenho do encarte, controles do painel, arrastar
  products/            modelo do produto e importações (planilha, lista colada)
  themes/              registro de temas + arte em SVG
    seasonal/          datas e estações (14)
    pharmacy/          farmácia (4)
    supermarket/       varejo alimentar (3)
    premium/           sóbrios (3)
  layouts/             cards, tabela, misto, agrupado e as grades
  export/              PNG, PDF (impressão), CSV e a entrega do arquivo
  services/            localStorage, imagens e o catálogo publicado
  pages/               composição da página do editor
  styles/              base, flyer, layouts e print
public/assets/         arquivos estáticos servidos como estão
database/              esquema SQL de referência (não usado pelo app ainda)
```

## O que ele faz

- Catálogo manual, lista colada, importação de CSV/XLS/XLSX e do
  `produtos.json` publicado pelo padronizador; exportação em CSV.
- Quatro layouts (cards, tabela, misto, agrupado) e 15 grades, com posições
  de destaque.
- Três formatos: A4 para impressão, quadrado para Instagram e 9:16 para
  Stories, com paginação automática.
- 24 temas em quatro famílias, com arte de cabeçalho e textura geradas em
  SVG, mais importação de tema próprio em `.json`.
- Upload de logo, arte de cabeçalho e fundo de página.
- Reordenação por arrastar (mouse) e por setas (toque).
- Exportação em PNG e impressão/PDF pelo próprio navegador.

## Onde os dados ficam

No `localStorage` do navegador, por aparelho (chaves `drogalink_v1` e
`drogalink_temas_v1`). Não há servidor nem conta de usuário. Para integração
com o painel do padronizador, ver `INTEGRACAO-PADRONIZADOR.md`.

## Publicação

GitHub Pages servindo a branch `main` a partir da raiz. O `CNAME` define o
domínio; o DNS (Cloudflare) aponta `encartes` para `zaureliojr-bit.github.io`.
