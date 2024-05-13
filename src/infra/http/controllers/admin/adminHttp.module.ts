import { Module } from '@nestjs/common'
import { CryptographyModule } from '@/infra/cryptography/cryptograph.module'
import { DatabaseModule } from '@/infra/database/database.module'
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

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    AuthenticateAdminController,
    DeleteAdminController,
    GetAdminByDocumentController,
    GetAdminByEmailController,
    GetAdminByIdController,
    RegisterAdminController,
    ResetPasswordAdminController,
    UpdateAdminController,
  ],
  providers: [
    AuthenticateAdminByDocumentUseCase,
    DeleteAdminUseCase,
    GetAdminByDocumentUseCase,
    GetAdminByEmailUseCase,
    GetAdminByIdUseCase,
    RegisterAdminUseCase,
    ResetAdminPasswordUseCase,
    UpdateAdminUseCase,
  ],
})
export class AdminHttpModule {}
