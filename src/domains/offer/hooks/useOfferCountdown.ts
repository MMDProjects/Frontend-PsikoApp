import { useState, useEffect, useCallback } from 'react'

type UseOfferCountdownReturn = {
  remainingSeconds: number
  currentTier: number
  isExpired: boolean
  resetTimer: () => void
}

type UseOfferCountdownParams = {
  tierCount: number
  tierDurationHours: number
  sentAt: string | null
}

function calculateRemainingSeconds(sentAt: string | null, tierDurationHours: number): number {
  if (!sentAt) return 0
  const tierMs = tierDurationHours * 60 * 60 * 1000
  const elapsed = Date.now() - new Date(sentAt).getTime()
  return Math.max(0, Math.floor((tierMs - elapsed) / 1000))
}

export function useOfferCountdown({
  tierCount,
  tierDurationHours,
  sentAt,
}: UseOfferCountdownParams): UseOfferCountdownReturn {
  const [remainingSeconds, setRemainingSeconds] = useState(
    () => calculateRemainingSeconds(sentAt, tierDurationHours)
  )

  useEffect(() => {
    const interval = setInterval(() => {
      setRemainingSeconds(calculateRemainingSeconds(sentAt, tierDurationHours))
    }, 1000)
    return () => clearInterval(interval)
  }, [sentAt, tierDurationHours])

  const resetTimer = useCallback(() => {
    setRemainingSeconds(tierDurationHours * 60 * 60)
  }, [tierDurationHours])

  const tierTotalSeconds = tierDurationHours * 60 * 60
  const elapsed = tierTotalSeconds - remainingSeconds
  const currentTier = Math.min(
    Math.floor(elapsed / (tierTotalSeconds / Math.max(tierCount, 1))),
    tierCount - 1
  )

  return {
    remainingSeconds,
    currentTier: Math.max(0, currentTier),
    isExpired: remainingSeconds === 0,
    resetTimer,
  }
}
