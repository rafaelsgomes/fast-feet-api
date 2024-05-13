import { Module } from '@nestjs/common'
import { CryptographyModule } from '@/infra/cryptography/cryptograph.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { AuthenticateRecipientByDocumentUseCase } from '@/domain/fastFeet/application/useCases/recipient/authenticateRecipientByDocument'
import { RegisterRecipientUseCase } from '@/domain/fastFeet/application/useCases/recipient/registerRecipient'
import { AuthenticateRecipientController } from './authenticateRecipientByDocument.controller'
import { RegisterRecipientController } from './registerRecipient.controller'
import { GetRecipientByIdController } from './getRecipientById.controller'
import { GetRecipientByIdUseCase } from '@/domain/fastFeet/application/useCases/recipient/getRecipientById'
import { UpdateRecipientController } from './updateRecipient.controller'
import { UpdateRecipientUseCase } from '@/domain/fastFeet/application/useCases/recipient/updateRecipient'
import { ResetRecipientPasswordUseCase } from '@/domain/fastFeet/application/useCases/recipient/resetRecipientPassword'
import { ResetPasswordRecipientController } from './resetRecipientPassword.controller'
import { DeleteRecipientController } from './deleteRecipient.controller'
import { DeleteRecipientUseCase } from '@/domain/fastFeet/application/useCases/recipient/deleteRecipient'
import { GetRecipientByDocumentController } from './getRecipientByDocument.controller'
import { GetRecipientByDocumentUseCase } from '@/domain/fastFeet/application/useCases/recipient/getRecipientByDocument'
import { GetRecipientByEmailController } from './getRecipientByEmail.controller'
import { GetRecipientByEmailUseCase } from '@/domain/fastFeet/application/useCases/recipient/getRecipientByEmail'
import { UpdateRecipientAllInfoUseCase } from '@/domain/fastFeet/application/useCases/recipient/updateRecipientAllInfo'
import { UpdateRecipientAllInfoController } from './updateRecipientAllInfo.controller'

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    GetRecipientByDocumentController,
    GetRecipientByEmailController,
    RegisterRecipientController,
    AuthenticateRecipientController,
    GetRecipientByIdController,
    UpdateRecipientController,
    ResetPasswordRecipientController,
    DeleteRecipientController,
    UpdateRecipientAllInfoController,
  ],
  providers: [
    GetRecipientByDocumentUseCase,
    GetRecipientByEmailUseCase,
    RegisterRecipientUseCase,
    AuthenticateRecipientByDocumentUseCase,
    GetRecipientByIdUseCase,
    UpdateRecipientUseCase,
    ResetRecipientPasswordUseCase,
    DeleteRecipientUseCase,
    UpdateRecipientAllInfoUseCase,
  ],
})
export class RecipientHttpModule {}
