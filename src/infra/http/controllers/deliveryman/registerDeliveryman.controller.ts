import { RegisterDeliverymanUseCase } from '@/domain/fastFeet/application/useCases/deliveryman/registerDeliveryman'
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

const registerDeliverymanBodySchema = z.object({
  name: z.string(),
  email: z.string(),
  password: z.string(),
  document: z.string().max(11),
})

type registerDeliverymanBody = z.infer<typeof registerDeliverymanBodySchema>

@Controller('/register')
@Public()
export class RegisterDeliverymanController {
  constructor(private registerDeliveryman: RegisterDeliverymanUseCase) {}
  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(registerDeliverymanBodySchema))
  async handle(@Body() body: registerDeliverymanBody) {
    try {
      const { document, email, name, password } = body

      await this.registerDeliveryman.execute({
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
