import { Recipient } from '@/domain/fastFeet/enterprise/entities/recipient'
import { Role } from '@/domain/fastFeet/enterprise/entities/role.enum'
import {
  User as PrismaRecipient,
  Prisma,
  Role as PrismaRole,
} from '@prisma/client'

export class PrismaRecipientMapper {
  static toDatabase(recipient: Recipient): Prisma.UserUncheckedCreateInput {
    return {
      id: recipient.id,
      document: recipient.document,
      email: recipient.email,
      password: recipient.password,
      name: recipient.name,
      roles: recipient.roles.map((item) => {
        return PrismaRole[item]
      }),
      isDeliveryman: false,
      createdAt: recipient.createdAt,
      updatedAt: recipient.updatedAt,
    }
  }

  static toDomain(raw: PrismaRecipient): Recipient {
    return Recipient.create(
      {
        document: raw.document,
        email: raw.email,
        password: raw.password,
        name: raw.name,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
        roles: raw.roles.map((item) => {
          return Role[item]
        }),
      },
      raw.id,
    )
  }
}
