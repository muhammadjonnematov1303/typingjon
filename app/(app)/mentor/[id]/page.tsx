import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { getSession } from '@/lib/session'
import { getDb } from '@/lib/prisma'
import { isAdminEmail } from '@/lib/admin'
import { getUserProfileAction } from '@/app/actions/admin-users'
import { LessonProgressList } from '@/app/admin/users/[id]/_components/lesson-progress-list'
import { ArrowLeft, GraduationCap } from 'lucide-react'

async function requireStaff() {
  const userId = await getSession()
  if (!userId) redirect('/login')
  const db = getDb()
  const user = await db.user.findUnique({ where: { id: userId } })
  if (!user) redirect('/login')
  if (!isAdminEmail(user.email) && user.role !== 'moderator') redirect('/dashboard')
  return user
}

export default async function MentorStudentPage({ params }: { params: Promise<{ id: string }> }) {
  await requireStaff()
  const { id } = await params

  const res = await getUserProfileAction(id)
  if ('error' in res) notFound()

  const { user, lessons } = res
  // Mentors manage students only — not admins or other mentors
  if (user.role !== 'user') notFound()

  const initials  = (user.name[0] ?? '').toUpperCase()
  const completed = lessons.filter(l => l.completed).length

  return (
    <div className="space-y-4 p-6">
      <Link href="/mentor"
        className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">
        <ArrowLeft className="h-3.5 w-3.5" /> O&apos;quvchilarga qaytish
      </Link>

      {/* Student header */}
      <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-xl font-bold text-white ring-2 ring-white dark:ring-slate-800">
          {user.image ? <img src={user.image} alt="" className="h-full w-full object-cover" /> : initials}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-base font-bold text-slate-900 dark:text-white">{user.name}</p>
          <p className="truncate font-mono text-xs text-slate-400 dark:text-slate-500">{user.email}</p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-600 ring-1 ring-blue-100 dark:bg-blue-950/30 dark:text-blue-400 dark:ring-blue-900/40">
          <GraduationCap className="h-3.5 w-3.5" />
          {completed}/{lessons.length} qadam
        </span>
      </div>

      {/* Lesson steps — mentor can pass / revert */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <LessonProgressList userId={user.id} lessons={lessons} />
      </div>
    </div>
  )
}
