import { Injectable } from '@nestjs/common'
import { IRecipientRepository } from '../../repositories/IRecipientRepository'
import { Recipient } from '@/domain/fastFeet/enterprise/entities/recipient'
import { UserNotFoundError } from '../_errors/userNotFoundError'

interface GetRecipientByEmailRequest {
  email: string
}

interface GetRecipientByEmailResponse {
  recipient: Recipient
}

@Injectable()
export class GetRecipientByEmailUseCase {
  constructor(private recipientRepository: IRecipientRepository) {}

  async execute({
    email,
  }: GetRecipientByEmailRequest): Promise<GetRecipientByEmailResponse> {
    const recipient = await this.recipientRepository.findByEmail(email)

    if (!recipient) {
      throw new UserNotFoundError(email)
    }

    return {
      recipient,
    }
  }
}
