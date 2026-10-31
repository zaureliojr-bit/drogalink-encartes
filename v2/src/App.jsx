import { useEffect, useMemo, useState } from 'react';
import { themes, themeCategories } from './data/themes.js';
import { loadWorkspace, saveWorkspace } from './lib/storage.js';

const starterProducts = [
  { id: 1, name: 'Vitamina C 1g', category: 'Vitaminas', oldPrice: '19,90', price: '14,99', unit: 'un' },
  { id: 2, name: 'Protetor solar FPS 50', category: 'Dermocosméticos', oldPrice: '59,90', price: '44,90', unit: 'un' },
  { id: 3, name: 'Fralda infantil pacote', category: 'Infantil', oldPrice: '49,90', price: '39,99', unit: 'pct' },
  { id: 4, name: 'Shampoo  למ', category: 'Higiene', oldPrice: '22,90', price: '17,90', unit: 'un' }
];

const money = (value) => {
  const number = Number(String(value).replace(',', '.'));
  return Number.isFinite(number) ? number.toFixed(2).replace('.', ',') : '0,00';
};

function Icon({ name }) {
  const paths = {
    grid: <><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></>,
    palette: <><path d="M12 3a9 9 0 1 0 0 18h1.2a2 2 0 0 0 1.5-3.3 1.8 1.8 0 0 1 1.4-3h1.1A3.8 3.8 0 0 0 21 10.9C21 6.5 17 3 12 3Z"/><circle cx="7.5" cy="10" r="1"/><circle cx="10" cy="6.8" r="1"/><circle cx="15" cy="7" r="1"/></>,
    package: <><path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="M3 8v9l9 5 9-5V8M12 13v9"/></>,
    image: <><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></>,
    download: <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5M12 15V3"/></>,
    plus: <><path d="M12 5v14M5 12h14"/></>,
    search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></>,
    check: <path d="m5 12 4 4L19 6"/>,
    spark: <><path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z"/><path d="m19 16 .8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8L19 16Z"/></>
  };
  return <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>;
}

