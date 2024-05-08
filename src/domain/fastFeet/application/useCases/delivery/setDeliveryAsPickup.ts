import { Delivery } from '@/domain/fastFeet/enterprise/entities/delivery'
import { IDeliveriesRepository } from '../../repositories/IDeliveriesRepository'
import { ResourceNotFoundError } from '@/core/errors/errors/resourceNotFoundError'
import { IDeliverymanRepository } from '../../repositories/IDeliverymanRepository'
import { UserNotFoundError } from '../_errors/userNotFoundError'
import { DeliveryIsNotAvailableError } from '../_errors/deliveryIsNotAvailableError'

interface SetDeliveryAsPickupRequest {
  deliveryId: string
  deliverymanId: string
}

interface SetDeliveryAsPickupResponse {
  delivery: Delivery
}

export class SetDeliveryAsPickupUseCase {
  constructor(
    private deliveriesRepository: IDeliveriesRepository,
    private deliverymanRepository: IDeliverymanRepository,
  ) {}

  async execute({
    deliveryId,
    deliverymanId,
  }: SetDeliveryAsPickupRequest): Promise<SetDeliveryAsPickupResponse> {
    const deliveryman = await this.deliverymanRepository.findById(deliverymanId)

    if (!deliveryman) {
      throw new UserNotFoundError(deliveryId)
    }

    const delivery = await this.deliveriesRepository.findById(deliveryId)

    if (!delivery) {
      throw new ResourceNotFoundError()
    }

    if (!delivery.availableAt) {
      throw new DeliveryIsNotAvailableError(deliveryId)
    }

    if (delivery.pickupAt) return { delivery }

    delivery.pickupAt = new Date()
    delivery.deliverymanId = deliverymanId

    this.deliveriesRepository.save(delivery)

    return {
      delivery,
    }
  }
}
