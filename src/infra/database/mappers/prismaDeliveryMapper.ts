import { Delivery } from '@/domain/fastFeet/enterprise/entities/delivery'
import { Delivery as PrismaDelivery, Prisma } from '@prisma/client'

export class PrismaDeliveryMapper {
  static toDatabase(delivery: Delivery): Prisma.DeliveryUncheckedCreateInput {
    return {
      id: delivery.id,
      longitude: delivery.longitude,
      latitude: delivery.latitude,
      zipCode: delivery.zipCode,
      address: delivery.address,
      city: delivery.city,
      state: delivery.state,
      additionalAddressInformation: delivery.additionalAddressInformation,
      recipientId: delivery.recipientId,
      deliverymanId: delivery.deliverymanId,
      availableAt: delivery.availableAt,
      pickupAt: delivery.pickupAt,
      deliveredAt: delivery.deliveredAt,
      returnedAt: delivery.returnedAt,
      createdAt: delivery.createdAt,
      updatedAt: delivery.updatedAt,
    }
  }

  static toDomain(raw: PrismaDelivery): Delivery {
    return Delivery.create(
      {
        additionalAddressInformation: raw.additionalAddressInformation,
        address: raw.address,
        city: raw.city,
        latitude: raw.latitude.toNumber(),
        longitude: raw.longitude.toNumber(),
        recipientId: raw.recipientId,
        state: raw.state,
        zipCode: raw.zipCode,
        availableAt: raw.availableAt,
        deliveredAt: raw.deliveredAt,
        deliverymanId: raw.deliverymanId,
        pickupAt: raw.pickupAt,
        returnedAt: raw.returnedAt,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      raw.id,
    )
  }
}
