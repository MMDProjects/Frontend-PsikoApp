import { useQuery } from '@tanstack/react-query'

import { get } from '@/lib/api'

import { categoryKeys, CATEGORY_STALE_TIME } from '../category.constants'
import { CategoryDetailSchema } from '../schemas/category.schema'

export function useCategoryDetailQuery(slug: string) {
  return useQuery({
    queryKey: categoryKeys.detail(slug),
    queryFn: async () => {
      const raw = await get(`/categories/${slug}`)
      const result = CategoryDetailSchema.safeParse(raw)
      if (!result.success) {
        console.error('[category-detail] Zod parse FAILED:', JSON.stringify(result.error.issues))
        throw result.error
      }
      return result.data
    },
    staleTime: CATEGORY_STALE_TIME,
    enabled: Boolean(slug),
  })
}
