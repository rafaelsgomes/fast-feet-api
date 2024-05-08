import { IDeliveriesRepository } from '../../repositories/IDeliveriesRepository'
import { ResourceNotFoundError } from '@/core/errors/errors/resourceNotFoundError'

interface DeleteDeliveryRequest {
  deliveryId: string
}

interface DeleteDeliveryResponse {}

export class DeleteDeliveryUseCase {
  constructor(private deliveriesRepository: IDeliveriesRepository) {}

  async execute({
    deliveryId,
  }: DeleteDeliveryRequest): Promise<DeleteDeliveryResponse> {
    const delivery = await this.deliveriesRepository.findById(deliveryId)

    if (!delivery) {
      throw new ResourceNotFoundError()
    }

    await this.deliveriesRepository.delete(deliveryId)

    return {}
  }
}
