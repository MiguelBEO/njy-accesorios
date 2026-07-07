import type { APIRoute } from 'astro'
import { getDB } from '../../../lib/db'
import { getAllSettings, setSetting } from '../../../lib/db'
import { validateSession, getSessionFromCookie } from '../../../lib/auth'

export const GET: APIRoute = async ({ locals }) => {
  const db = getDB(locals.runtime.env)
  const settings = await getAllSettings(db)
  const obj: Record<string, string> = {}
  for (const s of settings) {
    if (!s.key.startsWith('session:')) {
      obj[s.key] = s.value
    }
  }
  return new Response(JSON.stringify(obj), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}

export const PUT: APIRoute = async ({ request, locals }) => {
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
    for (const [key, value] of Object.entries(body)) {
      if (!key.startsWith('session:') && key !== 'admin_pass') {
        await setSetting(db, key, String(value))
      }
    }
    return new Response(JSON.stringify({ success: true }), {
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
