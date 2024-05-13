import { ResetRecipientPasswordUseCase } from '@/domain/fastFeet/application/useCases/recipient/resetRecipientPassword'
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

const resetRecipientPasswordBodySchema = z.object({
  password: z.string(),
  recipientId: z.string().uuid(),
})

const resetRecipientPasswordBodyPipe = new ZodValidationPipe(
  resetRecipientPasswordBodySchema,
)

type resetRecipientPasswordBody = z.infer<
  typeof resetRecipientPasswordBodySchema
>

@Controller('/reset-password')
export class ResetPasswordRecipientController {
  constructor(private resetRecipientPassword: ResetRecipientPasswordUseCase) {}

  @Patch()
  @Roles(Role.ADMIN)
  @HttpCode(204)
  async handle(
    @Body(resetRecipientPasswordBodyPipe) body: resetRecipientPasswordBody,
  ) {
    try {
      const { recipientId, password } = body
      await this.resetRecipientPassword.execute({
        recipientId,
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
