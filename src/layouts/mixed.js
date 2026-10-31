// Layout misto: os primeiros produtos viram cards com foto no topo e o
// restante da página entra na tabela.

import { $ } from '../utils.js';
import { offerHTML } from './cards.js';
import { tableHTML } from './table.js';

export function highlightCount(per) {
  return Math.max(1, Math.min(Number($('highl').value || 3), Math.max(1, per - 1)));
}

export function mixedHTML(list, per, off = 0) {
  const h = highlightCount(per);
  const cards = list.slice(0, h);
  const rest = list.slice(h);
  // No máximo 4 destaques por linha (2 no Stories): com 12 numa fileira só
  // os cards ficariam ilegíveis.
  const cols = Math.min(h, $('format').value === 'story' ? 2 : 4);
  const rows = Math.ceil(h / cols);
  const base = [33, 50, 60][rows - 1] || 60;
  return `<div class="hirow" style="grid-template-columns:repeat(${cols},minmax(0,1fr));flex-basis:${base}%">`
    + cards.map((p, i) => offerHTML(p, '', rows > 1, off + i)).join('')
    + `</div><div class="tblwrap">${tableHTML(rest, per - h, off + h)}</div>`;
}
