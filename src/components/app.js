import { h } from 'preact'
import { useState, useCallback, useEffect, useMemo } from 'preact/hooks'
import { parseDate, getLocale } from '../utils'
import { useInterval, useHash } from '../hooks'
import Main from './Main'

const LANGUAGES = navigator.languages || ['en']
const LOCALE = getLocale(...LANGUAGES)

export default function() {
  const [baseDate, setBaseDate] = useState(Date.now())
  const [query, setQuery] = useHash()
  const date = useMemo(() => parseDate(query), [query])

  const handleInput = useCallback(event => {
    setQuery(event.target.value)
  }, [setQuery])

  useInterval(() => setBaseDate(Date.now()), 1000)

  return <Main locale={LOCALE} baseDate={baseDate} query={query} date={date} onInput={handleInput}/>
}
