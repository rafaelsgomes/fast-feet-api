import { GetAdminByEmailUseCase } from '@/domain/fastFeet/application/useCases/admin/getAdminByEmail'
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

@Controller('email')
export class GetAdminByEmailController {
  constructor(private getAdminByEmail: GetAdminByEmailUseCase) {}

  @Get()
  @Roles(Role.ADMIN)
  async handle(@Query('email') email: string) {
    try {
      const { admin } = await this.getAdminByEmail.execute({
        email,
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
