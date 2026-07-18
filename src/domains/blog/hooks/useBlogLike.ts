import { useLikeBlogMutation } from '../api/useLikeBlogMutation'

type UseBlogLikeParams = {
  slug: string
  liked: boolean
  likeCount: number
}

type UseBlogLikeReturn = {
  liked: boolean
  likeCount: number
  toggleLike: () => void
}

export function useBlogLike({ slug, liked, likeCount }: UseBlogLikeParams): UseBlogLikeReturn {
  const { mutate: likeBlog, data } = useLikeBlogMutation()

  return {
    liked: data?.liked ?? liked,
    likeCount: data?.likeCount ?? likeCount,
    toggleLike: () => likeBlog({ slug }),
  }
}
