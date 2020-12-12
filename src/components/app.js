import { h } from 'preact'
import { useState, useCallback, useEffect, useMemo } from 'preact/hooks'
import { parseDate, getLocale } from '../utils'
import Main from './Main'

const LANGUAGES = navigator.languages || ['en']
const LOCALE = getLocale(...LANGUAGES)

export default function() {
  const [baseDate, setBaseDate] = useState(Date.now())
  const [query, setQuery] = useState(hashValue())
  const date = useMemo(() => parseDate(query), [query])

  const handleInput = useCallback(event => {
    const query = event.target.value.trim()
    const date = parseDate(query)

    if (date) {
      location.hash = encodeURIComponent(query)
    }

    setQuery(query)
  }, [setQuery])

  useInterval(() => setBaseDate(Date.now()), 1000)
  useHash(() => setQuery(hashValue()))

  return <Main locale={LOCALE} baseDate={baseDate} value={[query, date]} onInput={handleInput}/>
}
