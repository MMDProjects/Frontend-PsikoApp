import { View } from 'react-native'

import { Avatar } from '@/core/components/atoms/Avatar'
import { Chip } from '@/core/components/atoms/Chip'
import { Icon } from '@/core/components/atoms/Icon'
import { Text } from '@/core/components/atoms/Text'
import { cn } from '@/core/utils/cn'
import { formatDate } from '@/core/utils/formatDate'
import { AssessmentResultSummary } from '@/domains/assessment'

import { LISTING_STATUS_CONFIG, SESSION_TYPE_LABELS } from '../listing.constants'

import type { Listing } from '../types/listing.types'

export type ListingDetailProps = {
  listing: Listing
  viewerRole: 'expert' | 'client'
  className?: string
}

export function ListingDetail({ listing, viewerRole, className }: ListingDetailProps) {
  const statusConfig = LISTING_STATUS_CONFIG[listing.status]

  const createdDate = formatDate(listing.createdAt, 'long')

  const clientInitials = listing.client?.initials ?? '?'

  const clientName = viewerRole === 'expert'
    ? (listing.clientDisplayName ?? 'Danışan')
    : (listing.client?.fullName ?? 'Danışan')

  const sessionLabel = SESSION_TYPE_LABELS[listing.preferredSessionType] ?? listing.preferredSessionType

  return (
    <View className={cn('', className)}>

      <View className="px-4 py-5 gap-4">
        <View className="flex-row items-center gap-3">
          <Avatar
            size="lg"
            initials={clientInitials}
            src={listing.client?.avatarUrl ?? undefined}
          />
          <View className="flex-1">
            <Text variant="subheading" className="font-semibold leading-tight">{clientName}</Text>
          </View>
        </View>

        <Text variant="subheading" className="leading-snug">{listing.title}</Text>

        <View className="flex-row flex-wrap items-center gap-3">
          <View className="flex-row items-center gap-1.5">
            <Icon name={statusConfig.icon} size={13} color={statusConfig.iconColor} />
            <Text variant="caption" style={{ color: statusConfig.iconColor }}>{statusConfig.label}</Text>
          </View>
          {listing.city ? (
            <View className="flex-row items-center gap-1.5">
              <Icon name="MapPin" size={13} color="#A3A3A3" />
              <Text variant="caption" color="tertiary">{listing.city}</Text>
            </View>
          ) : null}
        </View>
      </View>

      <View className="mx-4 h-px bg-neutral-200 dark:bg-neutral-800" />
      <View className="px-4 py-5 gap-5">
        {listing.description ? (
          <View className="gap-2">
            <Text variant="caption" color="secondary" className="font-semibold uppercase tracking-widest">
              İlan Detayı
            </Text>
            <Text variant="body" color="secondary" className="leading-relaxed">
              {listing.description}
            </Text>
          </View>
        ) : null}

        <View className="gap-2.5">
          <Text variant="caption" color="secondary" className="font-semibold uppercase tracking-widest">
            Aranan Uzmanlık
          </Text>
          <View className="flex-row flex-wrap gap-1.5">
            {listing.specialization.map((spec) => (
              <Chip key={spec} label={spec} variant="filter" isSelected />
            ))}
          </View>
        </View>

        <View className="gap-2">
          <Text variant="caption" color="secondary" className="font-semibold uppercase tracking-widest">
            Seans Tipi
          </Text>
          <View className="flex-row">
            <Chip label={sessionLabel} variant="session" isSelected />
          </View>
        </View>

        <View className="gap-2">
          <Text variant="caption" color="secondary" className="font-semibold uppercase tracking-widest">
            Fiyat Aralığı
          </Text>
          <View className="flex-row">
            <Chip label={listing.budgetLabel} variant="tag" isSelected />
          </View>
        </View>
      </View>

      <View className="mx-4 h-px bg-neutral-200 dark:bg-neutral-800" />
      <View className="px-4 py-5 gap-3">
        <Text variant="caption" color="secondary" className="font-semibold uppercase tracking-widest">
          Danışan Hakkında
        </Text>
        <View className="flex-row items-center gap-3">
          <Avatar
            size="sm"
            initials={clientInitials}
            src={listing.client?.avatarUrl ?? undefined}
          />
          <Text variant="label" className="font-medium">{clientName}</Text>
        </View>
        <View className="gap-1">
          {listing.client?.createdAt ? (
            <Text variant="caption" color="secondary">
              {formatDate(listing.client.createdAt, 'long')} tarihinde kayıt oldu.
            </Text>
          ) : null}
          <Text variant="caption" color="secondary">
            {createdDate} tarihinde ilan oluşturdu.
          </Text>
        </View>
      </View>

      {listing.assessmentResult ? (
        <>
          <View className="mx-4 h-px bg-neutral-200 dark:bg-neutral-800" />
          <AssessmentResultSummary result={listing.assessmentResult} />
        </>
      ) : null}

    </View>
  )
}
