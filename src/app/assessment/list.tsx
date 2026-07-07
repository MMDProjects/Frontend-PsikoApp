import { ActivityIndicator, Pressable, ScrollView, useColorScheme, View } from 'react-native'
import { useRouter } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { Icon } from '@/core/components/atoms/Icon'
import { Text } from '@/core/components/atoms/Text'
import {
  useAssessmentListQuery,
  useMyAssessmentResultsQuery,
  RESULT_LEVEL_CONFIG,
} from '@/domains/assessment'

import type { IconName } from '@/core/components/atoms/Icon'

const CATEGORY_ICON: Record<string, IconName> = {
  anxiety:    'HeartPulse',
  depression: 'CloudRain',
  stress:     'Wind',
}

const TR_MONTHS = ['Oca','Şub','Mar','Nis','May','Haz','Tem','Ağu','Eyl','Eki','Kas','Ara']
function formatDate(iso: string): string {
  const d = new Date(iso)
  return `${d.getDate()} ${TR_MONTHS[d.getMonth()]} ${d.getFullYear()}`
}

export default function AssessmentListScreen() {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const isDark = useColorScheme() === 'dark'
  const metaIconColor = isDark ? '#A3A3A3' : '#737373'

  const { data: assessmentList, isLoading: listLoading } = useAssessmentListQuery()
  const { data: myResults, isLoading: resultsLoading } = useMyAssessmentResultsQuery()

  return (
    <View className="flex-1 bg-surface-base dark:bg-dark-bg">
      {/* Floating back button */}
      <Pressable
        onPress={() => router.back()}
        accessibilityRole="button"
        className="active:opacity-50"
        style={{
          position: 'absolute',
          top: insets.top + 8,
          left: 16,
          zIndex: 10,
          width: 44,
          height: 44,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Icon name="ChevronLeft" size={24} color="#0EA5E9" />
      </Pressable>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="pb-10">
        {/* Header */}
        <View className="px-4 pb-3" style={{ paddingTop: insets.top + 8, paddingLeft: 60 }}>
          <Text variant="heading">Testler</Text>
        </View>

        {/* ── SONUÇLARIM ── */}
        <View className="mx-4 mt-4 h-px bg-neutral-200 dark:bg-neutral-800" />
        <View className="px-4 pt-4 pb-2">
          <Text variant="caption" color="secondary" className="font-semibold uppercase tracking-widest">
            Sonuçlarım
          </Text>
        </View>

        {resultsLoading ? (
          <View className="py-4 items-center">
            <ActivityIndicator color="#0EA5E9" />
          </View>
        ) : !myResults || myResults.length === 0 ? (
          <View className="mx-4 bg-white dark:bg-dark-card rounded-xl p-5 items-center gap-2">
            <Icon name="ClipboardList" size={28} color="#A3A3A3" />
            <Text variant="body" color="secondary" align="center">Henüz tamamlanmış test yok</Text>
            <Text variant="caption" color="tertiary" align="center">Aşağıdaki testlerden birini tamamlayın.</Text>
          </View>
        ) : (
          myResults.map((result) => {
            const cfg = RESULT_LEVEL_CONFIG[result.level]
            return (
              <View key={result.id} className="mx-4 mb-3 bg-white dark:bg-dark-card rounded-xl overflow-hidden">
                {/* Pastel header */}
                <View className="px-4 py-3 flex-row items-center justify-between"
                  style={{ backgroundColor: result.level === 'low' ? '#F0FDF4' : result.level === 'moderate' ? '#FFFBEB' : '#FEF2F2' }}
                >
                  <View className="flex-row items-center gap-2">
                    <Icon name="ClipboardList" size={15} color={cfg.color} />
                    <Text variant="label" className="font-semibold" style={{ color: cfg.color }}>
                      {result.assessmentTitle}
                    </Text>
                  </View>
                  <View className="px-2 py-0.5 rounded-full" style={{ backgroundColor: cfg.color + '20' }}>
                    <Text variant="caption" className="font-semibold" style={{ color: cfg.color }}>
                      {cfg.label}
                    </Text>
                  </View>
                </View>

                {/* Body */}
                <View className="px-4 pt-3 pb-4 gap-2">
                  <Text variant="body" color="secondary" numberOfLines={3}>{result.summary}</Text>
                  <View className="flex-row items-center justify-between pt-1">
                    <View className="flex-row items-center gap-1.5">
                      <Icon name="Hash" size={13} color={metaIconColor} />
                      <Text variant="caption" color="tertiary">Puan: {result.score}</Text>
                    </View>
                    <Text variant="caption" color="tertiary">{formatDate(result.createdAt)}</Text>
                  </View>
                </View>
              </View>
            )
          })
        )}

        {/* ── MEVCUT TESTLER ── */}
        <View className="mx-4 mt-4 h-px bg-neutral-200 dark:bg-neutral-800" />
        <View className="px-4 pt-4 pb-2">
          <Text variant="caption" color="secondary" className="font-semibold uppercase tracking-widest">
            Mevcut Testler
          </Text>
        </View>

        {listLoading ? (
          <View className="py-4 items-center">
            <ActivityIndicator color="#0EA5E9" />
          </View>
        ) : (
          assessmentList?.map((test) => (
            <View key={test.id} className="mx-4 mb-3 bg-white dark:bg-dark-card rounded-xl overflow-hidden">
              {/* Header strip */}
              <View className="bg-sky-100 dark:bg-sky-950 px-4 py-3 flex-row items-center justify-between">
                <View className="flex-row items-center gap-2.5">
                  <Icon name={CATEGORY_ICON[test.category] ?? 'Brain'} size={16} color="#0369A1" />
                  <Text variant="label" className="font-semibold text-sky-900 dark:text-sky-200">
                    {test.title}
                  </Text>
                </View>
                <View className="bg-sky-500 rounded-full px-2.5 py-0.5">
                  <Text variant="caption" className="text-white font-semibold">Ücretsiz</Text>
                </View>
              </View>

              {/* Body */}
              <View className="px-4 pt-3 pb-4 gap-3">
                <View className="flex-row items-center gap-4">
                  <View className="flex-row items-center gap-1.5">
                    <Icon name="HelpCircle" size={13} color={metaIconColor} />
                    <Text variant="caption" color="secondary">{test.questionCount} soru</Text>
                  </View>
                  <View className="flex-row items-center gap-1.5">
                    <Icon name="Clock" size={13} color={metaIconColor} />
                    <Text variant="caption" color="secondary">~{test.estimatedMinutes} dk</Text>
                  </View>
                  <View className="flex-row items-center gap-1.5">
                    <Icon name="ShieldCheck" size={13} color={metaIconColor} />
                    <Text variant="caption" color="secondary">Kayıt gerekmez</Text>
                  </View>
                </View>
                <Pressable
                  onPress={() => router.push('/assessment' as never)}
                  className="flex-row items-center gap-1 active:opacity-70"
                >
                  <Text variant="caption" className="text-sky-600 dark:text-sky-400 font-semibold">
                    Teste Başla
                  </Text>
                  <Icon name="ChevronRight" size={13} color="#0284C7" />
                </Pressable>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  )
}
