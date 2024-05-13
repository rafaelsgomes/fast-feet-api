import { DeleteRecipientUseCase } from '@/domain/fastFeet/application/useCases/recipient/deleteRecipient'
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

@Controller('/:recipientId')
export class DeleteRecipientController {
  constructor(private deleteRecipient: DeleteRecipientUseCase) {}
  @Delete()
  @Roles(Role.ADMIN)
  @HttpCode(204)
  async handle(@Param('recipientId') recipientId: string) {
    try {
      await this.deleteRecipient.execute({
        recipientId,
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
