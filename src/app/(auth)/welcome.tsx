import { useState } from 'react'
import { Image, Pressable, View } from 'react-native'
import { useRouter } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { DecorCircles } from '@/core/components/atoms/DecorCircles'
import { Icon } from '@/core/components/atoms/Icon'
import { Text } from '@/core/components/atoms/Text'
import { BottomActionBar } from '@/core/components/organisms/BottomActionBar'
import { cn } from '@/core/utils/cn'
import { useOnboardingStore } from '@/store/onboardingStore'

import type { IconName } from '@/core/components/atoms/Icon'

// TODO: gerçek marka logosu gelince değiştirilecek
const LOGO_PLACEHOLDER = require('../../../assets/images/brand/logo-placeholder.png')

type WelcomeSlide = {
  icon: IconName
  title: string
  body: string
}

const FIRST_SLIDE: WelcomeSlide = {
  icon: 'HeartHandshake',
  title: 'Doğru psikoloğu bulmanın en kolay yolu',
  body: 'İhtiyacını anlatan bir ilan oluştur; alanında uzman psikologlar sana teklifleriyle gelsin. Sen sadece en uygun olanı seç.',
}

const SLIDES: WelcomeSlide[] = [
  FIRST_SLIDE,
  {
    icon: 'ClipboardList',
    title: 'Önce kendini keşfet',
    body: 'Ücretsiz psikolojik testlerle nasıl hissettiğini anla. Kayıt gerekmez, sonuçlarını dilersen ilanına ekleyebilirsin.',
  },
  {
    icon: 'ShieldCheck',
    title: 'Güvenle eşleş',
    body: 'Tüm uzmanların lisansları doğrulanır. İletişim bilgilerin yalnızca senin onayladığın eşleşmelerde paylaşılır.',
  },
]

export default function WelcomeScreen() {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const setSeenWelcome = useOnboardingStore((s) => s.setSeenWelcome)

  const [slide, setSlide] = useState(0)
  const isLast = slide === SLIDES.length - 1
  const current = SLIDES[slide] ?? FIRST_SLIDE

  const finish = (target: '/(auth)/register' | '/(auth)/login') => {
    setSeenWelcome()
    router.replace(target)
  }

  const bottomBarHeight = 56 + insets.bottom

  return (
    <View className="flex-1 bg-sky-500 dark:bg-sky-950" style={{ overflow: 'hidden' }}>
      {/* Dekoratif daireler — her slaytta süzülerek yer değiştirir */}
      <DecorCircles phase={slide} />

      {/* Atla — sağ üst */}
      <Pressable
        onPress={() => finish('/(auth)/login')}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel="Karşılamayı atla"
        style={{ position: 'absolute', top: insets.top + 8, right: 16, zIndex: 10 }}
        className="px-4 h-10 rounded-full items-center justify-center bg-sky-600 dark:bg-sky-900 active:bg-sky-700 dark:active:bg-sky-800"
      >
        <Text variant="caption" className="text-white font-semibold">Atla</Text>
      </Pressable>

      {/* Logo — üst orta */}
      <View className="items-center" style={{ paddingTop: insets.top + 12 }}>
        <View className="bg-white rounded-xl px-3 py-1.5">
          <Image
            source={LOGO_PLACEHOLDER}
            style={{ width: 146, height: 34 }}
            resizeMode="contain"
            accessibilityLabel="PsikoAl"
          />
        </View>
      </View>

      {/* Slayt içeriği */}
      <View className="flex-1 justify-center px-8 gap-6" style={{ paddingBottom: bottomBarHeight }}>
        <View className="items-center gap-6">
          <View className="w-24 h-24 rounded-full bg-white items-center justify-center">
            <Icon name={current.icon} size={44} color="#0EA5E9" />
          </View>
          {/* Sabit yükseklikli metin bloğu — slaytlar arası ikon/nokta konumları oynamaz */}
          <View className="items-center gap-3">
            <Text
              variant="heading"
              className="text-white text-center leading-tight"
              numberOfLines={2}
              style={{ minHeight: 76 }}
            >
              {current.title}
            </Text>
            <Text
              variant="body"
              className="text-sky-100 text-center leading-relaxed"
              numberOfLines={4}
              style={{ minHeight: 96 }}
            >
              {current.body}
            </Text>
          </View>
        </View>

        {/* Slayt noktaları */}
        <View className="flex-row justify-center gap-2 mt-2">
          {SLIDES.map((_, i) => (
            <View
              key={i}
              className={cn(
                'h-2 rounded-full',
                i === slide ? 'w-6 bg-white' : 'w-2 bg-sky-600 dark:bg-sky-900'
              )}
            />
          ))}
        </View>
      </View>

      <BottomActionBar
        actions={
          isLast
            ? [
                { label: 'Giriş Yap', onPress: () => finish('/(auth)/login'), variant: 'inverseGhost' },
                { label: 'Hemen Başla', onPress: () => finish('/(auth)/register'), variant: 'inverse' },
              ]
            : [{ label: 'Devam', onPress: () => setSlide((s) => s + 1), variant: 'inverse' }]
        }
      />
    </View>
  )
}
