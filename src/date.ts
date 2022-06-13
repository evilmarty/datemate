import { parseDate as internalParseDate } from 'chrono-node'

const NUMERIC = 'numeric'
const LONG = 'long'

export const InvalidDate = new Date(NaN)

export function parseDate(value: string, refDate?: Date): Date | null {
  if (value.match(/^\s*$/)) return null
  const date = internalParseDate(value, refDate)
  return date === null ? InvalidDate : date
}

export function isValidDate(date?): boolean {
  return !!date && !isNaN(date)
}

export function formatDate(date: Date, type?: string): string {
  let parts
  switch (type) {
    case 'time':
      return new Intl.DateTimeFormat([], {hour: NUMERIC, minute: NUMERIC}).format(date)
    case 'weekday':
      return new Intl.DateTimeFormat([], {weekday: LONG}).format(date)
    case 'month':
      return new Intl.DateTimeFormat([], {month: LONG}).format(date)
    case 'year':
      return new Intl.DateTimeFormat([], {year: NUMERIC}).format(date)
    case 'era':
      parts = new Intl.DateTimeFormat([], {era: LONG}).formatToParts(date)
      return getPartValue(parts, 'era')
    case 'timezone':
      parts = new Intl.DateTimeFormat([], {timeZoneName: LONG}).formatToParts(date)
      return getPartValue(parts, 'timeZoneName')
    case 'unixtimestamp':
      return String(date.getTime())
    default:
      return new Intl.DateTimeFormat([]).format(date)
  }
}

interface DateTimeFormatPart {
  type: string
  value: string
}

function getPartValue(parts: DateTimeFormatPart[], type: string): string {
  const part = parts.find(p => p.type === type) || {}
  return part.value
}
