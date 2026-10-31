-- Esquema de referência para quando o encarte deixar de viver só no
-- navegador. NADA aqui está em uso pelo app hoje: ele guarda tudo no
-- localStorage. É o desenho para a integração com o painel do padronizador.
--
-- Escrito em SQL padrão, compatível com PostgreSQL e com SQLite (basta
-- trocar os tipos de data).

-- Unidades da rede. Cada uma pode ter catálogo e campanhas próprias.
CREATE TABLE IF NOT EXISTS lojas (
  id            TEXT PRIMARY KEY,
  nome          TEXT NOT NULL,
  slug          TEXT NOT NULL UNIQUE,      -- usado no produtos-<slug>.json
  endereco      TEXT,
  telefone      TEXT,
  ativa         BOOLEAN NOT NULL DEFAULT TRUE,
  criada_em     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Espelha o formato que o app usa hoje em memória.
CREATE TABLE IF NOT EXISTS produtos (
  id            TEXT PRIMARY KEY,
  loja_id       TEXT REFERENCES lojas(id) ON DELETE CASCADE,
  nome          TEXT NOT NULL,
  categoria     TEXT,
  preco_normal  NUMERIC(10,2) NOT NULL DEFAULT 0,
  preco_oferta  NUMERIC(10,2) NOT NULL,     -- obrigatório e maior que zero
  codigo        TEXT,
  ean           TEXT,
  imagem        TEXT,                        -- URL; mesma origem evita o bloqueio de CORS no PNG
  laboratorio   TEXT,                        -- já concatenado com o registro MS
  leve          INTEGER NOT NULL DEFAULT 0,  -- promoção "leve N por"
  atualizado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CHECK (preco_oferta > 0)
);

-- EAN e código são as chaves usadas para não duplicar na importação.
CREATE UNIQUE INDEX IF NOT EXISTS produtos_loja_ean ON produtos (loja_id, ean) WHERE ean <> '';
CREATE INDEX IF NOT EXISTS produtos_nome ON produtos (nome);

-- Uma campanha é o encarte salvo: textos, formato, layout, tema e imagens.
CREATE TABLE IF NOT EXISTS campanhas (
  id            TEXT PRIMARY KEY,
  loja_id       TEXT REFERENCES lojas(id) ON DELETE CASCADE,
  nome          TEXT NOT NULL,
  valida_ate    DATE,
  formato       TEXT NOT NULL DEFAULT 'a4',      -- a4 | square | story
  layout        TEXT NOT NULL DEFAULT 'cards',   -- cards | table | mixed | grupos
  grade         TEXT,                            -- id da grade (ver src/layouts/grids.js)
  tema          TEXT,                            -- id do tema (ver src/themes/)
  config        TEXT,                            -- JSON com os demais campos do formulário
  criada_em     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  publicada_em  TIMESTAMP
);

-- Produtos de uma campanha, na ordem em que aparecem (posicao decide quem
-- ocupa os destaques).
CREATE TABLE IF NOT EXISTS campanha_itens (
  campanha_id   TEXT NOT NULL REFERENCES campanhas(id) ON DELETE CASCADE,
  produto_id    TEXT NOT NULL REFERENCES produtos(id) ON DELETE CASCADE,
  posicao       INTEGER NOT NULL,
  PRIMARY KEY (campanha_id, produto_id)
);

CREATE INDEX IF NOT EXISTS campanha_itens_ordem ON campanha_itens (campanha_id, posicao);

-- Temas personalizados importados por .json, hoje salvos no navegador.
CREATE TABLE IF NOT EXISTS temas (
  id            TEXT PRIMARY KEY,
  nome          TEXT NOT NULL,
  grupo         TEXT NOT NULL DEFAULT 'personalizado', -- seasonal | pharmacy | supermarket | premium | personalizado
  brand         TEXT NOT NULL,
  accent        TEXT NOT NULL,
  gradiente_de  TEXT,
  gradiente_ate TEXT,
  motivo        TEXT,
  cor_preco     TEXT
);
