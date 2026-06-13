import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getSession } from '@/lib/session'
import { getDb } from '@/lib/prisma'
import { isAdminEmail } from '@/lib/admin'
import { GraduationCap, ChevronRight, Users } from 'lucide-react'

async function requireStaff() {
  const userId = await getSession()
  if (!userId) redirect('/login')
  const db = getDb()
  const user = await db.user.findUnique({ where: { id: userId } })
  if (!user) redirect('/login')
  if (!isAdminEmail(user.email) && user.role !== 'moderator') redirect('/dashboard')
  return user
}

async function getStudents() {
  const db = getDb()
  const [users, totalLessons, rows] = await Promise.all([
    db.user.findMany({ where: { role: 'user', banned: false }, select: { id: true, name: true, email: true, image: true } }),
    db.lesson.count(),
    db.lessonProgress.findMany({ where: { completed: true }, select: { userId: true } }),
  ])
  const totals = new Map<string, number>()
  for (const r of rows) totals.set(r.userId, (totals.get(r.userId) ?? 0) + 1)
  const students = users
    .map(u => ({ ...u, qadam: totals.get(u.id) ?? 0 }))
    .sort((a, b) => b.qadam - a.qadam || a.name.localeCompare(b.name))
  return { students, totalLessons }
}

export default async function MentorPage() {
  await requireStaff()
  const { students, totalLessons } = await getStudents()

  return (
    <div className="space-y-5 p-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-white">
            <GraduationCap className="h-5 w-5 text-blue-600" />
            Mentor paneli
          </h1>
          <p className="text-sm text-slate-400 dark:text-slate-500">O&apos;quvchilarni nazorat qiling va qadamlarini boshqaring</p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-600 ring-1 ring-blue-100 dark:bg-blue-950/30 dark:text-blue-400 dark:ring-blue-900/40">
          <Users className="h-3.5 w-3.5" />
          {students.length}ta o&apos;quvchi
        </span>
      </div>

      {students.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-slate-200 py-16 text-center dark:border-slate-700">
          <Users className="h-10 w-10 text-slate-200 dark:text-slate-700" />
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-300">Hali o&apos;quvchilar yo&apos;q</p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {students.map(s => {
            const initials = (s.name[0] ?? '').toUpperCase()
            const pct = totalLessons > 0 ? Math.round((s.qadam / totalLessons) * 100) : 0
            return (
              <Link key={s.id} href={`/mentor/${s.id}`}
                className="group flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-800/50">
                <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-sm font-bold text-white ring-2 ring-white dark:ring-slate-800">
                  {s.image ? <img src={s.image} alt="" className="h-full w-full object-cover" /> : initials}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-slate-900 dark:text-white">{s.name}</p>
                  <p className="truncate font-mono text-xs text-slate-400 dark:text-slate-500">{s.email}</p>
                  {/* Progress */}
                  <div className="mt-2 flex items-center gap-2">
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                      <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="font-mono text-[11px] font-bold text-slate-500 dark:text-slate-400">{s.qadam}/{totalLessons}</span>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 flex-shrink-0 text-slate-300 transition-transform group-hover:translate-x-0.5 dark:text-slate-600" />
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
