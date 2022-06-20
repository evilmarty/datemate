import type { Component, Accessor, Setter } from 'solid-js'
import { createSignal, createEffect, createMemo, splitProps, Switch, Match, For, children } from 'solid-js'
import { Dynamic } from 'solid-js/web'
import { isValidDate, getDatesInMonth } from './date'

interface TimeProps {
  datetime: Date | string
  locale?: string
  format?: object
  parts?: object
  children: any
}

export function Time(props: TimeProps): Component {
  const [local, other] = splitProps(props, ['locale', 'datetime', 'format', 'parts', 'children'])
  const isFunction = typeof(local.children) === 'function'
  const resolved = children(() => local.children)
  const content = createMemo(() => {
    const children = !isFunction ? resolved() : null
    let dtf

    if (children) {
      return children
    }
    if (!isValidDate(local.datetime)) {
      return null
    }
    else if (isFunction) {
      return local.children(local.datetime)
    }
    if (typeof(local.parts) === 'object') {
      const keys = Object.keys(local.parts)
      dtf = new Intl.DateTimeFormat(local.locale, local.parts)
      return dtf
        .formatToParts(local.datetime)
        .filter(part => keys.includes(part.type))
        .map(part => part.value)
    } else {
      dtf = new Intl.DateTimeFormat(local.locale, local.format)
      return dtf.format(local.datetime)
    }
  })
  const datetime = createMemo(() => isValidDate(local.datetime) ? local.datetime.toISOString() : null)
  return (
    <time {...other} datetime={datetime()}>{content()}</time>
  )
}

interface DataListProps {
  children: Component[]
  onItemClick?: Function
}

export function DataList(props: DataListProps): Component {
  const resolved = children(() => Array.isArray(props.children) ? props.children : [props.children])
  const baseStyle = 'w-full text-left bg-white dark:bg-black odd:bg-gray-50 dark:odd:bg-gray-900 px-4 py-5 sm:px-6 sm:grid sm:grid-cols-3 sm:gap-4 flex-1 group active:bg-blue-500'
  const component = props.onItemClick ? 'button' : 'div'
  return (
    <dl class="bg-white dark:bg-black dark:border dark:border-gray-800 shadow overflow-hidden sm:rounded-lg">
      <For each={resolved()}>
        {child => (
          <Dynamic component={component} onClick={props.onItemClick} classList={{[baseStyle]: true, 'cursor-pointer': props.onItemClick}}>
            <dt class="text-sm font-medium text-gray-500 dark:text-gray-600 group-active:text-white dark:group-active:text-black">{child.title}</dt>
            <dd class="mt-1 text-sm text-gray-900 dark:text-gray-400 sm:mt-0 sm:col-span-2 group-active:text-white dark:group-active:text-black">{child}</dd>
          </Dynamic>
        )}
      </For>
    </dl>
  )
}

interface InputProps {
  isValid?: boolean
  value: string
  onInput: Function
  placeholder?: string
}

export function Input(props: InputProps): Component {
  const validate = (el, isValid) => {
    createEffect(() => {
      el.setCustomValidity(isValid() !== false ? '' : 'Invalid')
    })
  }

  return (
    <div class="relative rounded-md shadow-sm flex-1">
      <input type="text" class="text-center focus:ring-indigo-500 focus:border-indigo-500 block w-full pr-12 sm:text-sm bg-white dark:bg-black text-black dark:text-white border-gray-300 dark:border-gray-700 rounded-md invalid:border-red-300 dark:placeholder:text-gray-800" use:validate={props.isValid} value={props.value} onInput={props.onInput} placeholder={props.placeholder}/>
      <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
        <Switch>
          <Match when={props.isValid === false}>
            <HeroIcon name="exclamation-circle" class="text-red-300"/>
          </Match>
          <Match when={props.isValid === true}>
            <HeroIcon name="check" class="text-green-300"/>
          </Match>
        </Switch>
      </div>
    </div>
  )
}

interface ButtonProps {
  icon: string
  children: any
  toggle: boolean
}

export function Button(props: ButtonProps): Component {
  const [local, others] = splitProps(props, ['icon', 'children'])
  const baseStyle = 'inline-flex items-center p-2 border rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 justify-center'
  const onStyle = 'border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-900 shadow-inner'
  const offStyle = 'border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 bg-white dark:bg-black hover:bg-gray-50 dark:hover:bg-gray-900'
  return (
    <button {...others} classList={{[baseStyle]: true, [onStyle]: !!props.toggle, [offStyle]: !props.toggle}} type="button">
      <HeroIcon name={local.icon} class="h-5 w-5 text-gray-500"/>
      {local.children}
    </button>
  )
}

interface HeroIconProps {
  name: string
}

export function HeroIcon(props: HeroIconProps): Component {
  const [local, others] = splitProps(props, ['name'])
  switch (local.name) {
    case 'check':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" {...others} width={24} height={24}  viewBox="0 0 24 24" fill="currentColor">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      )
    case 'x':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" {...others} width={24} height={24}  viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      )
    case 'exclamation-circle':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" {...others} width={24} height={24}  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    case 'duplicate':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" {...others} width={24} height={24}  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      )
    case 'chevron-left':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" {...others} width={24} height={24}  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      )
    case 'chevron-right':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" {...others} width={24} height={24}  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      )
    case 'information-circle':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" {...others} width={24} height={24}  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    case 'emoji-happy':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" {...others} width={24} height={24} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    case 'calendar':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" {...others} width={24} height={24} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    default:
      return null
  }
}

