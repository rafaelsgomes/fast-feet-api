import { SendNotificationUseCase } from '@/domain/notification/application/useCases/sendNotification'
import { Module } from '@nestjs/common'
import { DatabaseModule } from '../database/database.module'
import { OnDeliveryAvailable } from '@/domain/notification/application/subscribers/onDeliveryAvailable'
import { OnDeliveryCreated } from '@/domain/notification/application/subscribers/onDeliveryCreated'
import { OnDeliveryMade } from '@/domain/notification/application/subscribers/onDeliveryMade'
import { OnDeliveryPickup } from '@/domain/notification/application/subscribers/onDeliveryPickup'
import { OnDeliveryReturned } from '@/domain/notification/application/subscribers/onDeliveryReturned'

@Module({
  imports: [DatabaseModule],
  providers: [
    OnDeliveryAvailable,
    OnDeliveryCreated,
    OnDeliveryMade,
    OnDeliveryPickup,
    OnDeliveryReturned,
    SendNotificationUseCase,
  ],
})
export class EventsModule {}
