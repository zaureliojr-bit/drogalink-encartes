// Arte dos temas, gerada em SVG no próprio navegador: um cabeçalho composto
// por camadas (gradiente, brilho, faixas diagonais, motivos e onda) e uma
// textura que se repete ao fundo da página. Nada é baixado de fora.

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
const W = 1200, H = 400;

// Posiciona um motivo: translada, gira e escala em torno do próprio centro.
const posicionar = (sh, x, y, sc, rt, fill, op) =>
  `<g transform="translate(${x} ${y}) rotate(${rt}) scale(${sc}) translate(-50 -50)" fill="${fill}" opacity="${op}">${sh}</g>`;

function cabecalho(tema, accent, r) {
  const motivo = tema.m ? (MOTIFS[tema.m] || MOTIFS.star) : null;
  const sh = motivo ? motivo.replace(/__C__/g, accent) : null;
  const camadas = [];

  // 1. Brilho suave no canto superior esquerdo, onde fica o nome da loja.
  camadas.push(`<rect width="${W}" height="${H}" fill="url(#brilho)"/>`);

  // 2. Dois motivos grandes, bem apagados, dando profundidade ao fundo.
  if (sh) {
    for (let i = 0; i < 2; i++) {
      camadas.push(posicionar(sh,
        Math.round(120 + r() * (W - 240)), Math.round(r() * H),
        (2.2 + r() * 1.4).toFixed(2), Math.round(r() * 360), accent, '.05'));
    }
  }

  // 3. Faixas diagonais atravessando a direita, como num encarte impresso.
  const d1 = Math.round(W * .52), larg = Math.round(W * .16);
  camadas.push(`<path d="M${d1} 0 L${d1 + larg} 0 L${d1 + larg - 150} ${H} L${d1 - 150} ${H} Z" fill="${accent}" opacity=".10"/>`);
  camadas.push(`<path d="M${d1 + larg + 40} 0 L${d1 + larg + 95} 0 L${d1 + larg - 55} ${H} L${d1 + larg - 110} ${H} Z" fill="${accent}" opacity=".07"/>`);

  // 4. Anel no canto direito (o mesmo gesto que o CSS fazia na faixa lisa).
  camadas.push(`<circle cx="${W - 70}" cy="-40" r="150" fill="none" stroke="${accent}" stroke-width="34" opacity=".10"/>`);

  // 5. Chuva de motivos pequenos.
  if (sh) {
    for (let i = 0; i < 14; i++) {
      camadas.push(posicionar(sh,
        Math.round(r() * W), Math.round(r() * H),
        (.22 + r() * .5).toFixed(2), Math.round(r() * 360), accent,
        (.08 + r() * .12).toFixed(2)));
    }
  }

  // 6. Onda clara na base, separando o cabeçalho dos produtos.
  camadas.push(`<path d="M0 ${H - 46} C ${W * .25} ${H - 86}, ${W * .55} ${H - 6}, ${W} ${H - 54} L${W} ${H} L0 ${H} Z" fill="#ffffff" opacity=".10"/>`);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">`
    + '<defs>'
    + `<linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${tema.g[0]}"/><stop offset="1" stop-color="${tema.g[1]}"/></linearGradient>`
    + '<radialGradient id="brilho" cx="18%" cy="8%" r="75%"><stop offset="0" stop-color="#ffffff" stop-opacity=".22"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/></radialGradient>'
    + '</defs>'
    + `<rect width="${W}" height="${H}" fill="url(#g)"/>`
    + camadas.join('')
    + '</svg>';
}

function textura(tema, r) {
  const motivo = tema.m ? (MOTIFS[tema.m] || MOTIFS.star) : null;
  if (!motivo) return '';
  const sh = motivo.replace(/__C__/g, tema.g[0]);
  const S = 300, el = [];
  for (let i = 0; i < 4; i++) {
    el.push(posicionar(sh, Math.round(r() * S), Math.round(r() * S),
      (.5 + r() * .5).toFixed(2), Math.round(r() * 360), tema.g[0], '1'));
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${S}" height="${S}">${el.join('')}</svg>`;
}

// kind: 'h' cabeçalho, 'b' textura de fundo.
// Tema sem motivo rende cabeçalho só com gradiente, brilho e faixas, e
// nenhuma textura de fundo — é o que mantém os temas sóbrios sóbrios.
export function themeArt(kind, key, tema) {
  if (!tema) return '';
  const accent = $('caccent').value;
  const ck = kind + key + accent;
  if (cache[ck]) return cache[ck];

  const svg = kind === 'h'
    ? cabecalho(tema, accent, rnd(kind + key))
    : textura(tema, rnd(kind + key));
  if (!svg) return '';

  return cache[ck] = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}
