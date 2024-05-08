import { Injectable } from '@nestjs/common'
import { IEncrypter } from '../../cryptography/encryper'
import { IHasher } from '../../cryptography/hasher'
import { IRecipientRepository } from '../../repositories/IRecipientRepository'
import { InvalidDocumentError } from '../_errors/invalidDocumentError'
import { WrongCredentialsError } from '../_errors/wrongCredentialsError'

interface AuthenticateRecipientByDocumentRequest {
  document: string
  password: string
}

interface AuthenticateRecipientByDocumentResponse {
  accessToken: string
}

@Injectable()
export class AuthenticateRecipientByDocumentUseCase {
  constructor(
    private recipientRepository: IRecipientRepository,
    private hasher: IHasher,
    private encrypter: IEncrypter,
  ) {}

  async execute({
    document,
    password,
  }: AuthenticateRecipientByDocumentRequest): Promise<AuthenticateRecipientByDocumentResponse> {
    if (document.length < 11 || document.length > 11) {
      throw new InvalidDocumentError()
    }
    const recipient = await this.recipientRepository.findByDocument(document)

    if (!recipient) {
      throw new WrongCredentialsError()
    }

    const isPasswordMatch = await this.hasher.compare(
      password,
      recipient.password,
    )

    if (!isPasswordMatch) {
      throw new WrongCredentialsError()
    }

    const accessToken = await this.encrypter.encrypt({
      sub: recipient.id,
    })

    return {
      accessToken,
    }
  }
}
