import { GetDeliveryByIdUseCase } from '@/domain/fastFeet/application/useCases/delivery/getDeliveryById'
import {
  BadRequestException,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  NotFoundException,
  Param,
} from '@nestjs/common'
import { ResourceNotFoundError } from '@/core/errors/errors/resourceNotFoundError'
import { CurrentUser } from '@/infra/auth/currentUser.decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { DeliveryDetailsPresenter } from '../../presenters/deliveryDetailsPresenter'
import { NotAllowedError } from '@/domain/fastFeet/application/useCases/_errors/notAllowedError'

@Controller(':deliveryId')
export class GetDeliveryByIdController {
  constructor(private getDeliveryById: GetDeliveryByIdUseCase) {}
  @Get()
  @HttpCode(200)
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('deliveryId') deliveryId: string,
  ) {
    try {
      const { sub: userId } = user

      const { delivery } = await this.getDeliveryById.execute({
        userId,
        deliveryId,
      })

      return { delivery: DeliveryDetailsPresenter.toHttp(delivery) }
    } catch (error) {
      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message)
        case NotAllowedError:
          throw new ForbiddenException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
