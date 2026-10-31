// Catálogo: inserir, atualizar, remover e filtrar produtos.
// Formato do produto:
//   { id, name, normal, sale, code, ean, image, category, lab, leve }

import { $ } from '../utils.js';
import { state } from '../state.js';
import { renderAll } from '../render.js';

const novoId = () =>
  crypto.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random());

// Devolve 'new', 'upd' ou false. quiet=true evita alerta e re-render, para
// importar em lote. EAN ou código servem de chave: reimportar atualiza em
// vez de duplicar.
export function addProduct(p, quiet) {
  if (!p.name || !Number.isFinite(Number(p.sale)) || Number(p.sale) <= 0) {
    if (quiet !== true) alert('Informe o nome e um preço promocional válido.');
    return false;
  }
  const item = {
    id: novoId(),
    name: String(p.name).trim(),
    normal: Number(p.normal || 0),
    sale: Number(p.sale),
    code: p.code || '',
    image: p.image || '',
    category: p.category || '',
    ean: p.ean || '',
    lab: p.lab || '',
    leve: Number(p.leve || 0)
  };
  const key = String(item.ean || item.code).trim();
  const ex = key && state.catalog.find(x => String(x.ean || x.code).trim() === key);
  if (ex) Object.assign(ex, item, { id: ex.id, image: item.image || ex.image });
  else state.catalog.unshift(item);
  if (quiet !== true) renderAll();
  return ex ? 'upd' : 'new';
}

export function delProduct(id) {
  const p = state.catalog.find(x => x.id === id);
  if (!p || !confirm('Excluir "' + p.name + '" do catálogo?')) return false;
  state.catalog = state.catalog.filter(x => x.id !== id);
  state.selected = state.selected.filter(x => x !== id);
  return true;
}

// Produtos que batem com a busca (vale para "adicionar/tirar todos").
export function filtered() {
  const q = $('search').value.toLowerCase();
  return state.catalog.filter(p =>
    (p.name + ' ' + p.code + ' ' + p.ean).toLowerCase().includes(q));
}

// Importa um lote e resume o resultado, incluindo as inconsistências de
// preço que valem conferência antes de publicar.
export function importProducts(list, skipped = 0, note = '') {
  let n = 0, u = 0;
  list.slice().reverse().forEach(p => {
    const r = addProduct(p, true);
    if (r === 'new') n++; else if (r === 'upd') u++;
  });
  renderAll();

  const sem = list.filter(p => p.normal > 0 && p.sale === p.normal).length;
  const susp = list.filter(p => p.normal > 0 && p.sale > p.normal).length;
  const m = ['Importação concluída: ' + n + ' novos' + (u ? ', ' + u + ' atualizados' : '') + '.'];
  if (skipped) m.push(skipped + ' linha(s) ignorada(s) por falta de nome ou de preço válido.' + note);
  if (sem) m.push(sem + ' sem desconto (promoção vazia ou igual ao preço de venda).');
  if (susp) m.push('Atenção: ' + susp + ' com promoção maior que o preço normal.');
  m.push('Confira os preços antes de publicar.');
  alert(m.join('\n'));
}
