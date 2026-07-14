import { View } from 'react-native'

import { Text } from '@/core/components/atoms/Text'

import type { Suggestion } from '../types/suggestion.types'

type SuggestionSlideProps = {
  suggestion: Suggestion
}

/** Hero pager içindeki tek öneri slaytı — cam panel, ikonsuz, metin odaklı */
export function SuggestionSlide({ suggestion }: SuggestionSlideProps) {
  return (
    <View className="flex-1 bg-white/20 dark:bg-white/10 border border-white/25 dark:border-white/10 rounded-2xl px-4 py-3 justify-center gap-1">
      <Text variant="caption" className="text-white/70 font-semibold uppercase tracking-wide">
        {suggestion.category}
      </Text>
      <Text variant="label" className="text-white font-semibold" numberOfLines={1}>
        {suggestion.title}
      </Text>
      <Text variant="caption" className="text-sky-100 leading-snug" numberOfLines={2}>
        {suggestion.body}
      </Text>
    </View>
  )
}
