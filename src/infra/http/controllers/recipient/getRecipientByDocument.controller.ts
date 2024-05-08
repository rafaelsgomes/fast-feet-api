import { GetRecipientByDocumentUseCase } from '@/domain/fastFeet/application/useCases/recipient/getRecipientByDocument'
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

@Controller('/recipient/document')
export class GetRecipientByDocumentController {
  constructor(private getRecipientByDocument: GetRecipientByDocumentUseCase) {}

  @Get()
  @Roles(Role.ADMIN)
  async handle(@Query('document') document: string) {
    try {
      const { recipient } = await this.getRecipientByDocument.execute({
        document,
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
