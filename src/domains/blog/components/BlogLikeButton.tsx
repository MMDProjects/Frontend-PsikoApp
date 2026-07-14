import { Pressable } from 'react-native'

import { cn } from '@/core/utils/cn'
import { Icon } from '@/core/components/atoms/Icon'
import { Text } from '@/core/components/atoms/Text'

import { useBlogLike } from '../hooks/useBlogLike'

type BlogLikeButtonProps = {
  slug: string
  initialCount: number
}

export function BlogLikeButton({ slug, initialCount }: BlogLikeButtonProps) {
  const { liked, likeCount, toggleLike } = useBlogLike({ slug, initialCount })

  return (
    <Pressable
      onPress={toggleLike}
      accessibilityRole="button"
      accessibilityLabel={liked ? 'Beğeniyi geri al' : 'Beğen'}
      className={cn(
        'flex-row items-center gap-2 rounded-full px-4 py-2.5 active:opacity-70 border',
        liked
          ? 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-900'
          : 'bg-neutral-50 dark:bg-dark-elevated border-neutral-200 dark:border-dark-border2'
      )}
    >
      <Icon name="Heart" size={18} color={liked ? '#EF4444' : '#A3A3A3'} />
      <Text
        variant="label"
        className={liked ? 'text-red-500 font-semibold' : 'text-neutral-500 dark:text-neutral-400 font-medium'}
      >
        {likeCount} Beğeni
      </Text>
    </Pressable>
  )
}
