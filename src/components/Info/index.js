import { h, Fragment } from 'preact'
import {
  format,
  formatDistanceStrict,
  formatRelative,
  isValid
} from 'date-fns'
import style from './style.css'

const SIMPLE_FORMAT = (date, _, ...args) => format(date, ...args)

const DETAILS = [
  {
    label: 'date',
    process: SIMPLE_FORMAT,
    args: ['P'],
  },
  {
    label: 'time',
    process: SIMPLE_FORMAT,
    args: ['p'],
  },
  {
    label: 'datetime',
    process: SIMPLE_FORMAT,
    args: ['Pp'],
  },
  {
    label: 'weekday',
    process: SIMPLE_FORMAT,
    args: ['cccc'],
  },
  {
    label: 'month',
    process: SIMPLE_FORMAT,
    args: ['LLLL'],
  },
  {
    label: 'day',
    process: SIMPLE_FORMAT,
    args: ['do'],
  },
  {
    label: 'year',
    process: SIMPLE_FORMAT,
    args: ['y'],
  },
  {
    label: 'quarter',
    process: SIMPLE_FORMAT,
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
    process: SIMPLE_FORMAT,
    args: ['T'],
  },
  {
    label: 'era',
    process: SIMPLE_FORMAT,
    args: ['GGGG'],
  },
  {
    label: 'timezone',
    process: SIMPLE_FORMAT,
    args: ['xxxxx'],
  },
]

export default function({ locale, date, baseDate, fallback = null, className = '' }) {
  if (!isValid(date)) {
    return fallback
  }

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
