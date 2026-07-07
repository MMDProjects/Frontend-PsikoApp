import { View } from 'react-native'

import { Avatar } from '@/core/components/atoms/Avatar'
import { Chip } from '@/core/components/atoms/Chip'
import { Icon } from '@/core/components/atoms/Icon'
import { Text } from '@/core/components/atoms/Text'
import { cn } from '@/core/utils/cn'
import { RESULT_LEVEL_CONFIG } from '@/domains/assessment'

import { LISTING_STATUS_CONFIG, SESSION_TYPE_LABELS } from '../listing.constants'
import { formatClientName } from '../utils/formatClientName'

import type { Listing } from '../types/listing.types'

export type ListingDetailProps = {
  listing: Listing
  viewerRole: 'expert' | 'client'
  className?: string
}

export function ListingDetail({ listing, viewerRole, className }: ListingDetailProps) {
  const statusConfig = LISTING_STATUS_CONFIG[listing.status]

  const createdDate = new Date(listing.createdAt).toLocaleDateString('tr-TR', {
    day: 'numeric', month: 'long', year: 'numeric',
  })

  const clientInitials = listing.client?.fullName
    .split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase() ?? '?'

  const clientName = viewerRole === 'expert' && listing.client
    ? formatClientName(listing.client.fullName)
    : (listing.client?.fullName ?? 'Danışan')

  const sessionLabel = SESSION_TYPE_LABELS[listing.preferredSessionType] ?? listing.preferredSessionType

  return (
    <View className={cn('', className)}>

      {/* ── Section 1: Danışan + İlan başlığı + Meta ───────────── */}
      <View className="px-4 py-5 gap-4">
        {/* Danışan satırı */}
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

        {/* İlan başlığı */}
        <Text variant="subheading" className="leading-snug">{listing.title}</Text>

        {/* Meta: durum + konum — yan yana, satır sonu flex-wrap */}
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

      {/* ── Section 2: İlan Detayı + Uzmanlık + Seans + Fiyat ── */}
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
            <Chip
              label={`₺${listing.budgetMin.toLocaleString('tr-TR')} – ₺${listing.budgetMax.toLocaleString('tr-TR')}`}
              variant="tag"
              isSelected
            />
          </View>
        </View>
      </View>

      {/* ── Section 3: Danışan Hakkında ───────────────────────── */}
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
              {new Date(listing.client.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })} tarihinde kayıt oldu.
            </Text>
          ) : null}
          <Text variant="caption" color="secondary">
            {createdDate} tarihinde ilan oluşturdu.
          </Text>
        </View>
      </View>

      {/* ── Section 4: Test Sonucu (varsa) ────────────────────── */}
      {listing.assessmentResult ? (() => {
        const result = listing.assessmentResult!
        const cfg = RESULT_LEVEL_CONFIG[result.level]
        const headerBg = result.level === 'low' ? '#F0FDF4' : result.level === 'moderate' ? '#FFFBEB' : '#FEF2F2'
        return (
          <>
            <View className="mx-4 h-px bg-neutral-200 dark:bg-neutral-800" />
            <View className="px-4 py-5 gap-3">
              <View className="flex-row items-center gap-1.5">
                <Text variant="caption" color="secondary" className="font-semibold uppercase tracking-widest">
                  Test Sonucu
                </Text>
                <Icon name="Paperclip" size={12} color="#A3A3A3" />
              </View>
              <View className="rounded-xl overflow-hidden border border-neutral-200">
                <View className="px-4 py-3 flex-row items-center justify-between" style={{ backgroundColor: headerBg }}>
                  <View className="flex-row items-center gap-2">
                    <Icon name="ClipboardList" size={14} color={cfg.color} />
                    <Text variant="label" className="font-semibold" style={{ color: cfg.color }}>
                      {result.assessmentTitle}
                    </Text>
                  </View>
                  <View className="flex-row items-center gap-2">
                    <View className="px-2 py-0.5 rounded-full" style={{ backgroundColor: cfg.color + '20' }}>
                      <Text variant="caption" className="font-semibold" style={{ color: cfg.color }}>
                        {cfg.label}
                      </Text>
                    </View>
                    <Text variant="caption" color="tertiary">Puan: {result.score}</Text>
                  </View>
                </View>
                <View className="px-4 pt-3 pb-3 bg-white">
                  <Text variant="caption" color="secondary" className="leading-relaxed">{result.summary}</Text>
                </View>
              </View>
            </View>
          </>
        )
      })() : null}

    </View>
  )
}
