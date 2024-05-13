import { PrismaService } from '../prisma.service'
import { Delivery } from '@/domain/fastFeet/enterprise/entities/delivery'
import { PrismaDeliveryMapper } from '../mappers/prismaDeliveryMapper'
import { Injectable } from '@nestjs/common'
import {
  FindManyNearByParams,
  IDeliveriesRepository,
} from '@/domain/fastFeet/application/repositories/IDeliveriesRepository'
import { DeliveryDetails } from '@/domain/fastFeet/enterprise/entities/valueObjects/deliveryDetails'
import { PrismaDeliveryDetailsMapper } from '../mappers/prismaDeliveryDetailsMapper'

interface fetchDeliveriesNearby {
  id: string
}

@Injectable()
export class PrismaDeliveriesRepository implements IDeliveriesRepository {
  constructor(private prismaService: PrismaService) {}
  async create(delivery: Delivery) {
    await this.prismaService.delivery.create({
      data: PrismaDeliveryMapper.toDatabase(delivery),
    })
  }

  async save(delivery: Delivery) {
    await this.prismaService.delivery.update({
      where: {
        id: delivery.id,
      },
      data: PrismaDeliveryMapper.toDatabase(delivery),
    })
  }

  async findById(deliveryId: string) {
    const delivery = await this.prismaService.delivery.findUnique({
      where: {
        id: deliveryId,
      },
    })

    if (!delivery) {
      return null
    }

    return PrismaDeliveryMapper.toDomain(delivery)
  }

  async findDetailsById(deliveryId: string): Promise<DeliveryDetails> {
    const delivery = await this.prismaService.delivery.findUnique({
      where: {
        id: deliveryId,
      },
      include: {
        deliveryman: true,
        recipient: true,
        attachments: true,
      },
    })

    if (!delivery) {
      return null
    }

    return PrismaDeliveryDetailsMapper.toDomain(delivery)
  }

  async findManyByRecipientId(recipientId: string) {
    const deliveries = await this.prismaService.delivery.findMany({
      where: {
        recipientId,
      },
    })

    return deliveries.map(PrismaDeliveryMapper.toDomain)
  }

  async findManyByDeliverymanId(deliverymanId: string) {
    const deliveries = await this.prismaService.delivery.findMany({
      where: {
        deliverymanId,
      },
    })

    return deliveries.map(PrismaDeliveryMapper.toDomain)
  }

  async findManyNearby({ latitude, longitude, userId }: FindManyNearByParams) {
    const deliveriesIds = await this.prismaService.$queryRaw<
      fetchDeliveriesNearby[]
    >`
      SELECT id from deliveries
      WHERE ( 6371 * acos( cos( radians(${latitude}) ) * cos( radians( latitude ) ) * cos( radians( longitude ) - radians(${longitude}) ) + sin( radians(${latitude}) ) * sin( radians( latitude ) ) ) ) <= 10
      AND deliveryman_id = ${userId}
    `

    const deliveries = await this.prismaService.delivery.findMany({
      where: {
        id: {
          in: deliveriesIds.map((item) => item.id),
        },
      },
    })

    return deliveries.map(PrismaDeliveryMapper.toDomain)
  }

  async delete(deliveryId: string) {
    await this.prismaService.delivery.delete({ where: { id: deliveryId } })
  }
}
