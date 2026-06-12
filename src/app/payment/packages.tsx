import { useState } from 'react'
import { Pressable, ScrollView, View } from 'react-native'
import { useRouter } from 'expo-router'

import { Badge } from '@/core/components/atoms/Badge'
import { Icon } from '@/core/components/atoms/Icon'
import { Skeleton } from '@/core/components/atoms/Skeleton'
import { Text } from '@/core/components/atoms/Text'
import { Button } from '@/core/components/atoms/Button'
import { EmptyState } from '@/core/components/molecules/EmptyState'
import { usePackagesQuery } from '@/domains/payment'

import type { Package } from '@/domains/payment'

export default function PackagesScreen() {
  const router = useRouter()
  const { data: packages, isLoading, isError } = usePackagesQuery()
  const [selected, setSelected] = useState<string | null>(null)

  const selectedPkg = packages?.find((p) => p.id === selected)

  return (
    <View className="flex-1 bg-surface-base">
      {/* Header */}
      <View className="flex-row items-center px-4 pt-14 pb-3 border-b border-neutral-100 bg-white">
        <Pressable onPress={() => router.back()} className="p-2 -ml-2 rounded-full active:bg-neutral-100">
          <Icon name="ArrowLeft" size={22} color="#171717" />
        </Pressable>
        <Text variant="label" className="ml-2 font-semibold">Seans Paketleri</Text>
      </View>

      {isLoading && (
        <ScrollView contentContainerClassName="px-4 py-5 gap-4">
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
          <ScrollView contentContainerClassName="px-4 py-5 gap-3 pb-32" showsVerticalScrollIndicator={false}>
            <Text variant="body" color="secondary" className="mb-1">
              Toplu paket alımında tasarruf edin. Paketler satın alımdan itibaren 6 ay geçerlidir.
            </Text>
            {packages.map((pkg: Package) => {
              const isSelected = selected === pkg.id
              return (
                <Pressable
                  key={pkg.id}
                  onPress={() => setSelected(pkg.id)}
                  className={`rounded-2xl p-5 border gap-3 ${
                    isSelected
                      ? 'bg-sky-50 border-sky-300'
                      : 'bg-white border-neutral-100 active:bg-neutral-50'
                  }`}
                >
                  <View className="flex-row items-start justify-between">
                    <View className="gap-1">
                      <View className="flex-row items-center gap-2">
                        <Text variant="label" className={`font-semibold ${isSelected ? 'text-sky-800' : ''}`}>
                          {pkg.name}
                        </Text>
                        {pkg.isPopular && <Badge label="Popüler" variant="sky" />}
                      </View>
                      <Text variant="caption" color="secondary">
                        {pkg.sessionCount} seans · {pkg.validDays} gün geçerli
                      </Text>
                    </View>
                    <View className="items-end gap-0.5">
                      <Text variant="subheading" className={`font-bold ${isSelected ? 'text-sky-700' : ''}`}>
                        ₺{pkg.price.toLocaleString('tr-TR')}
                      </Text>
                      <View className="flex-row items-center gap-1">
                        <Text variant="caption" color="secondary" className="line-through">
                          ₺{(pkg.unitPrice * pkg.sessionCount).toLocaleString('tr-TR')}
                        </Text>
                        <Badge label={`%${pkg.discountPct}`} variant="sage" />
                      </View>
                    </View>
                  </View>
                  <View className="flex-row items-center gap-1.5">
                    <Icon
                      name="CheckCircle2"
                      size={14}
                      color={isSelected ? '#0369A1' : '#16A34A'}
                    />
                    <Text variant="caption" className={isSelected ? 'text-sky-700' : 'text-green-700'}>
                      Seans başı ₺{pkg.unitPrice.toLocaleString('tr-TR')}
                    </Text>
                  </View>
                </Pressable>
              )
            })}
          </ScrollView>

          {/* Sticky bottom */}
          <View className="absolute bottom-0 left-0 right-0 px-4 pb-8 pt-4 bg-white border-t border-neutral-100">
            <Button
              label={selectedPkg ? `₺${selectedPkg.price.toLocaleString('tr-TR')} — Devam Et` : 'Paket Seçin'}
              onPress={() => {
                if (selected) router.push(`/payment/checkout?packageId=${selected}`)
              }}
              isDisabled={!selected}
            />
          </View>
        </>
      )}
    </View>
  )
}
