// Temas de datas e estações. id => { nome, brand, accent, g (gradiente do
// cabeçalho), m (motivo decorativo), p (cor do preço) }.
// Os ids não mudam: são o que já está salvo no navegador dos usuários.

export const seasonal = {
  verao:     { nome: 'Verão',          brand: '#0077b6', accent: '#ffd60a', g: ['#0077b6', '#00527e'], m: 'sun',    p: '#e74650' },
  outono:    { nome: 'Outono',         brand: '#a4551f', accent: '#e9c46a', g: ['#a4551f', '#73390f'], m: 'leaf',   p: '#c0392b' },
  inverno:   { nome: 'Inverno',        brand: '#3a5a7d', accent: '#cfe3f2', g: ['#3a5a7d', '#243d56'], m: 'snow',   p: '#e74650' },
  primavera: { nome: 'Primavera',      brand: '#2f8f5b', accent: '#ff8fab', g: ['#2f8f5b', '#1f6540'], m: 'flower', p: '#e4487a' },
  natal:     { nome: 'Natal',          brand: '#0b5d3b', accent: '#e4322b', g: ['#0b5d3b', '#063f27'], m: 'snow',   p: '#e4322b' },
  anonovo:   { nome: 'Ano Novo',       brand: '#1b1b3a', accent: '#e8c55a', g: ['#1b1b3a', '#0b0b1f'], m: 'star',   p: '#c9a227' },
  pascoa:    { nome: 'Páscoa',         brand: '#7b4bb7', accent: '#ffd166', g: ['#7b4bb7', '#55318a'], m: 'egg',    p: '#e4487a' },
  maes:      { nome: 'Dia das Mães',   brand: '#b5367a', accent: '#ffd9e6', g: ['#b5367a', '#86245a'], m: 'heart',  p: '#e4487a' },
  pais:      { nome: 'Dia dos Pais',   brand: '#1f3a5f', accent: '#8ecae6', g: ['#1f3a5f', '#122440'], m: 'star',   p: '#e74650' },
  juninas:   { nome: 'Festas Juninas', brand: '#c1440e', accent: '#ffd23f', g: ['#c1440e', '#8c2f09'], m: 'flag',   p: '#e74650' },
  aulas:     { nome: 'Volta às aulas', brand: '#2a6f97', accent: '#ffb703', g: ['#2a6f97', '#1a4a67'], m: 'star',   p: '#e74650' },
  rosa:      { nome: 'Outubro Rosa',   brand: '#d6336c', accent: '#ffd6e7', g: ['#d6336c', '#a01f4e'], m: 'heart',  p: '#d6336c' },
  azul:      { nome: 'Novembro Azul',  brand: '#14558f', accent: '#8ecae6', g: ['#14558f', '#0a3760'], m: 'star',   p: '#14558f' },
  black:     { nome: 'Black Friday',   brand: '#111111', accent: '#ffd400', g: ['#161616', '#000000'], m: 'star',   p: '#e74650' }
};
