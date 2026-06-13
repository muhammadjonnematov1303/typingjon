'use server'

import { redirect } from 'next/navigation'
import bcryptjs from 'bcryptjs'
import { getDb } from '@/lib/prisma'
import { sendVerificationEmail } from '@/lib/mail'
import { setSession, clearSession } from '@/lib/session'

function generateCode() {
  return String(Math.floor(10000 + Math.random() * 90000))
}

// ── 1. Ro'yxatdan o'tish ──────────────────────────────────────────────────────
export async function registerAction(_: unknown, formData: FormData) {
  const name     = (formData.get('name')     as string)?.trim()
  const email    = (formData.get('email')    as string)?.toLowerCase().trim()
  const password = (formData.get('password') as string)

  if (!name || name.length < 2)
    return { error: "To'liq ismingizni kiriting (kamida 2 ta belgi)" }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return { error: "To'g'ri email manzil kiriting" }
  if (!password || password.length < 8)
    return { error: "Parol kamida 8 ta belgidan iborat bo'lishi kerak" }

  const db = getDb()

  const existing = await db.user.findUnique({ where: { email } })
  if (existing?.emailVerified)
    return { error: "Bu email allaqachon ro'yxatdan o'tgan. Kirish sahifasiga o'ting." }

  const hashedPassword = await bcryptjs.hash(password, 12)

  await db.user.upsert({
    where:  { email },
    create: { name, email, password: hashedPassword },
    update: { name, password: hashedPassword },
  })

  const code = generateCode()
  await db.verificationCode.deleteMany({ where: { email } })
  await db.verificationCode.create({
    data: { email, code, expiresAt: new Date(Date.now() + 10 * 60 * 1000) },
  })

  try {
    await sendVerificationEmail(email, code)
  } catch {
    return { error: "Email yuborishda xatolik yuz berdi. Email manzilini tekshiring." }
  }

  redirect(`/verify-email?email=${encodeURIComponent(email)}`)
}

// ── 2. Kodni tasdiqlash ───────────────────────────────────────────────────────
export async function verifyEmailAction(email: string, code: string) {
  const lower = email.toLowerCase()
  const db    = getDb()

  const record = await db.verificationCode.findFirst({
    where:   { email: lower },
    orderBy: { createdAt: 'desc' },
  })

  if (!record)
    return { error: "Tasdiqlash kodi topilmadi. Qayta yuboring." }

  if (new Date() > record.expiresAt) {
    await db.verificationCode.delete({ where: { id: record.id } })
    return { error: "Kod muddati tugagan. Qayta yuboring." }
  }

  if (record.code !== code)
    return { error: "Kod noto'g'ri. Qayta tekshiring." }

  const now = new Date()
  const user = await db.user.update({
    where: { email: lower },
    data:  { emailVerified: now, lastLoginAt: now, lastSeenAt: now },
  })
  await db.verificationCode.deleteMany({ where: { email: lower } })

  await db.notification.create({
    data: {
      userId: user.id,
      title:  "Xush kelibsiz, Typingjon ga!",
      body:   "Hisobingiz muvaffaqiyatli tasdiqlandi. Birinchi testingizni boshlang!",
    },
  })

  await setSession(user.id)
  redirect('/dashboard')
}

// ── 3. Kirish ────────────────────────────────────────────────────────────────
export async function loginAction(_: unknown, formData: FormData) {
  const email    = (formData.get('email')    as string)?.toLowerCase().trim()
  const password = (formData.get('password') as string)

  if (!email || !password)
    return { error: "Email va parolni kiriting" }

  const db   = getDb()
  const user = await db.user.findUnique({ where: { email } })

  if (!user)
    return { error: "Bu email bilan hisob topilmadi" }

  if (!user.emailVerified)
    return { error: "Emailingiz tasdiqlanmagan. Avval emailni tasdiqlang" }

  if (!user.password)
    return { error: "Bu hisob Google orqali yaratilgan. 'Google bilan kirish' tugmasini bosing." }

  const ok = await bcryptjs.compare(password, user.password)
  if (!ok)
    return { error: "Parol noto'g'ri" }

  const now = new Date()
  await db.user.update({ where: { id: user.id }, data: { lastLoginAt: now, lastSeenAt: now } })
  await setSession(user.id)
  redirect('/dashboard')
}

// ── 4. Chiqish ────────────────────────────────────────────────────────────────
export async function logoutAction() {
  await clearSession()
  redirect('/login')
}

// ── 5. Kodni qayta yuborish ───────────────────────────────────────────────────
export async function resendCodeAction(email: string) {
  const lower = email.toLowerCase()
  const db    = getDb()

  const user = await db.user.findUnique({ where: { email: lower } })
  if (!user) return { error: "Foydalanuvchi topilmadi." }

  const code = generateCode()
  await db.verificationCode.deleteMany({ where: { email: lower } })
  await db.verificationCode.create({
    data: { email: lower, code, expiresAt: new Date(Date.now() + 10 * 60 * 1000) },
  })

  try {
    await sendVerificationEmail(lower, code)
  } catch {
    return { error: "Email yuborishda xatolik yuz berdi." }
  }

  return { ok: true }
}
