import { ResetDeliverymanPasswordUseCase } from '@/domain/fastFeet/application/useCases/deliveryman/resetDeliverymanPassword'
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  NotFoundException,
  Patch,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../../pipes/zodValidationPipe'
import { Roles } from '@/infra/authorization/roles.decorator'
import { Role } from '@/domain/fastFeet/enterprise/entities/role.enum'
import { UserNotFoundError } from '@/domain/fastFeet/application/useCases/_errors/userNotFoundError'
import { IsPasswordNotNewError } from '@/domain/fastFeet/application/useCases/_errors/isPasswordNotNewError'

const resetDeliverymanPasswordBodySchema = z.object({
  password: z.string(),
  deliverymanId: z.string().uuid(),
})

const resetDeliverymanPasswordBodyPipe = new ZodValidationPipe(
  resetDeliverymanPasswordBodySchema,
)

type resetDeliverymanPasswordBody = z.infer<
  typeof resetDeliverymanPasswordBodySchema
>

@Controller('/deliveryman/reset-password')
export class ResetPasswordDeliverymanController {
  constructor(
    private resetDeliverymanPassword: ResetDeliverymanPasswordUseCase,
  ) {}

  @Patch()
  @Roles(Role.ADMIN)
  @HttpCode(204)
  async handle(
    @Body(resetDeliverymanPasswordBodyPipe) body: resetDeliverymanPasswordBody,
  ) {
    try {
      const { deliverymanId, password } = body
      await this.resetDeliverymanPassword.execute({
        deliverymanId,
        password,
      })
    } catch (error) {
      switch (error.constructor) {
        case UserNotFoundError:
          throw new NotFoundException(error.message)
        case IsPasswordNotNewError:
          throw new BadRequestException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
