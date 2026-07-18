import { Alert, Pressable, View } from 'react-native'
import { useRouter } from 'expo-router'

import { Avatar } from '@/core/components/atoms/Avatar'
import { Button } from '@/core/components/atoms/Button'
import { Chip } from '@/core/components/atoms/Chip'
import { Icon } from '@/core/components/atoms/Icon'
import { Text } from '@/core/components/atoms/Text'
import { cn } from '@/core/utils/cn'

import { OFFER_STATUS_CONFIG } from '../offer.constants'
import { useAcceptOfferMutation } from '../api/useAcceptOfferMutation'
import { useRejectOfferMutation } from '../api/useRejectOfferMutation'
import { useWithdrawOfferMutation } from '../api/useWithdrawOfferMutation'

import type { Offer } from '../types/offer.types'

export type OfferCardProps = {
  offer: Offer
  viewerRole: 'expert' | 'client'
  onAction?: () => void
  onViewExpert?: () => void
  className?: string
}

export function OfferCard({ offer, viewerRole, onAction, onViewExpert, className }: OfferCardProps) {
  const router = useRouter()
  const isClient = viewerRole === 'client'
  const isPending = offer.status === 'PENDING'
  const statusConfig = OFFER_STATUS_CONFIG[offer.status]

  const { mutate: accept, isPending: isAccepting } = useAcceptOfferMutation()
  const { mutate: reject, isPending: isRejecting } = useRejectOfferMutation()
  const { mutate: withdraw, isPending: isWithdrawing } = useWithdrawOfferMutation()

  const expertInitials = offer.expert?.initials ?? '?'

  return (
    <View className={cn('bg-white dark:bg-dark-card rounded-xl px-4 py-4 gap-3', className)}>
      <View className="flex-row items-center justify-between gap-3">
        <View className="flex-row items-center gap-3 flex-1">
          <Avatar
            size="sm"
            initials={expertInitials}
            src={offer.expert?.avatarUrl ?? undefined}
          />
          <View className="flex-1">
            <Text variant="label" className="font-semibold" numberOfLines={1}>
              {offer.expert?.name ?? '—'}
            </Text>
            {offer.expert?.title && (
              <Text variant="caption" color="secondary">{offer.expert.title}</Text>
            )}
            {!isClient && offer.listing?.title && (
              <Text variant="caption" color="tertiary" numberOfLines={1}>{offer.listing.title}</Text>
            )}
          </View>
        </View>
        <View className="items-end gap-1">
          <Chip
            label={`₺${offer.price.toLocaleString('tr-TR')}`}
            variant="price"
            isSelected
          />
          <View className="flex-row items-center gap-1">
            <Icon name={statusConfig.icon} size={13} color={statusConfig.iconColor} />
            <Text variant="caption" className="font-medium" style={{ color: statusConfig.iconColor }}>
              {statusConfig.label}
            </Text>
          </View>
        </View>
      </View>

      <View className="gap-1.5">
        <View className="flex-row items-center gap-1.5">
          <Icon name="Video" size={13} color="#737373" />
          <Text variant="caption" color="secondary">
            {offer.sessionType === 'online' ? 'Online' : 'Yüz Yüze'}
          </Text>
        </View>
        {offer.description ? (
          <Text variant="caption" color="secondary" numberOfLines={2}>{offer.description}</Text>
        ) : null}
      </View>

      {isClient && onViewExpert && (
        <Pressable
          onPress={onViewExpert}
          className="flex-row items-center justify-between bg-neutral-50 dark:bg-dark-elevated border border-neutral-100 dark:border-dark-border rounded-xl px-4 py-2.5 active:bg-neutral-100 dark:active:bg-dark-control"
        >
          <Text variant="caption" className="text-sky-700 font-semibold">Uzmanı İncele</Text>
          <Icon name="ChevronRight" size={14} color="#0284C7" />
        </Pressable>
      )}

      {isPending && isClient && (
        <View className="flex-row gap-3">
          <View className="flex-1">
            <Button
              label="Reddet"
              onPress={() => reject(offer.id, { onSuccess: onAction })}
              variant="ghost"
              size="sm"
              isDisabled={isAccepting || isRejecting}
              fullWidth
            />
          </View>
          <View className="flex-1">
            <Button
              label="Kabul Et"
              onPress={() =>
                Alert.alert(
                  'Teklifi Kabul Et',
                  'İletişim bilgileriniz uzman ile paylaşılacaktır. Devam etmek istiyor musunuz?',
                  [
                    { text: 'Vazgeç', style: 'cancel' },
                    { text: 'Kabul Et', onPress: () => accept(offer.id, { onSuccess: onAction }) },
                  ]
                )
              }
              size="sm"
              isLoading={isAccepting}
              isDisabled={isRejecting}
              fullWidth
            />
          </View>
        </View>
      )}

      {isPending && !isClient && (
        <Button
          label="Teklifi Geri Çek"
          onPress={() => withdraw(offer.id, { onSuccess: onAction })}
          variant="ghost"
          size="sm"
          isLoading={isWithdrawing}
          fullWidth
        />
      )}

      <Pressable
        onPress={() => router.push(`/offer/${offer.id}`)}
        className="flex-row items-center justify-end gap-1 active:opacity-70"
      >
        <Text variant="caption" className="text-sky-600 font-semibold">Detay</Text>
        <Icon name="ChevronRight" size={14} color="#0284C7" />
      </Pressable>
    </View>
  )
}
