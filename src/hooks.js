import { useState, useEffect } from 'preact/hooks'

export function useInterval(callback, delay) {
  const wrappedCallback = requestAnimationFrame.bind(null, callback)
  return useEffect(() => {
    const interval = setInterval(wrappedCallback, delay)
    return () => clearInterval(interval)
  })
}

function setHash(hash) {
  location.hash = encodeURIComponent(hash)
}

function getHash() {
  return decodeURIComponent(location.hash.replace('#', ''))
}

export function useHash() {
  const [value, setValue] = useState(getHash())

  useEffect(() => {
    function callback() {
      setValue(getHash())
    }

    window.addEventListener('hashchange', callback)
    return () => window.removeEventListener('hashchange', callback)
  })

  return [value, setHash]
}

