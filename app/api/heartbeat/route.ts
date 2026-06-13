import { NextResponse } from 'next/server'
import { getSession } from '@/lib/session'
import { getDb } from '@/lib/prisma'

// Updates the user's "last seen" timestamp — pinged periodically by the client
// and once more (via sendBeacon) when the tab is hidden/closed, so it doubles as
// an approximate "left the site" time.
export async function POST() {
  const userId = await getSession()
  if (!userId) return NextResponse.json({ ok: false }, { status: 401 })

  try {
    await getDb().user.update({ where: { id: userId }, data: { lastSeenAt: new Date() } })
  } catch {
    // best-effort — never surface heartbeat failures to the user
  }
  return NextResponse.json({ ok: true })
}
