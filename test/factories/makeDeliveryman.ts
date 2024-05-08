import {
  Deliveryman,
  DeliverymanProps,
} from '@/domain/fastFeet/enterprise/entities/deliveryman'
import { PrismaDeliverymanMapper } from '@/infra/database/mappers/prismaDeliverymanMapper'
import { PrismaService } from '@/infra/database/prisma.service'
import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'

export function makeDeliveryman(
  override: Partial<DeliverymanProps> = {},
  id?: string,
) {
  const deliveryman = Deliveryman.create(
    {
      document: faker.string.numeric({
        length: {
          min: 11,
          max: 11,
        },
      }),
      email: faker.internet.email(),
      password: faker.internet.password(),
      name: faker.lorem.word(),
      ...override,
    },
    id,
  )
  return deliveryman
}

@Injectable()
export class DeliverymanFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaDeliveryman(
    data: Partial<DeliverymanProps> = {},
  ): Promise<Deliveryman> {
    const deliveryman = makeDeliveryman(data)

    await this.prisma.user.create({
      data: PrismaDeliverymanMapper.toDatabase(deliveryman),
    })

    return deliveryman
  }
}
