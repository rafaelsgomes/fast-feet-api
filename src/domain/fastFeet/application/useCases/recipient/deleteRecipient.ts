import { Injectable } from '@nestjs/common'
import { IRecipientRepository } from '../../repositories/IRecipientRepository'
import { UserNotFoundError } from '../_errors/userNotFoundError'

interface DeleteRecipientRequest {
  recipientId: string
}

interface DeleteRecipientResponse {}

@Injectable()
export class DeleteRecipientUseCase {
  constructor(private recipientRepository: IRecipientRepository) {}

  async execute({
    recipientId,
  }: DeleteRecipientRequest): Promise<DeleteRecipientResponse> {
    const recipient = await this.recipientRepository.findById(recipientId)

    if (!recipient) {
      throw new UserNotFoundError(recipientId)
    }

    await this.recipientRepository.delete(recipientId)

    return {}
  }
}
