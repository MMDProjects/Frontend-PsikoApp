import { Pressable, View } from 'react-native'

import { Avatar } from '@/core/components/atoms/Avatar'
import { Chip } from '@/core/components/atoms/Chip'
import { Icon } from '@/core/components/atoms/Icon'
import { Text } from '@/core/components/atoms/Text'
import { cn } from '@/core/utils/cn'

import { LISTING_STATUS_CONFIG, SESSION_TYPE_LABELS } from '../listing.constants'
import { formatClientName } from '../utils/formatClientName'

import type { Listing } from '../types/listing.types'

const TR_MONTHS = ['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran','Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık']

function formatShortDate(iso: string): string {
  const d = new Date(iso)
  return `${d.getDate()} ${TR_MONTHS[d.getMonth()]}`
}

export type ListingCardProps = {
  listing: Listing
  viewerRole: 'expert' | 'client'
  onPress: () => void
  onClose?: () => void
  hideStatus?: boolean
  className?: string
}

export function ListingCard({
  listing,
  viewerRole,
  onPress,
  onClose,
  hideStatus = false,
  className,
}: ListingCardProps) {
  const statusConfig = LISTING_STATUS_CONFIG[listing.status]
  const clientInitials = listing.client?.fullName
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() ?? '?'

  const priceLabel = listing.budgetMin === listing.budgetMax
    ? `₺${listing.budgetMin.toLocaleString('tr-TR')}`
    : `₺${listing.budgetMin.toLocaleString('tr-TR')} – ₺${listing.budgetMax.toLocaleString('tr-TR')}`

  const sessionLabel = SESSION_TYPE_LABELS[listing.preferredSessionType] ?? listing.preferredSessionType
  const dateLabel = formatShortDate(listing.createdAt)

  return (
    <Pressable
      onPress={onPress}
      className={cn('px-4 py-4 gap-3 active:opacity-90', className)}
    >
      {/* Başlık + durum */}
      <View className="flex-row items-start justify-between gap-2">
        <Text variant="label" className="flex-1 font-semibold text-neutral-900 dark:text-[#F5F5F7] leading-snug">
          {listing.title}
        </Text>
        {!hideStatus && (
          <View className="flex-row items-center gap-1 shrink-0">
            <Icon name={statusConfig.icon} size={13} color={statusConfig.iconColor} />
            <Text variant="caption" className="font-medium" style={{ color: statusConfig.iconColor }}>
              {statusConfig.label}
            </Text>
          </View>
        )}
      </View>

      {/* Açıklama */}
      {listing.description ? (
        <Text variant="caption" color="secondary" numberOfLines={2} className="-mt-1">
          {listing.description}
        </Text>
      ) : null}

      {/* Uzmanlık + fiyat + seans tipi — tek satırda akış */}
      <View className="flex-row flex-wrap gap-1.5">
        {listing.specialization.slice(0, 3).map((spec) => (
          <Chip key={spec} label={spec} variant="filter" isSelected />
        ))}
        {listing.specialization.length > 3 && (
          <Chip label={`+${listing.specialization.length - 3}`} variant="filter" />
        )}
        <Chip label={priceLabel} variant="tag" isSelected />
        <Chip label={sessionLabel} variant="session" isSelected />
      </View>

      {/* Alt satır: danışan adı (sol) + tarih (sağ) */}
      <View className="flex-row items-center justify-between pt-1">
        {listing.client ? (
          <View className="flex-row items-center gap-2 flex-1 mr-3">
            <Avatar size="xs" initials={clientInitials} src={listing.client.avatarUrl ?? undefined} />
            <Text variant="caption" color="secondary" numberOfLines={1}>
              {formatClientName(listing.client.fullName)}
            </Text>
          </View>
        ) : (
          <View className="flex-1" />
        )}
        <Text variant="caption" color="tertiary">{dateLabel}</Text>
      </View>
    </Pressable>
  )
}
