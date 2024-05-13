import { CreateDeliveryUseCase } from '@/domain/fastFeet/application/useCases/delivery/createDelivery'
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

const createDeliveryBodySchema = z.object({
  longitude: z.coerce.number(),
  latitude: z.coerce.number(),
  zipCode: z.string(),
  address: z.string(),
  city: z.string(),
  state: z.string(),
  additionalAddressInformation: z.string(),
  recipientId: z.string(),
})

type createDeliveryBody = z.infer<typeof createDeliveryBodySchema>

@Controller()
export class CreateDeliveryController {
  constructor(private createDelivery: CreateDeliveryUseCase) {}
  @Post()
  @Roles(Role.ADMIN)
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createDeliveryBodySchema))
  async handle(@Body() body: createDeliveryBody) {
    try {
      const {
        additionalAddressInformation,
        address,
        city,
        latitude,
        longitude,
        recipientId,
        state,
        zipCode,
      } = body

      await this.createDelivery.execute({
        additionalAddressInformation,
        address,
        city,
        latitude,
        longitude,
        recipientId,
        state,
        zipCode,
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
