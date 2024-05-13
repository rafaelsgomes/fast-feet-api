import { CryptographyModule } from '@/infra/cryptography/cryptograph.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { Module } from '@nestjs/common'
import { CreateDeliveryController } from './createDelivery.controller'
import { CreateDeliveryUseCase } from '@/domain/fastFeet/application/useCases/delivery/createDelivery'
import { GetDeliveryByIdController } from './getDeliveryById.controller'
import { GetDeliveryByIdUseCase } from '@/domain/fastFeet/application/useCases/delivery/getDeliveryById'
import { FetchDeliveriesByRecipientIdController } from './fetchDeliveriesByRecipientId.controller'
import { FetchDeliveriesByRecipientIdUseCase } from '@/domain/fastFeet/application/useCases/delivery/fetchDeliveriesByRecipientId'
import { FetchDeliveriesByDeliverymanIdController } from './fetchDeliveriesByDeliverymanId.controller'
import { FetchDeliveriesByDeliverymanIdUseCase } from '@/domain/fastFeet/application/useCases/delivery/fetchDeliveriesByDeliverymanId'
import { FetchManyDeliveriesNearbyUseCase } from '@/domain/fastFeet/application/useCases/delivery/fetchManyDeliveriesNearby'
import { FetchManyDeliveriesNearbyController } from './fetchManyDeliveriesNearby.controller'
import { DeleteDeliveryController } from './deleteDelivery.controller'
import { DeleteDeliveryUseCase } from '@/domain/fastFeet/application/useCases/delivery/deleteDelivery'
import { SetDeliveryAsAvailableController } from './setDeliveryAsAvailable.controller'
import { SetDeliveryAsAvailableUseCase } from '@/domain/fastFeet/application/useCases/delivery/setDeliveryAsAvailable'
import { SetDeliveryAsPickupController } from './setDeliveryAsPickup.controller'
import { SetDeliveryAsPickupUseCase } from '@/domain/fastFeet/application/useCases/delivery/setDeliveryAsPickup'
import { SetDeliveryAsReturnedController } from './setDeliveryAsReturned.controller'
import { SetDeliveryAsReturnedUseCase } from '@/domain/fastFeet/application/useCases/delivery/setDeliveryAsReturned'
import { UpdateDeliveryController } from './updateDelivery.controller'
import { UpdateDeliveryUseCase } from '@/domain/fastFeet/application/useCases/delivery/updateDelivery'
import { UploadAndCreateAttachmentUseCase } from '@/domain/fastFeet/application/useCases/delivery/uploadAndCreateAttachment'
import { UploadAttachmentsController } from './uploadAttachments.controller'
import { StorageModule } from '@/infra/storage/storage.module'
import { SetDeliveryAsDeliveredController } from './setDeliveryAsDelivered.controller'
import { SetDeliveryAsDeliveredUseCase } from '@/domain/fastFeet/application/useCases/delivery/setDeliveryAsDelivered'

@Module({
  imports: [DatabaseModule, CryptographyModule, StorageModule],
  controllers: [
    SetDeliveryAsDeliveredController,
    SetDeliveryAsAvailableController,
    FetchManyDeliveriesNearbyController,
    GetDeliveryByIdController,
    CreateDeliveryController,
    FetchDeliveriesByRecipientIdController,
    FetchDeliveriesByDeliverymanIdController,
    DeleteDeliveryController,
    SetDeliveryAsPickupController,
    SetDeliveryAsReturnedController,
    UpdateDeliveryController,
    UploadAttachmentsController,
  ],
  providers: [
    SetDeliveryAsDeliveredUseCase,
    SetDeliveryAsAvailableUseCase,
    FetchManyDeliveriesNearbyUseCase,
    GetDeliveryByIdUseCase,
    CreateDeliveryUseCase,
    FetchDeliveriesByRecipientIdUseCase,
    FetchDeliveriesByDeliverymanIdUseCase,
    DeleteDeliveryUseCase,
    SetDeliveryAsPickupUseCase,
    SetDeliveryAsReturnedUseCase,
    UpdateDeliveryUseCase,
    UploadAndCreateAttachmentUseCase,
  ],
})
export class DeliveryHttpModule {}
