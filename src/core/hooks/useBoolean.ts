import { useCallback, useState } from 'react'

type UseBooleanReturn = {
  value: boolean
  toggle: () => void
  setTrue: () => void
  setFalse: () => void
}

export function useBoolean(initialValue = false): UseBooleanReturn {
  const [value, setValue] = useState(initialValue)
  const toggle = useCallback(() => setValue((v) => !v), [])
  const setTrue = useCallback(() => setValue(true), [])
  const setFalse = useCallback(() => setValue(false), [])
  return { value, toggle, setTrue, setFalse }
}
