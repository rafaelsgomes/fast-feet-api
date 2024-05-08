import { GetDeliverymanByEmailUseCase } from '@/domain/fastFeet/application/useCases/deliveryman/getDeliverymanByEmail'
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

@Controller('/deliveryman/email')
export class GetDeliverymanByEmailController {
  constructor(private getDeliverymanByEmail: GetDeliverymanByEmailUseCase) {}

  @Get()
  @Roles(Role.ADMIN)
  async handle(@Query('email') email: string) {
    try {
      const { deliveryman } = await this.getDeliverymanByEmail.execute({
        email,
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
