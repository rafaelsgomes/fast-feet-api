import { DeliveryDetails } from '@/domain/fastFeet/enterprise/entities/valueObjects/deliveryDetails'
import {
  Delivery as PrismaDelivery,
  User as PrismaUser,
  Attachment as PrismaAttachment,
} from '@prisma/client'
import { PrismaAttachmentMapper } from './prismaAttachmentMapper'

type PrismaDeliveryDetails = PrismaDelivery & {
  recipient: PrismaUser
  deliveryman: PrismaUser
  attachments: PrismaAttachment[]
}

export class PrismaDeliveryDetailsMapper {
  static toDomain(raw: PrismaDeliveryDetails): DeliveryDetails {
    return DeliveryDetails.create({
      additionalAddressInformation: raw.additionalAddressInformation,
      address: raw.address,
      attachments: raw.attachments.map(PrismaAttachmentMapper.toDomain),
      city: raw.city,
      createdAt: raw.createdAt,
      deliveryId: raw.id,
      recipientId: raw.recipient ? raw.recipient.id : null,
      recipientName: raw.recipient ? raw.recipient.name : null,
      state: raw.state,
      zipCode: raw.zipCode,
      availableAt: raw.availableAt,
      deliveredAt: raw.deliveredAt,
      deliverymanId: raw.deliveryman ? raw.deliveryman.id : null,
      deliverymanName: raw.deliveryman ? raw.deliveryman.name : null,
      pickupAt: raw.pickupAt,
      returnedAt: raw.returnedAt,
      updatedAt: raw.updatedAt,
    })
  }
}
