import { Delivery } from '@/domain/fastFeet/enterprise/entities/delivery'
import { IDeliveriesRepository } from '../../repositories/IDeliveriesRepository'

interface FetchDeliveriesByDeliverymanIdRequest {
  deliverymanId: string
}

interface FetchDeliveriesByDeliverymanIdResponse {
  deliveries: Delivery[]
}

export class FetchDeliveriesByDeliverymanIdUseCase {
  constructor(private deliveriesRepository: IDeliveriesRepository) {}

  async execute({
    deliverymanId,
  }: FetchDeliveriesByDeliverymanIdRequest): Promise<FetchDeliveriesByDeliverymanIdResponse> {
    const deliveries =
      await this.deliveriesRepository.findManyByDeliverymanId(deliverymanId)

    return {
      deliveries,
    }
  }
}
