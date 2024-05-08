import { Injectable } from '@nestjs/common'
import { IDeliverymanRepository } from '../../repositories/IDeliverymanRepository'
import { UserNotFoundError } from '../_errors/userNotFoundError'
import { Deliveryman } from '@/domain/fastFeet/enterprise/entities/deliveryman'
import { InformationNotProvidedError } from '../_errors/informationNotProvidedError'

interface UpdateDeliverymanAllInfoRequest {
  deliverymanId: string
  name?: string
  email?: string
  document?: string
}

interface UpdateDeliverymanAllInfoResponse {
  deliveryman: Deliveryman
}

@Injectable()
export class UpdateDeliverymanAllInfoUseCase {
  constructor(private deliverymanRepository: IDeliverymanRepository) {}

  async execute({
    deliverymanId,
    email,
    name,
    document,
  }: UpdateDeliverymanAllInfoRequest): Promise<UpdateDeliverymanAllInfoResponse> {
    if (!name && !email && !document) {
      throw new InformationNotProvidedError()
    }

    const deliveryman = await this.deliverymanRepository.findById(deliverymanId)

    if (!deliveryman) {
      throw new UserNotFoundError(deliverymanId)
    }

    if (email && email !== deliveryman.email) deliveryman.setNewEmail = email
    if (name && name !== deliveryman.name) deliveryman.setNewName = name
    if (document && document !== deliveryman.document)
      deliveryman.setNewDocument = document

    await this.deliverymanRepository.save(deliveryman)

    return {
      deliveryman,
    }
  }
}
