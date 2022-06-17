/* @refresh reload */
import { render } from 'solid-js/web';

import './index.css';
import App from './App';

function updateParams(state) {
  const params = new URLSearchParams()
  const historyState = {}

  if (state.dateValid) {
    params.set('d', state.dateInput)
    historyState.dateInput = state.dateInput
  }
  if (state.refDateValid) {
    params.set('r', state.refDateInput)
    historyState.refDateInput = state.refDateInput
  }
  history.replaceState(historyState, null, `?${params}`)
}

const params = new URLSearchParams(location.search)

render(
  () => <App date={params.get('d')} refDate={params.get('r')} onChange={updateParams} />,
  document.getElementById('root') as HTMLElement,
)
