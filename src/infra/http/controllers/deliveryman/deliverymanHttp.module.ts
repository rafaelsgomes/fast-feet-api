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
import { ResetPasswordDeliverymanController } from './resetDeliverymanPassword.controller'
import { ResetDeliverymanPasswordUseCase } from '@/domain/fastFeet/application/useCases/deliveryman/resetDeliverymanPassword'
import { DeleteDeliverymanUseCase } from '@/domain/fastFeet/application/useCases/deliveryman/deleteDeliveryman'
import { DeleteDeliverymanController } from './deleteDeliveryman.controller'
import { GetDeliverymanByDocumentController } from './getDeliverymanByDocument.controller'
import { GetDeliverymanByEmailController } from './getDeliverymanByEmail.controller'
import { GetDeliverymanByDocumentUseCase } from '@/domain/fastFeet/application/useCases/deliveryman/getDeliverymanByDocument'
import { GetDeliverymanByEmailUseCase } from '@/domain/fastFeet/application/useCases/deliveryman/getDeliverymanByEmail'
import { UpdateDeliverymanAllInfoUseCase } from '@/domain/fastFeet/application/useCases/deliveryman/updateDeliverymanAllInfo'
import { UpdateDeliverymanAllInfoController } from './updateDeliverymanAllInfo.controller'
@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    GetDeliverymanByDocumentController,
    GetDeliverymanByEmailController,
    RegisterDeliverymanController,
    AuthenticateDeliverymanController,
    GetDeliverymanByIdController,
    UpdateDeliverymanController,
    ResetPasswordDeliverymanController,
    DeleteDeliverymanController,
    UpdateDeliverymanAllInfoController,
  ],
  providers: [
    GetDeliverymanByDocumentUseCase,
    GetDeliverymanByEmailUseCase,
    RegisterDeliverymanUseCase,
    AuthenticateDeliverymanByDocumentUseCase,
    GetDeliverymanByIdUseCase,
    UpdateDeliverymanUseCase,
    ResetDeliverymanPasswordUseCase,
    DeleteDeliverymanUseCase,
    UpdateDeliverymanAllInfoUseCase,
  ],
})
export class DeliverymanHttpModule {}
