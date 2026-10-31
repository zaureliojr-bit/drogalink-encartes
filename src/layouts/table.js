// Layout de tabela: nome, laboratório/MS e preço, em uma ou duas colunas.

import { $, esc, money } from '../utils.js';

export function rowHTML(p, ix) {
  const lab = p.lab ? `<small>${esc(p.lab)}</small>` : '';
  const pill = p.leve > 0 ? `<span class="pill">LEVE <b>${p.leve}</b> POR:</span>` : '';
  return `<div class="trow"${ix >= 0 ? ` draggable="true" data-i="${ix}"` : ''}>`
    + `<div class="tn"><b>${esc(p.name)}</b>${lab}</div>${pill}`
    + `<span class="tp">${money(p.sale)}</span></div>`;
}

// slots = quantas linhas a página reserva (mesmo que sobrem vazias, para as
// linhas não mudarem de altura entre páginas).
export function tableHTML(list, slots, off = 0) {
  const n = $('format').value === 'story' ? 1 : 2;
  const half = Math.ceil(slots / n);
  const rows = Math.max(1, half);
  const cols = n === 2
    ? [[list.slice(0, half), 0], [list.slice(half), half]]
    : [[list, 0]];
  const head = '<div class="thead"><span>Medicamento</span><span>OFERTA</span></div>';
  // Acima de 9 linhas por coluna o conteúdo não cabe no tamanho normal:
  // modo compacto (nome em uma linha, fontes menores).
  return cols.map(x =>
    `<div class="tcol${rows > 9 ? ' dense' : ''}" style="--r:${rows}">`
    + head + x[0].map((p, i) => rowHTML(p, off + x[1] + i)).join('')
    + '</div>').join('');
}
