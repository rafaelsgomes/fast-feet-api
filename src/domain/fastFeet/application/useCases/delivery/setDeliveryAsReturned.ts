import { Delivery } from '@/domain/fastFeet/enterprise/entities/delivery'
import { IDeliveriesRepository } from '../../repositories/IDeliveriesRepository'
import { ResourceNotFoundError } from '@/core/errors/errors/resourceNotFoundError'
import { Injectable } from '@nestjs/common'

interface SetDeliveryAsReturnedRequest {
  deliveryId: string
}

interface SetDeliveryAsReturnedResponse {
  delivery: Delivery
}
@Injectable()
export class SetDeliveryAsReturnedUseCase {
  constructor(private deliveriesRepository: IDeliveriesRepository) {}

  async execute({
    deliveryId,
  }: SetDeliveryAsReturnedRequest): Promise<SetDeliveryAsReturnedResponse> {
    const delivery = await this.deliveriesRepository.findById(deliveryId)

    if (!delivery) {
      throw new ResourceNotFoundError()
    }

    if (delivery.returnedAt) return { delivery }

    delivery.returnedAt = new Date()

    this.deliveriesRepository.save(delivery)

    return {
      delivery,
    }
  }
}
