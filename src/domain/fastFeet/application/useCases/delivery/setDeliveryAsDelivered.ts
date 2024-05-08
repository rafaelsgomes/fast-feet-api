import { Delivery } from '@/domain/fastFeet/enterprise/entities/delivery'
import { IDeliveriesRepository } from '../../repositories/IDeliveriesRepository'
import { ResourceNotFoundError } from '@/core/errors/errors/resourceNotFoundError'
import { NotAllowedError } from '../_errors/notAllowedError'
import { DeliveryAttachment } from '@/domain/fastFeet/enterprise/entities/deliveryAttachment'
import { DeliveryAttachmentList } from '@/domain/fastFeet/enterprise/entities/deliveryAttachmentsList'

interface SetDeliveryAsDeliveredRequest {
  deliveryId: string
  deliverymanId: string
  attachmentsIds: string[]
}

interface SetDeliveryAsDeliveredResponse {
  delivery: Delivery
}

export class SetDeliveryAsDeliveredUseCase {
  constructor(private deliveriesRepository: IDeliveriesRepository) {}

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

    const attachments = attachmentsIds.map((attachmentId) => {
      return DeliveryAttachment.create({
        attachmentId,
        deliveryId: delivery.id,
      })
    })

    delivery.attachments = new DeliveryAttachmentList(attachments)

    delivery.deliveredAt = new Date()

    this.deliveriesRepository.save(delivery)

    return {
      delivery,
    }
  }
}
