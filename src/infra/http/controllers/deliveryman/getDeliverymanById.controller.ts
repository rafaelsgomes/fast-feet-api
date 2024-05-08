import { GetDeliverymanByIdUseCase } from '@/domain/fastFeet/application/useCases/deliveryman/getDeliverymanById'
import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Param,
} from '@nestjs/common'
import { UserNotFoundError } from '@/domain/fastFeet/application/useCases/_errors/userNotFoundError'
import { DeliverymanPresenter } from '../../presenters/deliverymanPresenter'

@Controller(':deliverymanId')
export class GetDeliverymanByIdController {
  constructor(private getDeliverymanById: GetDeliverymanByIdUseCase) {}

  @Get()
  async handle(@Param('deliverymanId') deliverymanId: string) {
    try {
      const { deliveryman } = await this.getDeliverymanById.execute({
        deliverymanId,
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
