import { Injectable } from '@nestjs/common'
import { IRecipientRepository } from '../../repositories/IRecipientRepository'
import { Recipient } from '@/domain/fastFeet/enterprise/entities/recipient'
import { UserNotFoundError } from '../_errors/userNotFoundError'

interface GetRecipientByIdRequest {
  recipientId: string
}

interface GetRecipientByIdResponse {
  recipient: Recipient
}

@Injectable()
export class GetRecipientByIdUseCase {
  constructor(private recipientRepository: IRecipientRepository) {}

  async execute({
    recipientId,
  }: GetRecipientByIdRequest): Promise<GetRecipientByIdResponse> {
    const recipient = await this.recipientRepository.findById(recipientId)

    if (!recipient) {
      throw new UserNotFoundError(recipientId)
    }

    return {
      recipient,
    }
  }
}
