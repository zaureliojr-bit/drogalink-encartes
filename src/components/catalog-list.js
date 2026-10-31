// Seção 3: lista do catálogo, com busca, seleção e os botões de lote.

import { $, esc, money } from '../utils.js';
import { state } from '../state.js';
import { renderAll } from '../render.js';
import { delProduct, filtered } from '../products/model.js';
import { editProduct } from './product-form.js';

export function renderCatalog() {
  const lista = filtered();
  $('total').textContent = state.catalog.length;
  $('products').innerHTML = lista.length ? lista.map(p => `
    <div class="product">
      <div><strong>${esc(p.name)}</strong><small>${esc(p.code || p.ean || p.category || 'Sem código')} · ${money(p.sale)}</small></div>
      <div class="pbtns">
        <button data-add="${p.id}">${state.selected.includes(p.id) ? 'Adicionado' : 'Adicionar'}</button>
        <button data-edit="${p.id}" title="Editar" aria-label="Editar produto">✎</button>
        <button data-del="${p.id}" title="Excluir" aria-label="Excluir produto">✕</button>
      </div>
    </div>`).join('')
    : '<div class="notice">Nenhum produto encontrado. Cadastre um produto ou importe um CSV.</div>';
}

export function initCatalogList() {
  $('search').oninput = renderCatalog;

  $('products').onclick = e => {
    const ed = e.target.closest('[data-edit]'), dl = e.target.closest('[data-del]');
    if (ed) return editProduct(ed.dataset.edit);
    if (dl) { if (delProduct(dl.dataset.del)) renderAll(); return }
    const b = e.target.closest('[data-add]');
    if (!b) return;
    const id = b.dataset.add;
    if (state.selected.includes(id)) state.selected = state.selected.filter(x => x !== id);
    else state.selected.push(id);
    renderAll();
  };

  // Com busca ativa, os dois botões valem só para os produtos encontrados.
  $('addAll').onclick = () => {
    filtered().forEach(p => { if (!state.selected.includes(p.id)) state.selected.push(p.id) });
    renderAll();
  };
  $('rmAll').onclick = () => {
    const ids = filtered().map(p => p.id);
    state.selected = state.selected.filter(id => !ids.includes(id));
    renderAll();
  };
  $('removeSelected').onclick = () => { state.selected = []; renderAll() };
  $('clearAll').onclick = () => {
    if (!confirm('Apagar todos os produtos do catálogo?')) return;
    state.catalog = [];
    state.selected = [];
    renderAll();
  };
}
