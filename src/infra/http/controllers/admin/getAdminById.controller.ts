import { GetAdminByIdUseCase } from '@/domain/fastFeet/application/useCases/admin/getAdminById'
import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Param,
} from '@nestjs/common'
import { UserNotFoundError } from '@/domain/fastFeet/application/useCases/_errors/userNotFoundError'
import { AdminPresenter } from '../../presenters/adminPresenter'

@Controller(':adminId')
export class GetAdminByIdController {
  constructor(private getAdminById: GetAdminByIdUseCase) {}

  @Get()
  async handle(@Param('adminId') adminId: string) {
    try {
      const { admin } = await this.getAdminById.execute({
        adminId,
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
