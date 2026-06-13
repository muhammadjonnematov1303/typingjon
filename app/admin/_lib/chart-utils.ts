export function dayKey(d: Date) {
  const c = new Date(d); c.setHours(0, 0, 0, 0)
  return c.getTime()
}

export function dayLabel(d: Date) {
  return `${d.getDate()}.${d.getMonth() + 1}`
}

export function lastNDays(n: number) {
  const today = new Date(); today.setHours(0, 0, 0, 0)
  return Array.from({ length: n }, (_, i) => {
    const d = new Date(today)
    d.setDate(d.getDate() - (n - 1 - i))
    return d
  })
}
