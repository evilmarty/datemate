import { h } from 'preact'
import Input from '../Input'
import Info from '../Info'
import Examples from '../Examples'
import style from './style.css'

const K = () => {}

export default function({ locale, baseDate, value, onSubmit = K, onInput = K, onSelect = K }) {
  const [query, date] = value
  const isInvalid = query !== '' && date === null

  return (
    <div className={style.container}>
      <header className={style.header}>
        <h1 className={style.title}>Date Mate</h1>
      </header>
      <Input placeholder="Enter a date" value={query} onInput={onInput} onSubmit={onSubmit} className={style.input} isInvalid={isInvalid}/>
      <Examples locale={locale}/>
      <Info locale={locale} baseDate={baseDate} date={date} onSelect={onSelect} className={style.result}/>
      <footer className={style.footer}>
        Made by <a href="https://marty.zalega.me" target="_blank">Marty Zalega</a>. Code on <a href="https://github.com/evilmarty/datemate">GitHub</a>.
      </footer>
    </div>
  )
}
