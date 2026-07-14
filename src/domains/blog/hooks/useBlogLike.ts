import { useState, useCallback } from 'react'

import { useLikeBlogMutation } from '../api/useLikeBlogMutation'

type UseBlogLikeParams = {
  slug: string
  initialCount: number
}

type UseBlogLikeReturn = {
  liked: boolean
  likeCount: number
  toggleLike: () => void
}

export function useBlogLike({ slug, initialCount }: UseBlogLikeParams): UseBlogLikeReturn {
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(initialCount)
  const { mutate: likeBlog } = useLikeBlogMutation()

  const toggleLike = useCallback(() => {
    setLiked((prev) => {
      const next = !prev
      setLikeCount((c) => (next ? c + 1 : Math.max(0, c - 1)))
      likeBlog({ slug, liked: next })
      return next
    })
  }, [slug, likeBlog])

  return { liked, likeCount, toggleLike }
}
