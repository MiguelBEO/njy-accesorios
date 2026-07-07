import type { APIRoute } from 'astro'
import { getDB } from '../../../lib/db'
import { getCategoryBySlug, updateCategory, deleteCategory } from '../../../lib/db'
import { validateSession, getSessionFromCookie } from '../../../lib/auth'

export const GET: APIRoute = async ({ params, locals }) => {
  const db = getDB(locals.runtime.env)
  const category = await getCategoryBySlug(db, params.slug!)
  if (!category) {
    return new Response(JSON.stringify({ error: 'No encontrado' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    })
  }
  return new Response(JSON.stringify(category), {
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
    if (body.descripcion !== undefined) updates.descripcion = body.descripcion

    const success = await updateCategory(db, params.slug!, updates)
    if (!success) {
      return new Response(JSON.stringify({ error: 'No encontrado' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const category = await getCategoryBySlug(db, params.slug!)
    return new Response(JSON.stringify(category), {
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

  const success = await deleteCategory(db, params.slug!)
  return new Response(JSON.stringify({ success }), {
    status: success ? 200 : 404,
    headers: { 'Content-Type': 'application/json' },
  })
}
