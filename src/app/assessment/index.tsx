import { useState } from 'react'
import { Pressable, ScrollView, useColorScheme, View } from 'react-native'
import { useRouter } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { Button } from '@/core/components/atoms/Button'
import { Icon } from '@/core/components/atoms/Icon'
import { Skeleton, SkeletonGroup } from '@/core/components/atoms/Skeleton'
import { Text } from '@/core/components/atoms/Text'
import { BackButton } from '@/core/components/molecules/BackButton'
import { EmptyState } from '@/core/components/molecules/EmptyState'
import { ScreenTitle } from '@/core/components/molecules/ScreenTitle'
import { useAssessmentQuery, useSubmitAssessmentMutation, useAssessmentEngine } from '@/domains/assessment'

export default function AssessmentScreen() {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const isDark = useColorScheme() === 'dark'
  const { data: assessment, isLoading, isError } = useAssessmentQuery()
  const { mutate: submit, isPending } = useSubmitAssessmentMutation()
  const [started, setStarted] = useState(false)

  const engine = useAssessmentEngine(assessment)
  const {
    currentQuestion,
    currentAnswer,
    answers,
    progress,
    isFirst,
    isLast,
    canProceed,
    selectOption,
    goNext,
    goPrev,
    currentIndex,
  } = engine

  const handleNext = () => {
    if (isLast) {
      if (!assessment) return
      submit(
        { assessmentId: assessment.id, answers },
        {
          onSuccess: (result) => {
            router.replace(`/assessment/result?resultId=${result.id}`)
          },
        }
      )
    } else {
      goNext()
    }
  }

  if (!started) {
    return (
      <View className="flex-1 bg-surface-base dark:bg-dark-bg">
        <BackButton />
        <ScreenTitle title="Değerlendirme Testi" topInset />

        <View className="flex-1 px-5 justify-center gap-8">
        {isLoading ? (
          <SkeletonGroup gap="lg" className="items-center">
            <Skeleton variant="circle" width={64} height={64} />
            <Skeleton variant="line" width="60%" height={24} />
            <Skeleton variant="line" width="80%" height={16} />
          </SkeletonGroup>
        ) : isError || !assessment ? (
          <EmptyState
            icon="AlertCircle"
            title="Test yüklenemedi"
            description="Lütfen daha sonra tekrar deneyin."
          />
        ) : (
          <>
            <View className="items-center gap-4">
              <View className="w-16 h-16 rounded-full bg-sky-50 dark:bg-sky-950 items-center justify-center">
                <Icon name="Brain" size={32} color="#0EA5E9" />
              </View>
              <View className="items-center gap-2">
                <Text variant="heading" className="text-center">{assessment.title}</Text>
                <Text variant="body" color="secondary" className="text-center">
                  {assessment.description}
                </Text>
              </View>
              <View className="flex-row items-center gap-4">
                <View className="flex-row items-center gap-1.5">
                  <Icon name="HelpCircle" size={14} color="#737373" />
                  <Text variant="caption" color="secondary">
                    {assessment.questions.length} soru
                  </Text>
                </View>
                <View className="flex-row items-center gap-1.5">
                  <Icon name="Clock" size={14} color="#737373" />
                  <Text variant="caption" color="secondary">
                    ~{assessment.estimatedMinutes} dakika
                  </Text>
                </View>
              </View>
            </View>
            <View className="bg-sky-50 dark:bg-sky-950 border border-sky-100 dark:border-sky-800 rounded-xl px-4 py-3 flex-row items-start gap-3">
              <Icon name="Info" size={16} color="#0369A1" />
              <Text variant="caption" className="text-sky-700 dark:text-sky-400 flex-1">
                Bu test tanı koymaz. Sonuçlar bilgilendirme amaçlıdır. Ücretsiz, kayıt gerektirmez.
              </Text>
            </View>
            <Button label="Testi Başlat" onPress={() => setStarted(true)} />
          </>
        )}
        </View>
      </View>
    )
  }

  return (
    <View className="flex-1 bg-surface-base dark:bg-dark-bg" style={{ paddingTop: insets.top }}>
      {/* Progress bar */}
      <View className="h-1 bg-neutral-100 dark:bg-dark-control">
        <View className="h-full bg-sky-500" style={{ width: `${progress * 100}%` }} />
      </View>

      <View className="flex-row items-center justify-between px-5 pt-4 pb-2">
        <Pressable onPress={goPrev} disabled={isFirst}>
          <Icon name="ArrowLeft" size={20} color={isFirst ? '#D4D4D4' : isDark ? '#F5F5F7' : '#171717'} />
        </Pressable>
        <Text variant="caption" color="secondary">
          {currentIndex + 1} / {assessment?.questions.length}
        </Text>
        <View style={{ width: 20 }} />
      </View>

      <ScrollView contentContainerClassName="px-5 py-4 gap-6" showsVerticalScrollIndicator={false}>
        {currentQuestion && (
          <>
            <Text variant="subheading" className="leading-relaxed">{currentQuestion.text}</Text>

            <View className="gap-3">
              {currentQuestion.options.map((option) => {
                const isSelected = currentAnswer?.values.includes(option.value) ?? false
                return (
                  <Pressable
                    key={option.id}
                    onPress={() => selectOption(option.value)}
                    className={`rounded-xl px-4 py-4 border ${
                      isSelected
                        ? 'bg-sky-50 dark:bg-sky-950 border-sky-300 dark:border-sky-700'
                        : 'bg-white dark:bg-dark-card border-neutral-200 dark:border-dark-border active:bg-neutral-50 dark:active:bg-dark-elevated'
                    }`}
                  >
                    <View className="flex-row items-center gap-3">
                      <View className={`w-5 h-5 rounded-full border-2 items-center justify-center ${
                        isSelected ? 'border-sky-500 bg-sky-500' : 'border-neutral-300 dark:border-neutral-600'
                      }`}>
                        {isSelected && <View className="w-2.5 h-2.5 rounded-full bg-white" />}
                      </View>
                      <Text variant="body" className={isSelected ? 'text-sky-700 dark:text-sky-400' : ''}>
                        {option.text}
                      </Text>
                    </View>
                  </Pressable>
                )
              })}
            </View>
          </>
        )}

        <Button
          label={isLast ? (isPending ? 'Hesaplanıyor...' : 'Sonuçları Gör') : 'Sonraki'}
          onPress={handleNext}
          isDisabled={!canProceed}
          isLoading={isPending && isLast}
        />
      </ScrollView>
    </View>
  )
}
