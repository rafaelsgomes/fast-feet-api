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

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    RegisterRecipientController,
    AuthenticateRecipientController,
    GetRecipientByIdController,
    UpdateRecipientController,
  ],
  providers: [
    RegisterRecipientUseCase,
    AuthenticateRecipientByDocumentUseCase,
    GetRecipientByIdUseCase,
    UpdateRecipientUseCase,
  ],
})
export class RecipientHttpModule {}
