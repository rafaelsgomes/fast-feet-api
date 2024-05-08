import { Injectable } from '@nestjs/common'
import { IDeliverymanRepository } from '../../repositories/IDeliverymanRepository'
import { Deliveryman } from '@/domain/fastFeet/enterprise/entities/deliveryman'
import { UserNotFoundError } from '../_errors/userNotFoundError'

interface GetDeliverymanByDocumentRequest {
  document: string
}

interface GetDeliverymanByDocumentResponse {
  deliveryman: Deliveryman
}

@Injectable()
export class GetDeliverymanByDocumentUseCase {
  constructor(private deliverymanRepository: IDeliverymanRepository) {}

  async execute({
    document,
  }: GetDeliverymanByDocumentRequest): Promise<GetDeliverymanByDocumentResponse> {
    const deliveryman =
      await this.deliverymanRepository.findByDocument(document)

    if (!deliveryman) {
      throw new UserNotFoundError(document)
    }

    return {
      deliveryman,
    }
  }
}
