import { NextRequest, NextResponse } from 'next/server'

const PUBLIC_PATHS  = ['/login', '/register', '/verify-email', '/terms', '/privacy']
const AUTH_PATHS    = ['/login', '/register']

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl
  const session      = req.cookies.get('tj_session')?.value

  // Statik fayllar (sw.js, manifest, ikonkalar va h.k.) — login holatidan qat'iy nazar ochiq bo'lishi shart
  // (aks holda /login ga redirect bo'lib, brauzer "script behind a redirect" deb rad etadi)
  if (/\.[a-z0-9]+$/i.test(pathname)) {
    return NextResponse.next()
  }

  // Autentifikatsiya qilingan foydalanuvchi login/register ga kirmaydi
  if (session && AUTH_PATHS.some(p => pathname.startsWith(p))) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  // Autentifikatsiya qilinmagan foydalanuvchi dashboard ga kirmaydi
  if (!session && !PUBLIC_PATHS.some(p => pathname.startsWith(p)) && pathname !== '/') {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api).*)'],
}
