import { IDeliveryAttachmentsRepository } from '@/domain/fastFeet/application/repositories/IDeliveriesAttachmentsRepository'
import { DeliveryAttachment } from '@/domain/fastFeet/enterprise/entities/deliveryAttachment'

export class InMemoryDeliveriesAttachmentsRepository
  implements IDeliveryAttachmentsRepository
{
  public items: DeliveryAttachment[] = []

  async createMany(attachments: DeliveryAttachment[]): Promise<void> {
    this.items.push(...attachments)
  }

  async deleteMany(attachments: DeliveryAttachment[]): Promise<void> {
    const deliveryAttachments = this.items.filter(
      (item) => !attachments.some((attachment) => attachment.equals(item)),
    )

    this.items = deliveryAttachments
  }

  async findManyByDeliveryId(
    deliveryId: string,
  ): Promise<DeliveryAttachment[]> {
    const deliveryAttachments = this.items.filter(
      (item) => item.deliveryId.toString() === deliveryId,
    )

    return deliveryAttachments
  }

  async deleteManyByDeliveryId(deliveryId: string): Promise<void> {
    const deliveryAttachments = this.items.filter(
      (item) => item.deliveryId !== deliveryId,
    )

    this.items = deliveryAttachments
  }
}
