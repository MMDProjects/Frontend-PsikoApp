import { Pressable, ScrollView, useColorScheme, View } from 'react-native'
import { useRouter } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { Divider } from '@/core/components/atoms/Divider'
import { Icon } from '@/core/components/atoms/Icon'
import { Skeleton } from '@/core/components/atoms/Skeleton'
import { Text } from '@/core/components/atoms/Text'
import { BackButton } from '@/core/components/molecules/BackButton'
import { ScreenTitle } from '@/core/components/molecules/ScreenTitle'
import { SectionHeader } from '@/core/components/molecules/SectionHeader'
import {
  useAssessmentListQuery,
  useMyAssessmentResultsQuery,
  RESULT_LEVEL_CONFIG,
} from '@/domains/assessment'

const TR_MONTHS = ['Oca','Şub','Mar','Nis','May','Haz','Tem','Ağu','Eyl','Eki','Kas','Ara']
function formatDate(iso: string): string {
  const d = new Date(iso)
  return `${d.getDate()} ${TR_MONTHS[d.getMonth()]} ${d.getFullYear()}`
}

function RowSkeleton() {
  return (
    <View className="px-4 py-4 gap-3">
      <Skeleton variant="line" width="60%" height={14} />
      <Skeleton variant="line" width="90%" height={11} />
      <Skeleton variant="line" width="40%" height={11} />
    </View>
  )
}

export default function AssessmentListScreen() {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const isDark = useColorScheme() === 'dark'

  const { data: assessmentList, isLoading: listLoading } = useAssessmentListQuery()
  const { data: myResults, isLoading: resultsLoading } = useMyAssessmentResultsQuery()

  return (
    <View className="flex-1 bg-surface-base dark:bg-dark-bg">
      <BackButton />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-10"
        contentContainerStyle={{ paddingTop: insets.top + 8 }}
      >
        {/* Header — ortalanmış küçük sayfa başlığı */}
        <ScreenTitle title="Testler" />

        {/* ── SONUÇLARIM ── */}
        <Divider spacing="none" className="mx-4 mt-4" />
        <SectionHeader title="Sonuçlarım" />

        {resultsLoading ? (
          <RowSkeleton />
        ) : !myResults || myResults.length === 0 ? (
          <View className="px-4 py-6 items-center gap-2">
            <Icon name="ClipboardList" size={28} color="#A3A3A3" />
            <Text variant="body" color="secondary" align="center">Henüz tamamlanmış test yok</Text>
            <Text variant="caption" color="tertiary" align="center">Aşağıdaki testlerden birini tamamlayın.</Text>
          </View>
        ) : (
          myResults.map((result, index) => {
            const cfg = RESULT_LEVEL_CONFIG[result.level]
            return (
              <View key={result.id}>
                {index > 0 && <Divider spacing="none" className="mx-4" />}
                <View className="px-4 py-4 gap-2">
                  {/* Başlık + seviye */}
                  <View className="flex-row items-center gap-2.5">
                    <Text variant="label" className="flex-1 font-semibold text-neutral-900 dark:text-[#F5F5F7]" numberOfLines={1}>
                      {result.assessmentTitle}
                    </Text>
                    <Text variant="caption" className="font-semibold" style={{ color: cfg.color }}>
                      {cfg.label}
                    </Text>
                  </View>

                  {/* Özet */}
                  <Text variant="caption" color="secondary" numberOfLines={2} className="leading-relaxed">
                    {result.summary}
                  </Text>

                  {/* Alt satır: puan + tarih */}
                  <View className="flex-row items-center justify-between pt-1">
                    <Text variant="caption" color="tertiary">Puan: {result.score}</Text>
                    <Text variant="caption" color="tertiary">{formatDate(result.createdAt)}</Text>
                  </View>
                </View>
              </View>
            )
          })
        )}

        {/* ── MEVCUT TESTLER ── */}
        <Divider spacing="none" className="mx-4 mt-4" />
        <SectionHeader title="Mevcut Testler" />

        {listLoading ? (
          <RowSkeleton />
        ) : (
          assessmentList?.map((test, index) => (
            <View key={test.id}>
              {index > 0 && <Divider spacing="none" className="mx-4" />}
              <Pressable
                onPress={() => router.push('/assessment' as never)}
                className="px-4 py-4 flex-row items-center gap-3 active:opacity-90"
              >
                <View className="flex-1 gap-0.5">
                  <Text variant="body" className="dark:text-[#F5F5F7]">{test.title}</Text>
                  <Text variant="caption" color="tertiary">
                    Ücretsiz · {test.questionCount} soru · ~{test.estimatedMinutes} dk · Kayıt gerekmez
                  </Text>
                </View>
                <Icon name="ChevronRight" size={16} color={isDark ? '#525252' : '#A3A3A3'} />
              </Pressable>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  )
}
