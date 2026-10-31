// Biblioteca de artes: artes de cabeçalho guardadas e reutilizáveis, em vez
// de reenviar a imagem a cada campanha.
//
// Duas origens:
//   - as que vêm com o app, listadas em public/assets/temas/artes.json;
//   - as que o usuário envia, guardadas no navegador.
//
// Ao aplicar, a arte sempre vira data URL. Isso é o que faz ela entrar na
// exportação em PNG: dentro do SVG de exportação o navegador não busca
// arquivo externo, nem do próprio site.

import { state } from '../state.js';
import { fileToDataURL } from '../services/images.js';
import { renderFlyer } from '../render.js';

const CHAVE = 'drogalink_artes_v1';
const MANIFESTO = './public/assets/temas/artes.json';

export const biblioteca = {
  embutidas: [],   // { id, nome, arquivo }
  enviadas: []     // { id, nome, data }
};

export function carregarEnviadas() {
  try {
    const d = JSON.parse(localStorage.getItem(CHAVE) || 'null');
    if (Array.isArray(d)) biblioteca.enviadas = d;
  } catch (e) {}
}

function salvarEnviadas() {
  try { localStorage.setItem(CHAVE, JSON.stringify(biblioteca.enviadas)) }
  catch (e) {
    alert('O navegador não conseguiu guardar essa arte (armazenamento cheio). Remova artes antigas da biblioteca ou use uma imagem menor.');
  }
}

// O manifesto é opcional: sem ele, a biblioteca fica só com os envios.
export async function carregarEmbutidas() {
  try {
    const r = await fetch(MANIFESTO, { cache: 'no-store' });
    if (!r.ok) return;
    const d = await r.json();
    if (Array.isArray(d)) biblioteca.embutidas = d.filter(a => a && a.arquivo && a.nome);
  } catch (e) { /* app aberto fora do site, ou manifesto ausente */ }
}

export async function adicionarEnviadas(files) {
  for (const f of files) {
    const data = await fileToDataURL(f, 1100);
    biblioteca.enviadas.push({
      id: 'a' + Date.now() + Math.round(Math.random() * 1e4),
      nome: f.name.replace(/\.[^.]+$/, '').slice(0, 40),
      data
    });
  }
  salvarEnviadas();
}

export function removerEnviada(id) {
  biblioteca.enviadas = biblioteca.enviadas.filter(a => a.id !== id);
  salvarEnviadas();
}

export function renomearEnviada(id, nome) {
  const a = biblioteca.enviadas.find(x => x.id === id);
  if (!a) return;
  a.nome = String(nome).slice(0, 40);
  salvarEnviadas();
}

// Aplica como imagem de cabeçalho. Arte embutida é buscada e convertida em
// data URL na hora.
export async function aplicarArte(item) {
  state.headBgArt = true;
  if (item.data) { state.headBgData = item.data; renderFlyer(); return }
  const r = await fetch(item.arquivo, { cache: 'force-cache' });
  if (!r.ok) throw new Error('HTTP ' + r.status);
  const blob = await r.blob();
  state.headBgData = await new Promise((res, rej) => {
    const fr = new FileReader();
    fr.onerror = rej;
    fr.onload = () => res(fr.result);
    fr.readAsDataURL(blob);
  });
  renderFlyer();
}
