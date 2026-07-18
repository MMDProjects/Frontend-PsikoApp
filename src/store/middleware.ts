import { createJSONStorage, persist } from 'zustand/middleware'

import { zustandStorage } from '@/lib/storage'

export const mmkvStorage = createJSONStorage(() => zustandStorage)

export { persist }
