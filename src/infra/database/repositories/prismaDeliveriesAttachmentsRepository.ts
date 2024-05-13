import { PrismaService } from '../prisma.service'
import { Injectable } from '@nestjs/common'
import { IDeliveryAttachmentsRepository } from '@/domain/fastFeet/application/repositories/IDeliveriesAttachmentsRepository'
import { DeliveryAttachment } from '@/domain/fastFeet/enterprise/entities/deliveryAttachment'
import { PrismaDeliveryAttachmentMapper } from '../mappers/prismaDeliveryAttachmentMapper'

@Injectable()
export class PrismaDeliveryAttachmentsRepository
  implements IDeliveryAttachmentsRepository
{
  constructor(private prisma: PrismaService) {}

  async createMany(attachments: DeliveryAttachment[]): Promise<void> {
    if (attachments.length === 0) {
      return
    }

    const data = PrismaDeliveryAttachmentMapper.toPrismaUpdateMany(attachments)

    await this.prisma.attachment.updateMany(data)
  }

  async deleteMany(attachments: DeliveryAttachment[]): Promise<void> {
    const attachmentsIds = attachments.map((attachment) => {
      return attachment.attachmentId.toString()
    })

    await this.prisma.attachment.deleteMany({
      where: {
        id: {
          in: attachmentsIds,
        },
      },
    })
  }

  async findManyByDeliveryId(
    deliveryId: string,
  ): Promise<DeliveryAttachment[]> {
    const deliveryAttachments = await this.prisma.attachment.findMany({
      where: {
        deliveryId,
      },
    })

    return deliveryAttachments.map(PrismaDeliveryAttachmentMapper.toDomain)
  }

  async deleteManyByDeliveryId(deliveryId: string): Promise<void> {
    await this.prisma.attachment.deleteMany({
      where: {
        id: deliveryId,
      },
    })
  }
}
