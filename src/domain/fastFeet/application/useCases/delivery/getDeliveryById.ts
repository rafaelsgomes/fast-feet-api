import { Delivery } from '@/domain/fastFeet/enterprise/entities/delivery'
import { IDeliveriesRepository } from '../../repositories/IDeliveriesRepository'
import { ResourceNotFoundError } from '@/core/errors/errors/resourceNotFoundError'

interface GetDeliveryByIdRequest {
  deliveryId: string
}

interface GetDeliveryByIdResponse {
  delivery: Delivery
}

export class GetDeliveryByIdUseCase {
  constructor(private deliveriesRepository: IDeliveriesRepository) {}

  async execute({
    deliveryId,
  }: GetDeliveryByIdRequest): Promise<GetDeliveryByIdResponse> {
    const delivery = await this.deliveriesRepository.findById(deliveryId)

    if (!delivery) {
      throw new ResourceNotFoundError()
    }

    return {
      delivery,
    }
  }
}
