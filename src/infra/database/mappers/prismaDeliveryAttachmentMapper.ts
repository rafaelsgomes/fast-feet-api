import { DeliveryAttachment } from '@/domain/fastFeet/enterprise/entities/deliveryAttachment'
import { Attachment as PrismaAttachment, Prisma } from '@prisma/client'

export class PrismaDeliveryAttachmentMapper {
  static toDomain(raw: PrismaAttachment): DeliveryAttachment {
    return DeliveryAttachment.create(
      {
        attachmentId: raw.id,
        deliveryId: raw.deliveryId,
      },
      raw.id,
    )
  }

  static toPrismaUpdateMany(
    attachments: DeliveryAttachment[],
  ): Prisma.AttachmentUpdateManyArgs {
    const attachmentsIds = attachments.map((attachment) => {
      return attachment.attachmentId
    })

    return {
      where: {
        id: {
          in: attachmentsIds,
        },
      },
      data: {
        deliveryId: attachments[0].deliveryId,
      },
    }
  }
}
