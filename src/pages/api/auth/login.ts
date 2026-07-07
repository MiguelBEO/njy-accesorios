import type { APIRoute } from 'astro'
import { getDB } from '../../../lib/db'
import { login, setSessionCookie } from '../../../lib/auth'

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const { username, password } = await request.json()
    const db = getDB(locals.runtime.env)
    const sessionId = await login(db, username, password)

    if (!sessionId) {
      return new Response(JSON.stringify({ error: 'Credenciales inválidas' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Set-Cookie': setSessionCookie(sessionId),
      },
    })
  } catch {
    return new Response(JSON.stringify({ error: 'Error interno' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
