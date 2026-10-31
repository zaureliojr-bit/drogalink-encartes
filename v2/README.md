# Drogalink Encartes 2.0

Nova experiência do editor em desenvolvimento isolado na pasta `v2/`. A aplicação atual da raiz continua preservada.

## Requisitos
- Node.js 20.19+ ou 22.12+
- npm

## Executar localmente
```bash
cd v2
npm install
npm run dev
```

## Gerar build
```bash
npm run build
npm run preview
```

## Primeira fundação
- Interface modular com React + Vite.
- Biblioteca inicial de 18 temas e filtros por categoria.
- Editor com formatos A4, quadrado e Story.
- Cadastro e remoção de produtos.
- Personalização de título, loja e validade.
- Salvamento automático local no navegador.
- Impressão / salvar como PDF pelo navegador.

## Próximas etapas
1. Importação de catálogo CSV/XLSX e compatibilidade com o modelo do MVP.
2. Imagens reais de produtos por EAN/nome e upload manual.
3. Elementos editáveis no layout (texto, imagem, preço, selo, formas).
4. Exportação PNG de alta resolução e PDF com dimensões corretas por formato.
5. Biblioteca de modelos e salvamento de campanhas.
6. Testes automatizados e publicação de preview independente.