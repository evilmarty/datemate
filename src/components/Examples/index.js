import { h } from 'preact'
import style from './style.css'

export default function() {
  return (
    <ul className={style.container}>
      <li className={style.item}><a href="#today">Today</a></li>
      <li className={style.item}><a href="#tomorrow">Tomorrow</a></li>
      <li className={style.item}><a href="#last%20week">Last week</a></li>
      <li className={style.item}><a href="#next%20april">Next April</a></li>
      <li className={style.item}><a href="#5%20hours%20from%20now">5 hours from now</a></li>
      <li className={style.item}><a href="#november%205%201955">November 5 1955</a></li>
    </ul>
  )
}
