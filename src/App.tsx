import type { Component, Accessor, Setter } from 'solid-js'
import { createSignal, createMemo, createEffect, onCleanup, Show } from 'solid-js'
import { parseDate, isValidDate } from './date'
import { Input, DataList, Time, Button, Dialog } from './components'
import logo from './assets/logo.svg'

function maybeIsValidDate(date) {
  if (date !== null) {
    return isValidDate(date)
  }
}

function useHash(): [Accessor, Setter] {
  const hash = (): string => decodeURIComponent(location.hash.replace('#', ''))
  const setHash = (value: string) => location.hash = encodeURIComponent(value)
  const [value, setValue] = createSignal(hash())
  const callback = () => setValue(hash())

  createEffect(() => window.addEventListener('hashchange', callback))
  onCleanup(() => window.removeEventListener('hashchange', callback))

  return [value, setHash as Setter]
}

function App(): Component {
  const [hash, setHash] = useHash()
  const [dateInput, setDateInput] = createSignal(hash())
  const [refDate, setRefDate] = createSignal(null)
  const date = createMemo(() => parseDate(dateInput(), refDate()))
  const showDetails = createMemo(() => isValidDate(date()))
  const [showInfo, setShowInfo] = createSignal(false)

  createEffect(() => {
    const value = date()
    if (isValidDate(value) || !value) {
      setHash(dateInput())
    }
  })

  return (
    <div class="flex items-center justify-center min-h-screen p-4 ml-auto mr-auto w-full max-w-xl flex-col items-stretch">
      <header class="block mb-10">
        <svg classList={{'ml-auto mr-auto h-24 scale-100 transition-transform ease-in-out origin-bottom': true, 'scale-75': showDetails()}} viewBox="0 0 172 101" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M47.5863 0.511997V48H38.0503V44.032C35.5756 47.0187 31.9916 48.512 27.2983 48.512C24.0556 48.512 21.1116 47.7867 18.4663 46.336C15.8636 44.8853 13.8156 42.816 12.3223 40.128C10.8289 37.44 10.0823 34.3253 10.0823 30.784C10.0823 27.2427 10.8289 24.128 12.3223 21.44C13.8156 18.752 15.8636 16.6827 18.4663 15.232C21.1116 13.7813 24.0556 13.056 27.2983 13.056C31.6929 13.056 35.1276 14.4427 37.6023 17.216V0.511997H47.5863ZM29.0263 40.32C31.5436 40.32 33.6343 39.4667 35.2983 37.76C36.9623 36.0107 37.7943 33.6853 37.7943 30.784C37.7943 27.8827 36.9623 25.5787 35.2983 23.872C33.6343 22.1227 31.5436 21.248 29.0263 21.248C26.4663 21.248 24.3543 22.1227 22.6903 23.872C21.0263 25.5787 20.1943 27.8827 20.1943 30.784C20.1943 33.6853 21.0263 36.0107 22.6903 37.76C24.3543 39.4667 26.4663 40.32 29.0263 40.32ZM91.7708 13.568V48H82.2348V44.032C79.7601 47.0187 76.1761 48.512 71.4828 48.512C68.2401 48.512 65.2961 47.7867 62.6508 46.336C60.0481 44.8853 58.0001 42.816 56.5068 40.128C55.0134 37.44 54.2668 34.3253 54.2668 30.784C54.2668 27.2427 55.0134 24.128 56.5068 21.44C58.0001 18.752 60.0481 16.6827 62.6508 15.232C65.2961 13.7813 68.2401 13.056 71.4828 13.056C75.8774 13.056 79.3121 14.4427 81.7868 17.216V13.568H91.7708ZM73.2108 40.32C75.7281 40.32 77.8188 39.4667 79.4828 37.76C81.1468 36.0107 81.9788 33.6853 81.9788 30.784C81.9788 27.8827 81.1468 25.5787 79.4828 23.872C77.8188 22.1227 75.7281 21.248 73.2108 21.248C70.6508 21.248 68.5388 22.1227 66.8748 23.872C65.2108 25.5787 64.3788 27.8827 64.3788 30.784C64.3788 33.6853 65.2108 36.0107 66.8748 37.76C68.5388 39.4667 70.6508 40.32 73.2108 40.32ZM121.75 46.336C120.769 47.0613 119.553 47.616 118.102 48C116.694 48.3413 115.222 48.512 113.686 48.512C109.548 48.512 106.369 47.4667 104.15 45.376C101.932 43.2853 100.822 40.2133 100.822 36.16V5.952H110.806V14.336H119.318V22.016H110.806V36.032C110.806 37.4827 111.169 38.6133 111.894 39.424C112.62 40.192 113.665 40.576 115.03 40.576C116.566 40.576 117.932 40.1493 119.126 39.296L121.75 46.336ZM143.671 40.512C145.463 40.512 147.041 40.256 148.407 39.744C149.815 39.1893 151.116 38.336 152.311 37.184L157.623 42.944C154.38 46.656 149.644 48.512 143.415 48.512C139.532 48.512 136.097 47.7653 133.111 46.272C130.124 44.736 127.82 42.624 126.199 39.936C124.577 37.248 123.767 34.1973 123.767 30.784C123.767 27.4133 124.556 24.384 126.135 21.696C127.756 18.9653 129.953 16.8533 132.727 15.36C135.543 13.824 138.7 13.056 142.199 13.056C145.484 13.056 148.471 13.76 151.159 15.168C153.847 16.5333 155.98 18.5387 157.559 21.184C159.18 23.7867 159.991 26.88 159.991 30.464L134.519 35.392C135.244 37.0987 136.375 38.3787 137.911 39.232C139.489 40.0853 141.409 40.512 143.671 40.512ZM142.199 20.608C139.681 20.608 137.633 21.4187 136.055 23.04C134.476 24.6613 133.644 26.9013 133.559 29.76L150.327 26.496C149.857 24.704 148.897 23.2747 147.447 22.208C145.996 21.1413 144.247 20.608 142.199 20.608ZM45.0165 65.056C49.3258 65.056 52.7392 66.336 55.2565 68.896C57.8165 71.4133 59.0965 75.2107 59.0965 80.288V100H49.1125V81.824C49.1125 79.0933 48.5365 77.0667 47.3845 75.744C46.2752 74.3787 44.6752 73.696 42.5845 73.696C40.2378 73.696 38.3818 74.464 37.0165 76C35.6512 77.4933 34.9685 79.7333 34.9685 82.72V100H24.9845V81.824C24.9845 76.4053 22.8085 73.696 18.4565 73.696C16.1525 73.696 14.3178 74.464 12.9525 76C11.5872 77.4933 10.9045 79.7333 10.9045 82.72V100H0.9205V65.568H10.4565V69.536C11.7365 68.0853 13.2938 66.976 15.1285 66.208C17.0058 65.44 19.0538 65.056 21.2725 65.056C23.7045 65.056 25.9018 65.5467 27.8645 66.528C29.8272 67.4667 31.4058 68.8533 32.6005 70.688C34.0085 68.896 35.7792 67.5093 37.9125 66.528C40.0885 65.5467 42.4565 65.056 45.0165 65.056ZM103.365 65.568V100H93.8285V96.032C91.3538 99.0187 87.7698 100.512 83.0765 100.512C79.8338 100.512 76.8898 99.7867 74.2445 98.336C71.6418 96.8853 69.5938 94.816 68.1005 92.128C66.6072 89.44 65.8605 86.3253 65.8605 82.784C65.8605 79.2427 66.6072 76.128 68.1005 73.44C69.5938 70.752 71.6418 68.6827 74.2445 67.232C76.8898 65.7813 79.8338 65.056 83.0765 65.056C87.4712 65.056 90.9058 66.4427 93.3805 69.216V65.568H103.365ZM84.8045 92.32C87.3218 92.32 89.4125 91.4667 91.0765 89.76C92.7405 88.0107 93.5725 85.6853 93.5725 82.784C93.5725 79.8827 92.7405 77.5787 91.0765 75.872C89.4125 74.1227 87.3218 73.248 84.8045 73.248C82.2445 73.248 80.1325 74.1227 78.4685 75.872C76.8045 77.5787 75.9725 79.8827 75.9725 82.784C75.9725 85.6853 76.8045 88.0107 78.4685 89.76C80.1325 91.4667 82.2445 92.32 84.8045 92.32ZM133.344 98.336C132.363 99.0613 131.147 99.616 129.696 100C128.288 100.341 126.816 100.512 125.28 100.512C121.141 100.512 117.963 99.4667 115.744 97.376C113.525 95.2853 112.416 92.2133 112.416 88.16V57.952H122.4V66.336H130.912V74.016H122.4V88.032C122.4 89.4827 122.763 90.6133 123.488 91.424C124.213 92.192 125.259 92.576 126.624 92.576C128.16 92.576 129.525 92.1493 130.72 91.296L133.344 98.336ZM155.265 92.512C157.057 92.512 158.635 92.256 160.001 91.744C161.409 91.1893 162.71 90.336 163.905 89.184L169.217 94.944C165.974 98.656 161.238 100.512 155.009 100.512C151.126 100.512 147.691 99.7653 144.705 98.272C141.718 96.736 139.414 94.624 137.793 91.936C136.171 89.248 135.361 86.1973 135.361 82.784C135.361 79.4133 136.15 76.384 137.729 73.696C139.35 70.9653 141.547 68.8533 144.321 67.36C147.137 65.824 150.294 65.056 153.793 65.056C157.078 65.056 160.065 65.76 162.753 67.168C165.441 68.5333 167.574 70.5387 169.153 73.184C170.774 75.7867 171.585 78.88 171.585 82.464L146.113 87.392C146.838 89.0987 147.969 90.3787 149.505 91.232C151.083 92.0853 153.003 92.512 155.265 92.512ZM153.793 72.608C151.275 72.608 149.227 73.4187 147.649 75.04C146.07 76.6613 145.238 78.9013 145.153 81.76L161.921 78.496C161.451 76.704 160.491 75.2747 159.041 74.208C157.59 73.1413 155.841 72.608 153.793 72.608Z" fill="#3B82F6"/>
        </svg>
        <Button icon="information-circle" class="absolute top-2 right-2 text-black" onClick={() => setShowInfo(true)}/>
      </header>
      <Input value={dateInput()} isValid={maybeIsValidDate(date())} onInput={e => setDateInput(e.target.value)}/>
      <Input isValid={maybeIsValidDate(refDate())} onInput={e => setRefDate(parseDate(e.target.value))} placeholder="Now"/>
      <Show when={showDetails()}>
        <div class="mt-3">
          <DataList>
            <Time title="Date" datetime={date()} format={{}}/>
            <Time title="Time" datetime={date()} format={{hour: 'numeric', minute: 'numeric'}}/>
            <Time title="Week day" datetime={date()} format={{weekday: 'long'}}/>
            <Time title="Month" datetime={date()} format={{month: 'long'}}/>
            <Time title="Year" datetime={date()} format={{year: 'numeric'}}/>
            <Time title="Era" datetime={date()} parts={{era: 'long'}}/>
            <Time title="Time zone" datetime={date()} parts={{timeZoneName: 'long'}}/>
            <Time title="Unix timestamp" datetime={date()}>{date => String(date.getTime())}</Time>
          </DataList>
        </div>
      </Show>
      <Dialog modal={showInfo()} footer={<Button onClick={() => setShowInfo(false)} class="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">Close</Button>} title="About" icon="information-circle">
        <div class="text-sm text-gray-500 space-y-2">
          <p>Date Mate is a helpful app to better understand dates and time. Visit the <a href="https://github.com/evilmarty/datemate" class="text-blue-600">GitHub</a> repository to contribute or report an issue.</p>
          <p>This was made by <a href="https://marty.zalega.me" class="text-blue-600">Marty Zalega</a>.</p>
          <p>I hope this app was useful to you.</p>
        </div>
      </Dialog>
    </div>
  )
}

export default App
