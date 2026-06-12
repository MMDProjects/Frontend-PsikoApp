import { Pressable, View } from 'react-native'

import { Badge } from '@/core/components/atoms/Badge'
import { Icon } from '@/core/components/atoms/Icon'
import { Text } from '@/core/components/atoms/Text'

import { MATCH_STATE_CONFIG } from '../match.constants'

import type { MatchState } from '../types/match.types'

type MatchCodeBannerProps = {
  state: MatchState
  matchCode?: string
  expiresAt?: string | null
  onRelease?: () => void
  isReleasing?: boolean
  className?: string
}

export function MatchCodeBanner({
  state,
  matchCode,
  expiresAt,
  onRelease,
  isReleasing = false,
  className,
}: MatchCodeBannerProps) {
  const config = MATCH_STATE_CONFIG[state]

  const isMatched = state === 'MATCHED'
  const isPending = state === 'PENDING'

  const containerStyle = isMatched
    ? 'bg-sky-50 border border-sky-200'
    : isPending
      ? 'bg-amber-50 border border-amber-200'
      : 'bg-neutral-50 border border-neutral-200'

  return (
    <View className={`rounded-2xl px-4 py-4 gap-3 ${containerStyle} ${className ?? ''}`}>
      {/* Başlık satırı */}
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          <Icon
            name={isMatched ? 'LinkIcon' : isPending ? 'Clock' : 'Unlink'}
            size={16}
            color={isMatched ? '#0369A1' : isPending ? '#D97706' : '#737373'}
          />
          <Text
            variant="label"
            className={
              isMatched
                ? 'text-sky-800 font-semibold'
                : isPending
                  ? 'text-amber-800 font-semibold'
                  : 'text-neutral-600 font-semibold'
            }
          >
            Eşleşme Durumu
          </Text>
        </View>
        <Badge label={config.label} variant={config.badgeVariant as 'sky' | 'warning' | 'neutral'} />
      </View>

      {/* Kod + süre */}
      {matchCode && (isMatched || isPending) && (
        <View className="flex-row items-center justify-between">
          <Text variant="caption" color="secondary">Kod</Text>
          <Text variant="label" className="font-mono text-sky-700 tracking-widest">
            {matchCode.slice(0, 8).toUpperCase()}
          </Text>
        </View>
      )}

      {isPending && expiresAt && (
        <View className="flex-row items-center gap-1.5">
          <Icon name="AlertCircle" size={13} color="#D97706" />
          <Text variant="caption" className="text-amber-700 flex-1">
            Danışanın onayı bekleniyor. 48 saat içinde onay gelmezse talep iptal edilir.
          </Text>
        </View>
      )}

      {/* Eşleşmeyi sonlandır */}
      {isMatched && onRelease && (
        <Pressable
          onPress={onRelease}
          disabled={isReleasing}
          className="flex-row items-center justify-center gap-2 border border-sky-200 rounded-xl py-2.5 active:bg-sky-100"
        >
          <Icon name="Unlink" size={14} color="#0369A1" />
          <Text variant="caption" className="text-sky-700 font-semibold">
            {isReleasing ? 'İşleniyor...' : 'Eşleşmeyi Sonlandır'}
          </Text>
        </Pressable>
      )}
    </View>
  )
}

export type { MatchCodeBannerProps }
