import { cookies } from 'next/headers'

const SESSION_COOKIE = 'tj_session'
const MAX_AGE = 30 * 24 * 60 * 60 // 30 kun

export async function setSession(userId: string) {
  const store = await cookies()
  store.set(SESSION_COOKIE, userId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: MAX_AGE,
    path: '/',
  })
}

export async function getSession(): Promise<string | null> {
  const store = await cookies()
  return store.get(SESSION_COOKIE)?.value ?? null
}

export async function clearSession() {
  const store = await cookies()
  store.delete(SESSION_COOKIE)
}
