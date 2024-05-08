import { GetDeliverymanByDocumentUseCase } from '@/domain/fastFeet/application/useCases/deliveryman/getDeliverymanByDocument'
import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Query,
} from '@nestjs/common'
import { UserNotFoundError } from '@/domain/fastFeet/application/useCases/_errors/userNotFoundError'
import { DeliverymanPresenter } from '../../presenters/deliverymanPresenter'
import { Roles } from '@/infra/authorization/roles.decorator'
import { Role } from '@/domain/fastFeet/enterprise/entities/role.enum'

@Controller('/deliveryman/document')
export class GetDeliverymanByDocumentController {
  constructor(
    private getDeliverymanByDocument: GetDeliverymanByDocumentUseCase,
  ) {}

  @Get()
  @Roles(Role.ADMIN)
  async handle(@Query('document') document: string) {
    try {
      const { deliveryman } = await this.getDeliverymanByDocument.execute({
        document,
      })

      return {
        deliveryman: DeliverymanPresenter.toHttp(deliveryman),
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
