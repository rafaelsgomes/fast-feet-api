import { DomainEvents } from '@/core/events/domainEvents'
import { EventHandler } from '@/core/events/eventHandler'
import { SendNotificationUseCase } from '../useCases/sendNotification'
import { Injectable } from '@nestjs/common'
import { IDeliveriesRepository } from '@/domain/fastFeet/application/repositories/IDeliveriesRepository'
import { DeliveryReturnedEvent } from '@/domain/fastFeet/enterprise/events/deliveryReturnedEvent'

@Injectable()
export class OnDeliveryReturned implements EventHandler {
  constructor(
    private deliveriesRepository: IDeliveriesRepository,
    private sendNotification: SendNotificationUseCase,
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendDeliveryReturnedNotification.bind(this),
      DeliveryReturnedEvent.name,
    )
  }

  private async sendDeliveryReturnedNotification({
    delivery,
  }: DeliveryReturnedEvent) {
    const deliveryOnDatabase = await this.deliveriesRepository.findById(
      delivery.id,
    )

    if (deliveryOnDatabase) {
      await this.sendNotification.execute({
        recipientId: delivery.recipientId,
        title: `Delivery returned`,
        content:
          `Delivery returned check your account for more informations`.concat(
            '...',
          ),
      })
    }
  }
}
