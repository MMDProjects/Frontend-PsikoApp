// Root app state — extended by domain slices via intersection types.
// Add slice state types here as domains are added.
export type AppState = Record<string, never>
