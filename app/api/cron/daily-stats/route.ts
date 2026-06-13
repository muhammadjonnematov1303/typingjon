import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/prisma'
import { tgSend, ADMIN_ID } from '@/lib/telegram'

export async function GET(req: NextRequest) {
  // Vercel cron calls with CRON_SECRET header; allow direct access in dev
  const secret = req.headers.get('authorization')
  if (
    process.env.NODE_ENV === 'production' &&
    secret !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const db = getDb()

  const now       = new Date()
  const startOfDay = new Date(now)
  startOfDay.setHours(0, 0, 0, 0)

  const [
    testsToday,
    newUsersToday,
    activeUsers,
    totalTests,
    topResult,
  ] = await Promise.all([
    db.result.count({ where: { createdAt: { gte: startOfDay } } }),
    db.user.count({  where: { createdAt: { gte: startOfDay } } }),
    db.result.groupBy({
      by: ['userId'],
      where: { createdAt: { gte: startOfDay } },
      _count: true,
    }).then(r => r.length),
    db.result.count(),
    db.result.findFirst({ orderBy: { wpm: 'desc' } }),
  ])

  const topUser = topResult
    ? await db.user.findUnique({ where: { id: topResult.userId }, select: { name: true } })
    : null

  const dateStr = now.toLocaleDateString('uz-UZ', {
    day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Tashkent',
  })

  const text = [
    `<b>Kunlik statistika — ${dateStr}</b>`,
    '',
    `<b>Bugungi natijalar:</b>`,
    `  Testlar soni: <b>${testsToday}</b>`,
    `  Yangi foydalanuvchilar: <b>${newUsersToday}</b>`,
    `  Faol foydalanuvchilar: <b>${activeUsers}</b>`,
    '',
    `<b>Jami:</b>`,
    `  Barcha testlar: <b>${totalTests}</b>`,
    topUser ? `  Eng yuqori WPM: <b>${topResult!.wpm}</b> (${topUser.name})` : '',
  ].filter(Boolean).join('\n')

  await tgSend(ADMIN_ID, text)

  return NextResponse.json({ ok: true, testsToday, newUsersToday, activeUsers })
}
