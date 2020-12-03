import { isValid } from 'date-fns'
import { parseDate as _parseDate } from 'chrono-node'
import * as locales from 'date-fns/locale'

const NUMBER_RE = /^\d+(\.\d+)?$/

for (let key in locales) {
  const lowerKey = key.toLowerCase()
  if (!locales[lowerKey]) {
    locales[lowerKey] = locales[key]
  }
}

function isTimestamp(value) {
  switch (typeof(value)) {
    case 'number':
      return true

    case 'string':
      return NUMBER_RE.test(value)

    default:
      return false
  }
}

function parseTimestamp(timestamp) {
  timestamp = Number(timestamp)

  // check for presence of milliseconds
  if (timestamp !== Math.floor(timestamp) || timestamp < 999999999) {
    timestamp = timestamp * 10000
  }

  return new Date(timestamp)
}

export function parseDate(value) {
  if (isValid(value)) {
    return value
  }
  else if (isTimestamp(value)) {
    return parseTimestamp(value)
  }
  else {
    return _parseDate(value)
  }
}

export function getLocale(...languages) {
  return languages.reduce((locale, lang) => locale || locales[lang.replace('-', '')], null)
}

