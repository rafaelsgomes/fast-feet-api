import { Notification } from '../../enterprise/entities/notification'
import { INotificationsRepository } from '../repositories/INotificationsRepository'
import { Injectable } from '@nestjs/common'

export interface SendNotificationUseCaseRequest {
  recipientId: string
  title: string
  content: string
}

export interface SendNotificationUseCaseResponse {
  notification: Notification
}

@Injectable()
export class SendNotificationUseCase {
  constructor(private notificationsRepository: INotificationsRepository) {}

  async execute({
    recipientId,
    title,
    content,
  }: SendNotificationUseCaseRequest): Promise<SendNotificationUseCaseResponse> {
    const notification = Notification.create({
      recipientId,
      title,
      content,
    })

    await this.notificationsRepository.create(notification)

    return {
      notification,
    }
  }
}
