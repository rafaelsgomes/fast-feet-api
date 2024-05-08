import { Module } from '@nestjs/common'
import { DatabaseModule } from '../database/database.module'
import { CryptographyModule } from '../cryptography/cryptograph.module'
import { AdminHttpModule } from './controllers/admin/adminHttp.module'
import { RouterModule } from '@nestjs/core'
import { DeliverymanHttpModule } from './controllers/deliveryman/deliverymanHttp.module'
import { RecipientHttpModule } from './controllers/recipient/recipientHttp.module'

@Module({
  imports: [
    DatabaseModule,
    CryptographyModule,
    AdminHttpModule,
    DeliverymanHttpModule,
    RecipientHttpModule,
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
    ]),
  ],
})
export class HttpModule {}
