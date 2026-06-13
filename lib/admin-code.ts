const TIMEZONE = 'Asia/Tashkent'

// Admin code = current local time as HHMM, e.g. 11:43 -> "1143", 13:00 -> "1300"
function currentHHMM(offsetMinutes = 0): string {
  const date  = new Date(Date.now() + offsetMinutes * 60_000)
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: TIMEZONE, hour: '2-digit', minute: '2-digit', hour12: false,
  }).formatToParts(date)
  const hour   = parts.find(p => p.type === 'hour')?.value   ?? '00'
  const minute = parts.find(p => p.type === 'minute')?.value ?? '00'
  return `${hour}${minute}`
}

export function getCurrentAdminCode(): string {
  return currentHHMM(0)
}

// Accept current minute OR previous (handles edge cases at minute boundaries)
export function verifyAdminCode(input: string): boolean {
  const clean = input.trim()
  return clean === currentHHMM(0) || clean === currentHHMM(-1)
}

export function secondsUntilNextMinute(): number {
  return Math.ceil((60_000 - (Date.now() % 60_000)) / 1000)
}
