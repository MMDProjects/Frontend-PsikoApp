import { ScrollView, View } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useQueryClient } from '@tanstack/react-query'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { Button } from '@/core/components/atoms/Button'
import { Icon } from '@/core/components/atoms/Icon'
import { Text } from '@/core/components/atoms/Text'
import { ScreenTitle } from '@/core/components/molecules/ScreenTitle'
import { assessmentKeys, AssessmentResultCard } from '@/domains/assessment'

import type { AssessmentResult } from '@/domains/assessment'

export default function AssessmentResultScreen() {
  const { resultId } = useLocalSearchParams<{ resultId: string }>()
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const queryClient = useQueryClient()

  const result = queryClient.getQueryData<AssessmentResult>(assessmentKeys.result(resultId ?? ''))

  if (!result) {
    return (
      <View className="flex-1 items-center justify-center bg-surface-base dark:bg-dark-bg px-5 gap-4">
        <Icon name="AlertCircle" size={48} color="#737373" />
        <Text variant="heading" className="text-center">Sonuç bulunamadı</Text>
        <Button label="Teste Dön" onPress={() => router.replace('/assessment')} variant="ghost" />
      </View>
    )
  }

  return (
    <ScrollView
      className="flex-1 bg-surface-base dark:bg-dark-bg"
      contentContainerClassName="px-5 pb-12"
      contentContainerStyle={{ paddingTop: insets.top + 8 }}
      showsVerticalScrollIndicator={false}
    >
      <ScreenTitle title="Değerlendirme Tamamlandı" className="mb-3" />

      <AssessmentResultCard
        result={result}
        onFindExpert={() => router.push('/(tabs)/explore')}
        onRetake={() => router.replace('/assessment')}
      />
    </ScrollView>
  )
}
