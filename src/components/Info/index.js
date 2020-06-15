import { h, Fragment } from 'preact'
import {
  format,
  formatDistanceStrict,
  formatRelative,
  isValid
} from 'date-fns'
import style from './style.css'

const simpleFormat = (date, _, ...args) => format(date, ...args)

const DETAILS = [
  {
    label: 'date',
    process: simpleFormat,
    options: ['P'],
  },
  {
    label: 'time',
    process: simpleFormat,
    options: ['p'],
  },
  {
    label: 'datetime',
    process: simpleFormat,
    options: ['Pp'],
  },
  {
    label: 'relative year',
    process: formatDistanceStrict,
    options: [{unit: 'year', addSuffix: true}],
  },
  {
    label: 'relative month',
    process: formatDistanceStrict,
    options: [{unit: 'month', addSuffix: true}],
  },
  {
    label: 'relative day',
    process: formatDistanceStrict,
    options: [{unit: 'day', addSuffix: true}],
  },
  {
    label: 'relative hour',
    process: formatDistanceStrict,
    options: [{unit: 'hour', addSuffix: true}],
  },
  {
    label: 'relative minute',
    process: formatDistanceStrict,
    options: [{unit: 'minute', addSuffix: true}],
  },
  {
    label: 'relative second',
    process: formatDistanceStrict,
    options: [{unit: 'second', addSuffix: true}],
  },
  {
    label: 'weekday',
    process: simpleFormat,
    options: ['cccc'],
  },
  {
    label: 'month',
    process: simpleFormat,
    options: ['LLLL'],
  },
  {
    label: 'day',
    process: simpleFormat,
    options: ['do'],
  },
  {
    label: 'year',
    process: simpleFormat,
    options: ['y'],
  },
  {
    label: 'quarter',
    process: simpleFormat,
    options: ['qo'],
  },
  {
    label: 'era',
    process: simpleFormat,
    options: ['GGGG'],
  },
  {
    label: 'timezone',
    process: simpleFormat,
    options: ['xxxxx'],
  },
]

export default function({ date, baseDate, fallback = null, className = '' }) {
  if (!isValid(date)) {
    return fallback
  }

  const details = DETAILS.map(({ label, process, options }) => ({ label, value: process(date, baseDate, ...options) }))

  return (
    <dl className={`${style.container} ${className}`}>
      {details.map(item => (
        <Fragment>
          <dt className={style.title}>{item.label}</dt>
          <dd className={style.content}>{item.value}</dd>
        </Fragment>
      ))}
    </dl>
  )
}
