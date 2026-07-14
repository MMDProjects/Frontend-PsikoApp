import { FlatList, View } from 'react-native'
import { useRouter } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { Divider } from '@/core/components/atoms/Divider'
import { Skeleton } from '@/core/components/atoms/Skeleton'
import { BackButton } from '@/core/components/molecules/BackButton'
import { EmptyState } from '@/core/components/molecules/EmptyState'
import { ScreenTitle } from '@/core/components/molecules/ScreenTitle'
import { useBlogListQuery, BlogCard } from '@/domains/blog'

export default function BlogFeedScreen() {
  const router = useRouter()
  const insets = useSafeAreaInsets()

  const { data, isLoading, isError, refetch } = useBlogListQuery()
  const blogs = data?.data ?? []

  return (
    <View className="flex-1 bg-surface-base dark:bg-dark-bg">
      {/* Sabit geri butonu — scroll'dan etkilenmez */}
      <BackButton />

      <FlatList
        data={(!isLoading && !isError) ? blogs : []}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: insets.top + 8, paddingBottom: insets.bottom + 24 }}
        ListHeaderComponent={<ScreenTitle title="Psikoloji Blogu" />}
        ItemSeparatorComponent={() => <Divider spacing="none" className="mx-4" />}
        ListEmptyComponent={
          isLoading ? (
            <View>
              {[1, 2].map((i) => (
                <View key={i}>
                  <View className="px-4 py-4 gap-3">
                    <Skeleton variant="rect" width="100%" height={190} borderRadius="xl" />
                    <Skeleton variant="line" width="40%" height={12} />
                    <Skeleton variant="line" width="80%" height={14} />
                    <Skeleton variant="line" width="100%" height={11} />
                    <Skeleton variant="line" width="90%" height={11} />
                  </View>
                  {i < 2 && <Divider spacing="none" className="mx-4" />}
                </View>
              ))}
            </View>
          ) : isError ? (
            <EmptyState
              icon="WifiOff"
              title="Yüklenemedi"
              description="Blog yazıları alınamadı. Bağlantınızı kontrol edin."
              ctaLabel="Tekrar Dene"
              onCta={refetch}
            />
          ) : (
            <EmptyState
              icon="FileText"
              title="Henüz içerik yok"
              description="Yakında yeni yazılar eklenecek."
            />
          )
        }
        renderItem={({ item }) => (
          <BlogCard
            blog={item}
            onPress={() => router.push(`/blog/${item.slug}` as never)}
          />
        )}
      />
    </View>
  )
}
