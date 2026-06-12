const TR = 'tr-TR'

const FORMAT_OPTIONS: Record<'short' | 'long' | 'time', Intl.DateTimeFormatOptions> = {
  short: { day: '2-digit', month: '2-digit', year: 'numeric' },
  long: { day: 'numeric', month: 'long', year: 'numeric' },
  time: { hour: '2-digit', minute: '2-digit', hour12: false },
}

function toDate(date: Date | string): Date {
  return typeof date === 'string' ? new Date(date) : date
}

export function formatDate(
  date: Date | string,
  format: 'short' | 'long' | 'relative' | 'time',
  locale = TR
): string {
  const d = toDate(date)
  if (format === 'relative') return formatDateRelative(d)
  return new Intl.DateTimeFormat(locale, FORMAT_OPTIONS[format]).format(d)
}

export function formatDateRelative(date: Date | string): string {
  const d = toDate(date)
  const diffMs = Date.now() - d.getTime()
  const sec = Math.floor(diffMs / 1_000)
  const min = Math.floor(sec / 60)
  const hour = Math.floor(min / 60)
  const day = Math.floor(hour / 24)
  const week = Math.floor(day / 7)
  const month = Math.floor(day / 30)
  const year = Math.floor(day / 365)

  if (sec < 60) return 'şimdi'
  if (min < 60) return `${min} dakika önce`
  if (hour < 24) return `${hour} saat önce`
  if (day === 1) return 'dün'
  if (day < 7) return `${day} gün önce`
  if (week < 4) return `${week} hafta önce`
  if (month < 12) return `${month} ay önce`
  return `${year} yıl önce`
}
