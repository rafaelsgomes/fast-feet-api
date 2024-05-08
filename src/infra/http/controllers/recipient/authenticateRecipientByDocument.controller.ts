import { AuthenticateRecipientByDocumentUseCase } from '@/domain/fastFeet/application/useCases/recipient/authenticateRecipientByDocument'
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

const authenticateRecipientBodySchema = z.object({
  password: z.string(),
  document: z.string().max(11),
})

type authenticateRecipientBody = z.infer<typeof authenticateRecipientBodySchema>

@Controller('/sessions')
@Public()
export class AuthenticateRecipientController {
  constructor(
    private authenticateRecipient: AuthenticateRecipientByDocumentUseCase,
  ) {}

  @Post()
  @UsePipes(new ZodValidationPipe(authenticateRecipientBodySchema))
  async handle(@Body() body: authenticateRecipientBody) {
    try {
      const { document, password } = body

      const { accessToken } = await this.authenticateRecipient.execute({
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
