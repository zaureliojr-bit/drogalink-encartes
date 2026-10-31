// Escolhe o layout da página. off é o índice global do primeiro produto
// desta página, para o arrastar funcionar entre páginas diferentes.

import { $ } from '../utils.js';
import { cardsHTML } from './cards.js';
import { tableHTML } from './table.js';
import { mixedHTML } from './mixed.js';
import { gruposHTML } from './groups.js';

export function pageHTML(list, per, off = 0) {
  const l = $('layout').value;
  if (l === 'table') return tableHTML(list, per, off);
  if (l === 'mixed') return mixedHTML(list, per, off);
  if (l === 'grupos') return gruposHTML(list, per, off);
  return cardsHTML(list, off);
}

export { cardsHTML, tableHTML, mixedHTML, gruposHTML };
