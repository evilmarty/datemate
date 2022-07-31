import { parseDate as internalParseDate } from 'chrono-node'

const SECOND = 1000
const MINUTE = 60
const HOUR = 60
const DAY = 24
const WEEK = 7

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

export function formatDate(date: Date, format: string, locale?: string): string {
  const dtf = new Intl.DateTimeFormat(locale, format)
  return dtf.format(date)
}

export function getDateParts(date: Date, parts: object, locale?: string): string[] {
  const keys = Object.keys(parts)
  const dtf = new Intl.DateTimeFormat(locale, parts)
  return dtf
    .formatToParts(date)
    .filter(part => keys.includes(part.type))
    .map(part => part.value)
}

interface DateDetails {
  date: string
  time: string
  weekday: string
  month: string
  year: string
  era: string
  timezone: string
  timestamp: string
}

export function getDateDetails(date: Date, locale?: string): DateDetails {
  return {
    date: formatDate(date, {}, locale),
    time: formatDate(date, {hour: 'numeric', minute: 'numeric'}),
    weekday: formatDate(date, {weekday: 'long'}),
    month: formatDate(date, {month: 'long'}),
    year: formatDate(date, {year: 'numeric'}),
    era: getDateParts(date, {era: 'long'})[0],
    timezone: getDateParts(date, {timeZoneName: 'long'})[0],
    timestamp: String(date.getTime()),
  }
}

interface RelativeDetails {
  milliseconds: integer
  seconds: integer
  minutes: integer
  hours: integer
  days: integer
  weeks: integer
  months: integer
  quarters: integer
  years: integer
}

export function getRelativeDetails(date: Date, refDate: Date): RelativeDetails {
  const milliseconds = date.getTime() - refDate.getTime()
  const seconds = milliseconds / SECOND
  const minutes = seconds / MINUTE
  const hours = minutes / HOUR
  const days = hours / DAY
  const weeks = days / WEEK
  const months = countMonthsBetween(date, refDate)
  const quarters = Math.floor(months / 3)
  const years = countYearsBetween(date, refDate)

  return {seconds, minutes, hours, days, weeks, months, quarters, years}
}

interface HumanisedRelativeDetails {
  seconds?: string
  minutes?: string
  hours?: string
  days?: string
  weeks?: string
  months?: string
  quarters?: string
  years?: string
}

export function getHumanisedRelativeDetails(date: Date, refDate: Date, locale?: string): HumanisedRelativeDetails {
  const details = getRelativeDetails(date, refDate)
  const rtf = new Intl.RelativeTimeFormat(locale, {numeric: 'always'})
  const entries = Object
    .entries(details)
    .map(([key, value]) => [key, maybeFormat(rtf, value, key)])
  return Object.fromEntries(entries)
}

function maybeFormat(context, value, unit) {
  if (Math.abs(value) >= 1) {
    return context.format(Math.ceil(value), unit)
  } else {
    return null
  }
}

export function countMonthsBetween(fromDate: Date, toDate: Date): integer {
  const yearDiff = fromDate.getFullYear() - toDate.getFullYear()
  const monthDiff = fromDate.getMonth() - toDate.getMonth()
  return (12 * yearDiff) + monthDiff
}

export function countYearsBetween(fromDate: Date, toDate: Date): integer {
  return fromDate.getFullYear() - toDate.getFullYear()
}
