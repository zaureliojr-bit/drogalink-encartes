// Grades do layout de cards: cada arranjo diz quantas colunas e linhas a
// página tem e quais dos primeiros produtos ocupam espaços maiores (h).
// h[i] = [colunas, linhas] que o i-ésimo produto ocupa.

import { $ } from '../utils.js';

export const GRIDS = {
  // A4 e quadrado: base de 4 colunas.
  wide: [
    { id: '4x5',    n: '20 produtos — 4 x 5',                        c: 4, r: 5, h: [] },
    { id: '4x4',    n: '16 produtos — 4 x 4',                        c: 4, r: 4, h: [] },
    { id: '4x3',    n: '12 produtos — 4 x 3',                        c: 4, r: 3, h: [] },
    { id: '4x2',    n: '8 produtos — 4 x 2',                         c: 4, r: 2, h: [] },
    { id: '3x2',    n: '6 produtos — 3 x 2',                         c: 3, r: 2, h: [] },
    { id: '2x2',    n: '4 produtos — 2 x 2',                         c: 2, r: 2, h: [] },
    { id: '4x7',    n: '28 produtos — 4 x 7',                        c: 4, r: 7, h: [] },
    { id: 'g1d8',   n: '9 produtos — 1 destaque + 8',                c: 4, r: 3, h: [[2, 2]] },
    { id: 'g2d8',   n: '10 produtos — 2 destaques + 8',              c: 4, r: 4, h: [[2, 2], [2, 2]] },
    { id: 'glat9',  n: '10 produtos — 1 destaque lateral + 9',       c: 4, r: 3, h: [[1, 3]] },
    { id: 'gtop12', n: '13 produtos — destaque largo no topo + 12',  c: 4, r: 5, h: [[4, 2]] }
  ],
  // Stories: 2 colunas, senão não cabe.
  narrow: [
    { id: 'n2x3', n: '6 produtos — 2 x 3',                     c: 2, r: 3, h: [] },
    { id: 'n2x2', n: '4 produtos — 2 x 2',                     c: 2, r: 2, h: [] },
    { id: 'n2x4', n: '8 produtos — 2 x 4',                     c: 2, r: 4, h: [] },
    { id: 'n1d4', n: '5 produtos — 1 destaque no topo + 4',    c: 2, r: 4, h: [[2, 2]] }
  ]
};

// Cabem c*r células; cada destaque consome as células extras que ocupa.
export const gcount = g => g.c * g.r - g.h.reduce((s, x) => s + x[0] * x[1] - 1, 0);

export const gridList = () => $('format').value === 'story' ? GRIDS.narrow : GRIDS.wide;

export function fillGrid() {
  const list = gridList(), cur = $('grid').value;
  const html = list.map(g => `<option value="${g.id}">${g.n}</option>`).join('');
  if ($('grid').innerHTML !== html) {
    $('grid').innerHTML = html;
    if (list.some(g => g.id === cur)) $('grid').value = cur;
  }
  if (!list.some(g => g.id === $('grid').value)) $('grid').selectedIndex = 0;
}

export function gridSpec() {
  const list = gridList();
  return list.find(g => g.id === $('grid').value) || list[0];
}

// Quantos produtos cabem na página: no layout de cards vem da grade; nos
// outros, do seletor numérico.
export function perPage() {
  return $('layout').value === 'cards' ? gcount(gridSpec()) : Number($('count').value) || 20;
}
