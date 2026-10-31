// Controles do painel: campos que disparam render, tema, cores e as três
// imagens (logo, cabeçalho e fundo).

import { $ } from '../utils.js';
import { state, FIELDS } from '../state.js';
import { renderAll, renderFlyer } from '../render.js';
import { fileToDataURL } from '../services/images.js';
import { aplicarCoresDoTema, PADRAO } from '../themes/index.js';
import { importarArquivoTema, baixarModeloTema } from '../themes/custom.js';

// Cada seletor só aparece no layout a que pertence.
export function syncFields() {
  const l = $('layout').value;
  $('fGrid').hidden = l !== 'cards';
  $('fCount').hidden = l === 'cards';
  $('fHighl').hidden = l !== 'mixed';
  $('fPorCaixa').hidden = l !== 'grupos';
  $('hGrupos').hidden = l !== 'grupos';
}

async function lerImagem(input, max, png, erro, destino) {
  const f = input.files[0];
  if (!f) return;
  try { state[destino] = await fileToDataURL(f, max, png); renderFlyer() }
  catch { alert(erro) }
  input.value = '';
}

export function initControls() {
  FIELDS.forEach(id => $(id).addEventListener('input', renderAll));

  $('theme').addEventListener('change', e => {
    aplicarCoresDoTema(e.target.value);
    renderFlyer();
  });

  $('resetBrand').onclick = () => {
    $('cbrand').value = PADRAO.brand;
    $('caccent').value = PADRAO.accent;
    renderFlyer();
  };

  $('logoFile').onchange = e =>
    lerImagem(e.target, 400, true, 'Não foi possível ler o logo.', 'logoData');
  $('headBg').onchange = e =>
    lerImagem(e.target, 1100, false, 'Não foi possível ler a imagem do cabeçalho.', 'headBgData');
  $('pageBg').onchange = e =>
    lerImagem(e.target, 1000, false, 'Não foi possível ler a imagem de fundo.', 'pageBgData');

  $('removeLogo').onclick = () => { state.logoData = ''; renderFlyer() };
  $('removeHeadBg').onclick = () => { state.headBgData = ''; renderFlyer() };
  $('removePageBg').onclick = () => { state.pageBgData = ''; renderFlyer() };

  $('themeFile').onchange = async e => {
    const file = e.target.files[0];
    e.target.value = '';
    if (!file) return;
    try { await importarArquivoTema(file) }
    catch { alert('Não consegui ler esse arquivo. Confira se é um .json válido.') }
  };
  $('themeTemplate').onclick = baixarModeloTema;
}
