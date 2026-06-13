import { getDb } from './prisma'

export interface UserStats {
  completedLessons: number   // "qadam" — completed lessons
  bestWpm: number
  avgWpm: number
  bestAccuracy: number
  avgAccuracy: number
  streak: number             // consecutive days (ending today) with any activity
  totalSessions: number      // all results (tests + lessons)
  totalDurationSec: number
}

// Single source of truth for a user's display stats, so every page (dashboard,
// stats, profile, /api/me) shows identical numbers. WPM/accuracy/streak come
// from the Result table (all activity — tests AND lessons); the completed-lesson
// count comes from LessonProgress.
export async function getUserStats(userId: string): Promise<UserStats> {
  const db = getDb()
  const [completedLessons, agg, activity] = await Promise.all([
    db.lessonProgress.count({ where: { userId, completed: true } }),
    db.result.aggregate({
      where:  { userId },
      _max:   { wpm: true, accuracy: true },
      _avg:   { wpm: true, accuracy: true },
      _sum:   { duration: true },
      _count: true,
    }),
    db.result.findMany({ where: { userId }, select: { createdAt: true } }),
  ])

  const dayset = new Set(activity.map(r => {
    const d = new Date(r.createdAt); d.setHours(0, 0, 0, 0); return d.getTime()
  }))
  let streak = 0
  const day = new Date(); day.setHours(0, 0, 0, 0)
  while (dayset.has(day.getTime())) { streak++; day.setDate(day.getDate() - 1) }

  return {
    completedLessons,
    bestWpm:          agg._max.wpm ?? 0,
    avgWpm:           agg._avg.wpm ? Math.round(agg._avg.wpm) : 0,
    bestAccuracy:     agg._max.accuracy ? Math.round(agg._max.accuracy) : 0,
    avgAccuracy:      agg._avg.accuracy ? Math.round(agg._avg.accuracy) : 0,
    streak,
    totalSessions:    agg._count,
    totalDurationSec: agg._sum.duration ?? 0,
  }
}
