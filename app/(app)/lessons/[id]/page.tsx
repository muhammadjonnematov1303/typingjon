import { notFound, redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import { getDb } from '@/lib/prisma'
import { getLessons, getLessonByOrder } from '@/lib/lessons'
import { LessonClient } from './_components/lesson-client'

export default async function LessonPage({ params }: { params: Promise<{ id: string }> }) {
  const userId = await getSession()
  if (!userId) redirect('/login')

  const { id } = await params
  const order = parseInt(id)
  if (isNaN(order)) notFound()

  const [lesson, all] = await Promise.all([
    getLessonByOrder(order),
    getLessons(),
  ])
  if (!lesson) notFound()

  const idx  = all.findIndex(l => l.order === order)
  const next = all[idx + 1] ?? null

  const db = getDb()
  const progress = await db.lessonProgress.findUnique({
    where:  { userId_lessonId: { userId, lessonId: lesson.id } },
    select: { bestWpm: true, bestAccuracy: true },
  })

  return (
    <LessonClient
      lesson={lesson}
      nextLessonId={next ? String(next.order) : null}
      initialBest={progress ? { wpm: progress.bestWpm, accuracy: progress.bestAccuracy } : null}
    />
  )
}
