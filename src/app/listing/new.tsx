import { Pressable, View } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useColorScheme } from 'nativewind'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { Icon } from '@/core/components/atoms/Icon'
import { Text } from '@/core/components/atoms/Text'
import { CreateListingForm, useCreateListingMutation } from '@/domains/listing'

import type { CreateListingRequest } from '@/domains/listing'

export default function NewListingScreen() {
  const router = useRouter()
  const { spec } = useLocalSearchParams<{ spec?: string }>()
  const { colorScheme } = useColorScheme()
  const arrowColor = colorScheme === 'dark' ? '#F5F5F7' : '#171717'
  const insets = useSafeAreaInsets()

  const { mutate: createListing, isPending, error } = useCreateListingMutation()

  const handleSubmit = (data: CreateListingRequest) => {
    createListing(data, {
      onSuccess: (response) => {
        router.replace(`/listing/${response.id}` as never)
      },
    })
  }

  const apiError = error instanceof Error ? error.message : undefined

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

      {/* Sayfa başlığı — sabit, form'un üstünde */}
      <View style={{ paddingTop: insets.top + 8 }} className="pb-3 items-center">
        <Text variant="label" className="font-semibold">İlan Oluştur</Text>
      </View>

      {apiError && (
        <View className="mx-4 mb-2 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-xl px-4 py-3">
          <Text variant="caption" color="error">{apiError}</Text>
        </View>
      )}

      <CreateListingForm
        onSubmit={handleSubmit}
        onCancel={() => router.back()}
        isLoading={isPending}
        initialSpecialization={spec ?? undefined}
      />
    </View>
  )
}
