// Lista colada: uma linha por produto, campos separados por ; tab ou |.
// O nome vem primeiro; o resto pode vir em qualquer ordem — laboratório/MS,
// "leve N" (ou só o número) e preços. Com dois preços, o primeiro é o normal
// e o último, o da oferta.

import { parsePrice } from './import-sheet.js';

const priceRe = /^(R\$\s*)?\d{1,3}(\.\d{3})*,\d{1,2}$|^(R\$\s*)?\d+[.,]\d{1,2}$/;

export function parseList(text) {
  return text.split(/\r?\n/).map(l => l.trim()).filter(Boolean).map(raw => {
    const parts = raw.split(/\t|;|\|/).map(x => x.trim()).filter(Boolean);
    const name = parts.shift() || '';
    const prices = [], lab = [];
    let leve = 0;
    parts.forEach(x => {
      let m;
      if (m = x.match(/^leve\s*(\d+)(\s*por.*)?$/i)) leve = +m[1];
      else if (priceRe.test(x)) prices.push(parsePrice(x));
      else if (/^\d{1,2}$/.test(x)) leve = +x;
      else lab.push(x);
    });
    return {
      raw, name,
      lab: lab.join(' - '),
      leve,
      normal: prices.length > 1 ? prices[0] : 0,
      sale: prices.length ? prices[prices.length - 1] : 0
    };
  });
}
