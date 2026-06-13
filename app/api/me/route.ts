import { NextResponse } from 'next/server'
import { getSession } from '@/lib/session'
import { getDb } from '@/lib/prisma'
import { getUserStats } from '@/lib/user-stats'

export async function GET() {
  const userId = await getSession()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const db   = getDb()
  const user = await db.user.findUnique({
    where:  { id: userId },
    select: { name: true, email: true, image: true, createdAt: true },
  })
  if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const stats = await getUserStats(userId)

  return NextResponse.json({
    name:      user.name,
    email:     user.email,
    image:     user.image,
    createdAt: user.createdAt,
    stats: {
      totalTests: stats.completedLessons,
      bestWpm:    stats.bestWpm || null,
      streak:     stats.streak,
    },
  })
}
