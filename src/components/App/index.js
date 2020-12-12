import { h } from 'preact'
import { useState, useCallback, useEffect, useMemo } from 'preact/hooks'
import { parseDate, getLocale } from '../../utils'
import { useInterval, useHash } from '../../hooks'
import Input from '../Input'
import Info from '../Info'
import Examples from '../Examples'
import style from './style.css'

const K = () => {}
const LANGUAGES = navigator.languages || ['en']
const LOCALE = getLocale(...LANGUAGES)

export default function() {
  const [baseDate, setBaseDate] = useState(Date.now())
  const [query, setQuery] = useHash()
  const date = useMemo(() => parseDate(query), [query])
  const isInvalid = query !== '' && date === null

  const handleInput = useCallback(event => {
    setQuery(event.target.value)
  }, [setQuery])

  useInterval(() => setBaseDate(Date.now()), 1000)

  return (
    <div className={style.container}>
      <header className={style.header}>
        <h1 className={style.title}>Date Mate</h1>
      </header>
      <Input placeholder="Enter a date" value={query} onInput={handleInput} className={style.input} isInvalid={isInvalid}/>
      <Examples locale={LOCALE}/>
      <Info locale={LOCALE} baseDate={baseDate} date={date} className={style.result}/>
      <footer className={style.footer}>
        Made by <a href="https://marty.zalega.me" target="_blank">Marty Zalega</a>. Code on <a href="https://github.com/evilmarty/datemate">GitHub</a>.
      </footer>
    </div>
  )
}
