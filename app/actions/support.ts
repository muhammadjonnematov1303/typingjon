'use server'

import { getSession } from '@/lib/session'
import { getDb }      from '@/lib/prisma'

// Valid Uzbekistan mobile operator codes
// Beeline: 90,91 | Ucell: 93,94,50 | Mobiuz: 97,88
// Uzmobile: 77,99,95 | Humans: 33 | Perfectum: 98,80 | OQ: 20
const UZ_OPERATOR_CODES = new Set([
  '90', '91',
  '93', '94', '50',
  '97', '88',
  '77', '99', '95',
  '33',
  '98', '80',
  '20',
])

// Name must be: ≥2 words, ≥2 chars each, letters/apostrophe/hyphen only, no digits
function isValidName(name: string): string | null {
  if (!name || name.length < 3)   return "Ism familiyani to'liq kiriting (kamida 3 belgi)"
  if (name.length > 80)           return "Ism juda uzun (ko'pi bilan 80 belgi)"
  if (/\d/.test(name))            return "Ismda raqam bo'lishi mumkin emas"
  if (/[^a-zA-ZА-яёЁҒғҲҳҚқЎўЧчШш'\-\s]/.test(name))
                                  return "Ismda faqat harflar ishlatilishi mumkin"
  const parts = name.trim().split(/\s+/).filter(p => p.length > 0)
  if (parts.length < 2)           return "Ism va familiyangizni kiriting (masalan: Shukur Jalolov)"
  if (parts.some(p => p.length < 2))
                                  return "Har bir so'z kamida 2 ta harfdan iborat bo'lishi kerak"
  return null
}

export async function sendSupportMessage(formData: FormData) {
  const name    = (formData.get('name')    as string)?.trim()
  const phone   = (formData.get('phone')   as string)?.trim()
  const message = (formData.get('message') as string)?.trim()

  // Name validation
  const nameError = isValidName(name ?? '')
  if (nameError) return { error: nameError }

  if (!message || message.length < 5)
    return { error: "Murojaatni kiriting (kamida 5 belgi)" }

  // Phone validation
  const digits = phone?.replace(/\D/g, '') ?? ''
  if (digits.length !== 9)
    return { error: "Tel raqam 9 ta raqamdan iborat bo'lishi kerak" }

  const operatorCode = digits.slice(0, 2)
  if (!UZ_OPERATOR_CODES.has(operatorCode))
    return { error: "Noto'g'ri operator kodi. Faqat O'zbekiston raqamlari qabul qilinadi" }

  const tail = digits.slice(2) // 7 digits after operator code
  if (/^(\d)\1{6}$/.test(tail))
    return { error: "Haqiqiy telefon raqamingizni kiriting" }

  const FAKE = ['1234567', '2345678', '3456789', '0123456', '9876543',
                '8765432', '7654321', '6543210', '0000000', '1111111']
  if (FAKE.includes(tail))
    return { error: "Haqiqiy telefon raqamingizni kiriting" }

  const fullPhone = `+998 ${digits.replace(/(\d{2})(\d{3})(\d{2})(\d{2})/, '$1 $2 $3 $4')}`

  // Sender's profile (optional)
  let profileInfo = "Mehmon (tizimga kirmagan)"
  try {
    const userId = await getSession()
    if (userId) {
      const db   = getDb()
      const user = await db.user.findUnique({ where: { id: userId }, select: { name: true, email: true } })
      if (user) profileInfo = `${escHtml(user.name)} — ${escHtml(user.email)}`
    }
  } catch { /* non-fatal */ }

  const token  = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID

  if (!token || !chatId || chatId === 'PLACEHOLDER') {
    console.error('[Support] TELEGRAM_BOT_TOKEN yoki TELEGRAM_CHAT_ID .env da yo\'q')
    return { error: "Texnik xatolik yuz berdi. Iltimos keyinroq urinib ko'ring." }
  }

  const now = new Date().toLocaleString('uz-UZ', {
    timeZone:    'Asia/Tashkent',
    day:         'numeric',
    month:       'long',
    year:        'numeric',
    hour:        '2-digit',
    minute:      '2-digit',
  })

  const text = [
    '🆕 <b>Yangi murojaat</b> — Typingjon',
    '',
    '─────────────────────',
    `👤 <b>Ism:</b>     ${escHtml(name)}`,
    `📞 <b>Tel:</b>     ${escHtml(fullPhone)}`,
    `🔐 <b>Profil:</b>  ${profileInfo}`,
    '─────────────────────',
    '💬 <b>Xabar:</b>',
    '',
    escHtml(message),
    '',
    '─────────────────────',
    `⏰ <b>Vaqt:</b> ${now} (UZT)`,
  ].join('\n')

  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' }),
  })

  if (!res.ok) {
    console.error('[Support] Telegram API xatosi:', await res.text())
    return { error: "Xabar yuborishda xatolik. Iltimos qayta urinib ko'ring." }
  }

  return { ok: true }
}

function escHtml(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}
