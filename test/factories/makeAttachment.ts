import {
  Attachment,
  AttachmentProps,
} from '@/domain/fastFeet/enterprise/entities/attachment'
import { PrismaAttachmentMapper } from '@/infra/database/mappers/prismaAttachmentMapper'
import { PrismaService } from '@/infra/database/prisma.service'
import { faker } from '@faker-js/faker'

import { Injectable } from '@nestjs/common'

export function makeAttachment(
  override: Partial<AttachmentProps> = {},
  id?: string,
) {
  const attachment = Attachment.create(
    {
      title: faker.lorem.slug(),
      url: faker.lorem.slug(),
      ...override,
    },
    id,
  )

  return attachment
}

@Injectable()
export class AttachmentFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaAttachment(
    data: Partial<AttachmentProps> = {},
  ): Promise<Attachment> {
    const attachment = makeAttachment(data)

    await this.prisma.attachment.create({
      data: PrismaAttachmentMapper.toDatabase(attachment),
    })

    return attachment
  }
}
