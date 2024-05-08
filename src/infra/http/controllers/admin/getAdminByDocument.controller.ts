import { GetAdminByDocumentUseCase } from '@/domain/fastFeet/application/useCases/admin/getAdminByDocument'
import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Query,
} from '@nestjs/common'
import { UserNotFoundError } from '@/domain/fastFeet/application/useCases/_errors/userNotFoundError'
import { AdminPresenter } from '../../presenters/adminPresenter'
import { Roles } from '@/infra/authorization/roles.decorator'
import { Role } from '@/domain/fastFeet/enterprise/entities/role.enum'

@Controller('document')
export class GetAdminByDocumentController {
  constructor(private getAdminByDocument: GetAdminByDocumentUseCase) {}

  @Get()
  @Roles(Role.ADMIN)
  async handle(@Query('document') document: string) {
    try {
      const { admin } = await this.getAdminByDocument.execute({
        document,
      })

      return {
        admin: AdminPresenter.toHttp(admin),
      }
    } catch (error) {
      switch (error.constructor) {
        case UserNotFoundError:
          throw new NotFoundException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
