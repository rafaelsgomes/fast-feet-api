import { UpdateDeliverymanUseCase } from '@/domain/fastFeet/application/useCases/deliveryman/updateDeliveryman'
import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Param,
  Put,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../../pipes/zodValidationPipe'
import { InvalidDocumentError } from '@/domain/fastFeet/application/useCases/_errors/invalidDocumentError'
import { UserAlreadyExistsError } from '@/domain/fastFeet/application/useCases/_errors/userAlreadyExistsError'

const updateDeliverymanBodySchema = z.object({
  email: z.string().optional(),
  name: z.string().optional(),
})

const updateDeliverymanBodyPipe = new ZodValidationPipe(
  updateDeliverymanBodySchema,
)

type updateDeliverymanBody = z.infer<typeof updateDeliverymanBodySchema>

@Controller(':deliverymanId')
export class UpdateDeliverymanController {
  constructor(private updateDeliveryman: UpdateDeliverymanUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(
    @Param('deliverymanId') deliverymanId: string,
    @Body(updateDeliverymanBodyPipe) body: updateDeliverymanBody,
  ) {
    try {
      const { email, name } = body
      await this.updateDeliveryman.execute({
        deliverymanId,
        email,
        name,
      })
    } catch (error) {
      switch (error.constructor) {
        case UserAlreadyExistsError:
          throw new ConflictException(error.message)
        case InvalidDocumentError:
          throw new BadRequestException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
