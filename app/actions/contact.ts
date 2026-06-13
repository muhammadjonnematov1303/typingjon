'use server'

import { getSession } from '@/lib/session'
import { getDb } from '@/lib/prisma'
import { tgSend, ADMIN_ID } from '@/lib/telegram'

const TYPE_LABELS: Record<string, string> = {
  muammo: 'Muammo',
  taklif: 'Taklif',
  savol:  'Savol',
  boshqa: 'Boshqa',
}

export async function sendContactAction(_: unknown, formData: FormData) {
  const name    = (formData.get('name')    as string)?.trim()
  const type    = (formData.get('type')    as string)?.trim() || 'boshqa'
  const message = (formData.get('message') as string)?.trim()

  if (!name || name.length < 2)
    return { error: "Ismingizni kiriting (kamida 2 ta belgi)" }
  if (!message || message.length < 10)
    return { error: "Xabar kamida 10 ta belgidan iborat bo'lsin" }

  const db     = getDb()
  const userId = await getSession()
  let   userLine = `<b>Ism:</b> ${name}`

  if (userId) {
    const user = await db.user.findUnique({
      where:  { id: userId },
      select: { email: true },
    })
    if (user) {
      userLine += `\n<b>Email:</b> ${user.email}`
      userLine += `\n<b>ID:</b> <code>${userId}</code>`
    }
  }

  const text = [
    `<b>Yangi murojaat — ${TYPE_LABELS[type] ?? 'Boshqa'}</b>`,
    '',
    userLine,
    '',
    '<b>Xabar:</b>',
    message,
    '',
    `<i>Javob yuborish: /xabar ${userId ?? 'guest'} &lt;matn&gt;</i>`,
  ].join('\n')

  await tgSend(ADMIN_ID, text).catch(() => null)

  if (userId) {
    await db.notification.create({
      data: {
        userId,
        title: "Murojaatingiz qabul qilindi",
        body:  "Xabaringizni ko'rib chiqdik. Tez orada javob beramiz!",
      },
    })
  }

  return { ok: true }
}
