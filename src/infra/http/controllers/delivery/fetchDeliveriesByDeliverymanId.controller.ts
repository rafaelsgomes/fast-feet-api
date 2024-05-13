import { FetchDeliveriesByDeliverymanIdUseCase } from '@/domain/fastFeet/application/useCases/delivery/fetchDeliveriesByDeliverymanId'
import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  NotFoundException,
  Param,
} from '@nestjs/common'
import { ResourceNotFoundError } from '@/core/errors/errors/resourceNotFoundError'
import { DeliveryPresenter } from '../../presenters/deliveryPresenter'

@Controller('/deliveryman/:deliverymanId')
export class FetchDeliveriesByDeliverymanIdController {
  constructor(
    private fetchDeliveriesByDeliverymanId: FetchDeliveriesByDeliverymanIdUseCase,
  ) {}

  @Get()
  @HttpCode(200)
  async handle(@Param('deliverymanId') deliverymanId: string) {
    try {
      const { deliveries } = await this.fetchDeliveriesByDeliverymanId.execute({
        deliverymanId,
      })

      return {
        deliveries: deliveries.map(DeliveryPresenter.toHttp),
      }
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
