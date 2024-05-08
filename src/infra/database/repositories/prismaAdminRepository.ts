import { IAdminRepository } from '@/domain/fastFeet/application/repositories/IAdminRepository'
import { PrismaService } from '../prisma.service'
import { Admin } from '@/domain/fastFeet/enterprise/entities/admin'
import { PrismaAdminMapper } from '../mappers/prismaAdminMapper'
import { Injectable } from '@nestjs/common'

@Injectable()
export class PrismaAdminRepository implements IAdminRepository {
  constructor(private prismaService: PrismaService) {}

  async create(admin: Admin) {
    await this.prismaService.user.create({
      data: PrismaAdminMapper.toDatabase(admin),
    })
  }

  async save(admin: Admin) {
    await this.prismaService.user.update({
      where: {
        id: admin.id,
      },
      data: PrismaAdminMapper.toDatabase(admin),
    })
  }

  async findByDocument(document: string) {
    const admin = await this.prismaService.user.findUnique({
      where: {
        document,
      },
    })

    if (!admin) {
      return null
    }

    return PrismaAdminMapper.toDomain(admin)
  }

  async findByEmail(email: string) {
    const admin = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    })

    if (!admin) {
      return null
    }

    return PrismaAdminMapper.toDomain(admin)
  }

  async findById(adminId: string) {
    const admin = await this.prismaService.user.findUnique({
      where: {
        id: adminId,
      },
    })

    if (!admin) {
      return null
    }

    return PrismaAdminMapper.toDomain(admin)
  }

  async delete(adminId: string) {
    await this.prismaService.user.delete({ where: { id: adminId } })
  }
}
