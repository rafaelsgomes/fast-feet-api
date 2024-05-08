import { DeliveryAttachment } from '../../enterprise/entities/deliveryAttachment'

export abstract class IDeliveryAttachmentsRepository {
  abstract createMany(attachments: DeliveryAttachment[]): Promise<void>
  abstract deleteMany(attachments: DeliveryAttachment[]): Promise<void>
  abstract findManyByDeliveryId(
    deliveryId: string,
  ): Promise<DeliveryAttachment[]>

  abstract deleteManyByDeliveryId(deliveryId: string): Promise<void>
}
