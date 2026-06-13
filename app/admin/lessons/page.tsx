import { getLessons } from '@/lib/lessons'
import { BookOpen, Plus, Pencil } from 'lucide-react'
import { DeleteLessonButton } from './_components/delete-lesson-button'
import { EmptyState } from '../_components/empty-state'
import { BulkSelectProvider, SelectAllCheckbox, RowCheckbox } from '../_components/bulk-select'
import { bulkDeleteLessonsAction } from '@/app/actions/admin-lessons'
import { CARD, TABLE_HEAD_ROW, TABLE_HEAD_LABEL, ROW, GRID_LESSONS, BADGE, TABLE_CELL_ACTIONS, BTN_PRIMARY, PAGE_TITLE, PAGE_SUBTITLE } from '../_lib/ui'
import { cn } from '@/lib/utils'

const DIFFICULTY_TAG: Record<string, string> = {
  "Boshlang'ich": 'bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400',
  "O'rta":        'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400',
  'Murakkab':     'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400',
}

export default async function AdminLessonsPage() {
  const lessons = await getLessons()

  return (
    <div className="space-y-4 p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className={PAGE_TITLE}>
            <BookOpen className="h-5 w-5 text-blue-600" />
            Darslar
          </h1>
          <p className={PAGE_SUBTITLE}>Jami {lessons.length} ta dars</p>
        </div>
        <a href="/admin/lessons/new" className={cn(BTN_PRIMARY, 'px-4')}>
          <Plus className="h-4 w-4" />
          Yangi dars
        </a>
      </div>

      <BulkSelectProvider ids={lessons.map(l => l.id)} action={bulkDeleteLessonsAction} label="dars">
        <div className={cn(CARD, 'overflow-hidden')}>
          {lessons.length === 0 ? (
            <EmptyState icon={BookOpen} title="Hali darslar qo'shilmagan" subtitle="Yangi dars qo'shish uchun yuqoridagi tugmani bosing" />
          ) : (
            <>
              <div className={cn(TABLE_HEAD_ROW, GRID_LESSONS)}>
                {['#', 'Dars', 'Daraja', 'Kategoriya', 'Amallar'].map((h, i) => (
                  <span key={h} className={cn(TABLE_HEAD_LABEL, 'flex items-center gap-2', h === 'Daraja' && 'pl-2.5', h === 'Amallar' && 'md:justify-end')}>
                    {i === 0 && <SelectAllCheckbox />}
                    {h}
                  </span>
                ))}
              </div>
              <div className="divide-y divide-slate-50 dark:divide-slate-800">
                {lessons.map(l => (
                  <div key={l.id} className={cn(ROW, GRID_LESSONS)}>
                    <div className="flex items-center gap-2.5">
                      <RowCheckbox id={l.id} />
                      <span className="font-mono text-xs font-bold text-slate-400 dark:text-slate-500">{l.order}</span>
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-slate-800 dark:text-slate-100">{l.title}</p>
                      <p className="truncate text-xs text-slate-400 dark:text-slate-500">{l.description}</p>
                    </div>
                    <span className={cn(BADGE, DIFFICULTY_TAG[l.difficulty] ?? 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300')}>
                      {l.difficulty}
                    </span>
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{l.category}</span>
                    <div className={cn(TABLE_CELL_ACTIONS, 'gap-2')}>
                      <a href={`/admin/lessons/${l.id}/edit`}
                        className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-slate-600 transition-colors hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">
                        <Pencil className="h-3.5 w-3.5" />
                        Tahrirlash
                      </a>
                      <DeleteLessonButton id={l.id} title={l.title} />
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </BulkSelectProvider>
    </div>
  )
}
