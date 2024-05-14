import { Delivery } from '@/domain/fastFeet/enterprise/entities/delivery'
import { IDeliveriesRepository } from '../../repositories/IDeliveriesRepository'
import { ResourceNotFoundError } from '@/core/errors/errors/resourceNotFoundError'
import { NotAllowedError } from '../_errors/notAllowedError'
import { DeliveryAttachment } from '@/domain/fastFeet/enterprise/entities/deliveryAttachment'
import { Injectable } from '@nestjs/common'
import { IAttachmentsRepository } from '../../repositories/IAttachmentsRepository'
import { AttachmentsNotFoundError } from '../_errors/attachmentsNotFoundError'

interface SetDeliveryAsDeliveredRequest {
  deliveryId: string
  deliverymanId: string
  attachmentsIds: string[]
}

interface SetDeliveryAsDeliveredResponse {
  delivery: Delivery
}
@Injectable()
export class SetDeliveryAsDeliveredUseCase {
  constructor(
    private deliveriesRepository: IDeliveriesRepository,
    private attachmentsRepository: IAttachmentsRepository,
  ) {}

  async execute({
    deliveryId,
    deliverymanId,
    attachmentsIds,
  }: SetDeliveryAsDeliveredRequest): Promise<SetDeliveryAsDeliveredResponse> {
    const delivery = await this.deliveriesRepository.findById(deliveryId)

    if (!delivery) {
      throw new ResourceNotFoundError()
    }

    if (delivery.deliverymanId !== deliverymanId) {
      throw new NotAllowedError()
    }

    const attachmentsIsValid =
      await this.attachmentsRepository.findManyByIds(attachmentsIds)

    if (attachmentsIsValid.length < 1) {
      throw new AttachmentsNotFoundError()
    }

    const attachments = attachmentsIds.map((attachmentId) => {
      return DeliveryAttachment.create({
        attachmentId,
        deliveryId: delivery.id,
      })
    })

    delivery.setDelivered(attachments)

    this.deliveriesRepository.save(delivery)

    return {
      delivery,
    }
  }
}
