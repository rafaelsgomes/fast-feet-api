import { AuthenticateAdminByDocumentUseCase } from '@/domain/fastFeet/application/useCases/admin/authenticateAdminByDocument'
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

const authenticateAdminBodySchema = z.object({
  password: z.string(),
  document: z.string().max(11),
})

type authenticateAdminBody = z.infer<typeof authenticateAdminBodySchema>

@Controller('/sessions')
@Public()
export class AuthenticateAdminController {
  constructor(private authenticateAdmin: AuthenticateAdminByDocumentUseCase) {}

  @Post()
  @UsePipes(new ZodValidationPipe(authenticateAdminBodySchema))
  async handle(@Body() body: authenticateAdminBody) {
    try {
      const { document, password } = body

      const { accessToken } = await this.authenticateAdmin.execute({
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
