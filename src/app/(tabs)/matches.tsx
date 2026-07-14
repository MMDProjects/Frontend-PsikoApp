import { useState } from 'react'
import { FlatList, Pressable, View } from 'react-native'
import { useRouter } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { Avatar } from '@/core/components/atoms/Avatar'
import { Chip } from '@/core/components/atoms/Chip'
import { Icon } from '@/core/components/atoms/Icon'
import { Skeleton } from '@/core/components/atoms/Skeleton'
import { Text } from '@/core/components/atoms/Text'
import { EmptyState } from '@/core/components/molecules/EmptyState'
import { HeaderActions } from '@/core/components/molecules/HeaderActions'
import { SegmentedControl } from '@/core/components/molecules/SegmentedControl'
import { useAuthStore } from '@/domains/auth'
import { useMatchesQuery, MATCH_STATUS_CONFIG } from '@/domains/match'

import type { Match } from '@/domains/match'

type MatchTab = 'active' | 'past'

const TR_MONTHS = ['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran','Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık']
function formatShortDate(iso: string): string {
  const d = new Date(iso)
  return `${d.getDate()} ${TR_MONTHS[d.getMonth()]}`
}

const SESSION_LABELS: Record<string, string> = {
  online:    'Online',
  yüz_yüze: 'Yüz yüze',
}

function MatchRow({ match, onPress, hideStatus, viewerRole }: {
  match: Match
  onPress: () => void
  hideStatus?: boolean
  viewerRole: 'expert' | 'client'
}) {
  const cfg = MATCH_STATUS_CONFIG[match.status]

  const isExpert = viewerRole === 'expert'

  const partyName = isExpert
    ? (match.client?.fullName ?? 'Danışan')
    : (match.expert?.name ?? 'Uzman')

  const shortName = partyName.split(' ').map((w: string, i: number) => i === 0 ? w : w[0] + '.').join(' ')
  const initials  = partyName.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase()

  const listing = match.listing
  const offer   = match.offer
  const specs   = listing?.specialization ?? []

  const dateLabel = formatShortDate(match.createdAt)

  return (
    <Pressable
      onPress={onPress}
      className="px-4 py-4 gap-3 active:opacity-90"
    >
      {/* Başlık + durum */}
      <View className="flex-row items-start justify-between gap-2">
        <Text variant="label" className="flex-1 font-semibold text-neutral-900 dark:text-[#F5F5F7] leading-snug">
          {listing?.title ?? 'İlan'}
        </Text>
        {!hideStatus && (
          <View className="flex-row items-center gap-1 shrink-0">
            <Icon name={cfg.icon} size={13} color={cfg.iconColor} />
            <Text variant="caption" className="font-medium" style={{ color: cfg.iconColor }}>
              {cfg.label}
            </Text>
          </View>
        )}
      </View>

      {/* Açıklama */}
      {listing?.description ? (
        <Text variant="caption" color="secondary" numberOfLines={2} className="-mt-1">
          {listing.description}
        </Text>
      ) : null}

      {/* Uzmanlık + fiyat + seans tipi */}
      {(specs.length > 0 || offer) && (
        <View className="flex-row flex-wrap gap-1.5">
          {specs.slice(0, 3).map((s) => (
            <Chip key={s} label={s} variant="filter" isSelected />
          ))}
          {specs.length > 3 && (
            <Chip label={`+${specs.length - 3}`} variant="filter" />
          )}
          {offer && (
            <>
              <Chip label={`₺${offer.price.toLocaleString('tr-TR')}`} variant="price" isSelected />
              <Chip label={SESSION_LABELS[offer.sessionType] ?? offer.sessionType} variant="session" isSelected />
            </>
          )}
        </View>
      )}

      {/* Alt satır: taraf adı (sol) + şehir + tarih (sağ) */}
      <View className="flex-row items-center justify-between pt-1">
        <View className="flex-row items-center gap-2">
          <Avatar size="xs" initials={initials} />
          <Text variant="caption" color="secondary">{shortName}</Text>
          {listing?.city ? (
            <>
              <Text variant="caption" color="tertiary">·</Text>
              <View className="flex-row items-center gap-1">
                <Icon name="MapPin" size={11} color="#A3A3A3" />
                <Text variant="caption" color="tertiary">{listing.city}</Text>
              </View>
            </>
          ) : null}
        </View>
        <Text variant="caption" color="tertiary">{dateLabel}</Text>
      </View>
    </Pressable>
  )
}

