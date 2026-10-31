// Página do editor: liga os módulos e faz o primeiro desenho.

import { $ } from '../utils.js';
import { renderers, renderAll } from '../render.js';
import { load } from '../services/storage.js';
import { carregarTemasCustom } from '../themes/custom.js';
import { renderFlyer } from '../editor/flyer.js';
import { initControls } from '../editor/controls.js';
import { initDrag } from '../editor/drag.js';
import { renderCatalog, initCatalogList } from '../components/catalog-list.js';
import { initOrderList } from '../components/order-list.js';
import { initProductForm } from '../components/product-form.js';
import { exportarPNG } from '../export/png.js';
import { imprimir } from '../export/pdf.js';

export function initEditor() {
  // Registra os renders antes de qualquer coisa chamá-los.
  renderers.catalog = renderCatalog;
  renderers.flyer = renderFlyer;

  initControls();
  initCatalogList();
  initOrderList();
  initProductForm();
  initDrag();

  $('png').onclick = exportarPNG;
  $('pdf').onclick = imprimir;

  carregarTemasCustom();  // registra os temas importados antes de aplicar o salvo
  load();
  renderAll();
}
