// Seção 4: ordem dos produtos no encarte. Decide quem ocupa os destaques
// das grades e os cards do topo no layout misto.

import { $, esc, money } from '../utils.js';
import { state } from '../state.js';
import { renderAll } from '../render.js';
import { moveSel } from '../editor/drag.js';

export function renderOrder() {
  const list = state.selected.map(id => state.catalog.find(p => p.id === id)).filter(Boolean);
  $('order').innerHTML = list.length ? list.map((p, i) => `
    <div class="product ord" draggable="true" data-i="${i}">
      <div><strong>${i + 1}. ${esc(p.name)}</strong><small>${money(p.sale)}</small></div>
      <div class="pbtns">
        <button data-up="${i}" title="Subir" aria-label="Subir">↑</button>
        <button data-dn="${i}" title="Descer" aria-label="Descer">↓</button>
        <button data-rm="${i}" title="Tirar do encarte" aria-label="Tirar do encarte">✕</button>
      </div>
    </div>`).join('')
    : '<div class="notice">Nenhum produto no encarte ainda. Clique em “Adicionar” no catálogo.</div>';
}

export function initOrderList() {
  $('order').onclick = e => {
    const u = e.target.closest('[data-up]'),
          d = e.target.closest('[data-dn]'),
          r = e.target.closest('[data-rm]');
    if (u) return moveSel(+u.dataset.up, +u.dataset.up - 1);
    if (d) return moveSel(+d.dataset.dn, +d.dataset.dn + 1);
    if (r) { state.selected.splice(+r.dataset.rm, 1); renderAll() }
  };
}
