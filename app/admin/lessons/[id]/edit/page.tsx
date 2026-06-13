import { notFound } from 'next/navigation'
import { Pencil } from 'lucide-react'
import { getLesson } from '@/lib/lessons'
import { LessonForm } from '../../_components/lesson-form'
import { CARD, PAGE_TITLE, PAGE_SUBTITLE } from '../../../_lib/ui'
import { cn } from '@/lib/utils'

export default async function EditLessonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const lesson = await getLesson(id)
  if (!lesson) notFound()

  return (
    <div className="space-y-4 p-6">
      <div>
        <h1 className={PAGE_TITLE}>
          <Pencil className="h-5 w-5 text-blue-600" />
          Darsni tahrirlash
        </h1>
        <p className={PAGE_SUBTITLE}>{lesson.title}</p>
      </div>

      <div className={cn(CARD, 'max-w-2xl p-6')}>
        <LessonForm mode="edit" lesson={lesson} />
      </div>
    </div>
  )
}
