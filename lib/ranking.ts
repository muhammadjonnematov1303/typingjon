import { getDb } from './prisma'

export interface RankEntry {
  rank: number
  userId: string
  name: string
  email: string
  image: string | null
  qadam: number
}

// Single source of truth for the "qadam" (completed-lessons) ranking used by the
// user leaderboard, the admin leaderboard and the admin dashboard — so the order
// is identical everywhere. Tie-break is fully deterministic: qadam desc, then
// name asc, then userId — no Map/insertion-order ambiguity.
export async function getQadamRanking(start?: Date): Promise<RankEntry[]> {
  const db = getDb()
  const [users, rows] = await Promise.all([
    db.user.findMany({ select: { id: true, name: true, email: true, image: true } }),
    db.lessonProgress.findMany({
      where: { completed: true, ...(start ? { completedAt: { gte: start } } : {}) },
      select: { userId: true },
    }),
  ])

  const totals = new Map<string, number>()
  for (const r of rows) totals.set(r.userId, (totals.get(r.userId) ?? 0) + 1)

  return users
    .map(u => ({
      userId: u.id,
      name:   u.name,
      email:  u.email,
      image:  u.image ?? null,
      qadam:  totals.get(u.id) ?? 0,
    }))
    .sort((a, b) => b.qadam - a.qadam || a.name.localeCompare(b.name) || a.userId.localeCompare(b.userId))
    .map((e, i) => ({ rank: i + 1, ...e }))
}
