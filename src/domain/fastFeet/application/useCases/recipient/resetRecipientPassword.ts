import { Injectable } from '@nestjs/common'
import { Recipient } from '../../../enterprise/entities/recipient'
import { IHasher } from '../../cryptography/hasher'
import { IRecipientRepository } from '../../repositories/IRecipientRepository'
import { IsPasswordNotNewError } from '../_errors/isPasswordNotNewError'
import { UserNotFoundError } from '../_errors/userNotFoundError'

interface ResetRecipientPasswordRequest {
  recipientId: string
  password: string
}

interface ResetRecipientPasswordResponse {
  recipient: Recipient
}

@Injectable()
export class ResetRecipientPasswordUseCase {
  constructor(
    private recipientRepository: IRecipientRepository,
    private hasher: IHasher,
  ) {}

  async execute({
    recipientId,
    password,
  }: ResetRecipientPasswordRequest): Promise<ResetRecipientPasswordResponse> {
    const recipient = await this.recipientRepository.findById(recipientId)

    if (!recipient) {
      throw new UserNotFoundError(recipientId)
    }

    const isPasswordNotNew = await this.hasher.compare(
      password,
      recipient.password,
    )

    if (isPasswordNotNew) {
      throw new IsPasswordNotNewError()
    }

    const passwordHash = await this.hasher.hash(password)

    recipient.setNewPassword = passwordHash

    await this.recipientRepository.save(recipient)

    return {
      recipient,
    }
  }
}
