import { DeleteDeliveryUseCase } from '@/domain/fastFeet/application/useCases/delivery/deleteDelivery'
import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  NotFoundException,
  Param,
} from '@nestjs/common'
import { Roles } from '@/infra/authorization/roles.decorator'
import { Role } from '@/domain/fastFeet/enterprise/entities/role.enum'
import { ResourceNotFoundError } from '@/core/errors/errors/resourceNotFoundError'

@Controller(':deliveryId')
export class DeleteDeliveryController {
  constructor(private deleteDelivery: DeleteDeliveryUseCase) {}
  @Delete()
  @Roles(Role.ADMIN)
  @HttpCode(204)
  async handle(@Param('deliveryId') deliveryId: string) {
    try {
      await this.deleteDelivery.execute({
        deliveryId,
      })
    } catch (error) {
      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
