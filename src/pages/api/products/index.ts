import type { APIRoute } from 'astro'
import { getDB } from '../../../lib/db'
import { getProducts, createProduct, getProductsByCategory } from '../../../lib/db'
import { validateSession, getSessionFromCookie } from '../../../lib/auth'

export const GET: APIRoute = async ({ request, locals }) => {
  const db = getDB(locals.runtime.env)
  const url = new URL(request.url)
  const categoria = url.searchParams.get('categoria')

  const products = categoria
    ? await getProductsByCategory(db, categoria)
    : await getProducts(db)

  return new Response(JSON.stringify(products), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}

export const POST: APIRoute = async ({ request, locals }) => {
  const db = getDB(locals.runtime.env)
  const sessionId = getSessionFromCookie(request)
  if (!sessionId || !(await validateSession(db, sessionId))) {
    return new Response(JSON.stringify({ error: 'No autorizado' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  try {
    const body = await request.json()
    const slug = body.slug || body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    const success = await createProduct(db, {
      slug,
      title: body.title,
      precio: Number(body.precio),
      categoria: body.categoria || '',
      categoria_slug: body.categoria_slug || '',
      imagen: body.imagen || '',
      galeria: JSON.stringify(body.galeria || []),
      destacado: body.destacado ? 1 : 0,
      descripcion: body.descripcion || '',
    })

    if (success) {
      const product = await db.prepare('SELECT * FROM products WHERE slug = ?').bind(slug).first()
      return new Response(JSON.stringify(product), {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      })
    }
    return new Response(JSON.stringify({ error: 'Error al crear' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e?.message || 'Error' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
