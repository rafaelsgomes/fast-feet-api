import { DomainEvents } from '@/core/events/domainEvents'
import { EventHandler } from '@/core/events/eventHandler'
import { SendNotificationUseCase } from '../useCases/sendNotification'
import { Injectable } from '@nestjs/common'
import { IDeliveriesRepository } from '@/domain/fastFeet/application/repositories/IDeliveriesRepository'
import { DeliveryMadeEvent } from '@/domain/fastFeet/enterprise/events/deliveryMadeEvent'
import { IDeliverymanRepository } from '@/domain/fastFeet/application/repositories/IDeliverymanRepository'

@Injectable()
export class OnDeliveryMade implements EventHandler {
  constructor(
    private deliveriesRepository: IDeliveriesRepository,
    private deliverymanRepository: IDeliverymanRepository,
    private sendNotification: SendNotificationUseCase,
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendDeliveryMadeNotification.bind(this),
      DeliveryMadeEvent.name,
    )
  }

  private async sendDeliveryMadeNotification({ delivery }: DeliveryMadeEvent) {
    const deliveryOnDatabase = await this.deliveriesRepository.findById(
      delivery.id,
    )
    const deliverymanOnDatabase = await this.deliverymanRepository.findById(
      delivery.deliverymanId,
    )

    if (deliveryOnDatabase) {
      await this.sendNotification.execute({
        recipientId: delivery.recipientId,
        title: `Delivery made`,
        content:
          `Delivery made by ${deliverymanOnDatabase.name} check your account for more informations`.concat(
            '...',
          ),
      })
    }
  }
}
