// Reordenar arrastando. Vale para os cards, as linhas da tabela, os itens
// das caixas agrupadas e a lista "Ordem no encarte" — todos carregam
// data-i com o índice global do produto.
// Em tela sensível ao toque o navegador usa o gesto para rolar a página:
// lá quem reordena são as setas da lista.

import { state } from '../state.js';
import { renderAll } from '../render.js';

export function moveSel(from, to) {
  if (from === to || from < 0 || to < 0 ||
      from >= state.selected.length || to >= state.selected.length) return;
  const x = state.selected.splice(from, 1)[0];
  state.selected.splice(to, 0, x);
  renderAll();
}

let dragFrom = null;
const alvo = e => e.target.closest && e.target.closest('[data-i]');

export function initDrag() {
  document.addEventListener('dragstart', e => {
    const el = alvo(e);
    if (!el) return;
    dragFrom = Number(el.dataset.i);
    el.classList.add('dragging');
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = 'move';
      try { e.dataTransfer.setData('text/plain', String(dragFrom)) } catch (x) {}
    }
  });

  document.addEventListener('dragover', e => {
    if (dragFrom === null) return;
    const el = alvo(e);
    if (!el) return;
    e.preventDefault();
    if (e.dataTransfer) e.dataTransfer.dropEffect = 'move';
    if (Number(el.dataset.i) !== dragFrom) el.classList.add('dragover');
  });

  document.addEventListener('dragleave', e => {
    const el = alvo(e);
    if (el) el.classList.remove('dragover');
  });

  document.addEventListener('drop', e => {
    const el = alvo(e);
    if (!el || dragFrom === null) return;
    e.preventDefault();
    el.classList.remove('dragover');
    moveSel(dragFrom, Number(el.dataset.i));
    dragFrom = null;
  });

  document.addEventListener('dragend', () => {
    dragFrom = null;
    document.querySelectorAll('.dragover,.dragging')
      .forEach(e => e.classList.remove('dragover', 'dragging'));
  });
}
