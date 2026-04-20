import { useState, useEffect, useRef } from 'react'

/**
 * Returns a className string that toggles 'flash' for 400ms
 * whenever `value` changes (skipping the initial mount).
 */
export function useFlash(value) {
  const [flashing, setFlashing] = useState(false)
  const isFirst = useRef(true)

  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false
      return
    }
    setFlashing(true)
    const id = setTimeout(() => setFlashing(false), 400)
    return () => clearTimeout(id)
  }, [value])

  return flashing ? 'flash' : ''
}
