# Drogalink Encartes

Gerador de encartes de ofertas da Drogaria Mais Barato.

Aplicacao estatica: um unico arquivo HTML, sem servidor e sem banco de dados.
Todo o processamento acontece no navegador do usuario.

- **Publicado em:** https://encartes.drogalink.com.br
- **Arquivo da aplicacao:** `index.html`

## Como funciona

- Catalogo de produtos salvo no `localStorage` do proprio navegador (por aparelho).
- Importacao de planilha CSV, XLS e XLSX (a leitura de XLS/XLSX carrega a biblioteca SheetJS via CDN na primeira vez).
- Tres layouts de encarte: cards com imagem, tabela e misto (destaques + tabela).
- Tres formatos: A4 para impressao, quadrado para Instagram e 9:16 para Stories/WhatsApp.
- Exportacao em PNG e impressao/salvar em PDF pelo proprio navegador.

## Desenvolvimento

Nao ha build nem dependencias: abra `index.html` no navegador.

## Publicacao

GitHub Pages, servindo a branch `main` a partir da raiz. O arquivo `CNAME`
define o dominio personalizado; o DNS aponta `encartes` para `zaureliojr-bit.github.io`.
