import { useQuery } from '@tanstack/react-query'
import { z } from 'zod'

import { get } from '@/lib/api'

import { blogKeys, BLOG_STALE_TIME } from '../blog.constants'
import { BlogListItemSchema } from '../schemas/blog.schema'

const BlogListResponseSchema = z.object({
  data: z.array(BlogListItemSchema),
  meta: z.object({ page: z.number(), total: z.number(), perPage: z.number() }),
})

export function useBlogListQuery(category?: string) {
  return useQuery({
    queryKey: blogKeys.list(category),
    queryFn: async () => {
      const raw = await get('/blogs', category ? { params: { category } } : undefined)
      const result = BlogListResponseSchema.safeParse(raw)
      if (!result.success) {
        console.error('[blogs] Zod parse FAILED:', JSON.stringify(result.error.issues))
        throw result.error
      }
      return result.data
    },
    staleTime: BLOG_STALE_TIME,
  })
}