interface DialogProps {
  modal?: boolean
  open?: boolean
  title?: string
  icon?: string
  children: Component[]
  footer?: Component[]
  onClose?: Function
}

export function Dialog(props: DialogProps): Component {
  let el
  createEffect(() => {
    if (props.modal) {
      el.showModal()
    }
    else if (props.open) {
      el.show()
    }
    else {
      el.close()
    }
  })
  return (
    <dialog onCancel={props.onClose} ref={el} class="absolute z-10 p-0 rounded-lg text-left overflow-hidden backdrop:bg-white/70 dark:backdrop:bg-white/10 bg-white dark:bg-black shadow-xl transform transition-all sm:my-8 sm:max-w-lg sm:w-full">
      <div class="bg-white dark:bg-black px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
        <div class="sm:flex sm:items-start">
          <Show when={props.icon}>
            <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900 sm:mx-0 sm:h-10 sm:w-10">
              <HeroIcon name={props.icon} class="h-6 w-6 text-blue-600 dark:text-black"/>
            </div>
          </Show>
          <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left flex-1">
            <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">{props.title}</h3>
            <div class="mt-2">{props.children}</div>
          </div>
        </div>
      </div>
      <Show when={props.footer}>
        <div class="bg-gray-50 dark:bg-gray-900 px-4 py-3 sm:px-6 grid grid-cols-1 sm:flex sm:flex-row-reverse">{props.footer}</div>
      </Show>
    </dialog>
  )
}

interface CalendarProps {
  date: Date
  header?: string
  onSelect?: Function
}

export function Calendar(props: CalendarProps): Component {
  const today: Date = createMemo(() => new Date())
  const date: Date = createMemo(() => props.date || today())
  const days: Date[] = createMemo(() => getDatesInMonth(date()))
  const preDays: Date[] = createMemo(() => {
    const bom = days()[0]
    const dates = new Array(bom.getDay())
    let d
    for (let i = 0; i < dates.length; ++i) {
      d = new Date(bom)
      d.setDate(d.getDate() - i)
      dates[i] = d
    }
    return dates
  })
  const postDays: Date[] = createMemo(() => {
    const _days = days()
    const eom = _days[_days.length - 1]
    const dates = new Array(Math.abs(eom.getDay() - 6))
    let d
    for (let i = 0; i < dates.length; ++i) {
      d = new Date(eom)
      d.setDate(d.getDate() + i + 1)
      dates[i] = d
    }
    return dates
  })
  const headers: string[] = createMemo(() => {
    if (props.header === false) {
      return []
    }
    const dtf = new Intl.DateTimeFormat([], {weekday: props.header || 'short'})
    const strings = new Array(7)
    const date = new Date()
    let d
    for (let i = 0; i < strings.length; ++i) {
      d = new Date(date)
      d.setDate(d.getDate() + i - date.getDay())
      strings[i] = dtf.format(d)
    }
    return strings
  })
  const sameDate = (d1: Date, d2: Date): boolean => d1 && d2 && d1.getYear() === d2.getYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate()
  const handler = date => () => props.onSelect?.call(null, date)
  const prepostDay = day => (
    <button onClick={handler(day)} class="bg-gray-100 text-gray-400 dark:bg-gray-900 dark:hover:bg-gray-800 dark:text-gray-700 dark:border-gray-800">{day.getDate()}</button>
  )
  return (
    <div class="text-center leading-10">
      <Show when={headers().length > 0}>
        <div class="grid grid-cols-7">
          <For each={headers()}>
            {(header) => (
              <span class="text-gray-500 uppercase">{header}</span>
            )}
          </For>
        </div>
      </Show>
      <div class="grid grid-cols-7 divide-x divide-y border-r border-b dark:border-gray-800 rounded overflow-hidden">
        <For each={preDays()}>{prepostDay}</For>
        <For each={days()}>
          {(day) => (
            <button onClick={handler(day)} classList={{'bg-white text-black hover:bg-gray-50 dark:bg-black dark:hover:bg-gray-900 dark:text-white dark:border-gray-800': true, 'text-blue-500': sameDate(day, today())}}>
              {day.getDate()}
            </button>
          )}
        </For>
        <For each={postDays()}>{prepostDay}</For>
      </div>
    </div>
  )
}

export function CalendarPicker(props: CalendarProps): Component {
  const [date, setDate] = createSignal(props.date || new Date())
  const [open, setOpen] = createSignal(false)
  const month = createMemo(() => new Intl.DateTimeFormat([], {month: 'long'}).format(date()))
  const onSelect = date => {
    setOpen(false)
    props.onSelect?.call(null, date)
  }
  const changeMonth = increment => () => {
    const d = new Date(date())
    d.setMonth(d.getMonth() + increment)
    setDate(d)
  }
  return (
    <span>
      <Button icon="calendar" toggle={open()} onClick={() => setOpen(!open())}/>
      <Dialog modal={open()}>
        <div class="flex justify-between items-center mb-3">
          <Button icon="chevron-left" class="" onClick={changeMonth(-1)}/>
          <h3 class="font-bold dark:text-white">{month()}</h3>
          <Button icon="chevron-right" class="" onClick={changeMonth(+1)}/>
        </div>
        <Calendar {...props} date={date()} onSelect={onSelect}/>
      </Dialog>
    </span>
  )
}
