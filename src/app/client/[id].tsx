import { Pressable, ScrollView, View } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'

import { Avatar } from '@/core/components/atoms/Avatar'
import { Badge } from '@/core/components/atoms/Badge'
import { Icon } from '@/core/components/atoms/Icon'
import { Skeleton, SkeletonGroup } from '@/core/components/atoms/Skeleton'
import { Text } from '@/core/components/atoms/Text'
import { EmptyState } from '@/core/components/molecules/EmptyState'
import { useClientProfileQuery } from '@/domains/client'
import { MATCH_STATUS_CONFIG } from '@/domains/client'

export default function ClientDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()

  const { data: client, isLoading, isError } = useClientProfileQuery(id ?? '')

  return (
    <View className="flex-1 bg-surface-base">
      {/* Header */}
      <View className="flex-row items-center px-4 pt-14 pb-3 border-b border-neutral-100 bg-white">
        <Pressable
          onPress={() => router.back()}
          className="p-2 -ml-2 rounded-full active:bg-neutral-100"
        >
          <Icon name="ArrowLeft" size={22} color="#171717" />
        </Pressable>
        <Text variant="label" className="ml-2 font-semibold">Danışan Detayı</Text>
      </View>

      {isLoading && (
        <ScrollView contentContainerClassName="px-4 py-5 gap-4">
          <View className="bg-white border border-neutral-100 rounded-2xl p-5 flex-row items-center gap-4">
            <Skeleton variant="circle" height={56} width={56} />
            <SkeletonGroup className="flex-1" gap="sm">
              <Skeleton variant="line" width="50%" height={16} />
              <Skeleton variant="line" width="65%" height={14} />
              <Skeleton variant="line" width="40%" height={14} />
            </SkeletonGroup>
          </View>
          <Skeleton variant="rect" height={80} borderRadius="xl" />
          <Skeleton variant="rect" height={120} borderRadius="xl" />
        </ScrollView>
      )}

      {isError && (
        <EmptyState
          icon="AlertCircle"
          title="Yüklenemedi"
          description="Danışan bilgileri alınamadı."
          ctaLabel="Geri Dön"
          onCta={() => router.back()}
        />
      )}

      {client && (
        <ScrollView
          contentContainerClassName="px-4 py-5 gap-4 pb-10"
          showsVerticalScrollIndicator={false}
        >
          {/* Profil kartı */}
          <View className="bg-white border border-neutral-100 rounded-2xl p-5 gap-4">
            <View className="flex-row items-center gap-4">
              <Avatar
                size="lg"
                initials={client.fullName.split(' ').map((w) => w[0]).join('').slice(0, 2)}
              />
              <View className="flex-1 gap-1">
                <Text variant="subheading">{client.fullName}</Text>
                {client.email && (
                  <Text variant="caption" color="secondary">{client.email}</Text>
                )}
                {client.phone && (
                  <Text variant="caption" color="secondary">{client.phone}</Text>
                )}
              </View>
            </View>

            {/* Eşleşme durumu */}
            <View className="flex-row items-center justify-between border-t border-neutral-100 pt-4">
              <Text variant="label" color="secondary">Eşleşme Durumu</Text>
              <Badge
                label={MATCH_STATUS_CONFIG[client.matchStatus].label}
                variant={MATCH_STATUS_CONFIG[client.matchStatus].variant}
              />
            </View>

            {client.matchCode && (
              <View className="flex-row items-center justify-between">
                <Text variant="label" color="secondary">Eşleşme Kodu</Text>
                <Text variant="label" className="font-mono text-sky-700">
                  {client.matchCode.slice(0, 8).toUpperCase()}
                </Text>
              </View>
            )}
          </View>

          {/* Dahili notlar */}
          {client.notes && (
            <View className="bg-white border border-neutral-100 rounded-2xl p-5 gap-2">
              <View className="flex-row items-center gap-2">
                <Icon name="FileText" size={16} color="#737373" />
                <Text variant="label" className="font-semibold">Notlar</Text>
              </View>
              <Text variant="body" color="secondary">{client.notes}</Text>
            </View>
          )}

          {/* Kayıt tipi bilgisi */}
          <View className="bg-sky-50 border border-sky-100 rounded-xl px-4 py-3 flex-row items-center gap-3">
            <Icon
              name={client.registrationType === 'invited' ? 'Mail' : 'UserPlus'}
              size={16}
              color="#0369A1"
            />
            <Text variant="caption" className="text-sky-700 flex-1">
              {client.registrationType === 'invited'
                ? 'Davet ile platforma katıldı'
                : 'Platforma kendisi kayıt oldu'}
            </Text>
          </View>

          {/* Teklif gönder */}
          {client.matchStatus === 'MATCHED' && (
            <Pressable
              onPress={() => router.push(`/offer/new?clientId=${id}`)}
              className="flex-row items-center justify-between bg-white border border-sky-200 rounded-2xl px-5 py-4 active:bg-sky-50"
            >
              <View className="flex-row items-center gap-3">
                <View className="w-10 h-10 rounded-full bg-sky-50 items-center justify-center">
                  <Icon name="Send" size={18} color="#0EA5E9" />
                </View>
                <View>
                  <Text variant="label" className="font-semibold">Teklif Gönder</Text>
                  <Text variant="caption" color="secondary">Yeni seans teklifi oluştur</Text>
                </View>
              </View>
              <Icon name="ChevronRight" size={18} color="#A3A3A3" />
            </Pressable>
          )}
        </ScrollView>
      )}
    </View>
  )
}
