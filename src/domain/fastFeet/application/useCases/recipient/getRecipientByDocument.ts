import { Injectable } from '@nestjs/common'
import { IRecipientRepository } from '../../repositories/IRecipientRepository'
import { Recipient } from '@/domain/fastFeet/enterprise/entities/recipient'
import { UserNotFoundError } from '../_errors/userNotFoundError'

interface GetRecipientByDocumentRequest {
  document: string
}

interface GetRecipientByDocumentResponse {
  recipient: Recipient
}

@Injectable()
export class GetRecipientByDocumentUseCase {
  constructor(private recipientRepository: IRecipientRepository) {}

  async execute({
    document,
  }: GetRecipientByDocumentRequest): Promise<GetRecipientByDocumentResponse> {
    const recipient = await this.recipientRepository.findByDocument(document)

    if (!recipient) {
      throw new UserNotFoundError(document)
    }

    return {
      recipient,
    }
  }
}
