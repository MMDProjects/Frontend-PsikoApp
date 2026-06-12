import { create } from 'zustand'

import type { AppState } from './types'

// Root store — domain slices are added here as the project grows.
// Each domain exports its own useXxxStore; this hook exposes the combined root.
export const useAppStore = create<AppState>()(() => ({} as AppState))

export type { AppState } from './types'
