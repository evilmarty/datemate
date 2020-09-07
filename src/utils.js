import { isValid } from 'date-fns'
import { parseDate as _parseDate } from 'chrono-node'
import * as locales from 'date-fns/locale'

export function parseDate(value) {
  if (isValid(value)) {
    return value
  }
  else {
    return _parseDate(value)
  }
}

export function getLocale(...languages) {
  return languages.reduce((locale, lang) => locale || locales[lang.replace('-', '')], null)
}

