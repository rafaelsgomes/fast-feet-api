import { Injectable } from '@nestjs/common'
import { IDeliverymanRepository } from '../../repositories/IDeliverymanRepository'
import { UserNotFoundError } from '../_errors/userNotFoundError'

interface DeleteDeliverymanRequest {
  deliverymanId: string
}

interface DeleteDeliverymanResponse {}

@Injectable()
export class DeleteDeliverymanUseCase {
  constructor(private deliverymanRepository: IDeliverymanRepository) {}

  async execute({
    deliverymanId,
  }: DeleteDeliverymanRequest): Promise<DeleteDeliverymanResponse> {
    const deliveryman = await this.deliverymanRepository.findById(deliverymanId)

    if (!deliveryman) {
      throw new UserNotFoundError(deliverymanId)
    }

    await this.deliverymanRepository.delete(deliverymanId)

    return {}
  }
}
