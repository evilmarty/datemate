import { createStore } from 'solid-js/store'
import { batch } from 'solid-js'
import { parseDate, isValidDate } from './date'

interface StateProps {
  refDate?: string
  date?: string
}

interface State {
  refDate?: Date
  refDateInput: string
  refDateValid: boolean
  date?: Date
  dateInput: string
  dateValid: boolean
  showInfo: boolean
  showDetails: boolean
}

export function createState(initialState: StateProps = {}): [State, Function<State>] {
  const [state, setState] = createStore({
    refDate: null,
    refDateInput: '',
    refDateValid: null,
    date: null,
    dateInput: '',
    dateValid: null,
    showInfo: false,
    get showDetails() {
      return this.dateValid
    },
  })
  if (initialState.refDate) {
    changeRefDateInput(setState, initialState.refDate)
  }
  if (initialState.date) {
    changeDateInput(setState, initialState.date)
  }
  return [state, setState]
}

export function showInfo(setState: Function<State>) {
  setState('showInfo', true)
}

export function hideInfo(setState: Function<State>) {
  setState('showInfo', false)
}

export function changeDateAndRefDateInputs(setState: Function<State>, dateInput: string, refDateInput: string) {
  batch(() => {
    changeRefDateInput(setState, refDateInput)
    changeDateInput(setState, dateInput)
  })
}

export function changeDateInput(setState: Function<State>, dateInput: string) {
  setState(state => {
    const date = parseDate(dateInput, state.refDate)
    const dateValid = dateInput && isValidDate(date)
    return { ...state, date, dateInput, dateValid }
  })
}

export function changeDate(setState: Function<State>, date: Date) {
  setState(state => ({
    ...state,
    date,
    dateInput: date.toLocaleString(),
    dateValid: isValidDate(date),
  }))
}

export function changeRefDateInput(setState: Function<State>, refDateInput: string) {
  setState(state => {
    const refDate = parseDate(refDateInput)
    const date = parseDate(state.dateInput, refDate)
    return {
      ...state,
      refDate,
      refDateInput,
      date,
      refDateValid: refDateInput && isValidDate(refDate),
      dateValid: state.dateInput && isValidDate(date),
    }
  })
}

export function changeRefDate(setState: Function<State>, refDate: Date) {
  setState(state => {
    const date = parseDate(state.dateInput, refDate)
    return {
      ...state,
      refDate,
      date,
      refDateInput: refDate.toLocaleString(),
      refDateValid: isValidDate(refDate),
      dateValid: state.dateInput && isValidDate(date),
    }
  })
}
