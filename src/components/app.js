import { h } from 'preact'
import { useState, useCallback, useEffect, useMemo } from 'preact/hooks'
import { parseDate, getLocale } from '../utils'
import Main from './Main'

const languages = navigator.languages || ['en']
const locale = getLocale(...languages)

function useInterval(callback, timeout) {
  const wrappedCallback = requestAnimationFrame.bind(null, callback)
  return useEffect(() => {
    const interval = setInterval(wrappedCallback, timeout)
    return () => clearInterval(interval)
  })
}

function useHash(callback) {
  useEffect(() => {
    window.addEventListener('hashchange', callback)
    return () => window.removeEventListener('hashchange', callback)
  })
}

function hashValue() {
  return decodeURIComponent(location.hash.replace('#', ''))
}

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

  return <Main locale={locale} baseDate={baseDate} value={[query, date]} onInput={handleInput}/>
}
