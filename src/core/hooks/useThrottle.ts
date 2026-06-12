import { useCallback, useRef } from 'react'

export function useThrottle<T extends (...args: unknown[]) => unknown>(fn: T, delay: number): T {
  const lastCallRef = useRef(0)
  const fnRef = useRef(fn)
  fnRef.current = fn

  // REASON: wrapper preserves T's signature for callers but cannot be inferred structurally
  return useCallback(
    (...args: unknown[]) => {
      const now = Date.now()
      if (now - lastCallRef.current >= delay) {
        lastCallRef.current = now
        return fnRef.current(...args)
      }
    },
    [delay]
  ) as T
}
