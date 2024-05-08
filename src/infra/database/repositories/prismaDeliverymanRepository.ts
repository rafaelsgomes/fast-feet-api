import { IDeliverymanRepository } from '@/domain/fastFeet/application/repositories/IDeliverymanRepository'
import { PrismaService } from '../prisma.service'
import { Deliveryman } from '@/domain/fastFeet/enterprise/entities/deliveryman'
import { PrismaDeliverymanMapper } from '../mappers/prismaDeliverymanMapper'
import { Injectable } from '@nestjs/common'

@Injectable()
export class PrismaDeliverymanRepository implements IDeliverymanRepository {
  constructor(private prismaService: PrismaService) {}

  async create(deliveryman: Deliveryman) {
    await this.prismaService.user.create({
      data: PrismaDeliverymanMapper.toDatabase(deliveryman),
    })
  }

  async save(deliveryman: Deliveryman) {
    await this.prismaService.user.update({
      where: {
        id: deliveryman.id,
      },
      data: PrismaDeliverymanMapper.toDatabase(deliveryman),
    })
  }

  async findByDocument(document: string) {
    const deliveryman = await this.prismaService.user.findUnique({
      where: {
        document,
      },
    })

    if (!deliveryman) {
      return null
    }

    return PrismaDeliverymanMapper.toDomain(deliveryman)
  }

  async findByEmail(email: string) {
    const deliveryman = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    })

    if (!deliveryman) {
      return null
    }

    return PrismaDeliverymanMapper.toDomain(deliveryman)
  }

  async findById(deliverymanId: string) {
    const deliveryman = await this.prismaService.user.findUnique({
      where: {
        id: deliverymanId,
      },
    })

    if (!deliveryman) {
      return null
    }

    return PrismaDeliverymanMapper.toDomain(deliveryman)
  }

  async delete(deliverymanId: string) {
    await this.prismaService.user.delete({ where: { id: deliverymanId } })
  }
}
