import type { APIRoute } from 'astro'
import { getDB, getSetting } from '../../../lib/db'
import { validateSession, getSessionFromCookie } from '../../../lib/auth'

export const GET: APIRoute = async ({ request, locals }) => {
  const db = getDB(locals.runtime.env)
  const sessionId = getSessionFromCookie(request)

  if (!sessionId || !(await validateSession(db, sessionId))) {
    return new Response(JSON.stringify({ authenticated: false }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const username = await getSetting(db, 'admin_user')
  return new Response(JSON.stringify({ authenticated: true, username }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}
