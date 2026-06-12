import { createJSONStorage, persist } from 'zustand/middleware'
import { devtools } from 'zustand/middleware'

import { zustandStorage } from '@/lib/storage'

// Pre-configured MMKV-backed storage — pass to persist() in domain slices.
// Usage:
//   create<MyState>()(persist(initializer, { name: 'my-slice', storage: mmkvStorage }))
export const mmkvStorage = createJSONStorage(() => zustandStorage)

export { devtools, persist }
