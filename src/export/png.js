// Exportação em PNG: cada página do encarte é clonada, embutida num SVG com
// <foreignObject> e rasterizada em canvas.

import { $ } from '../utils.js';
import { loadImage, toDataURL } from '../services/images.js';
import { download } from './download.js';

// O CSS precisa ir junto dentro do SVG, senão o clone sai sem estilo. Com o
// CSS em arquivos separados não basta ler as tags <style>: lemos as regras
// das folhas (mesma origem, por isso cssRules é acessível).
function cssDoDocumento() {
  const partes = [];
  for (const sheet of document.styleSheets) {
    try { for (const rule of sheet.cssRules) partes.push(rule.cssText) }
    catch (e) { /* folha de outra origem não é legível: ignora */ }
  }
  if (!partes.length) {
    partes.push(...[...document.querySelectorAll('style')].map(t => t.textContent));
  }
  return partes.join('\n');
}

export async function exportarPNG() {
  const btn = $('png');
  btn.disabled = true;
  try {
    const fmt = $('format').value;
    const W = fmt === 'story' ? 390 : 760;
    const H = Math.round(W * (fmt === 'a4' ? 1.414 : fmt === 'story' ? 16 / 9 : 1));
    const outW = fmt === 'a4' ? 1240 : 1080;
    const els = [...$('flyer').parentElement.querySelectorAll('.flyer')];
    let skipped = 0;

    for (let pi = 0; pi < els.length; pi++) {
      const clone = els[pi].cloneNode(true);
      clone.style.width = W + 'px';
      clone.style.height = H + 'px';
      clone.style.boxShadow = 'none';

      for (const im of [...clone.querySelectorAll('img:not([hidden])')]) {
        try { im.src = await toDataURL(im.getAttribute('src')) }
        catch { skipped++; im.parentElement.textContent = '✚' }
      }

      const css = cssDoDocumento().replace(/&/g, '&amp;').replace(/</g, '&lt;');
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><foreignObject width="100%" height="100%"><div xmlns="http://www.w3.org/1999/xhtml" style="font:15px/1.45 Inter,system-ui,-apple-system,'Segoe UI',sans-serif;color:#22233a"><style>${css}</style>${new XMLSerializer().serializeToString(clone)}</div></foreignObject></svg>`;

      const img = await loadImage('data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg));
      const k = outW / W;
      const c = document.createElement('canvas');
      c.width = outW;
      c.height = Math.round(H * k);
      const x = c.getContext('2d');
      x.fillStyle = '#fff';
      x.fillRect(0, 0, c.width, c.height);
      x.drawImage(img, 0, 0, c.width, c.height);

      c.toBlob(b => download(b, 'drogalink-encarte-' + fmt + (els.length > 1 ? '-p' + (pi + 1) : '') + '.png'), 'image/png');
      await new Promise(r => setTimeout(r, 350));
    }

    if (skipped) {
      alert(skipped + ' imagem(ns) de URL externa não puderam entrar no PNG. Envie a foto como arquivo para resolver.');
    }
  } catch (e) {
    alert('Não foi possível gerar o PNG neste navegador. Use "Imprimir / salvar PDF" como alternativa.');
  }
  btn.disabled = false;
}
