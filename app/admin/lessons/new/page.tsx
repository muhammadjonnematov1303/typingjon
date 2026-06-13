import { Plus } from 'lucide-react'
import { LessonForm } from '../_components/lesson-form'
import { CARD, PAGE_TITLE, PAGE_SUBTITLE } from '../../_lib/ui'
import { cn } from '@/lib/utils'

export default function NewLessonPage() {
  return (
    <div className="space-y-4 p-6">
      <div>
        <h1 className={PAGE_TITLE}>
          <Plus className="h-5 w-5 text-blue-600" />
          Yangi dars
        </h1>
        <p className={PAGE_SUBTITLE}>Yangi dars yaratib, uni darslar ro&apos;yxatiga qo&apos;shing</p>
      </div>

      <div className={cn(CARD, 'max-w-2xl p-6')}>
        <LessonForm mode="create" />
      </div>
    </div>
  )
}
