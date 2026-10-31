// Registro de temas: junta os grupos, monta o seletor e aplica as cores.

import { $ } from '../utils.js';
import { seasonal } from './seasonal/index.js';
import { pharmacy } from './pharmacy/index.js';
import { supermarket } from './supermarket/index.js';
import { premium } from './premium/index.js';

export const PADRAO = { brand: '#5c5c94', accent: '#ffcf45', preco: '#e74650' };

// Grupos na ordem em que aparecem no seletor.
export const GRUPOS = [
  { id: 'seasonal', nome: 'Datas e estações', temas: seasonal },
  { id: 'pharmacy', nome: 'Farmácia', temas: pharmacy },
  { id: 'supermarket', nome: 'Varejo alimentar', temas: supermarket },
  { id: 'premium', nome: 'Sóbrios', temas: premium }
];

// Registro plano id => tema. Temas importados pelo usuário entram aqui também.
export const TEMAS = {};
for (const g of GRUPOS) for (const [id, t] of Object.entries(g.temas)) TEMAS[id] = t;

export const IDS_PADRAO = new Set(Object.keys(TEMAS));

export const getTema = id => TEMAS[id] || null;

// Monta o <select> com um <optgroup> por grupo. Os personalizados ficam num
// grupo próprio, no fim.
export function montarSeletorTemas(customizados = {}) {
  const sel = $('theme');
  const atual = sel.value;
  const opt = (v, n) => `<option value="${v}">${n}</option>`;
  let html = opt('', 'Padrão Drogalink');
  for (const g of GRUPOS) {
    html += `<optgroup label="${g.nome}">` +
      Object.entries(g.temas).map(([id, t]) => opt(id, t.nome)).join('') +
      '</optgroup>';
  }
  const custom = Object.values(customizados);
  if (custom.length) {
    html += '<optgroup label="Personalizados">' +
      custom.map(t => opt(t.id, t.nome)).join('') + '</optgroup>';
  }
  sel.innerHTML = html;
  if ([...sel.options].some(o => o.value === atual)) sel.value = atual;
}

// Aplica as duas cores do tema nos campos de cor (o usuário ainda pode
// ajustar à mão depois).
export function aplicarCoresDoTema(id) {
  const t = getTema(id);
  $('cbrand').value = t ? t.brand : PADRAO.brand;
  $('caccent').value = t ? t.accent : PADRAO.accent;
}
