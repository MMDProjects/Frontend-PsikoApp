export const BLOG_STALE_TIME = 5 * 60 * 1000 // 5 dakika

export const blogKeys = {
  all:    ['blogs'] as const,
  lists:  () => [...blogKeys.all, 'list'] as const,
  list:   (category?: string) => [...blogKeys.lists(), category ?? 'all'] as const,
  detail: (slug: string) => [...blogKeys.all, 'detail', slug] as const,
} as const
