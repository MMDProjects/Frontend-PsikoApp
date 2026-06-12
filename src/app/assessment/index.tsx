import { useState } from 'react'
import { Pressable, ScrollView, View } from 'react-native'
import { useRouter } from 'expo-router'

import { Button } from '@/core/components/atoms/Button'
import { Icon } from '@/core/components/atoms/Icon'
import { Skeleton, SkeletonGroup } from '@/core/components/atoms/Skeleton'
import { Text } from '@/core/components/atoms/Text'
import { EmptyState } from '@/core/components/molecules/EmptyState'
import { useAssessmentQuery, useSubmitAssessmentMutation } from '@/domains/assessment'

import type { AssessmentAnswer } from '@/domains/assessment'

// Assessment auth gerektirmez — (auth) grubunun dışındadır.
export default function AssessmentScreen() {
  const router = useRouter()
  const { data: assessment, isLoading, isError } = useAssessmentQuery()
  const { mutate: submit, isPending } = useSubmitAssessmentMutation()

  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<AssessmentAnswer[]>([])
  const [started, setStarted] = useState(false)

  const question = assessment?.questions[currentIndex]
  const progress = assessment ? (currentIndex / assessment.questions.length) : 0
  const isLast = assessment ? currentIndex === assessment.questions.length - 1 : false

  const currentAnswer = answers.find((a) => a.questionId === question?.id)

  const selectOption = (value: number) => {
    if (!question) return
    if (question.type === 'multiple_choice') {
      const existing = currentAnswer?.values ?? []
      const updated = existing.includes(value)
        ? existing.filter((v) => v !== value)
        : [...existing, value]
      setAnswers((prev) => {
        const filtered = prev.filter((a) => a.questionId !== question.id)
        return [...filtered, { questionId: question.id, values: updated }]
      })
    } else {
      setAnswers((prev) => {
        const filtered = prev.filter((a) => a.questionId !== question.id)
        return [...filtered, { questionId: question.id, values: [value] }]
      })
    }
  }

  const canProceed = Boolean(currentAnswer && currentAnswer.values.length > 0)

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
      setCurrentIndex((i) => i + 1)
    }
  }

  if (!started) {
    return (
      <View className="flex-1 bg-surface-base px-5 justify-center gap-8">
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
              <View className="w-16 h-16 rounded-full bg-sky-50 items-center justify-center">
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
            <View className="bg-sky-50 border border-sky-100 rounded-xl px-4 py-3 flex-row items-start gap-3">
              <Icon name="Info" size={16} color="#0369A1" />
              <Text variant="caption" className="text-sky-700 flex-1">
                Bu test tanı koymaz. Sonuçlar bilgilendirme amaçlıdır. Ücretsiz, kayıt gerektirmez.
              </Text>
            </View>
            <Button label="Testi Başlat" onPress={() => setStarted(true)} />
          </>
        )}
      </View>
    )
  }

  return (
    <View className="flex-1 bg-surface-base">
      {/* Progress bar */}
      <View className="h-1 bg-neutral-100">
        <View
          className="h-full bg-sky-500"
          style={{ width: `${progress * 100}%` }}
        />
      </View>

      <View className="flex-row items-center justify-between px-5 pt-4 pb-2">
        <Pressable onPress={() => setCurrentIndex((i) => Math.max(0, i - 1))} disabled={currentIndex === 0}>
          <Icon name="ArrowLeft" size={20} color={currentIndex === 0 ? '#D4D4D4' : '#171717'} />
        </Pressable>
        <Text variant="caption" color="secondary">
          {currentIndex + 1} / {assessment?.questions.length}
        </Text>
        <View style={{ width: 20 }} />
      </View>

      <ScrollView contentContainerClassName="px-5 py-4 gap-6" showsVerticalScrollIndicator={false}>
        {question && (
          <>
            <Text variant="subheading" className="leading-relaxed">{question.text}</Text>

            <View className="gap-3">
              {question.options.map((option) => {
                const isSelected = currentAnswer?.values.includes(option.value) ?? false
                return (
                  <Pressable
                    key={option.id}
                    onPress={() => selectOption(option.value)}
                    className={`rounded-xl px-4 py-4 border ${
                      isSelected
                        ? 'bg-sky-50 border-sky-300'
                        : 'bg-white border-neutral-200 active:bg-neutral-50'
                    }`}
                  >
                    <View className="flex-row items-center gap-3">
                      <View className={`w-5 h-5 rounded-full border-2 items-center justify-center ${
                        isSelected ? 'border-sky-500 bg-sky-500' : 'border-neutral-300'
                      }`}>
                        {isSelected && <View className="w-2.5 h-2.5 rounded-full bg-white" />}
                      </View>
                      <Text variant="body" className={isSelected ? 'text-sky-700' : ''}>
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
