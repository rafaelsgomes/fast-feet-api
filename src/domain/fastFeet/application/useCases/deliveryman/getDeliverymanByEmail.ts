import { Injectable } from '@nestjs/common'
import { IDeliverymanRepository } from '../../repositories/IDeliverymanRepository'
import { Deliveryman } from '@/domain/fastFeet/enterprise/entities/deliveryman'
import { UserNotFoundError } from '../_errors/userNotFoundError'

interface GetDeliverymanByEmailRequest {
  email: string
}

interface GetDeliverymanByEmailResponse {
  deliveryman: Deliveryman
}

@Injectable()
export class GetDeliverymanByEmailUseCase {
  constructor(private deliverymanRepository: IDeliverymanRepository) {}

  async execute({
    email,
  }: GetDeliverymanByEmailRequest): Promise<GetDeliverymanByEmailResponse> {
    const deliveryman = await this.deliverymanRepository.findByEmail(email)

    if (!deliveryman) {
      throw new UserNotFoundError(email)
    }

    return {
      deliveryman,
    }
  }
}
