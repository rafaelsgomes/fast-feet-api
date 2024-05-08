import { Module } from '@nestjs/common'
import { PrismaService } from './prisma.service'
import { IDeliverymanRepository } from '@/domain/fastFeet/application/repositories/IDeliverymanRepository'
import { PrismaDeliverymanRepository } from './repositories/prismaDeliverymanRepository'
import { IRecipientRepository } from '@/domain/fastFeet/application/repositories/IRecipientRepository'
import { PrismaRecipientRepository } from './repositories/prismaRecipientRepository'
import { IAdminRepository } from '@/domain/fastFeet/application/repositories/IAdminRepository'
import { PrismaAdminRepository } from './repositories/prismaAdminRepository'

@Module({
  providers: [
    PrismaService,
    {
      provide: IDeliverymanRepository,
      useClass: PrismaDeliverymanRepository,
    },
    {
      provide: IRecipientRepository,
      useClass: PrismaRecipientRepository,
    },
    {
      provide: IAdminRepository,
      useClass: PrismaAdminRepository,
    },
  ],
  exports: [
    PrismaService,
    IDeliverymanRepository,
    IRecipientRepository,
    IAdminRepository,
  ],
})
export class DatabaseModule {}
