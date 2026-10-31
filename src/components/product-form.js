// Seção 2: cadastro e edição de produto, lista colada e importações.

import { $ } from '../utils.js';
import { state } from '../state.js';
import { renderAll } from '../render.js';
import { addProduct, importProducts } from '../products/model.js';
import { parseList } from '../products/import-paste.js';
import { lerPlanilha, rowsToProducts } from '../products/import-sheet.js';
import { buscarCatalogoPublicado } from '../services/catalog-api.js';
import { fileToDataURL } from '../services/images.js';
import { exportarCatalogoCSV } from '../export/csv.js';

const CAMPOS = ['pname', 'pnormal', 'psale', 'pcode', 'pimage', 'pfile', 'plab', 'pleve'];

export function clearForm() {
  CAMPOS.forEach(id => $(id).value = '');
  state.pendingImage = '';
  state.editingId = null;
  $('add').textContent = '+ Adicionar produto';
}

export function editProduct(id) {
  const p = state.catalog.find(x => x.id === id);
  if (!p) return;
  state.editingId = id;
  const ehArquivo = (p.image || '').startsWith('data:');
  $('pname').value = p.name;
  $('pnormal').value = p.normal || '';
  $('psale').value = p.sale;
  $('pcode').value = p.code || p.ean || '';
  $('plab').value = p.lab || '';
  $('pleve').value = p.leve || '';
  $('pimage').value = ehArquivo ? '' : (p.image || '');
  $('pfile').value = '';
  state.pendingImage = ehArquivo ? p.image : '';
  $('add').textContent = 'Salvar alterações';
  $('pname').scrollIntoView({ behavior: 'smooth', block: 'center' });
  $('pname').focus();
}

function salvar() {
  const normal = Number($('pnormal').value || 0), sale = Number($('psale').value || 0);
  if (normal > 0 && sale > normal &&
      !confirm('O preço promocional está maior que o preço normal. Adicionar mesmo assim?')) return;

  if (state.editingId) {
    const p = state.catalog.find(x => x.id === state.editingId);
    const name = $('pname').value.trim(), sl = Number($('psale').value);
    if (!p || !name || !(sl > 0)) { alert('Informe o nome e um preço promocional válido.'); return }
    Object.assign(p, {
      name, normal, sale: sl,
      code: $('pcode').value,
      image: state.pendingImage || $('pimage').value,
      lab: $('plab').value,
      leve: Number($('pleve').value || 0)
    });
    clearForm();
    renderAll();
    return;
  }

  const ok = addProduct({
    name: $('pname').value, normal: $('pnormal').value, sale: $('psale').value,
    code: $('pcode').value, image: state.pendingImage || $('pimage').value,
    lab: $('plab').value, leve: $('pleve').value
  });
  if (ok) clearForm();
}

export function initProductForm() {
  $('add').onclick = salvar;
  $('clearForm').onclick = clearForm;

  $('pfile').onchange = async e => {
    const f = e.target.files[0];
    if (!f) return;
    try { state.pendingImage = await fileToDataURL(f) }
    catch { state.pendingImage = ''; alert('Não foi possível ler a imagem.') }
  };

  // Lista colada: as linhas inválidas continuam na caixa para correção.
  $('pasteBtn').onclick = () => {
    const list = parseList($('pasteList').value);
    if (!list.length) { alert('Cole ao menos uma linha de produto.'); return }
    const ok = list.filter(p => p.name && p.sale > 0);
    const bad = list.filter(p => !(p.name && p.sale > 0));
    importProducts(ok, bad.length, ' Elas continuam na caixa para você corrigir.');
    $('pasteList').value = bad.map(p => p.raw).join('\n');
  };

  $('csv').onchange = async e => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const rows = await lerPlanilha(file);
      importProducts(rows, rowsToProducts.skipped);
    } catch (err) {
      alert(err && err.message === 'offline'
        ? 'Para ler XLS/XLSX é preciso internet na primeira vez (a biblioteca é carregada online). Sem conexão, salve a planilha como CSV UTF-8 e importe de novo.'
        : 'Não foi possível ler o arquivo. Confira o formato e tente novamente.');
    }
    e.target.value = '';
  };

  $('catalogImport').onclick = async () => {
    const url = $('catalogUrl').value.trim();
    if (!url) { alert('Informe o endereço do produtos.json.'); return }
    const btn = $('catalogImport'), txt = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Importando...';
    try {
      const soOfertas = $('catalogSoOfertas').checked;
      const itens = await buscarCatalogoPublicado(url, soOfertas);
      if (!itens.length) {
        alert(soOfertas
          ? 'Nenhum produto em oferta encontrado nesse catálogo agora.'
          : 'Nenhum produto válido encontrado nesse catálogo.');
        return;
      }
      importProducts(itens);
    } catch (err) {
      alert('Não consegui importar esse catálogo. Confira o endereço e sua conexão.\n' + (err && err.message || ''));
    } finally {
      btn.disabled = false;
      btn.textContent = txt;
    }
  };

  $('exportCsv').onclick = exportarCatalogoCSV;
}
