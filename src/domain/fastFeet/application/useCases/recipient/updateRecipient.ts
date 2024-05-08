import { Injectable } from '@nestjs/common'
import { Recipient } from '../../../enterprise/entities/recipient'
import { IRecipientRepository } from '../../repositories/IRecipientRepository'
import { UserNotFoundError } from '../_errors/userNotFoundError'

interface UpdateRecipientRequest {
  recipientId: string
  name?: string
  email?: string
}

interface UpdateRecipientResponse {
  recipient: Recipient
}

@Injectable()
export class UpdateRecipientUseCase {
  constructor(private recipientRepository: IRecipientRepository) {}

  async execute({
    recipientId,
    email,
    name,
  }: UpdateRecipientRequest): Promise<UpdateRecipientResponse> {
    const recipient = await this.recipientRepository.findById(recipientId)

    if (!recipient) {
      throw new UserNotFoundError(recipientId)
    }

    if (!name && !email) {
      return { recipient }
    }

    if (email) recipient.setNewEmail = email
    if (name) recipient.setNewName = name

    await this.recipientRepository.save(recipient)

    return {
      recipient,
    }
  }
}
