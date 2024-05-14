import { DomainEvents } from '@/core/events/domainEvents'
import { EventHandler } from '@/core/events/eventHandler'
import { SendNotificationUseCase } from '../useCases/sendNotification'
import { Injectable } from '@nestjs/common'
import { IDeliveriesRepository } from '@/domain/fastFeet/application/repositories/IDeliveriesRepository'
import { DeliveryCreatedEvent } from '@/domain/fastFeet/enterprise/events/deliveryCreatedEvent'

@Injectable()
export class OnDeliveryCreated implements EventHandler {
  constructor(
    private deliveriesRepository: IDeliveriesRepository,
    private sendNotification: SendNotificationUseCase,
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendNewDeliveryNotification.bind(this),
      DeliveryCreatedEvent.name,
    )
  }

  private async sendNewDeliveryNotification({
    delivery,
  }: DeliveryCreatedEvent) {
    const deliveryOnDatabase = await this.deliveriesRepository.findById(
      delivery.id,
    )

    if (deliveryOnDatabase) {
      await this.sendNotification.execute({
        recipientId: delivery.recipientId,
        title: `New delivery created`,
        content:
          `New delivery created at ${delivery.createdAt} check your account for more informations`.concat(
            '...',
          ),
      })
    }
  }
}
