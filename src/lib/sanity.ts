import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

function getClient() {
  const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID
  if (!projectId) return null
  return createClient({
    projectId,
    dataset: import.meta.env.PUBLIC_SANITY_DATASET || 'production',
    apiVersion: '2024-01-01',
    useCdn: true,
  })
}

let _builder: ReturnType<typeof imageUrlBuilder> | null = null

function getBuilder() {
  if (!_builder) {
    const c = getClient()
    if (c) _builder = imageUrlBuilder(c)
  }
  return _builder
}

export function urlFor(source: any, width = 400): string {
  if (!source) return '/images/placeholder.svg'
  try {
    const b = getBuilder()
    if (!b) return '/images/placeholder.svg'
    return b.image(source).width(width).url()
  } catch {
    return '/images/placeholder.svg'
  }
}

export interface ProductoSanity {
  _id: string
  _createdAt: string
  title: string
  slug: string
  precio: number
  categoria: string
  categoriaSlug: string
  imagen: any
  galeria: any[]
  destacado: boolean
  descripcion: string
}

export interface CategoriaSanity {
  _id: string
  title: string
  slug: string
  descripcion?: string
}

const productosQuery = `*[_type == "producto"] | order(_createdAt desc){
  _id,
  _createdAt,
  title,
  "slug": slug.current,
  precio,
  "categoria": categoria->title,
  "categoriaSlug": categoria->slug.current,
  imagen,
  galeria,
  destacado,
  descripcion
}`

const categoriasQuery = `*[_type == "categoria"] | order(title asc){
  _id,
  title,
  "slug": slug.current,
  descripcion
}`

export async function getProductos(): Promise<ProductoSanity[]> {
  const c = getClient()
  if (!c) return []
  return c.fetch(productosQuery)
}

export async function getProductoBySlug(slug: string): Promise<ProductoSanity | null> {
  const c = getClient()
  if (!c) return null
  return c.fetch(`*[_type == "producto" && slug.current == $slug][0]{
    _id,
    _createdAt,
    title,
    "slug": slug.current,
    precio,
    "categoria": categoria->title,
    "categoriaSlug": categoria->slug.current,
    imagen,
    galeria,
    destacado,
    descripcion
  }`, { slug })
}

export async function getCategorias(): Promise<CategoriaSanity[]> {
  const c = getClient()
  if (!c) return []
  return c.fetch(categoriasQuery)
}
