import { Injectable } from '@nestjs/common'
import { Recipient } from '../../../enterprise/entities/recipient'
import { IHasher } from '../../cryptography/hasher'
import { IRecipientRepository } from '../../repositories/IRecipientRepository'
import { InvalidDocumentError } from '../_errors/invalidDocumentError'
import { UserAlreadyExistsError } from '../_errors/userAlreadyExistsError'

interface RegisterRecipientRequest {
  document: string
  name: string
  email: string
  password: string
}

interface RegisterRecipientResponse {
  recipient: Recipient
}

@Injectable()
export class RegisterRecipientUseCase {
  constructor(
    private recipientRepository: IRecipientRepository,
    private hasher: IHasher,
  ) {}

  async execute({
    document,
    email,
    name,
    password,
  }: RegisterRecipientRequest): Promise<RegisterRecipientResponse> {
    if (document.length < 11 || document.length > 11) {
      throw new InvalidDocumentError()
    }

    const recipientAlreadyExists =
      await this.recipientRepository.findByDocument(document)

    if (recipientAlreadyExists) {
      throw new UserAlreadyExistsError(document)
    }

    const recipientEmailAlreadyExists =
      await this.recipientRepository.findByEmail(email)

    if (recipientEmailAlreadyExists) {
      throw new UserAlreadyExistsError(email)
    }

    const passwordHash = await this.hasher.hash(password)

    const recipient = Recipient.create({
      document,
      name,
      email,
      password: passwordHash,
    })

    await this.recipientRepository.create(recipient)

    return {
      recipient,
    }
  }
}
