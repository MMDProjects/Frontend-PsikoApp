import { View } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'

import { Text } from '@/core/components/atoms/Text'
import { BackButton } from '@/core/components/molecules/BackButton'
import { ScreenTitle } from '@/core/components/molecules/ScreenTitle'
import { CreateListingForm, useCreateListingMutation } from '@/domains/listing'

import type { CreateListingRequest } from '@/domains/listing'

export default function NewListingScreen() {
  const router = useRouter()
  const { spec } = useLocalSearchParams<{ spec?: string }>()

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
      <BackButton />

      {/* Sayfa başlığı — sabit, form'un üstünde */}
      <ScreenTitle title="İlan Oluştur" topInset />

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
