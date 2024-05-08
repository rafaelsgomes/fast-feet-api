import { Injectable } from '@nestjs/common'
import { Deliveryman } from '../../../enterprise/entities/deliveryman'
import { IHasher } from '../../cryptography/hasher'
import { IDeliverymanRepository } from '../../repositories/IDeliverymanRepository'
import { InvalidDocumentError } from '../_errors/invalidDocumentError'
import { UserAlreadyExistsError } from '../_errors/userAlreadyExistsError'

interface RegisterDeliverymanRequest {
  document: string
  name: string
  email: string
  password: string
}

interface RegisterDeliverymanResponse {
  deliveryman: Deliveryman
}

@Injectable()
export class RegisterDeliverymanUseCase {
  constructor(
    private deliverymanRepository: IDeliverymanRepository,
    private hasher: IHasher,
  ) {}

  async execute({
    document,
    email,
    name,
    password,
  }: RegisterDeliverymanRequest): Promise<RegisterDeliverymanResponse> {
    if (document.length < 11 || document.length > 11) {
      throw new InvalidDocumentError()
    }

    const deliverymanAlreadyExists =
      await this.deliverymanRepository.findByDocument(document)

    if (deliverymanAlreadyExists) {
      throw new UserAlreadyExistsError(document)
    }

    const deliverymanEmailAlreadyExists =
      await this.deliverymanRepository.findByEmail(email)

    if (deliverymanEmailAlreadyExists) {
      throw new UserAlreadyExistsError(email)
    }

    const passwordHash = await this.hasher.hash(password)

    const deliveryman = Deliveryman.create({
      document,
      name,
      email,
      password: passwordHash,
    })

    await this.deliverymanRepository.create(deliveryman)

    return {
      deliveryman,
    }
  }
}
