# Drogalink Encartes — nota de integração

Resumo para quem for avaliar a integração deste MVP ao painel do padronizador.

## O que é

Aplicação estática em módulos ES: sem bundler, sem build, sem servidor.
`index.html` carrega `src/main.js` e o navegador resolve os imports.
Roda hoje em https://encartes.drogalink.com.br (GitHub Pages, repositório
`zaureliojr-bit/drogalink-encartes`).

Única dependência externa: SheetJS via CDN, carregada sob demanda **apenas**
quando o usuário importa XLS/XLSX. CSV não usa nada.

A estrutura de pastas está no README. O que interessa para integrar:

| Caminho | Papel |
|---|---|
| `src/state.js` | estado único: catálogo, seleção, imagens |
| `src/products/model.js` | `addProduct`, `importProducts`, `filtered` |
| `src/services/catalog-api.js` | leitura do `produtos.json` do padronizador |
| `src/services/storage.js` | persistência no localStorage |
| `src/layouts/` | os quatro layouts e as grades |
| `src/themes/` | temas por família + arte em SVG |
| `database/schema.sql` | esquema de referência, ainda não usado |

## Estado da aplicação

Formato do produto:

```js
{ id, name, normal, sale, code, ean, image, category, lab, leve }
```

- `normal` = preço de venda, `sale` = preço da oferta (obrigatório, > 0).
- `image` = URL ou data URL.
- `lab` = texto já concatenado, ex.: `"MEDLEY - MS.: 1832601360014"`.
- `leve` = quantidade da promoção "leve N por", 0 quando não houver.

Persistência: `localStorage`, chave `drogalink_v1`, com `{catalog, selected,
logo, hb, pb, f}` — `f` são os campos do formulário; `logo`, `hb` e `pb` são
data URLs do logo, da imagem de cabeçalho e do fundo. Temas importados ficam
na chave `drogalink_temas_v1`.

## Pontos de entrada para o banco de dados

Módulos ES não deixam nada global, então o app expõe de propósito uma API
pública em `window.Drogalink` (ver `src/main.js`):

```js
Drogalink.importProducts(lista)          // lote, com resumo das inconsistências
Drogalink.addProduct(obj, true)          // um item; EAN/código evitam duplicar
Drogalink.buscarCatalogoPublicado(url, soOfertas)
Drogalink.state.catalog                  // o que está carregado
Drogalink.render()                       // redesenha catálogo e encarte
```

A integração mínima é um `fetch` no endpoint do painel, mapeando as colunas
para os nomes acima, e uma chamada a `Drogalink.importProducts()`.

O botão "Importar catálogo publicado" já faz isso com o `produtos.json`
(`src/services/catalog-api.js`), e o endereço é editável no painel — serve
para uma segunda unidade com catálogo próprio.

## Imagens: o ponto que motivou a conversa

Imagem por URL externa **aparece na tela e no PDF**, mas **não entra na
exportação em PNG**: o PNG é gerado em `<canvas>`, e o navegador recusa
exportar um canvas que contenha imagem de outra origem (CORS).

Se as fotos forem servidas pela mesma origem do app, o problema desaparece.
Se vierem de outro host, basta o host enviar `Access-Control-Allow-Origin`
(o código já carrega as imagens com `crossOrigin="anonymous"`).

## Saídas

- **PNG**: `index.html` → handler de `#png`. Serializa o encarte em SVG
  (`foreignObject`) e rasteriza em canvas. 1240px de largura no A4.
- **PDF**: `window.print()` com `@media print` configurado para A4 retrato.

## Recursos atuais

Catálogo manual, colar lista, importar CSV/XLS/XLSX, exportar CSV.
Três layouts (cards, tabela, misto), 15 grades com posições de destaque,
3 formatos (A4, quadrado, stories), paginação automática, 14 temas sazonais
com arte gerada em SVG, upload de logo/cabeçalho/fundo, reordenação por
arrastar e por setas.

## Limites conhecidos

- Tudo vive no navegador: trocar de máquina ou limpar o navegador perde o
  catálogo (há exportação CSV como saída).
- `localStorage` tem cerca de 5 MB; fotos em data URL consomem rápido. O app
  avisa quando a gravação falha.
- Sem usuários, sem histórico de campanhas, sem fila de aprovação.
