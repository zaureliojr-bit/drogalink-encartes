export const themes = [
  { id: 'farmacia-classica', name: 'Farmácia clássica', category: 'Farmácia', primary: '#5c5c94', accent: '#ffcf45', background: '#f2f0fb', price: '#d72e42', style: 'classic' },
  { id: 'oferta-vermelha', name: 'Oferta vermelha', category: 'Popular', primary: '#c62828', accent: '#ffdf35', background: '#fff4ed', price: '#c62828', style: 'burst' },
  { id: 'premium-dark', name: 'Premium dark', category: 'Premium', primary: '#202536', accent: '#d9b66f', background: '#f1eee8', price: '#b32635', style: 'premium' },
  { id: 'supermercado-fresh', name: 'Fresh mercado', category: 'Supermercado', primary: '#16845b', accent: '#ffe16a', background: '#f0f8ed', price: '#d72e42', style: 'fresh' },
  { id: 'verao', name: 'Verão', category: 'Sazonal', primary: '#0077b6', accent: '#ffd60a', background: '#e9f8ff', price: '#e04436', style: 'summer' },
  { id: 'outono', name: 'Outono', category: 'Sazonal', primary: '#a4551f', accent: '#e9c46a', background: '#fbf0df', price: '#a12c22', style: 'autumn' },
  { id: 'inverno', name: 'Inverno', category: 'Sazonal', primary: '#3a5a7d', accent: '#cfe3f2', background: '#edf4fa', price: '#c33143', style: 'winter' },
  { id: 'primavera', name: 'Primavera', category: 'Sazonal', primary: '#2f8f5b', accent: '#ff8fab', background: '#eff9f0', price: '#d72e42', style: 'spring' },
  { id: 'natal', name: 'Natal', category: 'Datas especiais', primary: '#0b5d3b', accent: '#e4322b', background: '#f2f8f1', price: '#c62828', style: 'holiday' },
  { id: 'ano-novo', name: 'Ano novo', category: 'Datas especiais', primary: '#1b1b3a', accent: '#e8c55a', background: '#f5f3ed', price: '#a72d45', style: 'premium' },
  { id: 'pascoa', name: 'Páscoa', category: 'Datas especiais', primary: '#7b4bb7', accent: '#ffd166', background: '#f7f0ff', price: '#cf3e66', style: 'soft' },
  { id: 'dia-das-maes', name: 'Dia das mães', category: 'Datas especiais', primary: '#b5367a', accent: '#ffd9e6', background: '#fff0f5', price: '#c52c58', style: 'soft' },
  { id: 'dia-dos-pais', name: 'Dia dos pais', category: 'Datas especiais', primary: '#1f3a5f', accent: '#8ecae6', background: '#eef5fb', price: '#bd3340', style: 'classic' },
  { id: 'junina', name: 'Festa junina', category: 'Datas especiais', primary: '#c1440e', accent: '#ffd23f', background: '#fff4dd', price: '#b92325', style: 'burst' },
  { id: 'volta-as-aulas', name: 'Volta às aulas', category: 'Datas especiais', primary: '#2a6f97', accent: '#ffb703', background: '#eef7fc', price: '#c52d3a', style: 'fresh' },
  { id: 'black-friday', name: 'Black Friday', category: 'Campanhas', primary: '#111111', accent: '#ffd400', background: '#f1f1f1', price: '#d71920', style: 'dark' },
  { id: 'rosa', name: 'Rosa delicado', category: 'Cores', primary: '#d6336c', accent: '#ffd6e7', background: '#fff0f6', price: '#bd234f', style: 'soft' },
  { id: 'azul', name: 'Azul confiança', category: 'Cores', primary: '#14558f', accent: '#8ecae6', background: '#eff7fc', price: '#c52d3a', style: 'classic' }
];

export const themeCategories = ['Todos', ...new Set(themes.map((theme) => theme.category))];