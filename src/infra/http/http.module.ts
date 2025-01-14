import { Module } from '@nestjs/common'
import { DatabaseModule } from '../database/database.module'
import { CryptographyModule } from '../cryptography/cryptograph.module'
import { AdminHttpModule } from './controllers/admin/adminHttp.module'
import { RouterModule } from '@nestjs/core'
import { DeliverymanHttpModule } from './controllers/deliveryman/deliverymanHttp.module'
import { RecipientHttpModule } from './controllers/recipient/recipientHttp.module'
import { DeliveryHttpModule } from './controllers/delivery/deliveryHttp.module'
import { NotificationHttpModule } from './controllers/notification/notificationHttp.module'

@Module({
  imports: [
    DatabaseModule,
    CryptographyModule,
    AdminHttpModule,
    DeliverymanHttpModule,
    RecipientHttpModule,
    DeliveryHttpModule,
    NotificationHttpModule,
    RouterModule.register([
      {
        path: 'admin',
        module: AdminHttpModule,
      },
      {
        path: 'deliveryman',
        module: DeliverymanHttpModule,
      },
      {
        path: 'recipient',
        module: RecipientHttpModule,
      },
      {
        path: 'delivery',
        module: DeliveryHttpModule,
      },
      {
        path: 'notification',
        module: NotificationHttpModule,
      },
    ]),
  ],
})
export class HttpModule {}
