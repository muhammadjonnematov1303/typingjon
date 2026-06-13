'use server'

import { revalidatePath }    from 'next/cache'
import { getDb }             from '@/lib/prisma'
import { getSession }        from '@/lib/session'
import { isAdminEmail }      from '@/lib/admin'
import { verifyAdminCode }   from '@/lib/admin-code'

const ROLES = ['user', 'moderator', 'admin']

async function requireAdmin() {
  const userId = await getSession()
  if (!userId) return { error: "Avval tizimga kiring" } as const
  const db    = getDb()
  const admin = await db.user.findUnique({ where: { id: userId } })
  if (!admin || !isAdminEmail(admin.email)) return { error: "Ruxsat berilmagan" } as const
  return { admin } as const
}

// Admins OR mentors (role "moderator") — mentors supervise students' lesson steps
async function requireStaff() {
  const userId = await getSession()
  if (!userId) return { error: "Avval tizimga kiring" } as const
  const db   = getDb()
  const user = await db.user.findUnique({ where: { id: userId } })
  if (!user || (!isAdminEmail(user.email) && user.role !== 'moderator')) {
    return { error: "Ruxsat berilmagan" } as const
  }
  return { admin: user } as const
}

export async function setBannedAction(_: unknown, formData: FormData) {
  const check = await requireAdmin()
  if ('error' in check) return { error: check.error }

  const targetId = formData.get('userId') as string
  const banned   = formData.get('banned') === 'true'
  if (!targetId)                   return { error: "Foydalanuvchi aniqlanmadi" }
  if (targetId === check.admin.id) return { error: "O'zingizni bloklay olmaysiz" }

  const db = getDb()
  await db.user.update({ where: { id: targetId }, data: { banned } })
  revalidatePath('/admin/users')
  return { ok: true, banned }
}

export async function setRoleAction(_: unknown, formData: FormData) {
  const check = await requireAdmin()
  if ('error' in check) return { error: check.error }

  const targetId = formData.get('userId') as string
  const role     = formData.get('role')   as string
  const code     = formData.get('code')   as string | null

  if (!targetId)              return { error: "Foydalanuvchi aniqlanmadi" }
  if (!ROLES.includes(role))  return { error: "Noto'g'ri rol" }
  if (targetId === check.admin.id) return { error: "O'z rolingizni o'zgartira olmaysiz" }

  // Code required when promoting to admin
  if (role === 'admin') {
    if (!code) return { error: "Admin rolini berish uchun kod kiriting" }
    if (!verifyAdminCode(code)) return { error: "Noto'g'ri kod yoki vaqt o'tib ketgan" }
  }

  const db = getDb()
  await db.user.update({ where: { id: targetId }, data: { role } })
  revalidatePath('/admin/users')
  return { ok: true, role }
}

export async function setLessonProgressAction(_: unknown, formData: FormData) {
  const check = await requireStaff()
  if ('error' in check) return { error: check.error }

  const userId    = formData.get('userId')    as string
  const lessonId  = formData.get('lessonId')  as string
  const completed = formData.get('completed') === 'true'

  if (!userId || !lessonId) return { error: "Ma'lumot yetarli emas" }

  const db = getDb()
  if (completed) {
    await db.lessonProgress.upsert({
      where:  { userId_lessonId: { userId, lessonId } },
      create: { userId, lessonId, completed: true, completedAt: new Date(), attempts: 1, bestWpm: 0, bestAccuracy: 100 },
      update: { completed: true, completedAt: new Date() },
    })
  } else {
    await db.lessonProgress.upsert({
      where:  { userId_lessonId: { userId, lessonId } },
      create: { userId, lessonId, completed: false },
      update: { completed: false, completedAt: null, bestWpm: null, bestAccuracy: null, attempts: 0 },
    })
  }

  revalidatePath(`/admin/users/${userId}`)
  revalidatePath(`/mentor/${userId}`)
  return { ok: true as const, completed }
}

export async function getUserProfileAction(userId: string) {
  const check = await requireStaff()
  if ('error' in check) return { error: check.error }

  const db = getDb()
  const [user, lessons, progress] = await Promise.all([
    db.user.findUnique({
      where:  { id: userId },
      select: { id: true, name: true, email: true, image: true, role: true, banned: true, createdAt: true, lastLoginAt: true, lastSeenAt: true },
    }),
    db.lesson.findMany({ orderBy: { order: 'asc' } }),
    db.lessonProgress.findMany({ where: { userId } }),
  ])
  if (!user) return { error: "Foydalanuvchi topilmadi" }

  const progressMap = new Map(progress.map(p => [p.lessonId, p]))
  const lessons_ = lessons.map(l => {
    const p = progressMap.get(l.id)
    return {
      id:           l.id,
      order:        l.order,
      title:        l.title,
      difficulty:   l.difficulty,
      category:     l.category,
      completed:    p?.completed ?? false,
      bestWpm:      p?.bestWpm ?? null,
      bestAccuracy: p?.bestAccuracy ?? null,
      attempts:     p?.attempts ?? 0,
      completedAt:  p?.completedAt ?? null,
    }
  })

  return { ok: true as const, user, lessons: lessons_ }
}

export async function bulkDeleteUsersAction(_: unknown, formData: FormData) {
  const check = await requireAdmin()
  if ('error' in check) return { error: check.error }

  const ids = formData.getAll('ids').map(String).filter(Boolean)
  if (ids.length === 0)          return { error: "Hech qanday foydalanuvchi tanlanmagan" }
  if (ids.includes(check.admin.id)) return { error: "O'zingizni o'chira olmaysiz" }

  const db = getDb()
  const { count } = await db.user.deleteMany({ where: { id: { in: ids } } })
  revalidatePath('/admin/users')
  return { ok: true, count }
}
