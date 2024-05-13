import { FetchManyDeliveriesNearbyUseCase } from '@/domain/fastFeet/application/useCases/delivery/fetchManyDeliveriesNearby'
import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  NotFoundException,
  Request,
} from '@nestjs/common'
import { ResourceNotFoundError } from '@/core/errors/errors/resourceNotFoundError'
import { DeliveryPresenter } from '../../presenters/deliveryPresenter'
import { CurrentUser } from '@/infra/auth/currentUser.decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { z } from 'zod'

@Controller('/near')
export class FetchManyDeliveriesNearbyController {
  constructor(
    private fetchManyDeliveriesNearbyUseCase: FetchManyDeliveriesNearbyUseCase,
  ) {}

  @Get()
  @HttpCode(200)
  async handle(@CurrentUser() user: UserPayload, @Request() req) {
    try {
      const nearbyGymsQuerySchema = z.object({
        latitude: z.coerce.number().refine((value) => {
          return Math.abs(value) <= 90
        }),
        longitude: z.coerce.number().refine((value) => {
          return Math.abs(value) <= 180
        }),
      })
      const { latitude, longitude } = nearbyGymsQuerySchema.parse(req.query)

      const { sub: userId } = user

      const { deliveries } =
        await this.fetchManyDeliveriesNearbyUseCase.execute({
          userId,
          userLatitude: latitude,
          userLongitude: longitude,
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
