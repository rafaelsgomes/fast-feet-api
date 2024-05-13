import { IRecipientRepository } from '@/domain/fastFeet/application/repositories/IRecipientRepository'
import { PrismaService } from '../prisma.service'
import { Recipient } from '@/domain/fastFeet/enterprise/entities/recipient'
import { PrismaRecipientMapper } from '../mappers/prismaRecipientMapper'
import { Injectable } from '@nestjs/common'

@Injectable()
export class PrismaRecipientRepository implements IRecipientRepository {
  constructor(private prismaService: PrismaService) {}

  async create(recipient: Recipient) {
    await this.prismaService.user.create({
      data: PrismaRecipientMapper.toDatabase(recipient),
    })
  }

  async save(recipient: Recipient) {
    await this.prismaService.user.update({
      where: {
        id: recipient.id,
      },
      data: PrismaRecipientMapper.toDatabase(recipient),
    })
  }

  async findByDocument(document: string) {
    const recipient = await this.prismaService.user.findUnique({
      where: {
        document,
        isDeliveryman: false,
      },
    })

    if (!recipient) {
      return null
    }

    return PrismaRecipientMapper.toDomain(recipient)
  }

  async findByEmail(email: string) {
    const recipient = await this.prismaService.user.findUnique({
      where: {
        email,
        isDeliveryman: false,
      },
    })

    if (!recipient) {
      return null
    }

    return PrismaRecipientMapper.toDomain(recipient)
  }

  async findById(recipientId: string) {
    const recipient = await this.prismaService.user.findUnique({
      where: {
        id: recipientId,
        isDeliveryman: false,
      },
    })

    if (!recipient) {
      return null
    }

    return PrismaRecipientMapper.toDomain(recipient)
  }

  async delete(recipientId: string) {
    await this.prismaService.user.delete({ where: { id: recipientId } })
  }
}
