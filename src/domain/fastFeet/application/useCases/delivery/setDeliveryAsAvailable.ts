import { Delivery } from '@/domain/fastFeet/enterprise/entities/delivery'
import { IDeliveriesRepository } from '../../repositories/IDeliveriesRepository'
import { ResourceNotFoundError } from '@/core/errors/errors/resourceNotFoundError'

interface SetDeliveryAsAvailableRequest {
  deliveryId: string
}

interface SetDeliveryAsAvailableResponse {
  delivery: Delivery
}

export class SetDeliveryAsAvailableUseCase {
  constructor(private deliveriesRepository: IDeliveriesRepository) {}

  async execute({
    deliveryId,
  }: SetDeliveryAsAvailableRequest): Promise<SetDeliveryAsAvailableResponse> {
    const delivery = await this.deliveriesRepository.findById(deliveryId)

    if (!delivery) {
      throw new ResourceNotFoundError()
    }

    if (delivery.availableAt) return { delivery }

    delivery.availableAt = new Date()

    this.deliveriesRepository.save(delivery)

    return {
      delivery,
    }
  }
}