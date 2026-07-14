import { Image, Pressable, View } from 'react-native'

import { Icon } from '@/core/components/atoms/Icon'
import { Text } from '@/core/components/atoms/Text'

import { useBlogLike } from '../hooks/useBlogLike'

import type { BlogListItem } from '../types/blog.types'

type BlogCardProps = {
  blog: BlogListItem
  onPress: () => void
}

export function BlogCard({ blog, onPress }: BlogCardProps) {
  const { liked, likeCount, toggleLike } = useBlogLike({ slug: blog.slug, initialCount: blog.likeCount })

  return (
    <View className="px-4 py-4 gap-3">
      {/* 16:9 Cover Image — köşeleri yuvarlatılmış medya (Twitter post medyası gibi) */}
      <Pressable onPress={onPress} className="active:opacity-90">
        <Image
          source={{ uri: blog.coverImage }}
          style={{ width: '100%', aspectRatio: 16 / 9, borderRadius: 16 }}
          resizeMode="cover"
        />
      </Pressable>

      {/* Kategori tag'ları — carousel'deki gibi düz sky-500 metin */}
      <View className="flex-row flex-wrap gap-x-2 gap-y-1">
        {blog.categories.map((cat) => (
          <Text key={cat} variant="caption" className="text-sky-500 font-semibold">
            #{cat}
          </Text>
        ))}
      </View>

      {/* Title */}
      <Pressable onPress={onPress} className="active:opacity-80">
        <Text variant="label" className="font-semibold text-neutral-900 dark:text-[#F5F5F7] leading-snug">
          {blog.title}
        </Text>
      </Pressable>

      {/* Excerpt */}
      <Pressable onPress={onPress} className="active:opacity-80">
        <Text variant="caption" numberOfLines={4} className="leading-relaxed text-neutral-500 dark:text-neutral-400 -mt-1">
          {blog.excerpt}
        </Text>
      </Pressable>

      {/* Footer: Like + ReadTime + CTA */}
      <View className="flex-row items-center justify-between pt-1">
        <View className="flex-row items-center gap-3">
          {/* Like button */}
          <Pressable
            onPress={toggleLike}
            className="flex-row items-center gap-1.5 active:opacity-70"
            accessibilityRole="button"
            accessibilityLabel={liked ? 'Beğeniyi geri al' : 'Beğen'}
          >
            <Icon name="Heart" size={17} color={liked ? '#EF4444' : '#A3A3A3'} />
            <Text
              variant="caption"
              className={liked ? 'text-red-500 font-semibold' : 'text-neutral-400 dark:text-neutral-500'}
            >
              {likeCount}
            </Text>
          </Pressable>

          {/* Reading time */}
          <View className="flex-row items-center gap-1">
            <Icon name="Clock" size={13} color="#A3A3A3" />
            <Text variant="caption" className="text-neutral-400 dark:text-neutral-500">
              {blog.readingTime} dk okuma
            </Text>
          </View>
        </View>

        {/* Devamını Oku */}
        <Pressable
          onPress={onPress}
          className="flex-row items-center gap-1 active:opacity-70"
        >
          <Text variant="caption" className="text-sky-500 font-semibold">Devamını Oku</Text>
          <Icon name="ChevronRight" size={14} color="#0EA5E9" />
        </Pressable>
      </View>
    </View>
  )
}
