import { h, Fragment } from 'preact'
import {
  format,
  formatDistanceStrict,
  formatRelative,
  isValid
} from 'date-fns'
import style from './style.css'
import { getLocale } from '../../utils'

const simpleFormat = (date, _, ...args) => format(date, ...args)

const DETAILS = [
  {
    label: 'date',
    process: simpleFormat,
    args: ['P'],
  },
  {
    label: 'time',
    process: simpleFormat,
    args: ['p'],
  },
  {
    label: 'datetime',
    process: simpleFormat,
    args: ['Pp'],
  },
  {
    label: 'weekday',
    process: simpleFormat,
    args: ['cccc'],
  },
  {
    label: 'month',
    process: simpleFormat,
    args: ['LLLL'],
  },
  {
    label: 'day',
    process: simpleFormat,
    args: ['do'],
  },
  {
    label: 'year',
    process: simpleFormat,
    args: ['y'],
  },
  {
    label: 'quarter',
    process: simpleFormat,
    args: ['qo'],
  },
  {
    label: 'relative year',
    process: formatDistanceStrict,
    options: {unit: 'year', addSuffix: true},
  },
  {
    label: 'relative month',
    process: formatDistanceStrict,
    options: {unit: 'month', addSuffix: true},
  },
  {
    label: 'relative day',
    process: formatDistanceStrict,
    options: {unit: 'day', addSuffix: true},
  },
  {
    label: 'relative hour',
    process: formatDistanceStrict,
    options: {unit: 'hour', addSuffix: true},
  },
  {
    label: 'relative minute',
    process: formatDistanceStrict,
    options: {unit: 'minute', addSuffix: true},
  },
  {
    label: 'relative second',
    process: formatDistanceStrict,
    options: {unit: 'second', addSuffix: true},
  },
  {
    label: 'timestamp',
    process: simpleFormat,
    args: ['T'],
  },
  {
    label: 'era',
    process: simpleFormat,
    args: ['GGGG'],
  },
  {
    label: 'timezone',
    process: simpleFormat,
    args: ['xxxxx'],
  },
]

export default function({ languages, date, baseDate, fallback = null, className = '' }) {
  if (!isValid(date)) {
    return fallback
  }

  const locale = getLocale(...languages)
  const details = DETAILS.map(({ label, process, args = [], options = {} }) => ({ label, value: process(date, baseDate, ...args, { ...options, locale }) }))

  return (
    <Fragment>
      <dl className={`${style.container} ${className}`}>
        {details.map(item => (
          <Fragment>
            <dt className={style.title}>{item.label}</dt>
            <dd className={style.content}>
              <input onClick={event => { event.target.select(); document.execCommand('copy') }} className={style.input} value={item.value} readOnly/>
            </dd>
          </Fragment>
        ))}
      </dl>
    </Fragment>
  )
}
