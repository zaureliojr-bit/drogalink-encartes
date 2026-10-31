// Painel da biblioteca de artes: miniaturas clicáveis das artes que vêm com
// o app e das que o usuário enviou.

import { $, esc } from '../utils.js';
import {
  biblioteca, carregarEmbutidas, carregarEnviadas,
  adicionarEnviadas, removerEnviada, renomearEnviada, aplicarArte
} from '../themes/library.js';

function card(a, enviada) {
  const fundo = enviada ? a.data : a.arquivo;
  return `<figure class="arte" data-arte="${a.id}" data-tipo="${enviada ? 'env' : 'emb'}" title="Aplicar no cabeçalho">
    <span class="arte-img" style="background-image:url('${esc(fundo)}')"></span>
    <figcaption>${esc(a.nome)}</figcaption>
    ${enviada ? `<button class="arte-x" data-rm-arte="${a.id}" title="Remover da biblioteca" aria-label="Remover da biblioteca">✕</button>
    <button class="arte-rn" data-rn-arte="${a.id}" title="Renomear" aria-label="Renomear">✎</button>` : ''}
  </figure>`;
}

export function renderArtLibrary() {
  const emb = biblioteca.embutidas.map(a => card(a, false)).join('');
  const env = biblioteca.enviadas.map(a => card(a, true)).join('');
  $('artes').innerHTML = (emb + env) ||
    '<div class="notice">A biblioteca está vazia. Envie as artes de cabeçalho que você usa com frequência — elas ficam salvas e passam a aparecer aqui.</div>';
  $('artesCount').textContent = biblioteca.embutidas.length + biblioteca.enviadas.length;
}

export async function initArtLibrary() {
  carregarEnviadas();
  await carregarEmbutidas();
  renderArtLibrary();

  $('arteFiles').onchange = async e => {
    const files = [...e.target.files];
    e.target.value = '';
    if (!files.length) return;
    try { await adicionarEnviadas(files); renderArtLibrary() }
    catch { alert('Não foi possível ler uma das imagens.') }
  };

  $('artes').onclick = async e => {
    const rm = e.target.closest('[data-rm-arte]');
    if (rm) { removerEnviada(rm.dataset.rmArte); renderArtLibrary(); return }

    const rn = e.target.closest('[data-rn-arte]');
    if (rn) {
      const atual = biblioteca.enviadas.find(a => a.id === rn.dataset.rnArte);
      const nome = prompt('Nome da arte:', atual ? atual.nome : '');
      if (nome) { renomearEnviada(rn.dataset.rnArte, nome); renderArtLibrary() }
      return;
    }

    const fig = e.target.closest('[data-arte]');
    if (!fig) return;
    const lista = fig.dataset.tipo === 'env' ? biblioteca.enviadas : biblioteca.embutidas;
    const item = lista.find(a => a.id === fig.dataset.arte);
    if (!item) return;
    try { await aplicarArte(item) }
    catch { alert('Não consegui carregar essa arte.') }
  };
}
