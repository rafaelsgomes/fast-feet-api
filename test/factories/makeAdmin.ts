import { Admin, AdminProps } from '@/domain/fastFeet/enterprise/entities/admin'
import { Role } from '@/domain/fastFeet/enterprise/entities/role.enum'
import { PrismaService } from '@/infra/database/prisma.service'
import { PrismaAdminMapper } from '@/infra/database/mappers/prismaAdminMapper'
import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'

export function makeAdmin(override: Partial<AdminProps> = {}, id?: string) {
  const admin = Admin.create(
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
      roles: [Role.ADMIN],
      ...override,
    },
    id,
  )
  return admin
}

@Injectable()
export class AdminFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaAdmin(data: Partial<AdminProps> = {}): Promise<Admin> {
    const admin = makeAdmin(data)

    await this.prisma.user.create({
      data: PrismaAdminMapper.toDatabase(admin),
    })

    return admin
  }
}