export default function MatchesScreen() {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const role = useAuthStore((s) => s.role)
  const isExpert = role === 'expert'
  const [tab, setTab] = useState<MatchTab>('active')

  const { data: matches, isLoading, isError, refetch } = useMatchesQuery()

  const all = matches ?? []
  const active  = all.filter((m) => m.status === 'ACTIVE')
  const past    = all.filter((m) => m.status === 'COMPLETED' || m.status === 'RELEASED')
  const displayed = tab === 'active' ? active : past

  return (
    <View className="flex-1 bg-surface-base dark:bg-dark-bg">
      <HeaderActions
        actions={
          isExpert
            ? [{ icon: 'Bell', accessibilityLabel: 'Bildirimler', onPress: () => router.push('/notifications' as never) }]
            : [
                { icon: 'Bell', accessibilityLabel: 'Bildirimler', onPress: () => router.push('/notifications' as never) },
                { icon: 'Plus', accessibilityLabel: 'Yeni İlan Oluştur', onPress: () => router.push('/listing/new' as never) },
              ]
        }
      />

      <FlatList
        data={(!isLoading && !isError) ? displayed : []}
        keyExtractor={(item) => item.id}
        contentContainerClassName="pb-6"
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => (
          <View className="mx-4 h-px bg-neutral-200 dark:bg-neutral-800" />
        )}
        ListHeaderComponent={
          <View className="px-4 pb-3" style={{ paddingTop: insets.top + 8 }}>
            <Text variant="heading" className="mb-3" style={{ paddingRight: isExpert ? 52 : 100 }}>Eşleşmelerim</Text>
            <SegmentedControl
              options={[
                { key: 'active', label: 'Aktif',  count: active.length },
                { key: 'past',   label: 'Geçmiş', count: past.length   },
              ]}
              value={tab}
              onChange={setTab}
            />
          </View>
        }
        ListEmptyComponent={
          isLoading ? (
            <View>
              {[1, 2].map((i) => (
                <View key={i}>
                  <View className="px-4 py-4 gap-3">
                    <Skeleton variant="line" width="70%" height={14} />
                    <Skeleton variant="line" width="45%" height={12} />
                  </View>
                  {i < 2 && <View className="mx-4 h-px bg-neutral-200 dark:bg-neutral-800" />}
                </View>
              ))}
            </View>
          ) : isError ? (
            <EmptyState icon="WifiOff" title="Yüklenemedi" ctaLabel="Tekrar Dene" onCta={refetch} />
          ) : (
            <EmptyState
              icon="Link"
              title={tab === 'active' ? 'Aktif eşleşme yok' : 'Geçmiş eşleşme yok'}
              description={
                tab === 'active'
                  ? (isExpert
                    ? "Fırsatlar sekmesinden ilanları inceleyin ve teklif gönderin."
                    : "İlanlarınıza gelen teklifleri kabul ettiğinizde eşleşmeler burada görünür.")
                  : ''
              }
              ctaLabel={tab === 'active' ? (isExpert ? "İlan Feed'ine Git" : "İlanlarıma Git") : undefined}
              onCta={tab === 'active' ? () => router.push((isExpert ? '/' : '/offers') as never) : undefined}
            />
          )
        }
        renderItem={({ item }) => (
          <MatchRow
            match={item}
            hideStatus={tab === 'active'}
            viewerRole={role ?? 'client'}
            onPress={() => router.push(`/match/${item.id}` as never)}
          />
        )}
      />
    </View>
  )
}
