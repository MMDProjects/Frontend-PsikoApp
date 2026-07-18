import { View } from 'react-native'

import { Icon } from '@/core/components/atoms/Icon'
import { Text } from '@/core/components/atoms/Text'
import { useThemeColors } from '@/core/theme'

import { RESULT_LEVEL_CONFIG } from '../assessment.constants'

export type AssessmentResultSummaryProps = {
  result: {
    level: keyof typeof RESULT_LEVEL_CONFIG
    assessmentTitle: string
    score: number
    summary: string
  }
}

export function AssessmentResultSummary({ result }: AssessmentResultSummaryProps) {
  const colors = useThemeColors()
  const cfg = RESULT_LEVEL_CONFIG[result.level]

  return (
    <View className="px-4 py-5 gap-3">
      <View className="flex-row items-center gap-1.5">
        <Text variant="caption" color="secondary" className="font-semibold uppercase tracking-widest">
          Test Sonucu
        </Text>
        <Icon name="Paperclip" size={12} color={colors.contentDisabled} />
      </View>
      <View className="rounded-xl overflow-hidden border border-neutral-200">
        {/* REASON: statü rengi ve pastel zemin RESULT_LEVEL_CONFIG'ten dinamik gelir, statik class üretilemez */}
        <View className="px-4 py-3 flex-row items-center justify-between" style={{ backgroundColor: cfg.headerBg }}>
          <View className="flex-row items-center gap-2">
            <Icon name="ClipboardList" size={14} color={cfg.color} />
            <Text variant="label" className="font-semibold" style={{ color: cfg.color }}>
              {result.assessmentTitle}
            </Text>
          </View>
          <View className="flex-row items-center gap-2">
            <View className="px-2 py-0.5 rounded-full" style={{ backgroundColor: cfg.color + '20' }}>
              <Text variant="caption" className="font-semibold" style={{ color: cfg.color }}>
                {cfg.label}
              </Text>
            </View>
            <Text variant="caption" color="tertiary">Puan: {result.score}</Text>
          </View>
        </View>
        <View className="px-4 pt-3 pb-3 bg-white">
          <Text variant="caption" color="secondary" className="leading-relaxed">{result.summary}</Text>
        </View>
      </View>
    </View>
  )
}
