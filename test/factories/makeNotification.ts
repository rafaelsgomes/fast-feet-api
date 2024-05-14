import { faker } from '@faker-js/faker'
import {
  Notification,
  NotificationProps,
} from '@/domain/notification/enterprise/entities/notification'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/infra/database/prisma.service'
import { PrismaNotificationMapper } from '@/infra/database/mappers/prismaNotificationMapper'

export function makeNotification(
  override: Partial<NotificationProps> = {},
  id?: string,
) {
  const notification = Notification.create(
    {
      recipientId: faker.string.uuid(),
      title: faker.lorem.sentence(),
      content: faker.lorem.sentence(),
      ...override,
    },
    id,
  )

  return notification
}

@Injectable()
export class NotificationFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaNotification(
    data: Partial<NotificationProps> = {},
  ): Promise<Notification> {
    const notification = makeNotification(data)

    await this.prisma.notification.create({
      data: PrismaNotificationMapper.toDatabase(notification),
    })

    return notification
  }
}
