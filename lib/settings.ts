import { getDb } from './prisma'

export interface SiteSettings {
  siteName:        string
  siteDescription: string
  contactEmail:    string | null
  contactTelegram: string | null
  logoUrl:         string | null
  faviconUrl:      string | null
  seoTitle:        string | null
  seoDescription:  string | null
  seoKeywords:     string | null
  ogImageUrl:      string | null
}

export const DEFAULT_SETTINGS: SiteSettings = {
  siteName:        'Typingjon',
  siteDescription: "Interaktiv darslar, real vaqt fikr-mulohazasi va o'yinlashtirilgan mashqlar orqali yozish tezligi va aniqligingizni oshiring.",
  contactEmail:    null,
  contactTelegram: null,
  logoUrl:         null,
  faviconUrl:      null,
  seoTitle:        null,
  seoDescription:  null,
  seoKeywords:     null,
  ogImageUrl:      null,
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const db  = getDb()
  const row = await db.siteSettings.findUnique({ where: { id: 'singleton' } })
  if (!row) return DEFAULT_SETTINGS
  return {
    siteName:        row.siteName,
    siteDescription: row.siteDescription,
    contactEmail:    row.contactEmail,
    contactTelegram: row.contactTelegram,
    logoUrl:         row.logoUrl,
    faviconUrl:      row.faviconUrl,
    seoTitle:        row.seoTitle,
    seoDescription:  row.seoDescription,
    seoKeywords:     row.seoKeywords,
    ogImageUrl:      row.ogImageUrl,
  }
}
