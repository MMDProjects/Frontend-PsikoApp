import { Tabs } from 'expo-router'

import { Icon } from '@/core/components/atoms/Icon'
import { useAuthStore } from '@/domains/auth'
import { useKeyboard } from '@/core/hooks/useKeyboard'

import type { IconName } from '@/core/components/atoms/Icon'

type TabConfig = {
  name: string
  title: string
  icon: IconName
}

const EXPERT_TABS: TabConfig[] = [
  { name: 'index',   title: 'Danışanlar', icon: 'Users'  },
  { name: 'offers',  title: 'Teklifler',  icon: 'FileText' },
  { name: 'explore', title: 'Keşfet',     icon: 'Compass' },
  { name: 'profile', title: 'Profil',     icon: 'User'   },
]

const CLIENT_TABS: TabConfig[] = [
  { name: 'index',   title: 'Ana Sayfa',  icon: 'Home'   },
  { name: 'explore', title: 'Keşfet',     icon: 'Search' },
  { name: 'offers',  title: 'Teklifler',  icon: 'Bell'   },
  { name: 'profile', title: 'Profil',     icon: 'User'   },
]

const DEFAULT_TABS = CLIENT_TABS

// Design token colors — hardcoded because tab bar is rendered outside NativeWind className context
const TAB_ACTIVE_TINT   = '#5C4FD6' // iris-500
const TAB_INACTIVE_TINT = '#737373' // neutral-500
const TAB_BG            = '#FFFFFF'
const TAB_BORDER        = '#E5E5E5'

export default function TabsLayout() {
  const { isVisible: keyboardVisible } = useKeyboard()
  const role = useAuthStore((s) => s.role)

  const tabs = role === 'expert' ? EXPERT_TABS : DEFAULT_TABS

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor:   TAB_ACTIVE_TINT,
        tabBarInactiveTintColor: TAB_INACTIVE_TINT,
        tabBarStyle: keyboardVisible
          ? { display: 'none' }
          : {
              backgroundColor: TAB_BG,
              borderTopColor:  TAB_BORDER,
              borderTopWidth:  1,
              paddingBottom:   4,
              height:          56,
            },
        tabBarLabelStyle: {
          fontFamily: 'Inter_500Medium',
          fontSize:   11,
        },
      }}
    >
      {tabs.map(({ name, title, icon }) => (
        <Tabs.Screen
          key={name}
          name={name}
          options={{
            title,
            tabBarIcon: ({ color, size }) => (
              // REASON: Expo Router's tabBarIcon passes ColorValue; Icon expects string
              <Icon name={icon} size={size ?? 22} color={color as string} />
            ),
          }}
        />
      ))}

    </Tabs>
  )
}
