'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useRef, useState, useEffect, useTransition } from 'react'
import { Mail, ArrowLeft, RotateCcw, CheckCircle2, ShieldCheck } from 'lucide-react'
import { Logo } from '@/components/logo'
import { verifyEmailAction, resendCodeAction } from '@/app/actions/auth'

const OTP_LEN        = 5
const RESEND_SECONDS = 60

function maskEmail(email: string) {
  const [user, domain] = email.split('@')
  if (!domain) return email
  return `${user.slice(0, 2)}${'*'.repeat(Math.max(2, user.length - 2))}@${domain}`
}

export default function VerifyEmailClient() {
  const params = useSearchParams()
  const router = useRouter()
  const email  = params.get('email') ?? ''

  const [otp, setOtp]               = useState<string[]>(Array(OTP_LEN).fill(''))
  const [error, setError]           = useState('')
  const [success, setSuccess]       = useState(false)
  const [countdown, setCountdown]   = useState(RESEND_SECONDS)
  const [resendMsg, setResendMsg]   = useState('')
  const [focusedIdx, setFocusedIdx] = useState<number | null>(null)

  const [verifying, startVerify] = useTransition()
  const [resending, startResend] = useTransition()
  const refs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    if (countdown <= 0) return
    const t = setTimeout(() => setCountdown(c => c - 1), 1000)
    return () => clearTimeout(t)
  }, [countdown])

  useEffect(() => { refs.current[0]?.focus() }, [])

  if (!email) { router.replace('/register'); return null }

  function handleChange(idx: number, val: string) {
    const digit = val.replace(/\D/g, '').slice(-1)
    const next  = [...otp]; next[idx] = digit
    setOtp(next); setError('')
    if (digit && idx < OTP_LEN - 1) refs.current[idx + 1]?.focus()
  }

  function handleKeyDown(idx: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace') {
      if (otp[idx]) { const n = [...otp]; n[idx] = ''; setOtp(n) }
      else if (idx > 0) refs.current[idx - 1]?.focus()
    }
    if (e.key === 'ArrowLeft'  && idx > 0)           refs.current[idx - 1]?.focus()
    if (e.key === 'ArrowRight' && idx < OTP_LEN - 1) refs.current[idx + 1]?.focus()
    if (e.key === 'Enter') handleVerify()
  }

  function handlePaste(e: React.ClipboardEvent) {
    e.preventDefault()
    const digits = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LEN).split('')
    const next   = Array(OTP_LEN).fill('')
    digits.forEach((d, i) => { next[i] = d })
    setOtp(next)
    refs.current[Math.min(digits.length, OTP_LEN - 1)]?.focus()
  }

  function handleVerify() {
    if (otp.some(d => !d)) { setError('Barcha 5 ta raqamni kiriting'); return }
    startVerify(async () => {
      const result = await verifyEmailAction(email, otp.join(''))
      if (result?.error) {
        setError(result.error)
        setOtp(Array(OTP_LEN).fill(''))
        setTimeout(() => refs.current[0]?.focus(), 50)
      } else {
        setSuccess(true)
      }
    })
  }

  function handleResend() {
    setResendMsg('')
    startResend(async () => {
      const result = await resendCodeAction(email)
      if (result?.error) { setResendMsg(result.error); return }
      setOtp(Array(OTP_LEN).fill(''))
      setError('')
      setCountdown(RESEND_SECONDS)
      setResendMsg('Yangi kod yuborildi!')
      setTimeout(() => { setResendMsg(''); refs.current[0]?.focus() }, 3000)
    })
  }

  /* ── Success ── */
  if (success) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#f8fafc] px-4 overflow-hidden"
        style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #e2e8f0 1px, transparent 0)', backgroundSize: '24px 24px' }}>
        <div className="flex flex-col items-center gap-5 text-center animate-in fade-in zoom-in-95 duration-500">
          <div className="w-20 h-20 rounded-full bg-emerald-100 ring-8 ring-emerald-50 flex items-center justify-center">
            <CheckCircle2 className="h-10 w-10 text-emerald-600" />
          </div>
          <div>
            <p className="text-xl font-bold text-gray-900">Email tasdiqlandi!</p>
            <p className="text-sm text-gray-500 mt-1">Boshqaruv paneliga yo&apos;naltirilmoqda...</p>
          </div>
          <div className="w-48 h-1 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full w-full animate-[shimmer_1.5s_ease-out_forwards]" />
          </div>
        </div>
      </div>
    )
  }

  /* ── Main ── */
  return (
    <div
      className="h-screen overflow-hidden flex items-center justify-center px-4 bg-[#f8fafc]"
      style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #e2e8f0 1px, transparent 0)', backgroundSize: '24px 24px' }}
    >
      <div className="w-full max-w-[400px] animate-in fade-in slide-in-from-bottom-4 duration-500">

        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Logo />
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl shadow-black/[0.06] border border-gray-100 overflow-hidden">

          {/* Top accent */}
          <div className="h-[3px] bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500" />

          {/* Body */}
          <div className="px-8 pt-8 pb-6">

            {/* Icon */}
            <div className="flex justify-center mb-5">
              <div className="w-[60px] h-[60px] rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center shadow-sm">
                <Mail className="w-7 h-7 text-blue-600" />
              </div>
            </div>

            {/* Title */}
            <h1 className="text-center text-[21px] font-bold text-gray-900 tracking-tight mb-2">
              Emailni tasdiqlang
            </h1>

            {/* Description */}
            <p className="text-center text-sm text-gray-400 mb-4">
              Quyidagi email manziliga 5 xonali<br />tasdiqlash kodi yuborildi
            </p>

            {/* Email chip */}
            <div className="flex justify-center mb-7">
              <div className="inline-flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-full px-4 py-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
                <span className="text-sm font-semibold text-gray-700 font-mono">{maskEmail(email)}</span>
              </div>
            </div>

            {/* OTP inputs */}
            <div className="grid grid-cols-5 gap-2.5 mb-4" onPaste={handlePaste}>
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={el => { refs.current[i] = el }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={e => handleChange(i, e.target.value)}
                  onKeyDown={e => handleKeyDown(i, e)}
                  onFocus={() => setFocusedIdx(i)}
                  onBlur={() => setFocusedIdx(null)}
                  className={[
                    'w-full aspect-square rounded-2xl border-2 text-center font-mono text-2xl font-bold',
                    'outline-none transition-all duration-150 cursor-text select-none',
                    error
                      ? 'border-red-300 bg-red-50 text-red-600'
                      : digit
                        ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-md shadow-blue-100 scale-[1.04]'
                        : focusedIdx === i
                          ? 'border-blue-400 shadow-lg shadow-blue-50 bg-white text-gray-900'
                          : 'border-gray-200 bg-gray-50/50 text-gray-900 hover:border-gray-300',
                  ].join(' ')}
                />
              ))}
            </div>

            {/* Status message */}
            {error ? (
              <div className="flex items-center gap-2 mb-4 animate-in fade-in slide-in-from-top-1 duration-200">
                <div className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-[9px] font-black leading-none">!</span>
                </div>
                <span className="text-sm text-red-600">{error}</span>
              </div>
            ) : resendMsg ? (
              <div className="flex items-center gap-2 mb-4 animate-in fade-in duration-200">
                <ShieldCheck className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                <span className="text-sm text-emerald-600">{resendMsg}</span>
              </div>
            ) : (
              <p className="text-xs text-gray-400 mb-4 text-center">
                Kod 10 daqiqa davomida amal qiladi &middot; Spam papkasini tekshiring
              </p>
            )}

            {/* Verify button */}
            <button
              type="button"
              onClick={handleVerify}
              disabled={verifying || otp.some(d => !d)}
              className="relative w-full h-12 rounded-2xl font-semibold text-sm text-white overflow-hidden
                bg-blue-600 hover:bg-blue-700 active:bg-blue-800
                shadow-lg shadow-blue-200
                transition-all duration-150
                disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none disabled:hover:bg-blue-600"
            >
              {verifying ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Tekshirilmoqda...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <ShieldCheck className="h-4 w-4" />
                  Tasdiqlash
                </span>
              )}
            </button>
          </div>

          {/* Footer */}
          <div className="px-8 py-4 bg-gray-50/80 border-t border-gray-100 flex items-center justify-between">
            <a href="/register"
              className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors font-medium">
              <ArrowLeft className="h-3.5 w-3.5" />
              Orqaga
            </a>

            {countdown > 0 ? (
              <span className="text-sm text-gray-400">
                Qayta yuborish{' '}
                <span className="font-mono font-bold text-gray-600 tabular-nums">{countdown}s</span>
              </span>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                disabled={resending}
                className="flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors disabled:opacity-50"
              >
                <RotateCcw className={`h-3.5 w-3.5 ${resending ? 'animate-spin' : ''}`} />
                {resending ? 'Yuborilmoqda...' : 'Qayta yuborish'}
              </button>
            )}
          </div>
        </div>

        {/* Help */}
        <p className="text-center text-xs text-gray-400 mt-5">
          Muammo bo&apos;lsa{' '}
          <a href="mailto:support@typingjon.uz"
            className="text-blue-600 hover:text-blue-800 font-semibold transition-colors">
            support@typingjon.uz
          </a>
          {' '}ga murojaat qiling
        </p>

      </div>
    </div>
  )
}
