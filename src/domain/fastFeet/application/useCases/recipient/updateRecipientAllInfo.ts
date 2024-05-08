import { Injectable } from '@nestjs/common'
import { IRecipientRepository } from '../../repositories/IRecipientRepository'
import { UserNotFoundError } from '../_errors/userNotFoundError'
import { Recipient } from '@/domain/fastFeet/enterprise/entities/recipient'
import { InformationNotProvidedError } from '../_errors/informationNotProvidedError'

interface UpdateRecipientAllInfoRequest {
  recipientId: string
  name?: string
  email?: string
  document?: string
}

interface UpdateRecipientAllInfoResponse {
  recipient: Recipient
}

@Injectable()
export class UpdateRecipientAllInfoUseCase {
  constructor(private recipientRepository: IRecipientRepository) {}

  async execute({
    recipientId,
    email,
    name,
    document,
  }: UpdateRecipientAllInfoRequest): Promise<UpdateRecipientAllInfoResponse> {
    if (!name && !email && !document) {
      throw new InformationNotProvidedError()
    }
    const recipient = await this.recipientRepository.findById(recipientId)

    if (!recipient) {
      throw new UserNotFoundError(recipientId)
    }

    if (email && email !== recipient.email) recipient.setNewEmail = email
    if (name && name !== recipient.name) recipient.setNewName = name
    if (document && document !== recipient.document)
      recipient.setNewDocument = document

    await this.recipientRepository.save(recipient)

    return {
      recipient,
    }
  }
}
