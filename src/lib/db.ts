import type { D1Database } from '@cloudflare/workers-types'

export interface Product {
  id: number
  slug: string
  title: string
  precio: number
  categoria: string
  categoria_slug: string
  imagen: string
  galeria: string
  destacado: number
  descripcion: string
  created_at: string
}

export interface Category {
  id: number
  slug: string
  title: string
  descripcion: string
  created_at: string
}

export interface Setting {
  key: string
  value: string
}

export function getDB(env: any): D1Database {
  return env.DB
}

export async function getProducts(db: D1Database): Promise<Product[]> {
  const { results } = await db.prepare('SELECT * FROM products ORDER BY created_at DESC').all<Product>()
  return results
}

export async function getProductBySlug(db: D1Database, slug: string): Promise<Product | null> {
  return db.prepare('SELECT * FROM products WHERE slug = ?').bind(slug).first<Product>()
}

export async function getFeaturedProducts(db: D1Database): Promise<Product[]> {
  const { results } = await db.prepare('SELECT * FROM products WHERE destacado = 1 ORDER BY created_at DESC').all<Product>()
  return results
}

export async function getProductsByCategory(db: D1Database, categoriaSlug: string): Promise<Product[]> {
  const { results } = await db.prepare('SELECT * FROM products WHERE categoria_slug = ? ORDER BY created_at DESC').bind(categoriaSlug).all<Product>()
  return results
}

export async function createProduct(db: D1Database, product: Omit<Product, 'id' | 'created_at'>): Promise<boolean> {
  const info = await db.prepare(
    'INSERT INTO products (slug, title, precio, categoria, categoria_slug, imagen, galeria, destacado, descripcion) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
  ).bind(
    product.slug, product.title, product.precio, product.categoria,
    product.categoria_slug, product.imagen, product.galeria,
    product.destacado, product.descripcion
  ).run()
  return info.success
}

export async function updateProduct(db: D1Database, slug: string, product: Partial<Product>): Promise<boolean> {
  const fields: string[] = []
  const values: any[] = []
  if (product.title !== undefined) { fields.push('title = ?'); values.push(product.title) }
  if (product.precio !== undefined) { fields.push('precio = ?'); values.push(product.precio) }
  if (product.categoria !== undefined) { fields.push('categoria = ?'); values.push(product.categoria) }
  if (product.categoria_slug !== undefined) { fields.push('categoria_slug = ?'); values.push(product.categoria_slug) }
  if (product.imagen !== undefined) { fields.push('imagen = ?'); values.push(product.imagen) }
  if (product.galeria !== undefined) { fields.push('galeria = ?'); values.push(product.galeria) }
  if (product.destacado !== undefined) { fields.push('destacado = ?'); values.push(product.destacado) }
  if (product.descripcion !== undefined) { fields.push('descripcion = ?'); values.push(product.descripcion) }
  if (fields.length === 0) return false
  values.push(slug)
  const info = await db.prepare(`UPDATE products SET ${fields.join(', ')} WHERE slug = ?`).bind(...values).run()
  return info.success
}

export async function deleteProduct(db: D1Database, slug: string): Promise<boolean> {
  const info = await db.prepare('DELETE FROM products WHERE slug = ?').bind(slug).run()
  return info.success
}

export async function getCategories(db: D1Database): Promise<Category[]> {
  const { results } = await db.prepare('SELECT * FROM categories ORDER BY title ASC').all<Category>()
  return results
}

export async function getCategoryBySlug(db: D1Database, slug: string): Promise<Category | null> {
  return db.prepare('SELECT * FROM categories WHERE slug = ?').bind(slug).first<Category>()
}

export async function createCategory(db: D1Database, category: Omit<Category, 'id' | 'created_at'>): Promise<boolean> {
  const info = await db.prepare(
    'INSERT INTO categories (slug, title, descripcion) VALUES (?, ?, ?)'
  ).bind(category.slug, category.title, category.descripcion).run()
  return info.success
}

export async function updateCategory(db: D1Database, slug: string, category: Partial<Category>): Promise<boolean> {
  const fields: string[] = []
  const values: any[] = []
  if (category.title !== undefined) { fields.push('title = ?'); values.push(category.title) }
  if (category.descripcion !== undefined) { fields.push('descripcion = ?'); values.push(category.descripcion) }
  if (fields.length === 0) return false
  values.push(slug)
  const info = await db.prepare(`UPDATE categories SET ${fields.join(', ')} WHERE slug = ?`).bind(...values).run()
  return info.success
}

export async function deleteCategory(db: D1Database, slug: string): Promise<boolean> {
  const info = await db.prepare('DELETE FROM categories WHERE slug = ?').bind(slug).run()
  return info.success
}

export async function getSetting(db: D1Database, key: string): Promise<string | null> {
  const row = await db.prepare('SELECT value FROM settings WHERE key = ?').bind(key).first<Setting>()
  return row?.value ?? null
}

export async function setSetting(db: D1Database, key: string, value: string): Promise<boolean> {
  const info = await db.prepare(
    'INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)'
  ).bind(key, value).run()
  return info.success
}

export async function getAllSettings(db: D1Database): Promise<Setting[]> {
  const { results } = await db.prepare('SELECT * FROM settings ORDER BY key').all<Setting>()
  return results
}
