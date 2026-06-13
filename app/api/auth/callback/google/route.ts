import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const { searchParams, origin } = req.nextUrl
  const code  = searchParams.get('code')
  const error = searchParams.get('error')

  if (error || !code) {
    return NextResponse.redirect(new URL('/login?error=google_cancelled', origin))
  }

  try {
    const redirectUri = `${origin}/api/auth/callback/google`

    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method:  'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body:    new URLSearchParams({
        code,
        client_id:     process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        redirect_uri:  redirectUri,
        grant_type:    'authorization_code',
      }).toString(),
    })

    const tokens = await tokenRes.json()
    if (!tokens.access_token) {
      console.error('Google token exchange failed:', tokens)
      return NextResponse.redirect(new URL('/login?error=google_failed', origin))
    }

    const profileRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    })
    const profile = await profileRes.json()

    if (!profile.email) {
      return NextResponse.redirect(new URL('/login?error=google_failed', origin))
    }

    const db   = getDb()
    const name  = profile.name ?? profile.email.split('@')[0]
    const image = profile.picture ?? null

    // Same email = same account (email+password and Google share one account)
    let user = await db.user.findUnique({ where: { email: profile.email } })

    if (!user) {
      user = await db.user.create({
        data: {
          name,
          email:         profile.email,
          password:      '',
          image,
          emailVerified: new Date(),
        },
      })
      await db.notification.create({
        data: {
          userId: user.id,
          title:  "Xush kelibsiz, Typingjon ga!",
          body:   "Google orqali muvaffaqiyatli kirdingiz. Birinchi testingizni boshlang!",
        },
      })
    } else {
      // Always sync latest Google name, image, and mark email as verified
      user = await db.user.update({
        where: { id: user.id },
        data: {
          name,
          image,
          emailVerified: user.emailVerified ?? new Date(),
        },
      })
    }

    const now = new Date()
    await db.user.update({ where: { id: user.id }, data: { lastLoginAt: now, lastSeenAt: now } })

    const response = NextResponse.redirect(new URL('/dashboard', origin))
    response.cookies.set('tj_session', user.id, {
      httpOnly: true,
      secure:   process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge:   30 * 24 * 60 * 60,
      path:     '/',
    })

    return response
  } catch (err) {
    console.error('Google OAuth callback error:', err)
    return NextResponse.redirect(new URL('/login?error=google_failed', origin))
  }
}
