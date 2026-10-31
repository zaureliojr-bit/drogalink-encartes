// Ponto de entrada. O index.html carrega este arquivo como módulo ES, e o
// navegador resolve os imports: não há build nem bundler.

import { initEditor } from './pages/editor.js';
import { state } from './state.js';
import { addProduct, importProducts } from './products/model.js';
import { buscarCatalogoPublicado } from './services/catalog-api.js';
import { renderAll } from './render.js';

initEditor();

// API pública. Módulos ES não deixam nada global, e o painel do padronizador
// (ou um console) precisa de um caminho para alimentar o catálogo de fora:
//   Drogalink.importProducts(lista)   // lista no formato do catálogo
//   Drogalink.state.catalog           // o que está carregado agora
window.Drogalink = {
  versao: '2.0.0',
  state,
  addProduct,
  importProducts,
  buscarCatalogoPublicado,
  render: renderAll
};
