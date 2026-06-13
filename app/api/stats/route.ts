import { NextResponse } from 'next/server'
import { getSession } from '@/lib/session'
import { getDb } from '@/lib/prisma'

export async function GET() {
  const userId = await getSession()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const db        = getDb()
  const completed = await db.lessonProgress.findMany({
    where:   { userId, completed: true },
    orderBy: { completedAt: 'desc' },
  })

  const totalTests  = completed.length
  const wpms        = completed.map(r => r.bestWpm).filter((v): v is number => v != null)
  const accs        = completed.map(r => r.bestAccuracy).filter((v): v is number => v != null)
  const bestWpm     = wpms.length ? Math.max(...wpms) : null
  const avgWpm      = wpms.length ? Math.round(wpms.reduce((a, b) => a + b, 0) / wpms.length) : null
  const avgAccuracy = accs.length ? Math.round(accs.reduce((a, b) => a + b, 0) / accs.length) : null

  let streak = 0
  const today = new Date(); today.setHours(0, 0, 0, 0)
  const day   = new Date(today)
  const days  = new Set(completed.filter(r => r.completedAt).map(r => {
    const d = new Date(r.completedAt!); d.setHours(0, 0, 0, 0); return d.getTime()
  }))
  while (days.has(day.getTime())) { streak++; day.setDate(day.getDate() - 1) }

  return NextResponse.json({ totalTests, bestWpm, avgWpm, avgAccuracy, streak })
}
