import { SetDeliveryAsReturnedUseCase } from '@/domain/fastFeet/application/useCases/delivery/setDeliveryAsReturned'
import {
  BadRequestException,
  Controller,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
} from '@nestjs/common'
import { ResourceNotFoundError } from '@/core/errors/errors/resourceNotFoundError'
import { Roles } from '@/infra/authorization/roles.decorator'
import { Role } from '@/domain/fastFeet/enterprise/entities/role.enum'

@Controller(':deliveryId/return')
export class SetDeliveryAsReturnedController {
  constructor(private setDeliveryAsReturned: SetDeliveryAsReturnedUseCase) {}
  @Patch()
  @Roles(Role.ADMIN)
  @HttpCode(204)
  async handle(@Param('deliveryId') deliveryId: string) {
    try {
      await this.setDeliveryAsReturned.execute({
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
