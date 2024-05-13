import { SetDeliveryAsDeliveredUseCase } from '@/domain/fastFeet/application/useCases/delivery/setDeliveryAsDelivered'
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
} from '@nestjs/common'
import { ResourceNotFoundError } from '@/core/errors/errors/resourceNotFoundError'
import { z } from 'zod'
import { ZodValidationPipe } from '../../pipes/zodValidationPipe'
import { CurrentUser } from '@/infra/auth/currentUser.decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'

const setDeliveryAsDeliveredBodySchema = z.object({
  attachments: z.array(z.string().uuid()),
})

const setDeliveryAsDeliveredBodyPipe = new ZodValidationPipe(
  setDeliveryAsDeliveredBodySchema,
)

type SetDeliveryAsDeliveredBody = z.infer<
  typeof setDeliveryAsDeliveredBodySchema
>

@Controller(':deliveryId/delivered')
export class SetDeliveryAsDeliveredController {
  constructor(private setDeliveryAsDelivered: SetDeliveryAsDeliveredUseCase) {}
  @Patch()
  @HttpCode(204)
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('deliveryId') deliveryId: string,
    @Body(setDeliveryAsDeliveredBodyPipe) body: SetDeliveryAsDeliveredBody,
  ) {
    try {
      const { attachments } = body
      const { sub: userId } = user
      await this.setDeliveryAsDelivered.execute({
        deliveryId,
        attachmentsIds: attachments,
        deliverymanId: userId,
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
