import type { APIRoute } from 'astro'
import { getDB } from '../../../lib/db'
import { getProductBySlug, updateProduct, deleteProduct } from '../../../lib/db'
import { validateSession, getSessionFromCookie } from '../../../lib/auth'

export const GET: APIRoute = async ({ params, locals }) => {
  const db = getDB(locals.runtime.env)
  const product = await getProductBySlug(db, params.slug!)
  if (!product) {
    return new Response(JSON.stringify({ error: 'No encontrado' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    })
  }
  return new Response(JSON.stringify(product), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}

export const PUT: APIRoute = async ({ params, request, locals }) => {
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
    const updates: any = {}
    if (body.title !== undefined) updates.title = body.title
    if (body.precio !== undefined) updates.precio = Number(body.precio)
    if (body.categoria !== undefined) updates.categoria = body.categoria
    if (body.categoria_slug !== undefined) updates.categoria_slug = body.categoria_slug
    if (body.imagen !== undefined) updates.imagen = body.imagen
    if (body.galeria !== undefined) updates.galeria = JSON.stringify(body.galeria)
    if (body.destacado !== undefined) updates.destacado = body.destacado ? 1 : 0
    if (body.descripcion !== undefined) updates.descripcion = body.descripcion

    const success = await updateProduct(db, params.slug!, updates)
    if (!success) {
      return new Response(JSON.stringify({ error: 'No encontrado' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const product = await getProductBySlug(db, params.slug!)
    return new Response(JSON.stringify(product), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e?.message || 'Error' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}

export const DELETE: APIRoute = async ({ params, request, locals }) => {
  const db = getDB(locals.runtime.env)
  const sessionId = getSessionFromCookie(request)
  if (!sessionId || !(await validateSession(db, sessionId))) {
    return new Response(JSON.stringify({ error: 'No autorizado' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const success = await deleteProduct(db, params.slug!)
  return new Response(JSON.stringify({ success }), {
    status: success ? 200 : 404,
    headers: { 'Content-Type': 'application/json' },
  })
}
