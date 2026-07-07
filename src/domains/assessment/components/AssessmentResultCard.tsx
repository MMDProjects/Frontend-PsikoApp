import { useColorScheme, View } from 'react-native'

import { Badge } from '@/core/components/atoms/Badge'
import { Button } from '@/core/components/atoms/Button'
import { Icon } from '@/core/components/atoms/Icon'
import { Text } from '@/core/components/atoms/Text'
import { cn } from '@/core/utils/cn'

import { RESULT_LEVEL_CONFIG } from '../assessment.constants'

import type { AssessmentResult } from '../types/assessment.types'

export type AssessmentResultCardProps = {
  result: AssessmentResult
  onFindExpert?: () => void
  onRetake?: () => void
  className?: string
}

export function AssessmentResultCard({
  result,
  onFindExpert,
  onRetake,
  className,
}: AssessmentResultCardProps) {
  const levelConfig = RESULT_LEVEL_CONFIG[result.level]
  const isDark = useColorScheme() === 'dark'
  const iconColor = isDark ? '#A3A3A3' : '#404040'

  return (
    <View className={cn('gap-5', className)}>
      {/* Skor göstergesi */}
      <View className="items-center gap-3">
        <View className="w-20 h-20 rounded-full bg-sky-50 dark:bg-sky-950 border border-sky-200 dark:border-sky-800 items-center justify-center">
          <Text variant="heading" className="text-sky-700 dark:text-sky-400 text-3xl font-bold">
            {result.score}
          </Text>
        </View>
        <Badge
          label={`${levelConfig.label} Düzey`}
          variant={levelConfig.badgeVariant as 'sky' | 'sage' | 'warning' | 'error' | 'neutral'}
        />
      </View>

      {/* Özet */}
      <View className="bg-white dark:bg-dark-card border border-neutral-100 dark:border-dark-border rounded-2xl p-5 gap-2">
        <View className="flex-row items-center gap-2 mb-1">
          <Icon name="ClipboardList" size={16} color={iconColor} />
          <Text variant="label" className="font-semibold">Değerlendirme</Text>
        </View>
        <Text variant="body" color="secondary">{result.summary}</Text>
      </View>

      {/* Öneriler */}
      {result.suggestions.length > 0 && (
        <View className="bg-white dark:bg-dark-card border border-neutral-100 dark:border-dark-border rounded-2xl p-5 gap-3">
          <View className="flex-row items-center gap-2 mb-1">
            <Icon name="Lightbulb" size={16} color={iconColor} />
            <Text variant="label" className="font-semibold">Öneriler</Text>
          </View>
          {result.suggestions.map((suggestion, i) => (
            <View key={i} className="flex-row items-start gap-3">
              <View className="w-5 h-5 rounded-full bg-sky-50 dark:bg-sky-950 border border-sky-100 dark:border-sky-900 items-center justify-center mt-0.5 shrink-0">
                <Text variant="caption" className="text-sky-600 dark:text-sky-400 text-xs">{i + 1}</Text>
              </View>
              <Text variant="body" color="secondary" className="flex-1">{suggestion}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Uzman bul CTA */}
      <View className="bg-sky-50 dark:bg-sky-950 border border-sky-200 dark:border-sky-800 rounded-2xl p-5 gap-3">
        <View className="flex-row items-center gap-2">
          <Icon name="Heart" size={18} color={isDark ? '#38BDF8' : '#0369A1'} />
          <Text variant="label" className="text-sky-800 dark:text-sky-300 font-semibold">Profesyonel Destek</Text>
        </View>
        <Text variant="body" className="text-sky-700 dark:text-sky-400">
          Uzman bir psikologla çalışmak sonuçlarınızı iyileştirmenize yardımcı olabilir.
        </Text>
        {onFindExpert && (
          <Button label="Psikolog Bul" onPress={onFindExpert} variant="secondary" />
        )}
      </View>

      {onRetake && (
        <Button label="Testi Tekrar Yap" onPress={onRetake} variant="ghost" />
      )}
    </View>
  )
}
