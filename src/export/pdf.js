// PDF sai pela impressão do próprio navegador: o @media print em
// src/styles/print.css esconde o painel e deixa só as páginas do encarte,
// em A4 retrato.

export function imprimir() {
  window.print();
}
