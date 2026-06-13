'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { getDb } from '@/lib/prisma'
import { getSession } from '@/lib/session'
import { isAdminEmail } from '@/lib/admin'

const DIFFICULTIES = ["Boshlang'ich", "O'rta", 'Murakkab']
const SLUG_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/

async function requireAdmin() {
  const userId = await getSession()
  if (!userId) return { error: "Avval tizimga kiring" } as const
  const db = getDb()
  const admin = await db.user.findUnique({ where: { id: userId } })
  if (!admin || !isAdminEmail(admin.email)) return { error: "Ruxsat berilmagan" } as const
  return { admin } as const
}

function readFields(formData: FormData) {
  const id          = (formData.get('id') as string)?.trim()
  const order       = Number(formData.get('order'))
  const title       = (formData.get('title') as string)?.trim()
  const description = (formData.get('description') as string)?.trim()
  const text        = (formData.get('text') as string)?.trim()
  const difficulty  = formData.get('difficulty') as string
  const category    = (formData.get('category') as string)?.trim() || 'Umumiy'
  return { id, order, title, description, text, difficulty, category }
}

function validate(f: ReturnType<typeof readFields>, opts: { checkSlug: boolean }) {
  if (opts.checkSlug && !SLUG_RE.test(f.id))
    return "ID faqat kichik lotin harflari, raqamlar va chiziqchadan iborat bo'lishi kerak (masalan: yangi-dars)"
  if (!f.title || f.title.length < 2) return "Sarlavhani kiriting (kamida 2 ta belgi)"
  if (!f.description || f.description.length < 5) return "Tavsifni kiriting (kamida 5 ta belgi)"
  if (!f.text || f.text.length < 10) return "Mashq matnini kiriting (kamida 10 ta belgi)"
  if (!Number.isFinite(f.order) || f.order < 1) return "Tartib raqami 1 dan katta bo'lishi kerak"
  if (!DIFFICULTIES.includes(f.difficulty)) return "Noto'g'ri qiyinlik darajasi"
  return null
}

export async function createLessonAction(_: unknown, formData: FormData) {
  const check = await requireAdmin()
  if ('error' in check) return { error: check.error }

  const f = readFields(formData)
  const err = validate(f, { checkSlug: true })
  if (err) return { error: err }

  const db = getDb()
  const exists = await db.lesson.findUnique({ where: { id: f.id } })
  if (exists) return { error: "Bu ID bilan dars allaqachon mavjud" }

  await db.lesson.create({ data: f })
  revalidatePath('/admin/lessons')
  revalidatePath('/lessons')
  redirect('/admin/lessons')
}

export async function updateLessonAction(_: unknown, formData: FormData) {
  const check = await requireAdmin()
  if ('error' in check) return { error: check.error }

  const f = readFields(formData)
  const err = validate(f, { checkSlug: false })
  if (err) return { error: err }

  const db = getDb()
  const exists = await db.lesson.findUnique({ where: { id: f.id } })
  if (!exists) return { error: "Dars topilmadi" }

  await db.lesson.update({
    where: { id: f.id },
    data: { order: f.order, title: f.title, description: f.description, text: f.text, difficulty: f.difficulty, category: f.category },
  })
  revalidatePath('/admin/lessons')
  revalidatePath('/lessons')
  revalidatePath(`/lessons/${f.id}`)
  redirect('/admin/lessons')
}

export async function deleteLessonAction(_: unknown, formData: FormData) {
  const check = await requireAdmin()
  if ('error' in check) return { error: check.error }

  const id = formData.get('id') as string
  if (!id) return { error: "Dars aniqlanmadi" }

  const db = getDb()
  await db.lesson.delete({ where: { id } }).catch(() => null)
  revalidatePath('/admin/lessons')
  revalidatePath('/lessons')

  return { ok: true }
}

export async function bulkDeleteLessonsAction(_: unknown, formData: FormData) {
  const check = await requireAdmin()
  if ('error' in check) return { error: check.error }

  const ids = formData.getAll('ids').map(String).filter(Boolean)
  if (ids.length === 0) return { error: "Hech qanday dars tanlanmagan" }

  const db = getDb()
  const { count } = await db.lesson.deleteMany({ where: { id: { in: ids } } })
  revalidatePath('/admin/lessons')
  revalidatePath('/lessons')

  return { ok: true, count }
}
