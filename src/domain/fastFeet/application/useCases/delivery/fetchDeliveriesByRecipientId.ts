import { Delivery } from '@/domain/fastFeet/enterprise/entities/delivery'
import { IDeliveriesRepository } from '../../repositories/IDeliveriesRepository'

interface FetchDeliveriesByRecipientIdRequest {
  recipientId: string
}

interface FetchDeliveriesByRecipientIdResponse {
  deliveries: Delivery[]
}

export class FetchDeliveriesByRecipientIdUseCase {
  constructor(private deliveriesRepository: IDeliveriesRepository) {}

  async execute({
    recipientId,
  }: FetchDeliveriesByRecipientIdRequest): Promise<FetchDeliveriesByRecipientIdResponse> {
    const deliveries =
      await this.deliveriesRepository.findManyByRecipientId(recipientId)

    return {
      deliveries,
    }
  }
}
