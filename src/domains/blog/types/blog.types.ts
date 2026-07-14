import type { z } from 'zod'

import type { BlogSchema, BlogListItemSchema, BlogAuthorSchema } from '../schemas/blog.schema'

export type Blog         = z.infer<typeof BlogSchema>
export type BlogListItem = z.infer<typeof BlogListItemSchema>
export type BlogAuthor   = z.infer<typeof BlogAuthorSchema>
