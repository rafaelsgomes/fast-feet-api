import { Module } from '@nestjs/common'
import { DatabaseModule } from '@/infra/database/database.module'
import { ReadNotificationController } from './readNotification.controller'
import { ReadNotificationUseCase } from '@/domain/notification/application/useCases/readNotification'

@Module({
  imports: [DatabaseModule],
  controllers: [ReadNotificationController],
  providers: [ReadNotificationUseCase],
})
export class NotificationHttpModule {}
