import { useMutation, useQueryClient } from '@tanstack/react-query'
import { z } from 'zod'

import { post } from '@/lib/api'

import { blogKeys } from '../blog.constants'

const LikeResponseSchema = z.object({ likeCount: z.number() })

type LikeParams = { slug: string; liked: boolean }

export function useLikeBlogMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ slug, liked }: LikeParams) => {
      const raw = await post(`/blogs/${slug}/like`, { liked })
      return LikeResponseSchema.parse(raw)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: blogKeys.all })
    },
  })
}
