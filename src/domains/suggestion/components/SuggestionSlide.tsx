import { View } from 'react-native'

import { Text } from '@/core/components/atoms/Text'

import type { Suggestion } from '../types/suggestion.types'

type SuggestionSlideProps = {
  suggestion: Suggestion
}

export function SuggestionSlide({ suggestion }: SuggestionSlideProps) {
  return (
    <View className="flex-1 bg-sky-100 dark:bg-sky-900 rounded-2xl px-4 py-3 justify-center gap-1">
      <Text variant="caption" className="text-sky-500 dark:text-sky-300 font-semibold uppercase tracking-wide">
        {suggestion.category}
      </Text>
      <Text variant="label" className="text-sky-900 dark:text-white font-semibold" numberOfLines={1}>
        {suggestion.title}
      </Text>
      <Text variant="caption" className="text-sky-700 dark:text-sky-100 leading-snug" numberOfLines={2}>
        {suggestion.body}
      </Text>
    </View>
  )
}
