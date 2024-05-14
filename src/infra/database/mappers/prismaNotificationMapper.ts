import { Notification } from '@/domain/notification/enterprise/entities/notification'
import { Notification as PrismaNotification, Prisma } from '@prisma/client'

export class PrismaNotificationMapper {
  static toDomain(raw: PrismaNotification): Notification {
    return Notification.create(
      {
        title: raw.title,
        recipientId: raw.recipientId,
        content: raw.content,
        createdAt: raw.createdAt,
        readAt: raw.readAt,
      },
      raw.id,
    )
  }

  static toDatabase(
    notification: Notification,
  ): Prisma.NotificationUncheckedCreateInput {
    return {
      id: notification.id,
      title: notification.title,
      recipientId: notification.recipientId,
      content: notification.content,
      createdAt: notification.createdAt,
      readAt: notification.readAt,
    }
  }
}
