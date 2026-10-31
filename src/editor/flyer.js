// Desenho do encarte: cabeçalho, páginas, cores e rodapés.

import { $, ink } from '../utils.js';
import { state } from '../state.js';
import { save } from '../services/storage.js';
import { fillGrid, gridSpec, perPage } from '../layouts/grids.js';
import { pageHTML } from '../layouts/index.js';
import { getTema, PADRAO } from '../themes/index.js';
import { themeArt } from '../themes/art.js';
import { renderOrder } from '../components/order-list.js';
import { syncFields } from './controls.js';

// Cores, logo e arte do tema. A imagem enviada pelo usuário tem prioridade
// sobre a arte gerada pelo tema, tanto no cabeçalho quanto no fundo.
export function applyBrand() {
  const f = $('flyer');
  const b = $('cbrand').value, a = $('caccent').value;
  const lg = $('flyerLogo'), hd = f.querySelector('.flyer-head');

  f.style.setProperty('--brand', b);
  f.style.setProperty('--accent', a);
  f.style.setProperty('--onbrand', ink(b));
  f.style.setProperty('--onaccent', ink(a));

  if (state.logoData) { lg.src = state.logoData; lg.hidden = false }
  else { lg.removeAttribute('src'); lg.hidden = true }
  hd.classList.toggle('has-logo', !!state.logoData);

  const temaId = $('theme').value;
  const tema = getTema(temaId);
  const headSrc = state.headBgData || (tema ? themeArt('h', temaId, tema) : '');
  const bgSrc = state.pageBgData || (tema ? themeArt('b', temaId, tema) : '');

  // Foto do usuário leva escurecimento para o texto continuar legível; arte
  // pronta (biblioteca ou tema) já nasce com contraste e vai sem filtro.
  const foto = !!state.headBgData && !state.headBgArt;
  hd.classList.toggle('has-bg', foto);
  hd.classList.toggle('has-art', !!headSrc && !foto);
  if (headSrc) {
    f.style.setProperty('--headbg', 'url("' + headSrc + '")');
    f.style.setProperty('--onbrand', '#fff');
  } else f.style.removeProperty('--headbg');

  f.classList.toggle('hasbg', !!bgSrc);
  f.classList.toggle('patt', !state.pageBgData && !!bgSrc);
  if (bgSrc) f.style.setProperty('--pagebg', 'url("' + bgSrc + '")');
  else f.style.removeProperty('--pagebg');

  $('removeHeadBg').hidden = !state.headBgData;
  $('removePageBg').hidden = !state.pageBgData;

  const pr = tema ? tema.p : PADRAO.preco;
  f.style.setProperty('--price', pr);
  f.style.setProperty('--onprice', ink(pr));
  f.style.setProperty('--bgop', Number($('bgOpacity').value || 0) / 100);
  $('bgOpacityVal').textContent = $('bgOpacity').value;
}

// Faixa de aviso legal e rodapé institucional.
export function applyExtras() {
  const t = $('layout').value !== 'cards';
  const lg = $('flyerLegal');
  const c = $('contactText').value.trim();
  const d = $('deliveryText').value.trim();
  const i = $('installText').value.trim();
  const dt = $('valid').value;

  lg.textContent = $('legalText').value.trim();
  lg.hidden = !t || !lg.textContent;
  $('ifContact').textContent = c; $('ifContact').hidden = !c;
  $('ifDelivery').textContent = d; $('ifDelivery').hidden = !d;
  $('ifValid').textContent = dt
    ? 'Ofertas válidas até ' + new Date(dt + 'T12:00:00').toLocaleDateString('pt-BR') + ' ou enquanto durarem os estoques.'
    : 'Ofertas válidas enquanto durarem os estoques.';
  $('ifInst').textContent = i; $('ifInst').hidden = !i;
  $('infoFoot').hidden = !$('useInfo').checked;
}

// Clona a primeira página quantas vezes for preciso e ajusta a grade de cada
// uma conforme o layout.
export function buildPages(chosen, per) {
  const f = $('flyer'), shell = f.parentElement;
  const base = $('flyerFoot').textContent;
  const pages = Math.max(1, Math.ceil(chosen.length / per));
  const layout = $('layout').value;
  const table = layout === 'table', mixed = layout === 'mixed', grupos = layout === 'grupos';
  const tcols = $('format').value === 'story' ? 1 : 2;

  shell.querySelectorAll('.flyer.extra').forEach(e => e.remove());
  $('pageCount').textContent = pages;

  for (let i = 0; i < pages; i++) {
    let el = f;
    if (i > 0) {
      el = f.cloneNode(true);
      el.removeAttribute('id');
      el.classList.add('extra');
      el.querySelectorAll('[id]').forEach(e => e.removeAttribute('id'));
      shell.appendChild(el);
      el.querySelector('.gridproducts').innerHTML =
        pageHTML(chosen.slice(i * per, (i + 1) * per), per, i * per);
    }
    const g = el.querySelector('.gridproducts');
    const sp = gridSpec();
    const cards = !table && !mixed && !grupos;
    g.classList.toggle('table', table);
    g.classList.toggle('mixed', mixed);
    g.classList.toggle('grupos', grupos);
    g.style.gridTemplateColumns = cards ? 'repeat(' + sp.c + ',minmax(0,1fr))' : '';
    g.style.gridTemplateRows = cards ? 'repeat(' + sp.r + ',minmax(0,1fr))' : '';
    g.style.setProperty('--r', Math.ceil(per / tcols));
    if (pages > 1) el.querySelector('.flyer-foot span').textContent = base + ' • Página ' + (i + 1) + '/' + pages;
  }
}

export function renderFlyer() {
  const format = $('format').value;
  const flyer = $('flyer');
  flyer.className = 'flyer ' + format;

  fillGrid();
  syncFields();
  applyBrand();
  applyExtras();

  $('formatLabel').textContent = format === 'a4' ? 'A4' : format === 'square' ? 'Quadrado' : 'Stories';
  $('flyerStore').textContent = ($('storeName').value.trim() || $('store').value).toUpperCase();
  $('flyerSub').textContent = $('subtitle').value;
  $('flyerSub').hidden = !$('subtitle').value.trim();
  $('flyerTitle').textContent = $('campaign').value.toUpperCase() || 'OFERTAS DA SEMANA';

  const date = $('valid').value;
  $('flyerValid').textContent = date
    ? 'VÁLIDAS ATÉ ' + new Date(date + 'T12:00:00').toLocaleDateString('pt-BR')
    : $('band').value.toUpperCase();
  $('flyerValid').hidden = !$('flyerValid').textContent;
  $('flyerFoot').textContent = [$('storeName').value.trim() || $('store').value, $('footnote').value.trim()]
    .filter(Boolean).join(' • ');

  const chosen = state.selected.map(id => state.catalog.find(p => p.id === id)).filter(Boolean);
  const per = perPage();
  $('selectedCount').textContent = chosen.length;

  renderOrder();
  $('flyerProducts').innerHTML = chosen.length
    ? pageHTML(chosen.slice(0, per), per, 0)
    : '<div class="empty">Adicione produtos do catálogo para montar seu encarte.<br>Cada página comporta ' + per + ' itens.</div>';
  buildPages(chosen, per);
  save();
}
