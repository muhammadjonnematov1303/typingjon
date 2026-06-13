import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/session'
import { getDb } from '@/lib/prisma'
import { getLesson } from '@/lib/lessons'

export async function POST(req: NextRequest) {
  const userId = await getSession()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json().catch(() => null)
  if (!body) return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })

  const { lessonId, wpm, accuracy, duration } = body
  if (
    typeof lessonId !== 'string' ||
    typeof wpm !== 'number' || wpm < 1 || wpm > 300 ||
    typeof accuracy !== 'number' || accuracy < 0 || accuracy > 100 ||
    typeof duration !== 'number' || duration < 1
  ) {
    return NextResponse.json({ error: 'lessonId, wpm (1-300), accuracy (0-100), duration (s) required' }, { status: 400 })
  }

  if (!(await getLesson(lessonId))) {
    return NextResponse.json({ error: 'Dars topilmadi' }, { status: 404 })
  }

  const db       = getDb()
  const roundedWpm = Math.round(wpm)
  const roundedAcc = Number(accuracy.toFixed(2))

  const existing = await db.lessonProgress.findUnique({ where: { userId_lessonId: { userId, lessonId } } })

  const progress = await db.lessonProgress.upsert({
    where:  { userId_lessonId: { userId, lessonId } },
    create: {
      userId, lessonId,
      completed:    true,
      bestWpm:      roundedWpm,
      bestAccuracy: roundedAcc,
      attempts:     1,
      completedAt:  new Date(),
    },
    update: {
      completed:    true,
      attempts:     { increment: 1 },
      bestWpm:      !existing?.bestWpm      || roundedWpm > existing.bestWpm      ? roundedWpm : undefined,
      bestAccuracy: !existing?.bestAccuracy || roundedAcc > existing.bestAccuracy ? roundedAcc : undefined,
      completedAt:  existing?.completedAt ?? new Date(),
    },
  })

  await db.result.create({
    data: {
      userId,
      type:     'lesson',
      wpm:      roundedWpm,
      accuracy: roundedAcc,
      duration: Math.round(duration),
    },
  })

  // OWR (qadam) = how many distinct lessons this user has completed. Recompute
  // and cache it on the user so the leaderboard / profile can read it directly.
  const completedCount = await db.lessonProgress.count({ where: { userId, completed: true } })
  await db.user.update({ where: { id: userId }, data: { owr: completedCount } })

  return NextResponse.json({ ...progress, owr: completedCount }, { status: 201 })
}
