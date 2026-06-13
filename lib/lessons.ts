import { getDb } from './prisma'

export interface Lesson {
  id: string
  order: number
  title: string
  description: string
  text: string
  difficulty: string
  category: string
}

export async function getLessons(): Promise<Lesson[]> {
  const db = getDb()
  return db.lesson.findMany({ orderBy: { order: 'asc' } })
}

export async function getLesson(id: string): Promise<Lesson | null> {
  const db = getDb()
  return db.lesson.findUnique({ where: { id } })
}

export async function getLessonByOrder(order: number): Promise<Lesson | null> {
  const db = getDb()
  return db.lesson.findFirst({ where: { order } })
}

export async function getCompletedLessonIds(userId: string): Promise<Set<string>> {
  const db = getDb()
  const rows = await db.lessonProgress.findMany({
    where:  { userId, completed: true },
    select: { lessonId: true },
  })
  return new Set(rows.map(r => r.lessonId))
}

export async function getLessonBestWpm(userId: string): Promise<Map<string, number>> {
  const db = getDb()
  const rows = await db.lessonProgress.findMany({
    where:  { userId, bestWpm: { not: null } },
    select: { lessonId: true, bestWpm: true },
  })
  return new Map(rows.map(r => [r.lessonId, r.bestWpm ?? 0]))
}

export async function getLessonStats(userId: string): Promise<{ bestWpm: number; avgAccuracy: number }> {
  const db  = getDb()
  const agg = await db.lessonProgress.aggregate({
    where: { userId },
    _max:  { bestWpm: true },
    _avg:  { bestAccuracy: true },
  })
  return {
    bestWpm:     agg._max.bestWpm ?? 0,
    avgAccuracy: agg._avg.bestAccuracy ? Math.round(agg._avg.bestAccuracy) : 0,
  }
}
