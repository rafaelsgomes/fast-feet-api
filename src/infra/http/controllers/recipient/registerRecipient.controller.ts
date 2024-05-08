import { RegisterRecipientUseCase } from '@/domain/fastFeet/application/useCases/recipient/registerRecipient'
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
import { Public } from '@/infra/auth/public'

const registerRecipientBodySchema = z.object({
  name: z.string(),
  email: z.string(),
  password: z.string(),
  document: z.string().max(11),
})

type registerRecipientBody = z.infer<typeof registerRecipientBodySchema>

@Controller('/register')
@Public()
export class RegisterRecipientController {
  constructor(private registerRecipient: RegisterRecipientUseCase) {}
  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(registerRecipientBodySchema))
  async handle(@Body() body: registerRecipientBody) {
    try {
      const { document, email, name, password } = body

      await this.registerRecipient.execute({
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
