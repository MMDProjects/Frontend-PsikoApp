import { View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { cn } from '@/core/utils/cn'
import { Text } from '@/core/components/atoms/Text'

import type { ReactNode } from 'react'

export type ScreenTitleProps = {
  /** Ortalanmış küçük sayfa başlığı — iç sayfa standardı */
  title: string
  /** true ise safe-area üst boşluğunu kendisi ekler (scroll DIŞINDA sabit kullanım).
   *  false/verilmezse scroll container'ın paddingTop'una güvenir. */
  topInset?: boolean
  /** Başlığın altında gösterilecek opsiyonel satır (örn. güvenlik etiketi) */
  children?: ReactNode
  className?: string
  /** Başlık rengini geçersiz kılmak için (örn. mavi zeminde 'text-white') */
  titleClassName?: string
}

export function ScreenTitle({ title, topInset = false, children, className, titleClassName }: ScreenTitleProps) {
  const insets = useSafeAreaInsets()

  return (
    <View
      style={topInset ? { paddingTop: insets.top + 8 } : undefined}
      className={cn('pt-2 pb-3 items-center', className)}
    >
      <Text variant="label" className={cn('font-semibold', titleClassName)}>{title}</Text>
      {children}
    </View>
  )
}