export default function App() {
  const saved = useMemo(() => loadWorkspace(), []);
  const [activeTab, setActiveTab] = useState('editor');
  const [selectedTheme, setSelectedTheme] = useState(saved?.theme || 'farmacia-classica');
  const [category, setCategory] = useState('Todos');
  const [format, setFormat] = useState(saved?.format || 'a4');
  const [campaign, setCampaign] = useState(saved?.campaign || 'OFERTAS DA SEMANA');
  const [store, setStore] = useState(saved?.store || 'DROGARIA MAIS BARATO');
  const [validity, setValidity] = useState(saved?.validity || 'Ofertas válidas enquanto durarem os estoques');
  const [products, setProducts] = useState(saved?.products || starterProducts);
  const [query, setQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [draft, setDraft] = useState({ name: '', category: 'Geral', oldPrice: '', price: '', unit: 'un' });
  const [notice, setNotice] = useState('');

  const theme = themes.find((item) => item.id === selectedTheme) || themes[0];

  useEffect(() => {
    saveWorkspace({ theme: selectedTheme, format, campaign, store, validity, products });
  }, [selectedTheme, format, campaign, store, validity, products]);

  const filteredThemes = themes.filter((item) => category === 'Todos' || item.category === category);
  const visibleProducts = products.filter((item) => item.name.toLowerCase().includes(query.toLowerCase()));

  function addProduct(event) {
    event.preventDefault();
    if (!draft.name.trim() || !draft.price.trim()) return;
    setProducts((current) => [...current, { ...draft, id: Date.now() }]);
    setDraft({ name: '', category: 'Geral', oldPrice: '', price: '', unit: 'un' });
    setShowForm(false);
  }

  function removeProduct(id) {
    setProducts((current) => current.filter((product) => product.id !== id));
  }

  function exportPrint() {
    setNotice('Use a opção “Salvar como PDF” na janela de impressão.');
    window.setTimeout(() => setNotice(''), 4500);
    window.print();
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-lockup"><div className="brand-mark">D</div><div><strong>drogalink</strong><span>ENCARTES 2.0</span></div></div>
        <div className="workspace-label">ESTÚDIO DE CRIAÇÃO</div>
        <nav>
          <button className={activeTab === 'editor' ? 'nav-item active' : 'nav-item'} onClick={() => setActiveTab('editor')}><Icon name="grid"/> Editor de encartes</button>
          <button className={activeTab === 'themes' ? 'nav-item active' : 'nav-item'} onClick={() => setActiveTab('themes')}><Icon name="palette"/> Biblioteca de temas</button>
          <button className={activeTab === 'products' ? 'nav-item active' : 'nav-item'} onClick={() => setActiveTab('products')}><Icon name="package"/> Produtos</button>
        </nav>
        <div className="sidebar-bottom"><div className="status-dot"/> Projeto salvo neste dispositivo <small>Versão experimental 2.0</small></div>
      </aside>

      <main className="main-area">
        <header className="topbar"><div><span className="eyebrow">DROGALINK / ESTÚDIO</span><h1>{activeTab === 'themes' ? 'Biblioteca de temas' : activeTab === 'products' ? 'Catálogo de produtos' : 'Editor de encartes'}</h1></div><div className="top-actions"><span className="save-state"><Icon name="check"/> Salvamento automático</span><button className="button button-primary" onClick={exportPrint}><Icon name="download"/> Exportar PDF</button></div></header>

        {activeTab === 'editor' && <div className="editor-layout">
          <section className="work-panel">
            <div className="section-heading"><div><span className="eyebrow">PRÉ-VISUALIZAÇÃO</span><h2>Seu encarte</h2></div><div className="format-switch">{[['a4','A4'],['square','Quadrado'],['story','Story']].map(([id,label]) => <button key={id} className={format === id ? 'selected' : ''} onClick={() => setFormat(id)}>{label}</button>)}</div></div>
            <div className="canvas-stage">
              <article className={`flyer flyer-${format} theme-${theme.style}`} style={{ '--primary': theme.primary, '--accent': theme.accent, '--paper': theme.background, '--price': theme.price }}>
                <div className="flyer-top"><span className="flyer-kicker">PREÇOS QUE CABEM NO SEU BOLSO</span><span className="flyer-tag">OFERTA</span></div>
                <h2>{campaign || 'OFERTAS DA SEMANA'}</h2><div className="flyer-store">{store}</div>
                <div className="flyer-products">{products.slice(0, format === 'story' ? 4 : 6).map((product) => <div className="flyer-product" key={product.id}><div className="product-placeholder"><span>{product.name.slice(0,1).toUpperCase()}</span></div><div className="flyer-product-name">{product.name}</div>{product.oldPrice && <div className="old-price">De R$ {money(product.oldPrice)}</div>}<div className="sale-price"><small>R$</small>{money(product.price)}</div><div className="unit-label">/{product.unit || 'un'}</div></div>)}</div>
                <footer><strong>CONFIRA NOSSAS OFERTAS!</strong><span>{validity}</span></footer>
              </article>
            </div>
            {notice && <div className="notice">{notice}</div>}
          </section>

          <aside className="settings-panel">
            <div className="panel-title"><Icon name="spark"/><div><strong>Personalizar campanha</strong><span>Configure os detalhes do encarte</span></div></div>
            <label className="field-label">Título da campanha<input value={campaign} onChange={(e) => setCampaign(e.target.value)} /></label>
            <label className="field-label">Nome da loja<input value={store} onChange={(e) => setStore(e.target.value)} /></label>
            <label className="field-label">Rodapé / validade<input value={validity} onChange={(e) => setValidity(e.target.value)} /></label>
            <div className="control-divider"/>
            <div className="panel-row"><div><strong>Tema visual</strong><span>{theme.name}</span></div><button className="text-button" onClick={() => setActiveTab('themes')}>Ver todos</button></div>
            <div className="theme-mini-grid">{themes.slice(0,6).map((item) => <button key={item.id} title={item.name} className={selectedTheme === item.id ? 'theme-swatch active' : 'theme-swatch'} onClick={() => setSelectedTheme(item.id)} style={{ '--swatch': item.primary, '--swatch-accent': item.accent }}><span/></button>)}</div>
            <div className="control-divider"/>
            <div className="panel-row"><div><strong>Produtos no encarte</strong><span>{products.length} itens adicionados</span></div><button className="text-button" onClick={() => setActiveTab('products')}>Gerenciar</button></div>
            <button className="button button-outline full-width" onClick={() => setShowForm(true)}><Icon name="plus"/> Adicionar produto</button>
            {showForm && <form className="quick-form" onSubmit={addProduct}><input autoFocus placeholder="Nome do produto" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })}/><div className="form-pair"><input placeholder="Preço antigo" value={draft.oldPrice} onChange={(e) => setDraft({ ...draft, oldPrice: e.target.value })}/><input placeholder="Preço oferta" value={draft.price} onChange={(e) => setDraft({ ...draft, price: e.target.value })}/></div><div className="form-actions"><button type="button" className="text-button" onClick={() => setShowForm(false)}>Cancelar</button><button className="button button-primary" type="submit">Adicionar</button></div></form>}
          </aside>
        </div>}

        {activeTab === 'themes' && <section className="library-view"><div className="library-intro"><div><span className="eyebrow">IDENTIDADE VISUAL</span><h2>Escolha o clima da sua campanha</h2><p>Temas prontos para diferentes segmentos, datas e estilos de comunicação.</p></div><span className="count-pill">{themes.length} temas</span></div><div className="category-tabs">{themeCategories.map((item) => <button key={item} className={category === item ? 'selected' : ''} onClick={() => setCategory(item)}>{item}</button>)}</div><div className="theme-library-grid">{filteredThemes.map((item) => <button key={item.id} className={selectedTheme === item.id ? 'theme-card chosen' : 'theme-card'} onClick={() => { setSelectedTheme(item.id); setActiveTab('editor'); }}><div className={`theme-card-art theme-${item.style}`} style={{ '--primary': item.primary, '--accent': item.accent, '--paper': item.background, '--price': item.price }}><span className="art-burst">OFERTA</span><strong>PREÇOS<br/>ESPECIAIS</strong><div className="art-price">R$ 9,99</div><div className="art-lines"/></div><div className="theme-card-meta"><span><strong>{item.name}</strong><small>{item.category}</small></span>{selectedTheme === item.id ? <span className="selected-check"><Icon name="check"/></span> : <span className="choose-label">Usar tema</span>}</div></button>)}</div></section>}

        {activeTab === 'products' && <section className="products-view"><div className="library-intro"><div><span className="eyebrow">BASE DE OFERTAS</span><h2>Produtos da campanha</h2><p>Organize os itens que serão exibidos no encarte.</p></div><button className="button button-primary" onClick={() => setShowForm(true)}><Icon name="plus"/> Novo produto</button></div><div className="product-toolbar"><div className="search-box"><Icon name="search"/><input placeholder="Buscar produto..." value={query} onChange={(e) => setQuery(e.target.value)}/></div><span>{visibleProducts.length} produtos</span></div>{showForm && <form className="product-create-form" onSubmit={addProduct}><input placeholder="Nome do produto" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })}/><input placeholder="Categoria" value={draft.category} onChange={(e) => setDraft({ ...draft, category: e.target.value })}/><input placeholder="Preço antigo" value={draft.oldPrice} onChange={(e) => setDraft({ ...draft, oldPrice: e.target.value })}/><input placeholder="Preço oferta" value={draft.price} onChange={(e) => setDraft({ ...draft, price: e.target.value })}/><button className="button button-primary" type="submit">Salvar produto</button><button className="text-button" type="button" onClick={() => setShowForm(false)}>Cancelar</button></form>}<div className="product-table"><div className="product-table-head"><span>PRODUTO</span><span>CATEGORIA</span><span>PREÇO ANTERIOR</span><span>OFERTA</span><span/></div>{visibleProducts.map((item) => <div className="product-row" key={item.id}><div className="product-name-cell"><div className="table-product-icon">{item.name.slice(0,1).toUpperCase()}</div><strong>{item.name}</strong></div><span>{item.category}</span><span className="muted-price">{item.oldPrice ? 'R$ ' + money(item.oldPrice) : '—'}</span><strong className="table-sale-price">R$ {money(item.price)}</strong><button className="remove-button" onClick={() => removeProduct(item.id)} aria-label={`Remover ${item.name}`}>×</button></div>)}</div></section>}
      </main>
    </div>
  );
}