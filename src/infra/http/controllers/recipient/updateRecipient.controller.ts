import { UpdateRecipientUseCase } from '@/domain/fastFeet/application/useCases/recipient/updateRecipient'
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

const updateRecipientBodySchema = z.object({
  email: z.string().optional(),
  name: z.string().optional(),
})

const updateRecipientBodyPipe = new ZodValidationPipe(updateRecipientBodySchema)

type updateRecipientBody = z.infer<typeof updateRecipientBodySchema>

@Controller(':recipientId')
export class UpdateRecipientController {
  constructor(private updateRecipient: UpdateRecipientUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(
    @Param('recipientId') recipientId: string,
    @Body(updateRecipientBodyPipe) body: updateRecipientBody,
  ) {
    try {
      const { email, name } = body
      await this.updateRecipient.execute({
        recipientId,
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
