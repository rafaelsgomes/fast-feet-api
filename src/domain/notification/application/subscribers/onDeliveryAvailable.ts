import { DomainEvents } from '@/core/events/domainEvents'
import { EventHandler } from '@/core/events/eventHandler'
import { SendNotificationUseCase } from '../useCases/sendNotification'
import { Injectable } from '@nestjs/common'
import { IDeliveriesRepository } from '@/domain/fastFeet/application/repositories/IDeliveriesRepository'
import { DeliveryAvailableEvent } from '@/domain/fastFeet/enterprise/events/deliveryAvailableEvent'

@Injectable()
export class OnDeliveryAvailable implements EventHandler {
  constructor(
    private deliveriesRepository: IDeliveriesRepository,
    private sendNotification: SendNotificationUseCase,
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendDeliveryAvailableNotification.bind(this),
      DeliveryAvailableEvent.name,
    )
  }

  private async sendDeliveryAvailableNotification({
    delivery,
  }: DeliveryAvailableEvent) {
    const deliveryOnDatabase = await this.deliveriesRepository.findById(
      delivery.id,
    )

    if (deliveryOnDatabase) {
      await this.sendNotification.execute({
        recipientId: delivery.recipientId,
        title: `Delivery available`,
        content:
          `Delivery available for pickup check your account for more informations`.concat(
            '...',
          ),
      })
    }
  }
}
