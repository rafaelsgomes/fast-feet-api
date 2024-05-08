import { AuthenticateDeliverymanByDocumentUseCase } from '@/domain/fastFeet/application/useCases/deliveryman/authenticateDeliverymanByDocument'
import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../../pipes/zodValidationPipe'
import { InvalidDocumentError } from '@/domain/fastFeet/application/useCases/_errors/invalidDocumentError'
import { Public } from '@/infra/auth/public'
import { WrongCredentialsError } from '@/domain/fastFeet/application/useCases/_errors/wrongCredentialsError'

const authenticateDeliverymanBodySchema = z.object({
  password: z.string(),
  document: z.string().max(11),
})

type authenticateDeliverymanBody = z.infer<
  typeof authenticateDeliverymanBodySchema
>

@Controller('/sessions')
@Public()
export class AuthenticateDeliverymanController {
  constructor(
    private authenticateDeliveryman: AuthenticateDeliverymanByDocumentUseCase,
  ) {}

  @Post()
  @UsePipes(new ZodValidationPipe(authenticateDeliverymanBodySchema))
  async handle(@Body() body: authenticateDeliverymanBody) {
    try {
      const { document, password } = body

      const { accessToken } = await this.authenticateDeliveryman.execute({
        document,
        password,
      })

      return {
        access_token: accessToken,
      }
    } catch (error) {
      switch (error.constructor) {
        case WrongCredentialsError:
          throw new UnauthorizedException(error.message)
        case InvalidDocumentError:
          throw new BadRequestException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
