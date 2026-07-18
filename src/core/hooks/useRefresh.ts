import { useCallback, useRef, useState } from 'react'

type Refetchable = { refetch: () => Promise<unknown> }

type UseRefreshReturn = {
  isRefreshing: boolean
  onRefresh: () => void
}

export function useRefresh(...queries: Refetchable[]): UseRefreshReturn {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const queriesRef = useRef(queries)
  queriesRef.current = queries

  const onRefresh = useCallback(() => {
    setIsRefreshing(true)
    Promise.all(queriesRef.current.map((q) => q.refetch()))
      .catch(() => undefined)
      .finally(() => setIsRefreshing(false))
  }, [])

  return { isRefreshing, onRefresh }
}
