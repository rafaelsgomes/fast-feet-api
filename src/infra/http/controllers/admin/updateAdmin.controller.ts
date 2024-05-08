import { UpdateAdminUseCase } from '@/domain/fastFeet/application/useCases/admin/updateAdmin'
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

const updateAdminBodySchema = z.object({
  email: z.string().optional(),
  name: z.string().optional(),
  document: z.string().optional(),
})

const updateAdminBodyPipe = new ZodValidationPipe(updateAdminBodySchema)

type updateAdminBody = z.infer<typeof updateAdminBodySchema>

@Controller(':adminId')
export class UpdateAdminController {
  constructor(private updateAdmin: UpdateAdminUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(
    @Param('adminId') adminId: string,
    @Body(updateAdminBodyPipe) body: updateAdminBody,
  ) {
    try {
      const { email, name, document } = body
      await this.updateAdmin.execute({
        adminId,
        email,
        name,
        document,
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
