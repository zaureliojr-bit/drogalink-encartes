// Layout agrupado: cada caixa reúne 2, 3 ou 4 produtos lado a lado, com
// divisória tracejada. Serve para variações do mesmo item (três cores de
// tintura, três absorventes) dividirem o espaço de um card só.

import { $, esc, money } from '../utils.js';

export function porCaixa() {
  return Math.max(2, Math.min(Number($('porCaixa').value || 3), 4));
}

export function grupoItemHTML(p, ix) {
  const foto = p.image
    ? `<img src="${esc(p.image)}" alt="" onerror="this.parentElement.classList.add('imgfail');this.parentElement.textContent='✚'">`
    : '✚';
  return `<div class="grupo-item"${ix >= 0 ? ` draggable="true" data-i="${ix}"` : ''}>`
    + `<div class="prod-img">${foto}</div>`
    + `<div class="prod-name">${esc(p.name)}</div>`
    + `<div class="gprice">${money(p.sale).replace('R$', '<span>R$</span>')}</div></div>`;
}

export function gruposHTML(list, per, off = 0) {
  const pc = porCaixa();
  const n = $('format').value === 'story' ? 1 : 2;   // caixas por fileira
  const boxes = [];
  for (let i = 0; i < list.length; i += pc) boxes.push(list.slice(i, i + pc));
  const rows = [];
  for (let i = 0; i < boxes.length; i += n) rows.push(boxes.slice(i, i + n));
  let idx = off;
  return rows.map(r =>
    `<div class="grouprow">${r.map(b =>
      `<div class="grupo">${b.map(p => grupoItemHTML(p, idx++)).join('')}</div>`).join('')}</div>`
  ).join('');
}
