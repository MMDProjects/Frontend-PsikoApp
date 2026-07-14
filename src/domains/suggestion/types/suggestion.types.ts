import type { z } from 'zod'

import type { SuggestionSchema } from '../schemas/suggestion.schema'

export type Suggestion = z.infer<typeof SuggestionSchema>
export type SuggestionAudience = Suggestion['audience']
