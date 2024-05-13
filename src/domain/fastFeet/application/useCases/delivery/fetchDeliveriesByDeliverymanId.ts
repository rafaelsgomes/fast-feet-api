import { Delivery } from '@/domain/fastFeet/enterprise/entities/delivery'
import { IDeliveriesRepository } from '../../repositories/IDeliveriesRepository'
import { Injectable } from '@nestjs/common'

interface FetchDeliveriesByDeliverymanIdRequest {
  deliverymanId: string
}

interface FetchDeliveriesByDeliverymanIdResponse {
  deliveries: Delivery[]
}
@Injectable()
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
