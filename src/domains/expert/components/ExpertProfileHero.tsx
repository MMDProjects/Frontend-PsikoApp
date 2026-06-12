import { View } from 'react-native'

import { Avatar } from '@/core/components/atoms/Avatar'
import { Text } from '@/core/components/atoms/Text'
import { Chip } from '@/core/components/atoms/Chip'
import { RatingRow } from '@/core/components/molecules/RatingRow'
import { cn } from '@/core/utils/cn'

import type { Expert } from '../types/expert.types'

export type ExpertProfileHeroProps = {
  expert: Expert
  className?: string
}

export function ExpertProfileHero({ expert, className }: ExpertProfileHeroProps) {
  const initials = expert.name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <View className={cn('bg-white border border-neutral-100 rounded-2xl p-5 gap-4', className)}>
      {/* Avatar + isim + ünvan */}
      <View className="flex-row items-center gap-4">
        <Avatar
          size="xl"
          src={expert.avatarUrl ?? undefined}
          initials={initials}
          isVerified={expert.isVerified}
        />

        <View className="flex-1 gap-1">
          <Text variant="subheading">{expert.name}</Text>
          <Text variant="body" color="secondary">{expert.title}</Text>

          <View className="flex-row items-center gap-2 mt-1">
            <RatingRow
              rating={expert.rating}
              reviewCount={expert.reviewCount}
              size="sm"
            />
          </View>
        </View>
      </View>

      {/* Uzmanlık chip'leri */}
      {expert.specializations.length > 0 && (
        <View className="flex-row flex-wrap gap-2">
          {expert.specializations.slice(0, 5).map((spec) => (
            <Chip key={spec} label={spec} variant="filter" isSelected />
          ))}
          {expert.specializations.length > 5 && (
            <Chip
              label={`+${expert.specializations.length - 5}`}
              variant="filter"
            />
          )}
        </View>
      )}

      {/* İstatistik şeridi */}
      <View className="flex-row border-t border-neutral-100 pt-4 gap-0">
        <StatPill value={`${expert.experienceYears} yıl`} label="Deneyim" />
        <View className="w-px bg-neutral-100 mx-3" />
        <StatPill value={expert.reviewCount.toString()} label="Değerlendirme" />
        <View className="w-px bg-neutral-100 mx-3" />
        <StatPill value={expert.rating.toFixed(1)} label="Puan" />
      </View>
    </View>
  )
}

type StatPillProps = { value: string; label: string }

function StatPill({ value, label }: StatPillProps) {
  return (
    <View className="flex-1 items-center gap-0.5">
      <Text variant="subheading" className="text-sky-600">{value}</Text>
      <Text variant="caption" color="tertiary">{label}</Text>
    </View>
  )
}
