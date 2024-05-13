import {
  Delivery,
  DeliveryProps,
} from '@/domain/fastFeet/enterprise/entities/delivery'
import { PrismaDeliveryMapper } from '@/infra/database/mappers/prismaDeliveryMapper'
import { PrismaService } from '@/infra/database/prisma.service'
import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'

export function makeDelivery(
  override: Partial<DeliveryProps> = {},
  id?: string,
) {
  const delivery = Delivery.create(
    {
      additionalAddressInformation: faker.location.secondaryAddress(),
      address: faker.location.streetAddress(),
      longitude: faker.location.longitude(),
      latitude: faker.location.latitude(),
      zipCode: faker.location.zipCode(),
      city: faker.location.city(),
      state: faker.location.state(),
      recipientId: faker.string.uuid(),
      ...override,
    },
    id,
  )
  return delivery
}

@Injectable()
export class DeliveryFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaDelivery(
    data: Partial<DeliveryProps> = {},
  ): Promise<Delivery> {
    const delivery = makeDelivery(data)

    await this.prisma.delivery.create({
      data: PrismaDeliveryMapper.toDatabase(delivery),
    })

    return delivery
  }
}
