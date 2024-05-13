import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PrismaAttachmentMapper } from '../mappers/prismaAttachmentMapper'
import { IAttachmentsRepository } from '@/domain/fastFeet/application/repositories/IAttachmentsRepository'
import { Attachment } from '@/domain/fastFeet/enterprise/entities/attachment'

@Injectable()
export class PrismaAttachmentsRepository implements IAttachmentsRepository {
  constructor(private prisma: PrismaService) {}
  async create(attachment: Attachment): Promise<void> {
    await this.prisma.attachment.create({
      data: PrismaAttachmentMapper.toDatabase(attachment),
    })
  }

  async findById(attachmentId: string): Promise<Attachment | null> {
    const attachment = await this.prisma.attachment.findUnique({
      where: {
        id: attachmentId,
      },
    })

    if (!attachment) {
      return null
    }

    return PrismaAttachmentMapper.toDomain(attachment)
  }

  async findManyByIds(attachmentIds: string[]): Promise<Attachment[]> {
    const attachments = await this.prisma.attachment.findMany({
      where: {
        id: {
          in: attachmentIds,
        },
      },
    })

    return attachments.map(PrismaAttachmentMapper.toDomain)
  }
}
