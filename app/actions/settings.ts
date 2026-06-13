'use server'

import bcryptjs from 'bcryptjs'
import { getDb } from '@/lib/prisma'
import { getSession } from '@/lib/session'

export async function updateProfileAction(_: unknown, formData: FormData) {
  const userId = await getSession()
  if (!userId) return { error: "Avval tizimga kiring" }

  const name = (formData.get('name') as string)?.trim()
  if (!name || name.length < 2)
    return { error: "To'liq ismingizni kiriting (kamida 2 ta belgi)" }

  const db = getDb()
  await db.user.update({ where: { id: userId }, data: { name } })

  return { ok: true }
}

export async function changePasswordAction(_: unknown, formData: FormData) {
  const userId = await getSession()
  if (!userId) return { error: "Avval tizimga kiring" }

  const current = formData.get('current') as string
  const next    = formData.get('next')    as string

  if (!current || !next)
    return { error: "Barcha maydonlarni to'ldiring" }
  if (next.length < 8)
    return { error: "Yangi parol kamida 8 ta belgidan iborat bo'lishi kerak" }

  const db   = getDb()
  const user = await db.user.findUnique({ where: { id: userId } })
  if (!user) return { error: "Foydalanuvchi topilmadi" }

  const ok = await bcryptjs.compare(current, user.password)
  if (!ok) return { error: "Joriy parol noto'g'ri" }

  const hashed = await bcryptjs.hash(next, 12)
  await db.user.update({ where: { id: userId }, data: { password: hashed } })

  return { ok: true }
}
