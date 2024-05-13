import { FetchDeliveriesByRecipientIdUseCase } from '@/domain/fastFeet/application/useCases/delivery/fetchDeliveriesByRecipientId'
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

@Controller('/recipient/:recipientId')
export class FetchDeliveriesByRecipientIdController {
  constructor(
    private fetchDeliveriesByRecipientId: FetchDeliveriesByRecipientIdUseCase,
  ) {}

  @Get()
  @HttpCode(200)
  async handle(@Param('recipientId') recipientId: string) {
    try {
      const { deliveries } = await this.fetchDeliveriesByRecipientId.execute({
        recipientId,
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
