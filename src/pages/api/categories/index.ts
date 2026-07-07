import type { APIRoute } from 'astro'
import { getDB } from '../../../lib/db'
import { getCategories, createCategory } from '../../../lib/db'
import { validateSession, getSessionFromCookie } from '../../../lib/auth'

export const GET: APIRoute = async ({ locals }) => {
  const db = getDB(locals.runtime.env)
  const categories = await getCategories(db)
  return new Response(JSON.stringify(categories), {
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
    const success = await createCategory(db, {
      slug,
      title: body.title,
      descripcion: body.descripcion || '',
    })

    if (success) {
      const category = await db.prepare('SELECT * FROM categories WHERE slug = ?').bind(slug).first()
      return new Response(JSON.stringify(category), {
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
