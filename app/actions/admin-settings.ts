'use server'

import { revalidatePath } from 'next/cache'
import { getDb }          from '@/lib/prisma'
import { getSession }     from '@/lib/session'
import { isAdminEmail }   from '@/lib/admin'
import { verifyAdminCode } from '@/lib/admin-code'

const MAX_IMAGE_LEN = 700_000 // ~512KB base64 data URL

async function requireAdmin() {
  const userId = await getSession()
  if (!userId) return { error: "Avval tizimga kiring" } as const
  const db    = getDb()
  const admin = await db.user.findUnique({ where: { id: userId } })
  if (!admin || !isAdminEmail(admin.email)) return { error: "Ruxsat berilmagan" } as const
  return { admin } as const
}

function refresh() {
  revalidatePath('/admin/settings')
  revalidatePath('/', 'layout')
}

// Gate for the settings page — verify the 4-digit admin code (current HH:MM)
export async function verifySettingsCodeAction(code: string) {
  const check = await requireAdmin()
  if ('error' in check) return { ok: false as const, error: check.error }
  if (!verifyAdminCode(code ?? '')) return { ok: false as const, error: "Kod noto'g'ri" }
  return { ok: true as const }
}

// Danger zone — delete every non-admin user and all of their data.
export async function clearAllUsersAction(code: string) {
  const check = await requireAdmin()
  if ('error' in check) return { ok: false as const, error: check.error }
  if (!verifyAdminCode(code ?? '')) return { ok: false as const, error: "Kod noto'g'ri" }

  const db = getDb()
  const meId = check.admin.id

  // Keep admins (by role or admin email) and the acting admin; wipe the rest
  const candidates = await db.user.findMany({
    where:  { role: { not: 'admin' }, id: { not: meId } },
    select: { id: true, email: true },
  })
  const ids = candidates.filter(u => !isAdminEmail(u.email)).map(u => u.id)

  if (ids.length === 0) return { ok: true as const, deleted: 0 }

  // No DB-level cascade on these relations — remove dependent rows first
  await db.lessonProgress.deleteMany({ where: { userId: { in: ids } } })
  await db.result.deleteMany({ where: { userId: { in: ids } } })
  await db.notification.deleteMany({ where: { userId: { in: ids } } })
  await db.user.deleteMany({ where: { id: { in: ids } } })

  revalidatePath('/admin/users')
  revalidatePath('/admin')
  return { ok: true as const, deleted: ids.length }
}

export async function updateGeneralSettingsAction(_: unknown, formData: FormData) {
  const check = await requireAdmin()
  if ('error' in check) return { error: check.error }

  const siteName        = (formData.get('siteName') as string)?.trim()
  const siteDescription = (formData.get('siteDescription') as string)?.trim()
  const contactEmail    = (formData.get('contactEmail') as string)?.trim()
  const contactTelegram = (formData.get('contactTelegram') as string)?.trim()

  if (!siteName || siteName.length < 2)
    return { error: "Sayt nomini kiriting (kamida 2 ta belgi)" }
  if (!siteDescription || siteDescription.length < 10)
    return { error: "Sayt tavsifi kamida 10 ta belgidan iborat bo'lsin" }

  const db = getDb()
  await db.siteSettings.upsert({
    where:  { id: 'singleton' },
    create: {
      id: 'singleton', siteName, siteDescription,
      contactEmail: contactEmail || null, contactTelegram: contactTelegram || null,
    },
    update: {
      siteName, siteDescription,
      contactEmail: contactEmail || null, contactTelegram: contactTelegram || null,
    },
  })
  refresh()
  return { ok: true }
}

export async function updateLogoAction(_: unknown, formData: FormData) {
  const check = await requireAdmin()
  if ('error' in check) return { error: check.error }

  const logoUrl    = (formData.get('logoUrl') as string)?.trim()
  const faviconUrl = (formData.get('faviconUrl') as string)?.trim()

  if (logoUrl && logoUrl.length > MAX_IMAGE_LEN)
    return { error: "Logo rasmi juda katta (maksimal ~512KB)" }
  if (faviconUrl && faviconUrl.length > MAX_IMAGE_LEN)
    return { error: "Favicon rasmi juda katta (maksimal ~512KB)" }

  const db = getDb()
  await db.siteSettings.upsert({
    where:  { id: 'singleton' },
    create: { id: 'singleton', logoUrl: logoUrl || null, faviconUrl: faviconUrl || null },
    update: { logoUrl: logoUrl || null, faviconUrl: faviconUrl || null },
  })
  refresh()
  return { ok: true }
}

export async function updateSeoSettingsAction(_: unknown, formData: FormData) {
  const check = await requireAdmin()
  if ('error' in check) return { error: check.error }

  const seoTitle       = (formData.get('seoTitle') as string)?.trim()
  const seoDescription = (formData.get('seoDescription') as string)?.trim()
  const seoKeywords    = (formData.get('seoKeywords') as string)?.trim()
  const ogImageUrl     = (formData.get('ogImageUrl') as string)?.trim()

  if (ogImageUrl && ogImageUrl.length > MAX_IMAGE_LEN)
    return { error: "OG rasmi juda katta (maksimal ~512KB)" }

  const db = getDb()
  await db.siteSettings.upsert({
    where:  { id: 'singleton' },
    create: {
      id: 'singleton',
      seoTitle: seoTitle || null, seoDescription: seoDescription || null,
      seoKeywords: seoKeywords || null, ogImageUrl: ogImageUrl || null,
    },
    update: {
      seoTitle: seoTitle || null, seoDescription: seoDescription || null,
      seoKeywords: seoKeywords || null, ogImageUrl: ogImageUrl || null,
    },
  })
  refresh()
  return { ok: true }
}
