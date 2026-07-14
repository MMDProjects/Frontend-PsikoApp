import type { z } from 'zod'

import type { CategoryDetailSchema, CategorySchema } from '../schemas/category.schema'

export type Category = z.infer<typeof CategorySchema>
export type CategoryDetail = z.infer<typeof CategoryDetailSchema>
