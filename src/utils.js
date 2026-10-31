// Funções de uso geral, sem estado e sem dependência de outros módulos.

export const $ = id => document.getElementById(id);

export const money = n =>
  Number(n || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export const esc = s =>
  String(s ?? '').replace(/[&<>"']/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// Luminância relativa (WCAG), usada para decidir se o texto sobre uma cor
// deve ser escuro ou claro.
export function lum(h) {
  const n = parseInt(h.slice(1), 16);
  const f = v => { v /= 255; return v <= .03928 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4) };
  return .2126 * f(n >> 16 & 255) + .7152 * f(n >> 8 & 255) + .0722 * f(n & 255);
}

export const ink = h => lum(h) > .45 ? '#22233a' : '#fff';

// Gerador pseudoaleatório determinístico: a mesma semente devolve sempre a
// mesma sequência, para a arte dos temas não mudar a cada render.
export function rnd(seed) {
  let s = 7;
  for (const ch of seed) s = (s * 31 + ch.charCodeAt(0)) >>> 0;
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296 };
}

export const slugify = s => String(s || '').trim().toLowerCase()
  .normalize('NFD').replace(/[̀-ͯ]/g, '')
  .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
