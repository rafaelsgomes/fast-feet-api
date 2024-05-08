import { DeleteDeliverymanUseCase } from '@/domain/fastFeet/application/useCases/deliveryman/deleteDeliveryman'
import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  NotFoundException,
  Param,
} from '@nestjs/common'
import { UserNotFoundError } from '@/domain/fastFeet/application/useCases/_errors/userNotFoundError'
import { Roles } from '@/infra/authorization/roles.decorator'
import { Role } from '@/domain/fastFeet/enterprise/entities/role.enum'

@Controller('/deliveryman/:deliverymanId')
export class DeleteDeliverymanController {
  constructor(private deleteDeliveryman: DeleteDeliverymanUseCase) {}
  @Delete()
  @Roles(Role.ADMIN)
  @HttpCode(204)
  async handle(@Param('deliverymanId') deliverymanId: string) {
    try {
      await this.deleteDeliveryman.execute({
        deliverymanId,
      })
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
