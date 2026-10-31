# Drogalink Encartes — nota de integração

Resumo para quem for avaliar a integração deste MVP ao painel do padronizador.

## O que é

`index.html` — arquivo único, sem build, sem dependências e sem servidor.
HTML + CSS + JS puro. Hoje roda em https://encartes.drogalink.com.br
(GitHub Pages, repositório `zaureliojr-bit/drogalink-encartes`).

Única dependência externa: SheetJS via CDN, carregada sob demanda **apenas**
quando o usuário importa XLS/XLSX. CSV não usa nada.

## Estado da aplicação

Dois arrays globais no escopo do script:

- `catalog` — todos os produtos cadastrados.
- `selected` — ids dos produtos no encarte, **na ordem em que aparecem**.

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
data URLs do logo, da imagem de cabeçalho e do fundo.

## Pontos de entrada para o banco de dados

Para alimentar o catálogo a partir do painel, só é preciso popular `catalog`.
Três funções já existentes resolvem:

- `addProduct(obj, true)` — insere/atualiza um produto. Usa EAN ou código como
  chave: reimportar atualiza em vez de duplicar. O segundo argumento `true`
  evita re-renderizar a cada item.
- `importProducts(lista)` — importa um lote e mostra o resumo com as
  inconsistências de preço.
- Depois do lote: `renderCatalog(); renderFlyer();`

Ou seja, a integração mínima é um `fetch` no endpoint do painel mapeando os
campos acima e chamando `importProducts()`.

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
