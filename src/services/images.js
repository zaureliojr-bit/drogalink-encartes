// Leitura e preparo de imagens no navegador.

// Lê um arquivo, reduz para `max` px no maior lado e devolve data URL.
// JPEG por padrão (menor); PNG quando precisa de fundo transparente (logo).
export function fileToDataURL(file, max = 500, png = false) {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onerror = rej;
    r.onload = () => {
      const i = new Image();
      i.onerror = rej;
      i.onload = () => {
        const k = Math.min(1, max / Math.max(i.width, i.height));
        const c = document.createElement('canvas');
        c.width = Math.round(i.width * k);
        c.height = Math.round(i.height * k);
        const x = c.getContext('2d');
        if (!png) { x.fillStyle = '#fff'; x.fillRect(0, 0, c.width, c.height) }
        x.drawImage(i, 0, 0, c.width, c.height);
        res(png ? c.toDataURL('image/png') : c.toDataURL('image/jpeg', .85));
      };
      i.src = r.result;
    };
    r.readAsDataURL(file);
  });
}

export function loadImage(src) {
  return new Promise((res, rej) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => res(img);
    img.onerror = rej;
    img.src = src;
  });
}

// Converte uma imagem já carregada em data URL. Falha de propósito quando a
// origem não libera CORS: é o que mantém o PNG fora do canvas "sujo".
export async function toDataURL(src) {
  if (src.startsWith('data:')) return src;
  const i = await loadImage(src);
  const c = document.createElement('canvas');
  c.width = i.naturalWidth;
  c.height = i.naturalHeight;
  c.getContext('2d').drawImage(i, 0, 0);
  return c.toDataURL('image/png');
}
