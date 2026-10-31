// Arte dos temas, gerada em SVG no próprio navegador: um cabeçalho com
// gradiente e motivos espalhados, e uma textura que se repete ao fundo da
// página. Nada é baixado de fora.

import { $, rnd } from '../utils.js';

// Desenhos disponíveis. __C__ é trocado pela cor no momento de gerar.
export const MOTIFS = {
  heart: '<path d="M50 80 L18 48 A18 18 0 0 1 50 24 A18 18 0 0 1 82 48 Z"/>',
  star: '<path d="M50 10 L61 38 L90 40 L68 58 L75 88 L50 71 L25 88 L32 58 L10 40 L39 38 Z"/>',
  snow: '<path d="M50 8V92M8 50H92M20 20L80 80M80 20L20 80" stroke="__C__" stroke-width="8" fill="none" stroke-linecap="round"/>',
  sun: '<circle cx="50" cy="50" r="22"/><path d="M50 4V18M50 82V96M4 50H18M82 50H96M18 18L28 28M72 72L82 82M82 18L72 28M28 72L18 82" stroke="__C__" stroke-width="8" fill="none" stroke-linecap="round"/>',
  leaf: '<path d="M50 8C80 30 80 70 50 92C20 70 20 30 50 8Z"/>',
  flag: '<path d="M4 16H96" stroke="__C__" stroke-width="5" fill="none"/><path d="M12 16L22 46L32 16ZM42 16L52 46L62 16ZM72 16L82 46L92 16Z"/>',
  egg: '<path d="M50 10C72 10 85 40 85 58A35 35 0 0 1 15 58C15 40 28 10 50 10Z"/>',
  flower: '<circle cx="50" cy="26" r="15"/><circle cx="50" cy="74" r="15"/><circle cx="26" cy="50" r="15"/><circle cx="74" cy="50" r="15"/>'
};

const cache = {};

// kind: 'h' cabeçalho (1200x400), 'b' textura de fundo (ladrilho 300x300).
// Tema sem motivo (motivo nulo) rende um cabeçalho só com o gradiente e
// nenhuma textura de fundo — é o que faz os temas sóbrios ficarem sóbrios.
export function themeArt(kind, key, tema) {
  if (!tema) return '';
  const accent = $('caccent').value;
  const ck = kind + key + accent;
  if (cache[ck]) return cache[ck];

  const motivo = tema.m ? (MOTIFS[tema.m] || MOTIFS.star) : null;
  if (!motivo && kind === 'b') return '';
  const r = rnd(kind + key);
  let svg;

  if (kind === 'h') {
    const W = 1200, H = 400, el = [];
    if (motivo) {
      const sh = motivo.replace(/__C__/g, accent);
      for (let i = 0; i < 18; i++) {
        const x = Math.round(r() * W), y = Math.round(r() * H);
        const sc = (.3 + r() * .8).toFixed(2);
        const op = (.07 + r() * .14).toFixed(2);
        const rt = Math.round(r() * 360);
        el.push(`<g transform="translate(${x} ${y}) rotate(${rt}) scale(${sc}) translate(-50 -50)" fill="${accent}" opacity="${op}">${sh}</g>`);
      }
    }
    svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${tema.g[0]}"/><stop offset="1" stop-color="${tema.g[1]}"/></linearGradient></defs><rect width="${W}" height="${H}" fill="url(#g)"/>${el.join('')}</svg>`;
  } else {
    const S = 300, el = [];
    const sh = motivo.replace(/__C__/g, tema.g[0]);
    for (let i = 0; i < 4; i++) {
      const x = Math.round(r() * S), y = Math.round(r() * S);
      const sc = (.5 + r() * .5).toFixed(2);
      const rt = Math.round(r() * 360);
      el.push(`<g transform="translate(${x} ${y}) rotate(${rt}) scale(${sc}) translate(-50 -50)" fill="${tema.g[0]}">${sh}</g>`);
    }
    svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${S}" height="${S}">${el.join('')}</svg>`;
  }

  return cache[ck] = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}
