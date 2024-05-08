import { Module } from '@nestjs/common'
import { CryptographyModule } from '@/infra/cryptography/cryptograph.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { AuthenticateDeliverymanByDocumentUseCase } from '@/domain/fastFeet/application/useCases/deliveryman/authenticateDeliverymanByDocument'
import { RegisterDeliverymanUseCase } from '@/domain/fastFeet/application/useCases/deliveryman/registerDeliveryman'
import { AuthenticateDeliverymanController } from './authenticateDeliverymanByDocument.controller'
import { RegisterDeliverymanController } from './registerDeliveryman.controller'
import { GetDeliverymanByIdController } from './getDeliverymanById.controller'
import { GetDeliverymanByIdUseCase } from '@/domain/fastFeet/application/useCases/deliveryman/getDeliverymanById'
import { UpdateDeliverymanController } from './updateDeliveryman.controller'
import { UpdateDeliverymanUseCase } from '@/domain/fastFeet/application/useCases/deliveryman/updateDeliveryman'
@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    RegisterDeliverymanController,
    AuthenticateDeliverymanController,
    GetDeliverymanByIdController,
    UpdateDeliverymanController,
  ],
  providers: [
    RegisterDeliverymanUseCase,
    AuthenticateDeliverymanByDocumentUseCase,
    GetDeliverymanByIdUseCase,
    UpdateDeliverymanUseCase,
  ],
})
export class DeliverymanHttpModule {}
