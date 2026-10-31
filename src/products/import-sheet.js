// Importação de planilha: CSV lido aqui mesmo, XLS/XLSX via SheetJS
// carregado sob demanda (única dependência externa do app).

export function parsePrice(v) {
  let s = String(v || '').replace(/[R$\s]/g, '');
  if (s.includes(',') && s.includes('.')) s = s.replace(/\./g, '').replace(',', '.');
  else s = s.replace(',', '.');
  return Number(s) || 0;
}

// Detecta o separador (; ou ,) pelas primeiras linhas e respeita aspas.
export function parseCSV(text) {
  const first = text.split(/\r?\n/).slice(0, 6).join('\n');
  const delim = (first.match(/;/g) || []).length > (first.match(/,/g) || []).length ? ';' : ',';
  const rows = [];
  let row = [], field = '', quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (c === '"' && quoted && text[i + 1] === '"') { field += '"'; i++ }
    else if (c === '"') { quoted = !quoted }
    else if (c === delim && !quoted) { row.push(field); field = '' }
    else if ((c === '\n' || c === '\r') && !quoted) {
      if (c === '\r' && text[i + 1] === '\n') i++;
      row.push(field);
      if (row.some(x => x.trim())) rows.push(row);
      row = []; field = '';
    } else field += c;
  }
  row.push(field);
  if (row.some(x => x.trim())) rows.push(row);
  return rowsToProducts(rows);
}

// Converte linhas cruas em produtos, procurando o cabeçalho (planilhas
// costumam ter título e linhas em branco antes dele).
export function rowsToProducts(rows) {
  rowsToProducts.skipped = 0;
  if (!rows.length) return [];
  const norm = s => s.trim().toLowerCase().normalize('NFD')
    .replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9_]/g, '');
  const known = ['nome', 'produto', 'name', 'descricao', 'descricaoproduto'];
  let hi = rows.findIndex((r, i) => i < 15 && r.some(c => known.includes(norm(String(c)))));
  if (hi < 0) hi = 0;
  rows = rows.slice(hi);
  const headers = rows.shift().map(norm);
  const idx = (...names) => headers.findIndex(h => names.includes(h));

  const ni = idx('nome', 'produto', 'name', 'descricao', 'descricaoproduto'),
        ci = idx('categoria', 'category'),
        pi = idx('preco', 'preconormal', 'price', 'valor', 'precovenda', 'precode', 'pvenda', 'precoatual'),
        si = idx('preco_promocional', 'precopromocional', 'promocao', 'precooferta', 'sale'),
        co = idx('codigo', 'cod', 'codigo_interno', 'sku'),
        ei = idx('ean', 'gtin', 'codigo_barras'),
        ii = idx('imagem', 'image', 'url_imagem', 'foto'),
        la = idx('laboratorio', 'lab', 'fabricante'),
        mi = idx('ms', 'registro', 'registroms'),
        le = idx('leve', 'qtd', 'quantidade');

  const mapped = rows.map(r => ({
    name: r[ni >= 0 ? ni : 0],
    category: ci >= 0 ? r[ci] : '',
    normal: pi >= 0 ? parsePrice(r[pi]) : 0,
    sale: (si >= 0 && parsePrice(r[si]) > 0) ? parsePrice(r[si]) : pi >= 0 ? parsePrice(r[pi]) : 0,
    code: co >= 0 ? r[co] : '',
    ean: ei >= 0 ? r[ei] : '',
    image: ii >= 0 ? r[ii] : '',
    lab: [la >= 0 ? r[la] : '', mi >= 0 && r[mi] ? 'MS.: ' + r[mi] : ''].filter(Boolean).join(' - '),
    leve: le >= 0 ? r[le] : 0
  }));
  const ok = mapped.filter(p => p.name && p.sale > 0);
  rowsToProducts.skipped = mapped.length - ok.length;
  return ok;
}

export function loadXLSX() {
  return window.XLSX ? Promise.resolve() : new Promise((res, rej) => {
    const sc = document.createElement('script');
    sc.src = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js';
    sc.onload = res;
    sc.onerror = () => rej(new Error('offline'));
    document.head.appendChild(sc);
  });
}

// Lê o arquivo escolhido e devolve os produtos. Lança 'offline' quando a
// biblioteca de XLSX não pôde ser baixada.
export async function lerPlanilha(file) {
  if (/\.xlsx?$/i.test(file.name)) {
    await loadXLSX();
    const wb = XLSX.read(await file.arrayBuffer(), { type: 'array' });
    const ws = wb.Sheets[wb.SheetNames[0]];
    return rowsToProducts(
      XLSX.utils.sheet_to_json(ws, { header: 1, raw: true, defval: '', blankrows: false })
        .map(r => r.map(v => String(v ?? ''))));
  }
  return parseCSV(await file.text());
}
