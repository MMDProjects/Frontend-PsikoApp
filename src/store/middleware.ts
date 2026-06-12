import { createJSONStorage, persist } from 'zustand/middleware'
import { devtools } from 'zustand/middleware'

import { zustandStorage } from '@/lib/storage'

// Pre-configured AsyncStorage-backed storage — pass to persist() in domain slices.
// Usage:
//   create<MyState>()(persist(initializer, { name: 'my-slice', storage: asyncStorage }))
export const mmkvStorage = createJSONStorage(() => zustandStorage)
export const asyncStorage = mmkvStorage

export { devtools, persist }
