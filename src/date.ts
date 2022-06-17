import { parseDate as internalParseDate } from 'chrono-node'

export const InvalidDate = new Date(NaN)

export function parseDate(value: string, refDate?: Date): Date | null {
  if (value.match(/^\s*$/)) return null
  const date = internalParseDate(value, refDate)
  return date === null ? InvalidDate : date
}

export function isValidDate(date?): boolean {
  return !!date && !isNaN(date)
}

export function endOfMonth(date: Date): Date {
  const eom = new Date(date)
  eom.setMonth(eom.getMonth() + 1)
  eom.setDate(0)
  return eom
}

export function getDatesInMonth(date: Date): Date[] {
  const eom = endOfMonth(date)
  const days = new Array(eom.getDate())
  let d
  days[days.length - 1] = eom
  for (let i = 0; i < days.length - 1; ++i) {
    d = new Date(eom)
    d.setDate(i + 1)
    days[i] = d
  }
  return days
}
