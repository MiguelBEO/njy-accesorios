import { getSetting, setSetting, getDB } from './db'
import type { D1Database } from '@cloudflare/workers-types'

function generateId(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < 32; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

export async function login(db: D1Database, username: string, password: string): Promise<string | null> {
  const adminUser = await getSetting(db, 'admin_user')
  const adminPass = await getSetting(db, 'admin_pass')
  if (username === adminUser && password === adminPass) {
    const sessionId = generateId()
    await setSetting(db, `session:${sessionId}`, new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString())
    return sessionId
  }
  return null
}

export async function validateSession(db: D1Database, sessionId: string | null): Promise<boolean> {
  if (!sessionId) return false
  const expires = await getSetting(db, `session:${sessionId}`)
  if (!expires) return false
  const expiresDate = new Date(expires)
  if (expiresDate < new Date()) {
    await db.prepare('DELETE FROM settings WHERE key = ?').bind(`session:${sessionId}`).run()
    return false
  }
  return true
}

export async function logout(db: D1Database, sessionId: string): Promise<void> {
  await db.prepare('DELETE FROM settings WHERE key = ?').bind(`session:${sessionId}`).run()
}

export function getSessionFromCookie(request: Request): string | null {
  const cookie = request.headers.get('cookie')
  if (!cookie) return null
  const match = cookie.match(/(?:^|;\s*)njy_session=([^;]*)/)
  return match ? match[1] : null
}

export function setSessionCookie(sessionId: string): string {
  return `njy_session=${sessionId}; HttpOnly; Path=/; Max-Age=${7 * 24 * 60 * 60}; SameSite=Lax`
}

export function clearSessionCookie(): string {
  return `njy_session=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax`
}
