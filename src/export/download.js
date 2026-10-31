// Entrega de arquivo ao usuário. Dentro do visualizador de artifacts do
// Claude o link comum não baixa nada: lá a capacidade "downloads" é quem
// salva. Fora dele (site, localhost), cai no link.

let dlCap = null;
const dlReady = (window.claude && window.claude.use)
  ? window.claude.use('downloads').then(d => { dlCap = d }).catch(() => {})
  : Promise.resolve();

export async function download(blob, name) {
  await dlReady;
  if (dlCap) {
    try { await dlCap.save({ filename: name, data: blob }); return }
    catch (err) { if (err && (err.code === 'declined' || err.code === 'rate_limited')) return }
  }
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1500);
}
