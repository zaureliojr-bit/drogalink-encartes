// Estado da aplicação. É um objeto único porque módulos ES não deixam
// reatribuir um valor importado: `state.catalog = ...` funciona em todos os
// módulos, `catalog = ...` não funcionaria.

export const state = {
  catalog: [],        // todos os produtos cadastrados
  selected: [],       // ids no encarte, na ordem em que aparecem
  logoData: '',       // data URL do logo
  headBgData: '',     // data URL da imagem de cabeçalho enviada
  pageBgData: '',     // data URL do fundo de página enviado
  editingId: null,    // produto em edição no formulário
  pendingImage: ''    // foto escolhida no formulário, ainda não salva
};

// Campos do formulário que são persistidos e que disparam novo render.
export const FIELDS = [
  'campaign', 'store', 'valid', 'format', 'count', 'cbrand', 'caccent',
  'subtitle', 'band', 'storeName', 'footnote', 'layout', 'grid', 'highl',
  'porCaixa', 'theme', 'bgOpacity', 'legalText', 'useInfo', 'contactText',
  'deliveryText', 'installText'
];

export const STORAGE_KEY = 'drogalink_v1';
export const THEMES_KEY = 'drogalink_temas_v1';
