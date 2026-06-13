import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { PwaRegister } from '@/components/pwa-register'
import { CustomCursor } from '@/components/custom-cursor'
import { ContentGuard } from '@/components/content-guard'
import { getSiteSettings } from '@/lib/settings'
import './globals.css'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()

  const title       = settings.seoTitle || settings.siteName
  const description = settings.seoDescription || settings.siteDescription
  const keywords    = settings.seoKeywords
    ? settings.seoKeywords.split(',').map(k => k.trim()).filter(Boolean)
    : undefined

  return {
    title: {
      default: title,
      template: `${settings.siteName} — %s`,
    },
    description,
    keywords,
    manifest: '/manifest.webmanifest',
    appleWebApp: {
      capable: true,
      statusBarStyle: 'default',
      title: settings.siteName,
    },
    icons: {
      icon: settings.faviconUrl
        ? [{ url: settings.faviconUrl }]
        : [
            { url: '/favicon.svg', type: 'image/svg+xml' },
            { url: '/icon.png',    type: 'image/png', sizes: '512x512' },
          ],
      shortcut: settings.faviconUrl || '/favicon.svg',
      apple:    [{ url: '/apple-icon.png', type: 'image/png', sizes: '180x180' }],
    },
    openGraph: {
      title,
      description,
      siteName: settings.siteName,
      images: settings.ogImageUrl ? [{ url: settings.ogImageUrl }] : undefined,
    },
  }
}

export const viewport: Viewport = {
  themeColor: '#2563eb',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="uz" suppressHydrationWarning className={`${GeistSans.variable} ${GeistMono.variable} bg-background overflow-x-hidden scroll-smooth`}>
      <head>
        {/* Dark mode is admin-only. Apply the saved theme before first paint
            on /admin so it doesn't flash; everywhere else stays light. */}
        <script dangerouslySetInnerHTML={{ __html: `(function(){try{if(location.pathname.indexOf('/admin')===0&&localStorage.getItem('tj-theme')==='dark'){document.documentElement.classList.add('dark')}}catch(e){}})();` }} />
      </head>
      <body className="antialiased overflow-x-hidden">
        {children}
        <CustomCursor />
        <ContentGuard />
        <PwaRegister />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
