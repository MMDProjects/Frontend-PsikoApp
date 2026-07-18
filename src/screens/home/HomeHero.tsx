import { Image, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { DecorCircles } from '@/core/components/atoms/DecorCircles'
import { Text } from '@/core/components/atoms/Text'
import { HeroPager } from '@/core/components/organisms/HeroPager'

import type { ReactNode } from 'react'

const LOGO_PLACEHOLDER = require('../../../assets/images/brand/logo-placeholder.png')

export type HomeHeroProps = {
  firstName?: string
  subtitle: string
  pages: ReactNode[]
  textRightInset: number
}

export function HomeHero({ firstName, subtitle, pages, textRightInset }: HomeHeroProps) {
  const insets = useSafeAreaInsets()

  return (
    <View
      className="bg-sky-500 dark:bg-sky-950 px-5 pb-6 rounded-b-2xl overflow-hidden"
      style={{ paddingTop: insets.top + 8 }}
    >
      <DecorCircles />

      <View style={{ paddingRight: textRightInset }}>
        <View className="bg-white rounded-xl self-start px-3 py-1.5">
          <Image
            source={LOGO_PLACEHOLDER}
            className="w-[146px] h-[34px]"
            resizeMode="contain"
            accessibilityLabel="PsikoAl"
          />
        </View>
        <Text variant="subheading" className="text-white font-bold mt-3">
          Merhaba{firstName ? `, ${firstName}` : ''}!
        </Text>
        <Text variant="caption" className="text-sky-100 mt-0.5">
          {subtitle}
        </Text>
      </View>

      <HeroPager pages={pages} />
    </View>
  )
}
