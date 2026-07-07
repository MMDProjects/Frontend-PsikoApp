import { useState } from 'react'
import { Pressable, ScrollView, View } from 'react-native'
import { useRouter } from 'expo-router'
import { useColorScheme } from 'nativewind'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { Button } from '@/core/components/atoms/Button'
import { Icon } from '@/core/components/atoms/Icon'
import { Skeleton } from '@/core/components/atoms/Skeleton'
import { Text } from '@/core/components/atoms/Text'
import { EmptyState } from '@/core/components/molecules/EmptyState'
import { usePackagesQuery, PackagePicker } from '@/domains/payment'

export default function PackagesScreen() {
  const router = useRouter()
  const { colorScheme } = useColorScheme()
  const arrowColor = colorScheme === 'dark' ? '#F5F5F7' : '#171717'

  const { data: packages, isLoading, isError } = usePackagesQuery()
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const insets = useSafeAreaInsets()

  const selectedPkg = packages?.find((p) => p.id === selectedId)

  return (
    <View className="flex-1 bg-surface-base dark:bg-dark-bg">
      {/* Floating back button */}
      <Pressable
        onPress={() => router.back()}
        style={{ position: 'absolute', top: insets.top + 8, left: 16, zIndex: 10 }}
        className="w-10 h-10 rounded-full bg-white dark:bg-dark-card items-center justify-center active:bg-neutral-100 dark:active:bg-dark-elevated"
      >
        <Icon name="ArrowLeft" size={20} color={arrowColor} />
      </Pressable>

      {isLoading && (
        <ScrollView contentContainerStyle={{ paddingTop: insets.top + 8, paddingHorizontal: 16, paddingBottom: 20, gap: 16 }}>
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} variant="rect" height={120} borderRadius="xl" />
          ))}
        </ScrollView>
      )}

      {isError && (
        <EmptyState
          icon="AlertCircle"
          title="Paketler yüklenemedi"
          ctaLabel="Geri Dön"
          onCta={() => router.back()}
        />
      )}

      {packages && (
        <>
          <ScrollView contentContainerStyle={{ paddingTop: insets.top + 8, paddingHorizontal: 16, paddingBottom: 128 }} showsVerticalScrollIndicator={false}>
            <View className="pt-2 pb-3 items-center">
              <Text variant="label" className="font-semibold">Seans Paketleri</Text>
            </View>
            <Text variant="body" color="secondary" className="mb-4">
              Toplu paket alımında tasarruf edin. Paketler satın alımdan itibaren 6 ay geçerlidir.
            </Text>
            <PackagePicker
              packages={packages}
              selectedId={selectedId}
              onSelect={setSelectedId}
            />
          </ScrollView>

          {/* Sticky bottom */}
          <View className="absolute bottom-0 left-0 right-0 px-4 pb-8 pt-4 bg-white dark:bg-dark-card border-t border-neutral-100 dark:border-dark-border">
            <Button
              label={selectedPkg ? `₺${selectedPkg.price.toLocaleString('tr-TR')} — Devam Et` : 'Paket Seçin'}
              onPress={() => {
                if (selectedId) router.push(`/payment/checkout?packageId=${selectedId}`)
              }}
              isDisabled={!selectedId}
            />
          </View>
        </>
      )}
    </View>
  )
}
