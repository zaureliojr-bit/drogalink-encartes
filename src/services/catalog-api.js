// Catálogo publicado pelo Drogalink Padronizador (produtos.json): mesmo
// formato que o site "Drogaria Mais Barato" consome. precoPromocao só existe
// quando o produto está em oferta de verdade; sem ela, sale cai no preço
// normal (sem desconto, sem risca no preço antigo). A imagem já vem do
// imagens-proxy (R2, Access-Control-Allow-Origin: *), por isso entra na
// exportação em PNG, diferente de imagem de URL externa qualquer.

export function produtoCatalogoParaItem(p) {
  const normal = Number(p.precoVenda || 0);
  const promo = Number(p.precoPromocao || 0);
  const sale = promo > 0 && promo < normal ? promo : normal;
  return {
    name: p.descricao || '',
    normal, sale,
    code: p.codigo || '',
    ean: p.ean || '',
    image: p.imagem || '',
    category: p.categoria || '',
    lab: p.laboratorio || '',
    leve: 0
  };
}

// Busca o produtos.json e devolve os itens já no formato do catálogo.
// Lança erro com mensagem legível quando a resposta não serve.
export async function buscarCatalogoPublicado(url, soOfertas) {
  const resp = await fetch(url, { cache: 'no-store' });
  if (!resp.ok) throw new Error('HTTP ' + resp.status);
  const dados = await resp.json();
  const lista = Array.isArray(dados) ? dados
    : Array.isArray(dados.produtos) ? dados.produtos : null;
  if (!lista) throw new Error('Formato inesperado: esperava um produtos.json do padronizador.');
  return lista
    .filter(p => p && p.descricao && Number(p.precoVenda) > 0)
    .filter(p => !soOfertas ||
      (Number(p.precoPromocao) > 0 && Number(p.precoPromocao) < Number(p.precoVenda)))
    .map(produtoCatalogoParaItem);
}
