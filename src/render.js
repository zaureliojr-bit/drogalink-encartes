// Ponto de encontro dos renders. Existe para quebrar a dependência circular
// entre os módulos: quem precisa redesenhar a tela importa daqui, e a página
// (src/pages/editor.js) registra as funções reais no arranque.

export const renderers = {
  catalog: () => {},
  flyer: () => {}
};

export const renderCatalog = () => renderers.catalog();
export const renderFlyer = () => renderers.flyer();
export const renderAll = () => { renderers.catalog(); renderers.flyer() };
