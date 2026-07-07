import type { APIRoute } from 'astro'
import { getDB } from '../../../lib/db'
import { logout, getSessionFromCookie, clearSessionCookie } from '../../../lib/auth'

export const POST: APIRoute = async ({ request, locals }) => {
  const db = getDB(locals.runtime.env)
  const sessionId = getSessionFromCookie(request)
  if (sessionId) {
    await logout(db, sessionId)
  }
  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Set-Cookie': clearSessionCookie(),
    },
  })
}
