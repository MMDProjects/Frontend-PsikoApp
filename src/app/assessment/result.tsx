import { ScrollView, View } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'

import { Button } from '@/core/components/atoms/Button'
import { Icon } from '@/core/components/atoms/Icon'
import { Text } from '@/core/components/atoms/Text'
import { assessmentKeys, RESULT_LEVEL_CONFIG } from '@/domains/assessment'
import { useQueryClient } from '@tanstack/react-query'

export default function AssessmentResultScreen() {
  const { resultId } = useLocalSearchParams<{ resultId: string }>()
  const router = useRouter()
  const queryClient = useQueryClient()

  const result = queryClient.getQueryData(assessmentKeys.result(resultId ?? ''))

  if (!result || typeof result !== 'object' || !('level' in result)) {
    return (
      <View className="flex-1 items-center justify-center bg-surface-base px-5 gap-4">
        <Icon name="AlertCircle" size={48} color="#737373" />
        <Text variant="heading" className="text-center">Sonuç bulunamadı</Text>
        <Button label="Teste Dön" onPress={() => router.replace('/assessment')} variant="ghost" />
      </View>
    )
  }

  const typedResult = result as {
    score: number
    level: 'low' | 'moderate' | 'high'
    summary: string
    suggestions: string[]
  }

  const levelConfig = RESULT_LEVEL_CONFIG[typedResult.level]

  return (
    <ScrollView className="flex-1 bg-surface-base" contentContainerClassName="px-5 py-10 gap-6 pb-12">
      {/* Sonuç başlığı */}
      <View className="items-center gap-4">
        <View className="w-20 h-20 rounded-full bg-sky-50 items-center justify-center border-4 border-sky-100">
          <Text variant="heading" className="text-sky-700 text-2xl font-bold">
            {typedResult.score}
          </Text>
        </View>
        <View className="items-center gap-1">
          <Text variant="heading" className="text-center">Değerlendirme Tamamlandı</Text>
          <View className="flex-row items-center gap-1.5 px-4 py-1.5 rounded-full border"
            style={{ backgroundColor: `${levelConfig.color}15`, borderColor: `${levelConfig.color}40` }}>
            <View className="w-2 h-2 rounded-full" style={{ backgroundColor: levelConfig.color }} />
            <Text variant="caption" style={{ color: levelConfig.color }} className="font-semibold">
              {levelConfig.label} Düzey
            </Text>
          </View>
        </View>
      </View>

      {/* Özet */}
      <View className="bg-white border border-neutral-100 rounded-2xl p-5 gap-2">
        <Text variant="label" className="font-semibold">Değerlendirme</Text>
        <Text variant="body" color="secondary">{typedResult.summary}</Text>
      </View>

      {/* Öneriler */}
      {typedResult.suggestions.length > 0 && (
        <View className="bg-white border border-neutral-100 rounded-2xl p-5 gap-3">
          <Text variant="label" className="font-semibold">Öneriler</Text>
          {typedResult.suggestions.map((suggestion, i) => (
            <View key={i} className="flex-row items-start gap-3">
              <View className="w-5 h-5 rounded-full bg-sky-50 items-center justify-center mt-0.5 shrink-0">
                <Text variant="caption" className="text-sky-600 text-xs">{i + 1}</Text>
              </View>
              <Text variant="body" color="secondary" className="flex-1">{suggestion}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Uzman bul CTA */}
      <View className="bg-sky-50 border border-sky-200 rounded-2xl p-5 gap-3">
        <View className="flex-row items-center gap-2">
          <Icon name="Heart" size={18} color="#0369A1" />
          <Text variant="label" className="text-sky-800 font-semibold">Profesyonel Destek</Text>
        </View>
        <Text variant="body" className="text-sky-700">
          Uzman bir psikologla çalışmak sonuçlarınızı iyileştirmenize yardımcı olabilir.
        </Text>
        <Button
          label="Psikolog Bul"
          onPress={() => router.push('/(tabs)/explore')}
          variant="secondary"
        />
      </View>

      <Button
        label="Testi Tekrar Yap"
        onPress={() => router.replace('/assessment')}
        variant="ghost"
      />
    </ScrollView>
  )
}
