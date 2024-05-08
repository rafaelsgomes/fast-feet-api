import { Injectable } from '@nestjs/common'
import { Deliveryman } from '../../../enterprise/entities/deliveryman'
import { IDeliverymanRepository } from '../../repositories/IDeliverymanRepository'
import { UserNotFoundError } from '../_errors/userNotFoundError'

interface UpdateDeliverymanRequest {
  deliverymanId: string
  name?: string
  email?: string
}

interface UpdateDeliverymanResponse {
  deliveryman: Deliveryman
}

@Injectable()
export class UpdateDeliverymanUseCase {
  constructor(private deliverymanRepository: IDeliverymanRepository) {}

  async execute({
    deliverymanId,
    email,
    name,
  }: UpdateDeliverymanRequest): Promise<UpdateDeliverymanResponse> {
    const deliveryman = await this.deliverymanRepository.findById(deliverymanId)

    if (!deliveryman) {
      throw new UserNotFoundError(deliverymanId)
    }

    if (!name && !email) {
      return { deliveryman }
    }

    if (email) deliveryman.setNewEmail = email
    if (name) deliveryman.setNewName = name

    await this.deliverymanRepository.save(deliveryman)

    return {
      deliveryman,
    }
  }
}
