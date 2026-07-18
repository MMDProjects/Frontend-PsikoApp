import { Pressable, View } from 'react-native'

import { Icon } from '@/core/components/atoms/Icon'
import { Text } from '@/core/components/atoms/Text'
import { cn } from '@/core/utils/cn'
import { RESULT_LEVEL_CONFIG } from '@/domains/assessment'

import type { MyAssessmentResult } from '@/domains/assessment'

const ICON_ON_BRAND = '#FFFFFF'

export type CreateListingStepAssessmentProps = {
  title: string
  selectedSpecs: string[]
  budgetMin: string
  budgetMax: string
  results: MyAssessmentResult[]
  selectedResultId?: string
  onSelectResult: (id?: string) => void
}

export function CreateListingStepAssessment({
  title,
  selectedSpecs,
  budgetMin,
  budgetMax,
  results,
  selectedResultId,
  onSelectResult,
}: CreateListingStepAssessmentProps) {
  return (
    <View className="gap-5">
      <View className="gap-1">
        <Text variant="heading" className="text-white">Test Sonucu Ekle</Text>
        <Text variant="body" className="text-sky-100">
          Geçmiş test sonuçlarını ilanına ekleyerek uzmanlara daha fazla bilgi verebilirsin.
        </Text>
      </View>

      <View className="bg-sky-600 dark:bg-sky-900 rounded-xl px-4 py-4 gap-3">
        <Text variant="caption" className="text-sky-100 font-semibold uppercase tracking-widest">
          İlan Özeti
        </Text>
        <View className="gap-1.5">
          <View className="flex-row gap-2">
            <Icon name="FileText" size={14} color={ICON_ON_BRAND} />
            <Text variant="caption" className="text-white flex-1" numberOfLines={2}>{title.trim()}</Text>
          </View>
          <View className="flex-row gap-2">
            <Icon name="Tag" size={14} color={ICON_ON_BRAND} />
            <Text variant="caption" className="text-white flex-1">
              {selectedSpecs.slice(0, 3).join(', ')}{selectedSpecs.length > 3 ? ` +${selectedSpecs.length - 3}` : ''}
            </Text>
          </View>
          <View className="flex-row gap-2">
            <Icon name="Wallet" size={14} color={ICON_ON_BRAND} />
            <Text variant="caption" className="text-white">
              ₺{parseFloat(budgetMin).toLocaleString('tr-TR')} – ₺{parseFloat(budgetMax).toLocaleString('tr-TR')}
            </Text>
          </View>
        </View>
      </View>

      {results.length === 0 ? (
        <View className="bg-sky-600 dark:bg-sky-900 rounded-xl p-4 items-center gap-2">
          <Icon name="ClipboardList" size={32} color="rgba(255,255,255,0.8)" />
          <Text variant="body" className="text-white" align="center">
            Henüz tamamlanmış test sonucun yok.
          </Text>
          <Text variant="caption" className="text-sky-100" align="center">
            Testler sayfasından bir test tamamlayabilirsin.
          </Text>
        </View>
      ) : (
        <View className="gap-3">
          {results.map((result) => {
            const cfg = RESULT_LEVEL_CONFIG[result.level]
            const isSelected = selectedResultId === result.id
            return (
              <Pressable
                key={result.id}
                onPress={() => onSelectResult(isSelected ? undefined : result.id)}
                className={cn(
                  'rounded-xl px-4 py-4 gap-2 active:opacity-90',
                  isSelected ? 'bg-sky-50 dark:bg-sky-100' : 'bg-white dark:bg-white'
                )}
              >
                <View className="flex-row items-center gap-2.5">
                  <Text
                    variant="label"
                    className="flex-1 font-semibold text-neutral-900 dark:text-neutral-900"
                    numberOfLines={1}
                  >
                    {result.assessmentTitle}
                  </Text>
                  <Text variant="caption" className="font-semibold" style={{ color: cfg.color }}>
                    {cfg.label}
                  </Text>
                  <View
                    className={cn(
                      'w-5 h-5 rounded-full border-2 items-center justify-center',
                      isSelected ? 'border-sky-500 bg-sky-500' : 'border-neutral-300 bg-white'
                    )}
                  >
                    {isSelected && <Icon name="Check" size={11} color={ICON_ON_BRAND} />}
                  </View>
                </View>

                <Text
                  variant="caption"
                  className="leading-relaxed text-neutral-500 dark:text-neutral-500"
                  numberOfLines={2}
                >
                  {result.summary}
                </Text>

                <Text variant="caption" className="text-neutral-400 dark:text-neutral-400">
                  Puan: {result.score}
                </Text>
              </Pressable>
            )
          })}
        </View>
      )}
    </View>
  )
}
