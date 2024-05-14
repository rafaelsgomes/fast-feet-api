import { NotAllowedError } from '@/domain/fastFeet/application/useCases/_errors/notAllowedError'
import { Notification } from '../../enterprise/entities/notification'
import { INotificationsRepository } from '../repositories/INotificationsRepository'
import { ResourceNotFoundError } from '@/core/errors/errors/resourceNotFoundError'
import { Injectable } from '@nestjs/common'

interface ReadNotificationUseCaseRequest {
  recipientId: string
  notificationId: string
}

interface ReadNotificationUseCaseResponse {
  notification: Notification
}

@Injectable()
export class ReadNotificationUseCase {
  constructor(private notificationsRepository: INotificationsRepository) {}

  async execute({
    recipientId,
    notificationId,
  }: ReadNotificationUseCaseRequest): Promise<ReadNotificationUseCaseResponse> {
    const notification =
      await this.notificationsRepository.findById(notificationId)

    if (!notification) {
      throw new ResourceNotFoundError()
    }

    if (recipientId !== notification.recipientId.toString()) {
      throw new NotAllowedError()
    }

    notification.read()

    await this.notificationsRepository.save(notification)

    return {
      notification,
    }
  }
}
