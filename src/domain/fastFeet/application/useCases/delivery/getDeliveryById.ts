import { IDeliveriesRepository } from '../../repositories/IDeliveriesRepository'
import { ResourceNotFoundError } from '@/core/errors/errors/resourceNotFoundError'
import { Injectable } from '@nestjs/common'
import { NotAllowedError } from '../_errors/notAllowedError'
import { DeliveryDetails } from '@/domain/fastFeet/enterprise/entities/valueObjects/deliveryDetails'

interface GetDeliveryByIdRequest {
  deliveryId: string
  userId: string
}

interface GetDeliveryByIdResponse {
  delivery: DeliveryDetails
}
@Injectable()
export class GetDeliveryByIdUseCase {
  constructor(private deliveriesRepository: IDeliveriesRepository) {}

  async execute({
    deliveryId,
    userId,
  }: GetDeliveryByIdRequest): Promise<GetDeliveryByIdResponse> {
    const delivery = await this.deliveriesRepository.findDetailsById(deliveryId)

    if (!delivery) {
      throw new ResourceNotFoundError()
    }

    if (delivery.recipientId !== userId && delivery.deliverymanId !== userId) {
      throw new NotAllowedError()
    }

    return {
      delivery,
    }
  }
}
