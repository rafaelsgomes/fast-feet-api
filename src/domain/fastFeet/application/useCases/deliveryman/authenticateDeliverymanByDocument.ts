import { Injectable } from '@nestjs/common'
import { IEncrypter } from '../../cryptography/encryper'
import { IHasher } from '../../cryptography/hasher'
import { IDeliverymanRepository } from '../../repositories/IDeliverymanRepository'
import { InvalidDocumentError } from '../_errors/invalidDocumentError'
import { WrongCredentialsError } from '../_errors/wrongCredentialsError'

interface AuthenticateDeliverymanByDocumentRequest {
  document: string
  password: string
}

interface AuthenticateDeliverymanByDocumentResponse {
  accessToken: string
}

@Injectable()
export class AuthenticateDeliverymanByDocumentUseCase {
  constructor(
    private deliverymanRepository: IDeliverymanRepository,
    private hasher: IHasher,
    private encrypter: IEncrypter,
  ) {}

  async execute({
    document,
    password,
  }: AuthenticateDeliverymanByDocumentRequest): Promise<AuthenticateDeliverymanByDocumentResponse> {
    if (document.length < 11 || document.length > 11) {
      throw new InvalidDocumentError()
    }
    const deliveryman =
      await this.deliverymanRepository.findByDocument(document)

    if (!deliveryman) {
      throw new WrongCredentialsError()
    }

    const isPasswordMatch = await this.hasher.compare(
      password,
      deliveryman.password,
    )

    if (!isPasswordMatch) {
      throw new WrongCredentialsError()
    }

    const accessToken = await this.encrypter.encrypt({
      sub: deliveryman.id,
    })

    return {
      accessToken,
    }
  }
}
