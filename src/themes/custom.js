// Tema personalizado (.json): mesma ideia dos temas prontos, só que vindo de
// fora. O motivo decorativo continua preso aos que existem em MOTIFS —
// aceitar um desenho novo exigiria SVG no arquivo, e isso é editor, não
// importação.

import { $, slugify } from '../utils.js';
import { THEMES_KEY } from '../state.js';
import { MOTIFS } from './art.js';
import { TEMAS, IDS_PADRAO, montarSeletorTemas, aplicarCoresDoTema, PADRAO } from './index.js';
import { download } from '../export/download.js';
import { renderFlyer } from '../render.js';

export let temasCustom = {};

export function validarTema(obj) {
  const hex = /^#[0-9a-fA-F]{6}$/, erros = [];
  if (!obj || typeof obj !== 'object') return { erros: ['Arquivo não é um JSON de tema válido.'] };

  let id = slugify(obj.id || obj.nome);
  if (!id) { erros.push('Informe "id" ou "nome".'); return { erros } }
  // Não sobrescreve um tema pronto: ganha sufixo.
  if (IDS_PADRAO.has(id)) id += '-personalizado';

  const nome = String(obj.nome || obj.id || 'Tema personalizado').trim();
  const brand = hex.test(obj.brand) ? obj.brand : null;
  if (!brand) erros.push('"brand" precisa ser uma cor hexadecimal, ex.: "#5c5c94".');
  const accent = hex.test(obj.accent) ? obj.accent : null;
  if (!accent) erros.push('"accent" precisa ser uma cor hexadecimal, ex.: "#ffcf45".');
  if (erros.length) return { erros };

  const grad = Array.isArray(obj.gradiente) ? obj.gradiente : [];
  const g0 = hex.test(grad[0]) ? grad[0] : brand;
  const g1 = hex.test(grad[1]) ? grad[1] : brand;
  const motivo = MOTIFS[obj.motivo] ? obj.motivo : 'star';
  const corPreco = hex.test(obj.corPreco) ? obj.corPreco : PADRAO.preco;

  return { tema: { id, nome, brand, accent, gradiente: [g0, g1], motivo, corPreco } };
}

export function registrarTemaCustom(t, selecionar) {
  TEMAS[t.id] = {
    nome: t.nome, brand: t.brand, accent: t.accent,
    g: t.gradiente, m: t.motivo, p: t.corPreco
  };
  montarSeletorTemas(temasCustom);
  if (selecionar) {
    $('theme').value = t.id;
    aplicarCoresDoTema(t.id);
    renderFlyer();
  }
}

export function salvarTemasCustom() {
  try { localStorage.setItem(THEMES_KEY, JSON.stringify(temasCustom)) } catch (e) {}
}

export function carregarTemasCustom() {
  try {
    const d = JSON.parse(localStorage.getItem(THEMES_KEY) || 'null');
    if (d && typeof d === 'object') {
      temasCustom = d;
      Object.values(d).forEach(t => { TEMAS[t.id] = { nome: t.nome, brand: t.brand, accent: t.accent, g: t.gradiente, m: t.motivo, p: t.corPreco } });
    }
  } catch (e) {}
  montarSeletorTemas(temasCustom);
}

export async function importarArquivoTema(file) {
  const obj = JSON.parse(await file.text());
  const { tema, erros } = validarTema(obj);
  if (erros) { alert('Não consegui importar esse tema:\n- ' + erros.join('\n- ')); return }
  registrarTemaCustom(tema, true);
  temasCustom[tema.id] = tema;
  salvarTemasCustom();
  alert('Tema "' + tema.nome + '" importado e aplicado.');
}

export function baixarModeloTema() {
  const modelo = {
    id: 'meu-tema',
    nome: 'Meu tema',
    brand: $('cbrand').value,
    accent: $('caccent').value,
    gradiente: [$('cbrand').value, $('cbrand').value],
    motivo: 'star',
    corPreco: PADRAO.preco,
    _motivos_disponiveis: Object.keys(MOTIFS)
  };
  download(new Blob([JSON.stringify(modelo, null, 2)], { type: 'application/json' }),
    'drogalink-tema-modelo.json');
}
