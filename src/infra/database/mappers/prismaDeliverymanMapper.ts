import { Deliveryman } from '@/domain/fastFeet/enterprise/entities/deliveryman'
import { Role } from '@/domain/fastFeet/enterprise/entities/role.enum'
import {
  User as PrismaDeliveryman,
  Prisma,
  Role as PrismaRole,
} from '@prisma/client'

export class PrismaDeliverymanMapper {
  static toDatabase(deliveryman: Deliveryman): Prisma.UserUncheckedCreateInput {
    return {
      id: deliveryman.id,
      document: deliveryman.document,
      email: deliveryman.email,
      password: deliveryman.password,
      name: deliveryman.name,
      roles: deliveryman.roles.map((item) => {
        return PrismaRole[item]
      }),
      isDeliveryman: true,
      createdAt: deliveryman.createdAt,
      updatedAt: deliveryman.updatedAt,
    }
  }

  static toDomain(raw: PrismaDeliveryman): Deliveryman {
    return Deliveryman.create(
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
