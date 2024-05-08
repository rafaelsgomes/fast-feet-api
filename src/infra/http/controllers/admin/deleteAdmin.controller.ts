import { DeleteAdminUseCase } from '@/domain/fastFeet/application/useCases/admin/deleteAdmin'
import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  NotFoundException,
  Param,
} from '@nestjs/common'
import { UserNotFoundError } from '@/domain/fastFeet/application/useCases/_errors/userNotFoundError'
import { Roles } from '@/infra/authorization/roles.decorator'
import { Role } from '@/domain/fastFeet/enterprise/entities/role.enum'

@Controller(':adminId')
export class DeleteAdminController {
  constructor(private deleteAdmin: DeleteAdminUseCase) {}
  @Delete()
  @Roles(Role.ADMIN)
  @HttpCode(204)
  async handle(@Param('adminId') adminId: string) {
    try {
      await this.deleteAdmin.execute({
        adminId,
      })
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
