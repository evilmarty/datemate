import { h } from 'preact'
import { useState, useCallback, useEffect, useMemo } from 'preact/hooks'
import parseDate from '../date'
import Main from './Main'

function useInterval(callback, timeout) {
  return useEffect(() => {
    const interval = setInterval(callback, timeout)
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
  return location.hash.replace('#', '')
}

export default function() {
  const [baseDate, setBaseDate] = useState(Date.now())
  const [query, setQuery] = useState(hashValue())
  const date = useMemo(() => parseDate(query), [query])

  const handleInput = useCallback(event => {
    const query = event.target.value.trim()
    const date = parseDate(query)

    if (date) {
      location.hash = query
    }

    setQuery(query)
  }, [setQuery])

  useInterval(() => setBaseDate(Date.now()), 1000)
  useHash(() => setQuery(hashValue()))

  return <Main baseDate={baseDate} value={[query, date]} onInput={handleInput}/>
}
