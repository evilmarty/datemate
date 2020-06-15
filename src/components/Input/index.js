import { h } from 'preact'
import { useCallback } from 'preact/hooks'
import style from './style.css'

const K = () => {}

export default function({ onSubmit = K, onKeyDown = K, className = '', isInvalid = false, ...props }) {
  const handleKeyDown = useCallback(event => {
    if (event.key === 'Enter' && !isInvalid) {
      onSubmit(event)
    }
    else {
      onKeyDown(event)
    }
  }, [onSubmit, onKeyDown])

  return (
    <span className={`${style.container} ${className}`}>
      <input type="search" className={`${style.input} ${isInvalid ? style.invalid : style.valid}`} onKeyDown={handleKeyDown} {...props}/>
    </span>
  )
}
