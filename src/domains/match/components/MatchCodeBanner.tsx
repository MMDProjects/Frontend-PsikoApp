import { Pressable, useColorScheme, View } from 'react-native'

import { Icon } from '@/core/components/atoms/Icon'
import { Text } from '@/core/components/atoms/Text'
import { cn } from '@/core/utils/cn'

import { MATCH_STATUS_CONFIG } from '../match.constants'

import type { Match } from '../types/match.types'

export type MatchCodeBannerProps = {
  match: Match
  onRelease?: () => void
  isReleasing?: boolean
  className?: string
}

export function MatchCodeBanner({ match, onRelease, isReleasing = false, className }: MatchCodeBannerProps) {
  const config = MATCH_STATUS_CONFIG[match.status]
  const isActive = match.status === 'ACTIVE'
  const isDark = useColorScheme() === 'dark'

  const otherPartyName = match.expert?.name ?? match.client?.fullName

  return (
    <View
      className={cn(
        'rounded-2xl px-4 py-4 gap-3',
        isActive
          ? 'bg-sky-50 dark:bg-sky-950 border border-sky-200 dark:border-sky-800'
          : 'bg-neutral-50 dark:bg-dark-elevated border border-neutral-200 dark:border-dark-border2',
        className
      )}
    >
      {/* Başlık satırı */}
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          <Icon
            name={isActive ? 'Link' : 'Unlink'}
            size={16}
            color={isActive ? (isDark ? '#38BDF8' : '#0369A1') : (isDark ? '#A3A3A3' : '#737373')}
          />
          <Text variant="label" className={isActive ? 'text-sky-800 dark:text-sky-300 font-semibold' : 'text-neutral-600 dark:text-neutral-400 font-semibold'}>
            Eşleşme Durumu
          </Text>
        </View>
        <View className="flex-row items-center gap-1">
          <Icon name={config.icon} size={13} color={config.iconColor} />
          <Text variant="caption" className="font-medium" style={{ color: config.iconColor }}>
            {config.label}
          </Text>
        </View>
      </View>

      {/* Diğer taraf bilgisi */}
      {otherPartyName && (
        <View className="flex-row items-center justify-between">
          <Text variant="caption" color="secondary">
            {match.expert ? 'Uzman' : 'Danışan'}
          </Text>
          <Text variant="label" className={isActive ? 'text-sky-700 dark:text-sky-400' : 'text-neutral-700 dark:text-neutral-300'}>
            {otherPartyName}
          </Text>
        </View>
      )}

      {match.expert?.title && (
        <View className="flex-row items-center justify-between">
          <Text variant="caption" color="tertiary">Ünvan</Text>
          <Text variant="caption" color="secondary">{match.expert.title}</Text>
        </View>
      )}

      {/* Eşleşmeyi sonlandır (ACTIVE) */}
      {isActive && onRelease && (
        <Pressable
          onPress={onRelease}
          disabled={isReleasing}
          className="flex-row items-center justify-center gap-2 border border-sky-200 dark:border-sky-800 rounded-xl py-2.5 active:bg-sky-100 dark:active:bg-sky-900"
        >
          <Icon name="Unlink" size={14} color={isDark ? '#38BDF8' : '#0369A1'} />
          <Text variant="caption" className="text-sky-700 dark:text-sky-400 font-semibold">
            {isReleasing ? 'İşleniyor...' : 'Eşleşmeyi Sonlandır'}
          </Text>
        </Pressable>
      )}
    </View>
  )
}
