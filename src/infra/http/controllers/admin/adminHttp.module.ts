import { Module } from '@nestjs/common'
import { CryptographyModule } from '@/infra/cryptography/cryptograph.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { ResetDeliverymanPasswordUseCase } from '@/domain/fastFeet/application/useCases/deliveryman/resetDeliverymanPassword'
import { ResetPasswordDeliverymanController } from '../deliveryman/resetDeliverymanPassword.controller'
import { ResetPasswordRecipientController } from '../recipient/resetRecipientPassword.controller'
import { ResetRecipientPasswordUseCase } from '@/domain/fastFeet/application/useCases/recipient/resetRecipientPassword'
import { DeleteDeliverymanController } from '../deliveryman/deleteDeliveryman.controller'
import { DeleteDeliverymanUseCase } from '@/domain/fastFeet/application/useCases/deliveryman/deleteDeliveryman'
import { DeleteRecipientController } from '../recipient/deleteRecipient.controller'
import { DeleteRecipientUseCase } from '@/domain/fastFeet/application/useCases/recipient/deleteRecipient'
import { GetRecipientByDocumentController } from '../recipient/getRecipientByDocument.controller'
import { GetRecipientByDocumentUseCase } from '@/domain/fastFeet/application/useCases/recipient/getRecipientByDocument'
import { GetRecipientByEmailController } from '../recipient/getRecipientByEmail.controller'
import { GetRecipientByEmailUseCase } from '@/domain/fastFeet/application/useCases/recipient/getRecipientByEmail'
import { GetDeliverymanByDocumentController } from '../deliveryman/getDeliverymanByDocument.controller'
import { GetDeliverymanByEmailController } from '../deliveryman/getDeliverymanByEmail.controller'
import { GetDeliverymanByDocumentUseCase } from '@/domain/fastFeet/application/useCases/deliveryman/getDeliverymanByDocument'
import { GetDeliverymanByEmailUseCase } from '@/domain/fastFeet/application/useCases/deliveryman/getDeliverymanByEmail'
import { AuthenticateAdminController } from './authenticateAdminByDocument.controller'
import { AuthenticateAdminByDocumentUseCase } from '@/domain/fastFeet/application/useCases/admin/authenticateAdminByDocument'
import { DeleteAdminController } from './deleteAdmin.controller'
import { DeleteAdminUseCase } from '@/domain/fastFeet/application/useCases/admin/deleteAdmin'
import { GetAdminByDocumentController } from './getAdminByDocument.controller'
import { GetAdminByDocumentUseCase } from '@/domain/fastFeet/application/useCases/admin/getAdminByDocument'
import { GetAdminByEmailController } from './getAdminByEmail.controller'
import { GetAdminByEmailUseCase } from '@/domain/fastFeet/application/useCases/admin/getAdminByEmail'
import { GetAdminByIdController } from './getAdminById.controller'
import { GetAdminByIdUseCase } from '@/domain/fastFeet/application/useCases/admin/getAdminById'
import { RegisterAdminController } from './registerAdmin.controller'
import { RegisterAdminUseCase } from '@/domain/fastFeet/application/useCases/admin/registerAdmin'
import { ResetPasswordAdminController } from './resetAdminPassword.controller'
import { ResetAdminPasswordUseCase } from '@/domain/fastFeet/application/useCases/admin/resetAdminPassword'
import { UpdateAdminController } from './updateAdmin.controller'
import { UpdateAdminUseCase } from '@/domain/fastFeet/application/useCases/admin/updateAdmin'
import { UpdateRecipientAllInfoController } from '../recipient/updateRecipientAllInfo.controller'
import { UpdateRecipientAllInfoUseCase } from '@/domain/fastFeet/application/useCases/recipient/updateRecipientAllInfo'
import { UpdateDeliverymanAllInfoController } from '../deliveryman/updateDeliverymanAllInfo.controller'
import { UpdateDeliverymanAllInfoUseCase } from '@/domain/fastFeet/application/useCases/deliveryman/updateDeliverymanAllInfo'

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    ResetPasswordDeliverymanController,
    DeleteDeliverymanController,
    ResetPasswordRecipientController,
    DeleteRecipientController,
    GetRecipientByDocumentController,
    GetRecipientByEmailController,
    GetDeliverymanByDocumentController,
    GetDeliverymanByEmailController,
    AuthenticateAdminController,
    DeleteAdminController,
    GetAdminByDocumentController,
    GetAdminByEmailController,
    GetAdminByIdController,
    RegisterAdminController,
    ResetPasswordAdminController,
    UpdateAdminController,
    UpdateRecipientAllInfoController,
    UpdateDeliverymanAllInfoController,
  ],
  providers: [
    ResetDeliverymanPasswordUseCase,
    DeleteDeliverymanUseCase,
    ResetRecipientPasswordUseCase,
    DeleteRecipientUseCase,
    GetRecipientByDocumentUseCase,
    GetRecipientByEmailUseCase,
    GetDeliverymanByDocumentUseCase,
    GetDeliverymanByEmailUseCase,
    AuthenticateAdminByDocumentUseCase,
    DeleteAdminUseCase,
    GetAdminByDocumentUseCase,
    GetAdminByEmailUseCase,
    GetAdminByIdUseCase,
    RegisterAdminUseCase,
    ResetAdminPasswordUseCase,
    UpdateAdminUseCase,
    UpdateRecipientAllInfoUseCase,
    UpdateDeliverymanAllInfoUseCase,
  ],
})
export class AdminHttpModule {}
