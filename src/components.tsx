import type { Component, Accessor, Setter } from 'solid-js'
import { createEffect, createMemo, splitProps, Switch, Match, For, children } from 'solid-js'
import { isValidDate } from './date'

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
  props: Component[]
}

export function DataList(props: DataListProps): Component {
  const resolved = children(() => Array.isArray(props.children) ? props.children : [props.children])
  return (
    <dl class="bg-white dark:bg-black dark:border dark:border-gray-800 shadow overflow-hidden sm:rounded-lg">
      <For each={resolved()}>
        {child => (
          <div class="bg-white dark:bg-black odd:bg-gray-50 dark:odd:bg-gray-900 px-4 py-5 sm:px-6 sm:grid sm:grid-cols-3 sm:gap-4 flex-1">
            <dt class="text-sm font-medium text-gray-500 dark:text-gray-600">{child.title}</dt>
            <dd class="mt-1 text-sm text-gray-900 dark:text-gray-400 sm:mt-0 sm:col-span-2">{child}</dd>
          </div>
        )}
      </For>
    </dl>
  )
}

interface InputProps {
  isValid?: boolean
}

export function Input(props: InputProps): Component {
  const [local, others] = splitProps(props, ['isValid'])
  const validate = (el, isValid) => {
    createEffect(() => {
      el.setCustomValidity(isValid() !== false ? '' : 'Invalid')
    })
  }

  return (
    <div class="mt-1 relative rounded-md shadow-sm">
      <input type="text" class="text-center focus:ring-indigo-500 focus:border-indigo-500 block w-full pr-12 sm:text-sm bg-white dark:bg-black text-black dark:text-white border-gray-300 dark:border-gray-700 rounded-md invalid:border-red-300 dark:placeholder:text-gray-800" use:validate={local.isValid} {...others}/>
      <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
        <Switch>
          <Match when={local.isValid === false}>
            <HeroIcon name="exclamation-circle" class="text-red-300"/>
          </Match>
          <Match when={local.isValid === true}>
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
}

export function Button(props: ButtonProps): Component {
  const [local, others] = splitProps(props, ['icon', 'children'])
  return (
    <button {...others} class="inline-flex items-center p-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-black hover:bg-gray-50 dark:hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 justify-center" type="button">
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
    <dialog onCancel={props.onClose} ref={el} class="absolute p-0 rounded-lg text-left overflow-hidden backdrop:bg-white/70 dark:backdrop:bg-white/10 bg-white dark:bg-black shadow-xl transform transition-all sm:my-8 sm:max-w-lg sm:w-full">
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
