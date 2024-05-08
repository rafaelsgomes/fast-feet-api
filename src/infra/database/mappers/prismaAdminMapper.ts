import { Admin } from '@/domain/fastFeet/enterprise/entities/admin'
import { Role } from '@/domain/fastFeet/enterprise/entities/role.enum'
import { User as PrismaAdmin, Prisma, Role as PrismaRole } from '@prisma/client'

export class PrismaAdminMapper {
  static toDatabase(admin: Admin): Prisma.UserUncheckedCreateInput {
    return {
      id: admin.id,
      document: admin.document,
      email: admin.email,
      password: admin.password,
      name: admin.name,
      roles: admin.roles.map((item) => {
        return PrismaRole[item]
      }),
      isDeliveryman: false,
      createdAt: admin.createdAt,
      updatedAt: admin.updatedAt,
    }
  }

  static toDomain(raw: PrismaAdmin): Admin {
    return Admin.create(
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
