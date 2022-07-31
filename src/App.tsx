import type { Component, Accessor, Setter } from 'solid-js'
import { createEffect, createMemo, Show } from 'solid-js'
import { Input, DataList, Button, Dialog, CalendarPicker } from './components'
import { createState, showInfo, hideInfo, changeDateInput, changeDate, changeRefDateInput, changeRefDate, StateProps } from './state'
import logo from './logo.svg'

const LABELS = {
  date: 'Date',
  time: 'Time',
  weekday: 'Week day',
  month: 'Month',
  year: 'Year',
  era: 'Era',
  timezone: 'Time zone',
  timestamp: 'Unix timestamp',
  seconds: 'Seconds',
  minutes: 'Minutes',
  hours: 'Hours',
  days: 'Days',
  weeks: 'Weeks',
  months: 'Months',
  quarters: 'Quarters',
  years: 'Years',
}

interface AppProps {
  date: string
  refDate: string
  onChange?: Function
  onClick?: Function
}

function App(props: AppProps): Component {
  const [state: StateProps, setState] = createState(props)
  const dateDetails = createMemo(() => getDateDetailEntries(state))
  const relDetails = createMemo(() => getRelativeDetailEntries(state))

  if (props.onChange) {
    createEffect(() => {
      // referencing state property changes to trigger effect
      if (state.date || state.refDate) {
        props.onChange(state)
      }
    })
  }

  return (
    <div class="flex items-center justify-center min-h-screen p-4 ml-auto mr-auto w-full max-w-xl flex-col items-stretch">
      <header class="block mb-10">
        <img src={logo} classList={{'ml-auto mr-auto h-40 scale-100 transition-transform ease-in-out origin-bottom': true, 'scale-75': state.showDetails}}/>
        <Button icon="information-circle" class="absolute top-2 right-2 text-black" onClick={() => showInfo(setState)}/>
      </header>
      <div class="flex justify-between mt-1 space-x-1">
        <Input value={state.dateInput} isValid={state.dateValid} onInput={e => changeDateInput(setState, e.target.value)}/>
        <CalendarPicker date={state.date} onSelect={date => changeDate(setState, date)}/>
      </div>
      <div class="flex justify-between mt-1 space-x-1">
        <Input value={state.refDateInput} isValid={state.refDateValid} onInput={e => changeRefDateInput(setState, e.target.value)} placeholder="Relative to now"/>
        <CalendarPicker date={state.refDate} onSelect={date => changeRefDate(setState, date)}/>
      </div>
      <Show when={state.showDetails}>
        <div class="mt-3">
          <DataList onItemClick={props.onClick}>
            <For each={dateDetails()}>
              {([key, value]) => <time title={LABELS[key]} datetime={state.date}>{value}</time>}
            </For>
            <For each={relDetails()}>
              {([key, value]) => <time title={LABELS[key]} datetime={state.date}>{value}</time>}
            </For>
          </DataList>
        </div>
      </Show>
      <Dialog modal={state.showInfo} footer={<Button onClick={() => hideInfo(setState)}>Close</Button>} title="About" icon="information-circle">
        <div class="text-sm text-gray-500 space-y-2">
          <p>Date Mate is a helpful app to better understand dates and time. Visit the <a href="https://github.com/evilmarty/datemate" class="text-blue-600">GitHub</a> repository to contribute or report an issue.</p>
          <p>This was made by <a href="https://marty.zalega.me" class="text-blue-600">Marty Zalega</a>.</p>
          <p>I hope this app was useful to you.</p>
        </div>
      </Dialog>
    </div>
  )
}

function getDateDetailEntries(state: StateProps) {
  if (state.showDetails) {
    return Object.entries(state.dateDetails)
  } else {
    return []
  }
}

function getRelativeDetailEntries(state: StateProps) {
  if (state.showDetails) {
    const entries = Object.entries(state.relDetails)
    return entries.filter(([key, value]) => value)
  } else {
    return []
  }
}

export default App
