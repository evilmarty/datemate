import { createStore } from 'solid-js/store'
import { batch } from 'solid-js'
import { parseDate, isValidDate, getDateDetails, getHumanisedRelativeDetails } from './date'

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
  dateDetails?: DateDetails
  relDetails?: HumanisedRelativeDetails
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

export function changeDateInput(setState: Function<State>, dateInput: string) {
  setState(state => updateDateInput(state, dateInput))
}

export function changeDate(setState: Function<State>, date: Date) {
  const dateInput = date.toLocaleString()
  setState(state => updateDate({...state, dateInput}, date))
}

export function changeRefDateInput(setState: Function<State>, refDateInput: string) {
  setState(state => updateRefDateInput(state, refDateInput))
}

export function changeRefDate(setState: Function<State>, refDate: Date) {
  const refDateInput = refDate.toLocaleString()
  setState(state => updateRefDate({...state, refDateInput}, refDate))
}

function updateDateInput(state, dateInput) {
  const date = parseDate(dateInput, state.refDate)
  return updateDate({...state, dateInput}, date)
}

function updateDate(state, date) {
  const dateValid = state.dateInput && isValidDate(date)
  const dateDetails = dateValid ? getDateDetails(date) : null
  const relDetails = dateValid ? getHumanisedRelativeDetails(date, state.refDate || new Date()) : null
  return {...state, date, dateValid, dateDetails, relDetails}
}

function updateRefDateInput(state, refDateInput) {
  const refDate = parseDate(refDateInput)
  return updateRefDate({...state, refDateInput}, refDate)
}

function updateRefDate(state, refDate) {
  const refDateValid = state.refDateInput && isValidDate(refDate)
  return updateDateInput({...state, refDate, refDateValid}, state.dateInput)
}
