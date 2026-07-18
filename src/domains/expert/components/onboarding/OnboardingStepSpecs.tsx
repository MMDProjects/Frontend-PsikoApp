import { View } from 'react-native'

import { Chip } from '@/core/components/atoms/Chip'
import { Text } from '@/core/components/atoms/Text'

import { ExpertSpecializations } from '../../schemas/expert.schema'

export type OnboardingStepSpecsProps = {
  selectedSpecs: string[]
  onToggleSpec: (spec: string) => void
  errorMessage?: string
}

export function OnboardingStepSpecs({ selectedSpecs, onToggleSpec, errorMessage }: OnboardingStepSpecsProps) {
  return (
    <View className="gap-3">
      <View className="flex-row flex-wrap gap-2">
        {ExpertSpecializations.map((spec) => (
          <Chip
            key={spec}
            label={spec}
            isSelected={selectedSpecs.includes(spec)}
            onPress={() => onToggleSpec(spec)}
            variant="onBrand"
          />
        ))}
      </View>
      {errorMessage && (
        <Text variant="caption" className="text-red-100">{errorMessage}</Text>
      )}
    </View>
  )
}
