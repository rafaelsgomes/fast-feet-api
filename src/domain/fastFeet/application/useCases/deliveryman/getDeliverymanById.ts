import { Injectable } from '@nestjs/common'
import { IDeliverymanRepository } from '../../repositories/IDeliverymanRepository'
import { Deliveryman } from '@/domain/fastFeet/enterprise/entities/deliveryman'
import { UserNotFoundError } from '../_errors/userNotFoundError'

interface GetDeliverymanByIdRequest {
  deliverymanId: string
}

interface GetDeliverymanByIdResponse {
  deliveryman: Deliveryman
}

@Injectable()
export class GetDeliverymanByIdUseCase {
  constructor(private deliverymanRepository: IDeliverymanRepository) {}

  async execute({
    deliverymanId,
  }: GetDeliverymanByIdRequest): Promise<GetDeliverymanByIdResponse> {
    const deliveryman = await this.deliverymanRepository.findById(deliverymanId)

    if (!deliveryman) {
      throw new UserNotFoundError(deliverymanId)
    }

    return {
      deliveryman,
    }
  }
}
