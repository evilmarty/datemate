import { isValid } from 'date-fns'
import { parseDate } from 'chrono-node'

export default function(value) {
  if (isValid(value)) {
    return value
  }
  else {
    return parseDate(value)
  }
}
