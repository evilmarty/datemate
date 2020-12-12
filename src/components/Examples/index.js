import { h } from 'preact'
import { useMemo } from 'preact/hooks'
import { sub, formatRelative, formatDistance } from 'date-fns'
import style from './style.css'

const DAYS_INDEX = [0, 1, 2, 3, 4, 5, 6]
const monthsIndex = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]

const DEFAULT_EXAMPLES = [
  'Today',
  'Tomorrow',
  'Yesterday',
]

const DEFAULT_SUFFIXES = [
  'Week',
  'Month',
  'Year',
]

function sample(items) {
  const i = Math.floor(Math.random() * items.length)
  return items[i]
}

export default function({ locale }) {
  const examples = useMemo(() => {
    const suffixes = [
      ...DEFAULT_SUFFIXES,
      ...DAYS_INDEX.map(locale.localize.day),
      ...monthsIndex.map(locale.localize.month),
    ]
    const now = Date.now()

    return [
      ...DEFAULT_EXAMPLES,
      `Last ${sample(suffixes)}`,
      `Next ${sample(suffixes)}`,
      formatDistance(sub(now, { hours: 1000 * Math.random() }), now, { locale, addSuffix: true }),
      formatDistance(sub(now, { hours: -1000 * Math.random() }), now, { locale, addSuffix: true }),
      formatRelative(sub(now, { hours: 100 * Math.random() }), now, { locale, addSuffix: true }),
    ]
  }, [locale])

  return (
    <div className={style.container}>
      <ul className={style.list}>
        {examples.map(example => (
          <li className={style.item}><a href={`#${encodeURIComponent(example)}`}>{example}</a></li>
        ))}
      </ul>
    </div>
  )
}
