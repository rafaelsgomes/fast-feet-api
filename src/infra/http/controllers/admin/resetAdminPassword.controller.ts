import { ResetAdminPasswordUseCase } from '@/domain/fastFeet/application/useCases/admin/resetAdminPassword'
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

const resetAdminPasswordBodySchema = z.object({
  password: z.string(),
  adminId: z.string().uuid(),
})

const resetAdminPasswordBodyPipe = new ZodValidationPipe(
  resetAdminPasswordBodySchema,
)

type resetAdminPasswordBody = z.infer<typeof resetAdminPasswordBodySchema>

@Controller('/admin/reset-password')
export class ResetPasswordAdminController {
  constructor(private resetAdminPassword: ResetAdminPasswordUseCase) {}

  @Patch()
  @Roles(Role.ADMIN)
  @HttpCode(204)
  async handle(@Body(resetAdminPasswordBodyPipe) body: resetAdminPasswordBody) {
    try {
      const { adminId, password } = body
      await this.resetAdminPassword.execute({
        adminId,
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
