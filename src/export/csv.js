// Exportação do catálogo em CSV (mesmas colunas aceitas na importação).

import { state } from '../state.js';
import { download } from './download.js';

export function exportarCatalogoCSV() {
  const rows = [
    ['nome', 'categoria', 'preco', 'preco_promocional', 'codigo', 'ean', 'imagem', 'laboratorio', 'leve'],
    ...state.catalog.map(p =>
      [p.name, p.category, p.normal, p.sale, p.code, p.ean, p.image, p.lab || '', p.leve || ''])
  ];
  const csv = rows
    .map(r => r.map(v => '"' + String(v ?? '').replace(/"/g, '""') + '"').join(';'))
    .join('\r\n');
  // BOM para o Excel brasileiro abrir em UTF-8 sem perder acentos.
  download(new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' }), 'drogalink-catalogo.csv');
}
