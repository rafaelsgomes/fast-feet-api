import { Delivery } from '@/domain/fastFeet/enterprise/entities/delivery'
import { IDeliveriesRepository } from '../../repositories/IDeliveriesRepository'
import { ResourceNotFoundError } from '@/core/errors/errors/resourceNotFoundError'
import { Injectable } from '@nestjs/common'

interface SetDeliveryAsAvailableRequest {
  deliveryId: string
}

interface SetDeliveryAsAvailableResponse {
  delivery: Delivery
}
@Injectable()
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

    delivery.setAvailable()

    this.deliveriesRepository.save(delivery)

    return {
      delivery,
    }
  }
}
