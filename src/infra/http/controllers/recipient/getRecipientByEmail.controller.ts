import { GetRecipientByEmailUseCase } from '@/domain/fastFeet/application/useCases/recipient/getRecipientByEmail'
import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Query,
} from '@nestjs/common'
import { UserNotFoundError } from '@/domain/fastFeet/application/useCases/_errors/userNotFoundError'
import { RecipientPresenter } from '../../presenters/recipientPresenter'
import { Roles } from '@/infra/authorization/roles.decorator'
import { Role } from '@/domain/fastFeet/enterprise/entities/role.enum'

@Controller('/email')
export class GetRecipientByEmailController {
  constructor(private getRecipientByEmail: GetRecipientByEmailUseCase) {}

  @Get()
  @Roles(Role.ADMIN)
  async handle(@Query('email') email: string) {
    try {
      const { recipient } = await this.getRecipientByEmail.execute({
        email,
      })

      return {
        recipient: RecipientPresenter.toHttp(recipient),
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
