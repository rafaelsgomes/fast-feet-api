import { DomainEvents } from '@/core/events/domainEvents'
import { EventHandler } from '@/core/events/eventHandler'
import { SendNotificationUseCase } from '../useCases/sendNotification'
import { Injectable } from '@nestjs/common'
import { IDeliveriesRepository } from '@/domain/fastFeet/application/repositories/IDeliveriesRepository'
import { DeliveryPickupEvent } from '@/domain/fastFeet/enterprise/events/deliveryPickupEvent'
import { IDeliverymanRepository } from '@/domain/fastFeet/application/repositories/IDeliverymanRepository'

@Injectable()
export class OnDeliveryPickup implements EventHandler {
  constructor(
    private deliveriesRepository: IDeliveriesRepository,
    private deliverymanRepository: IDeliverymanRepository,
    private sendNotification: SendNotificationUseCase,
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendDeliveryPickupNotification.bind(this),
      DeliveryPickupEvent.name,
    )
  }

  private async sendDeliveryPickupNotification({
    delivery,
  }: DeliveryPickupEvent) {
    const deliveryOnDatabase = await this.deliveriesRepository.findById(
      delivery.id,
    )
    const deliverymanOnDatabase = await this.deliverymanRepository.findById(
      delivery.deliverymanId,
    )

    if (deliveryOnDatabase) {
      await this.sendNotification.execute({
        recipientId: delivery.recipientId,
        title: `Delivery pickup`,
        content:
          `Delivery pickup by ${deliverymanOnDatabase.name} check your account for more informations`.concat(
            '...',
          ),
      })
    }
  }
}
