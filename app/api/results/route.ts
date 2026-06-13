import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/session'
import { getDb } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const userId = await getSession()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json().catch(() => null)
  if (!body) return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })

  const { wpm, accuracy, duration } = body
  if (
    typeof wpm !== 'number'      || wpm < 0       || wpm > 400 ||
    typeof accuracy !== 'number' || accuracy < 0  || accuracy > 100 ||
    typeof duration !== 'number' || duration < 1
  ) {
    return NextResponse.json({ error: 'wpm (0-400), accuracy (0-100), duration (s) required' }, { status: 400 })
  }

  const db = getDb()
  const result = await db.result.create({
    data: {
      userId,
      type:     'test',
      wpm:      Math.round(wpm),
      accuracy: Number(accuracy.toFixed(2)),
      duration: Math.round(duration),
    },
  })

  return NextResponse.json(result, { status: 201 })
}
