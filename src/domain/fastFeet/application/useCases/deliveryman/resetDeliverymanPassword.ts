import { Injectable } from '@nestjs/common'
import { Deliveryman } from '../../../enterprise/entities/deliveryman'
import { IHasher } from '../../cryptography/hasher'
import { IDeliverymanRepository } from '../../repositories/IDeliverymanRepository'
import { IsPasswordNotNewError } from '../_errors/isPasswordNotNewError'
import { UserNotFoundError } from '../_errors/userNotFoundError'

interface ResetDeliverymanPasswordRequest {
  deliverymanId: string
  password: string
}

interface ResetDeliverymanPasswordResponse {
  deliveryman: Deliveryman
}

@Injectable()
export class ResetDeliverymanPasswordUseCase {
  constructor(
    private deliverymanRepository: IDeliverymanRepository,
    private hasher: IHasher,
  ) {}

  async execute({
    deliverymanId,
    password,
  }: ResetDeliverymanPasswordRequest): Promise<ResetDeliverymanPasswordResponse> {
    const deliveryman = await this.deliverymanRepository.findById(deliverymanId)

    if (!deliveryman) {
      throw new UserNotFoundError(deliverymanId)
    }

    const isPasswordNotNew = await this.hasher.compare(
      password,
      deliveryman.password,
    )

    if (isPasswordNotNew) {
      throw new IsPasswordNotNewError()
    }

    const passwordHash = await this.hasher.hash(password)

    deliveryman.setNewPassword = passwordHash

    await this.deliverymanRepository.save(deliveryman)

    return {
      deliveryman,
    }
  }
}
