-- N&J Accesorios - Database Schema

CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  precio REAL NOT NULL,
  categoria TEXT NOT NULL DEFAULT '',
  categoria_slug TEXT NOT NULL DEFAULT '',
  imagen TEXT DEFAULT '',
  galeria TEXT DEFAULT '[]',
  destacado INTEGER DEFAULT 0,
  descripcion TEXT DEFAULT '',
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  descripcion TEXT DEFAULT '',
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  created_at TEXT DEFAULT (datetime('now'))
);

-- Default settings
INSERT OR IGNORE INTO settings VALUES ('admin_user', 'NoraWrite');
INSERT OR IGNORE INTO settings VALUES ('admin_pass', 'lcdll22');
INSERT OR IGNORE INTO settings VALUES ('site_logo', '/images/placeholder.svg');
INSERT OR IGNORE INTO settings VALUES ('site_name', 'N&J Accesorios y Belleza');
INSERT OR IGNORE INTO settings VALUES ('site_tagline', 'Detalles que te hacen brillar');

-- Default categories
INSERT OR IGNORE INTO categories (slug, title, descripcion) VALUES
  ('collares', 'Collares', 'Collares elegantes y delicados'),
  ('anillos', 'Anillos', 'Anillos para toda ocasión'),
  ('labiales', 'Labiales', 'Labiales de larga duración'),
  ('aretes', 'Aretes', 'Aretes que complementan tu look'),
  ('pulseras', 'Pulseras', 'Pulseras artesanales'),
  ('sets', 'Sets', 'Sets completos de accesorios');
