// Layout de cards: foto, nome e preços, um produto por célula da grade.

import { esc, money } from '../utils.js';
import { gridSpec } from './grids.js';

// st: estilo inline (usado pelos destaques, que ocupam mais células).
// dense: grade apertada — nome em 2 linhas e margens menores.
// ix: índice global do produto, que habilita o arrastar para reordenar.
export function offerHTML(p, st, dense, ix) {
  const desconto = p.normal > p.sale
    ? `<div class="badge">-${Math.max(1, Math.round((1 - p.sale / p.normal) * 100))}%</div>` : '';
  const foto = p.image
    ? `<img src="${esc(p.image)}" alt="" onerror="this.parentElement.classList.add('imgfail');this.parentElement.textContent='✚'">`
    : '✚';
  const antigo = p.normal > 0 && p.normal > p.sale
    ? `<span class="old-price">${money(p.normal)}</span>` : '';
  return `<div class="offer${dense ? ' dense' : ''}"${st ? ` style="${st}"` : ''}${ix >= 0 ? ` draggable="true" data-i="${ix}"` : ''}>`
    + desconto
    + `<div class="prod-img">${foto}</div>`
    + `<div class="prod-name">${esc(p.name)}</div>`
    + `<div class="pricerow">${antigo}<span class="sale-price">${money(p.sale).replace('R$', '<span>R$</span>')}</span></div>`
    + '</div>';
}

export function cardsHTML(list, off = 0) {
  const sp = gridSpec(), h = sp.h, dense = sp.c * sp.r >= 16;
  return list.map((p, i) => offerHTML(
    p,
    h[i] ? `grid-column:span ${h[i][0]};grid-row:span ${h[i][1]}` : '',
    dense && !h[i],
    off + i
  )).join('');
}
