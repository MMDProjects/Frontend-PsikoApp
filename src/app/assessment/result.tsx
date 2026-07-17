import { ScrollView, View } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useQueryClient } from '@tanstack/react-query'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { DecorCircles } from '@/core/components/atoms/DecorCircles'
import { BackButton } from '@/core/components/molecules/BackButton'
import { EmptyState } from '@/core/components/molecules/EmptyState'
import { ScreenTitle } from '@/core/components/molecules/ScreenTitle'
import { BottomActionBar } from '@/core/components/organisms/BottomActionBar'
import { assessmentKeys, AssessmentResultCard } from '@/domains/assessment'

import type { AssessmentResult } from '@/domains/assessment'

export default function AssessmentResultScreen() {
  const { resultId } = useLocalSearchParams<{ resultId: string }>()
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const queryClient = useQueryClient()

  const result = queryClient.getQueryData<AssessmentResult>(assessmentKeys.result(resultId ?? ''))

  const bottomBarHeight = 56 + insets.bottom

  if (!result) {
    return (
      <View className="flex-1 bg-sky-500 dark:bg-sky-950" style={{ overflow: 'hidden' }}>
        <DecorCircles />
        <BackButton />
        <EmptyState
          icon="AlertCircle"
          title="Sonuç bulunamadı"
          ctaLabel="Teste Dön"
          onCta={() => router.replace('/assessment')}
        />
      </View>
    )
  }

  return (
    <View className="flex-1 bg-sky-500 dark:bg-sky-950" style={{ overflow: 'hidden' }}>
      <DecorCircles />

      <BackButton />

      <ScreenTitle title="Değerlendirme Tamamlandı" topInset titleClassName="text-white" />

      <ScrollView
        contentContainerClassName="px-5 gap-5"
        contentContainerStyle={{ paddingBottom: bottomBarHeight + 16 }}
        showsVerticalScrollIndicator={false}
      >
        <AssessmentResultCard result={result} />
      </ScrollView>

      <BottomActionBar
        actions={[
          { label: 'Testi Tekrar Yap', onPress: () => router.replace('/assessment'), variant: 'inverseGhost' },
          { label: 'Destek Al', onPress: () => router.push('/listing/new'), variant: 'inverse' },
        ]}
      />
    </View>
  )
}
