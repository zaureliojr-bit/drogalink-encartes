// Persistência no navegador (localStorage). Guarda catálogo, seleção, as três
// imagens em data URL e os campos do formulário.

import { $ } from '../utils.js';
import { state, FIELDS, STORAGE_KEY } from '../state.js';
import { fillGrid } from '../layouts/grids.js';

let warned = false;

export function save() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      catalog: state.catalog,
      selected: state.selected,
      logo: state.logoData,
      hb: state.headBgData,
      pb: state.pageBgData,
      hba: state.headBgArt,
      f: Object.fromEntries(FIELDS.map(i =>
        [i, $(i).type === 'checkbox' ? $(i).checked : $(i).value]))
    }));
  } catch (e) {
    if (!warned) {
      warned = true;
      alert('O navegador não conseguiu salvar (armazenamento cheio ou bloqueado). Exporte o catálogo em CSV para não perder os dados.');
    }
  }
}

export function load() {
  try {
    const d = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    if (!d) return;
    state.catalog = Array.isArray(d.catalog) ? d.catalog : [];
    state.logoData = typeof d.logo === 'string' ? d.logo : '';
    state.headBgData = typeof d.hb === 'string' ? d.hb : '';
    state.headBgArt = !!d.hba;
    state.pageBgData = typeof d.pb === 'string' ? d.pb : '';
    state.selected = (d.selected || []).filter(id => state.catalog.some(p => p.id === id));
    Object.entries(d.f || {}).forEach(([k, v]) => {
      const e = $(k);
      if (e) { if (e.type === 'checkbox') e.checked = !!v; else e.value = v }
    });
    // Uma opção que deixou de existir (ex.: 14 por página) devolveria valor
    // vazio e quebraria a paginação: cai no padrão.
    if (!Number($('count').value)) $('count').value = '20';
    fillGrid();
    if (d.f && d.f.grid) $('grid').value = d.f.grid;
    if (!$('grid').value) $('grid').selectedIndex = 0;
  } catch (e) { /* preferência corrompida: segue com os padrões */ }
}
