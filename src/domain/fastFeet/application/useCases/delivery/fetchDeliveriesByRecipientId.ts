import { Delivery } from '@/domain/fastFeet/enterprise/entities/delivery'
import { IDeliveriesRepository } from '../../repositories/IDeliveriesRepository'
import { Injectable } from '@nestjs/common'

interface FetchDeliveriesByRecipientIdRequest {
  recipientId: string
}

interface FetchDeliveriesByRecipientIdResponse {
  deliveries: Delivery[]
}
@Injectable()
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
