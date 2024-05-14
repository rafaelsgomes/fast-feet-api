import { Delivery } from '@/domain/fastFeet/enterprise/entities/delivery'
import { IDeliveriesRepository } from '../../repositories/IDeliveriesRepository'
import { ResourceNotFoundError } from '@/core/errors/errors/resourceNotFoundError'
import { IDeliverymanRepository } from '../../repositories/IDeliverymanRepository'
import { UserNotFoundError } from '../_errors/userNotFoundError'
import { DeliveryIsNotAvailableError } from '../_errors/deliveryIsNotAvailableError'
import { Injectable } from '@nestjs/common'

interface SetDeliveryAsPickupRequest {
  deliveryId: string
  deliverymanId: string
}

interface SetDeliveryAsPickupResponse {
  delivery: Delivery
}
@Injectable()
export class SetDeliveryAsPickupUseCase {
  constructor(
    private deliveriesRepository: IDeliveriesRepository,
    private deliverymanRepository: IDeliverymanRepository,
  ) {}

  async execute({
    deliveryId,
    deliverymanId,
  }: SetDeliveryAsPickupRequest): Promise<SetDeliveryAsPickupResponse> {
    const delivery = await this.deliveriesRepository.findById(deliveryId)

    if (!delivery) {
      throw new ResourceNotFoundError()
    }

    const deliveryman = await this.deliverymanRepository.findById(deliverymanId)

    if (!deliveryman) {
      throw new UserNotFoundError(deliveryId)
    }

    if (!delivery.availableAt) {
      throw new DeliveryIsNotAvailableError(deliveryId)
    }

    if (delivery.pickupAt) return { delivery }

    delivery.setPickup(deliverymanId)

    this.deliveriesRepository.save(delivery)

    return {
      delivery,
    }
  }
}
