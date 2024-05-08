import {
  Recipient,
  RecipientProps,
} from '@/domain/fastFeet/enterprise/entities/recipient'
import { PrismaRecipientMapper } from '@/infra/database/mappers/prismaRecipientMapper'
import { PrismaService } from '@/infra/database/prisma.service'
import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'

export function makeRecipient(
  override: Partial<RecipientProps> = {},
  id?: string,
) {
  const recipient = Recipient.create(
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
  return recipient
}

@Injectable()
export class RecipientFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaRecipient(
    data: Partial<RecipientProps> = {},
  ): Promise<Recipient> {
    const recipient = makeRecipient(data)

    await this.prisma.user.create({
      data: PrismaRecipientMapper.toDatabase(recipient),
    })

    return recipient
  }
}
