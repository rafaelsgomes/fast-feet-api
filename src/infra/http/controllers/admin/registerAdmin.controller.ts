import { RegisterAdminUseCase } from '@/domain/fastFeet/application/useCases/admin/registerAdmin'
import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
  UsePipes,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../../pipes/zodValidationPipe'
import { InvalidDocumentError } from '@/domain/fastFeet/application/useCases/_errors/invalidDocumentError'
import { UserAlreadyExistsError } from '@/domain/fastFeet/application/useCases/_errors/userAlreadyExistsError'
import { Roles } from '@/infra/authorization/roles.decorator'
import { Role } from '@/domain/fastFeet/enterprise/entities/role.enum'

const registerAdminBodySchema = z.object({
  name: z.string(),
  email: z.string(),
  password: z.string(),
  document: z.string().max(11),
})

type registerAdminBody = z.infer<typeof registerAdminBodySchema>

@Controller('/register')
export class RegisterAdminController {
  constructor(private registerAdmin: RegisterAdminUseCase) {}
  @Post()
  @Roles(Role.ADMIN)
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(registerAdminBodySchema))
  async handle(@Body() body: registerAdminBody) {
    try {
      const { document, email, name, password } = body

      await this.registerAdmin.execute({
        document,
        email,
        name,
        password,
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
