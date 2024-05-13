import { Module } from '@nestjs/common'
import { PrismaService } from './prisma.service'
import { IDeliverymanRepository } from '@/domain/fastFeet/application/repositories/IDeliverymanRepository'
import { PrismaDeliverymanRepository } from './repositories/prismaDeliverymanRepository'
import { IRecipientRepository } from '@/domain/fastFeet/application/repositories/IRecipientRepository'
import { PrismaRecipientRepository } from './repositories/prismaRecipientRepository'
import { IAdminRepository } from '@/domain/fastFeet/application/repositories/IAdminRepository'
import { PrismaAdminRepository } from './repositories/prismaAdminRepository'
import { IDeliveriesRepository } from '@/domain/fastFeet/application/repositories/IDeliveriesRepository'
import { PrismaDeliveriesRepository } from './repositories/prismaDeliveriesRepository'
import { IDeliveryAttachmentsRepository } from '@/domain/fastFeet/application/repositories/IDeliveriesAttachmentsRepository'
import { PrismaDeliveryAttachmentsRepository } from './repositories/prismaDeliveriesAttachmentsRepository'
import { IAttachmentsRepository } from '@/domain/fastFeet/application/repositories/IAttachmentsRepository'
import { PrismaAttachmentsRepository } from './repositories/prismaAttachmentsRepository'

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
    {
      provide: IDeliveriesRepository,
      useClass: PrismaDeliveriesRepository,
    },
    {
      provide: IDeliveryAttachmentsRepository,
      useClass: PrismaDeliveryAttachmentsRepository,
    },
    {
      provide: IAttachmentsRepository,
      useClass: PrismaAttachmentsRepository,
    },
  ],
  exports: [
    PrismaService,
    IDeliverymanRepository,
    IRecipientRepository,
    IAdminRepository,
    IDeliveriesRepository,
    IDeliveryAttachmentsRepository,
    IAttachmentsRepository,
  ],
})
export class DatabaseModule {}
