import { NextResponse } from 'next/server'
import { getSession } from '@/lib/session'
import { getDb } from '@/lib/prisma'

export async function GET() {
  const userId = await getSession()
  if (!userId) return NextResponse.json([])

  const db = getDb()
  const notifications = await db.notification.findMany({
    where:   { userId },
    orderBy: { createdAt: 'desc' },
    take:    20,
  })

  return NextResponse.json(notifications)
}

export async function PATCH() {
  const userId = await getSession()
  if (!userId) return NextResponse.json({ ok: false })

  const db = getDb()
  await db.notification.updateMany({
    where: { userId, read: false },
    data:  { read: true },
  })

  return NextResponse.json({ ok: true })
}
