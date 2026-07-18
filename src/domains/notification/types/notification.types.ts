import { z } from 'zod'

import { NotificationSchema, NotificationTypeSchema } from '../schemas/notification.schema'

export type Notification = z.infer<typeof NotificationSchema>
export type NotificationType = z.infer<typeof NotificationTypeSchema>
