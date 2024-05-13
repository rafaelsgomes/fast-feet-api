import { SetDeliveryAsPickupUseCase } from '@/domain/fastFeet/application/useCases/delivery/setDeliveryAsPickup'
import {
  BadRequestException,
  Controller,
  ForbiddenException,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
} from '@nestjs/common'
import { ResourceNotFoundError } from '@/core/errors/errors/resourceNotFoundError'
import { CurrentUser } from '@/infra/auth/currentUser.decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { UserNotFoundError } from '@/domain/fastFeet/application/useCases/_errors/userNotFoundError'
import { DeliveryIsNotAvailableError } from '@/domain/fastFeet/application/useCases/_errors/deliveryIsNotAvailableError'

@Controller(':deliveryId/pickup')
export class SetDeliveryAsPickupController {
  constructor(private setDeliveryAsPickup: SetDeliveryAsPickupUseCase) {}
  @Patch()
  @HttpCode(204)
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('deliveryId') deliveryId: string,
  ) {
    try {
      const { sub: userId } = user

      await this.setDeliveryAsPickup.execute({
        deliverymanId: userId,
        deliveryId,
      })
    } catch (error) {
      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message)
        case UserNotFoundError:
          throw new NotFoundException(error.message)
        case DeliveryIsNotAvailableError:
          throw new ForbiddenException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
