import { GetRecipientByIdUseCase } from '@/domain/fastFeet/application/useCases/recipient/getRecipientById'
import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Param,
} from '@nestjs/common'
import { UserNotFoundError } from '@/domain/fastFeet/application/useCases/_errors/userNotFoundError'
import { RecipientPresenter } from '../../presenters/recipientPresenter'

@Controller(':recipientId')
export class GetRecipientByIdController {
  constructor(private getRecipientById: GetRecipientByIdUseCase) {}

  @Get()
  async handle(@Param('recipientId') recipientId: string) {
    try {
      const { recipient } = await this.getRecipientById.execute({
        recipientId,
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
