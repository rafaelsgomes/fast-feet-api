import { UpdateDeliveryUseCase } from '@/domain/fastFeet/application/useCases/delivery/updateDelivery'
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  NotFoundException,
  Param,
  Put,
} from '@nestjs/common'
import { ResourceNotFoundError } from '@/core/errors/errors/resourceNotFoundError'
import { Roles } from '@/infra/authorization/roles.decorator'
import { Role } from '@/domain/fastFeet/enterprise/entities/role.enum'
import { z } from 'zod'
import { ZodValidationPipe } from '../../pipes/zodValidationPipe'

const updateDeliveryBodySchema = z.object({
  longitude: z.coerce.number().optional(),
  latitude: z.coerce.number().optional(),
  zipCode: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  additionalAddressInformation: z.string().optional(),
  recipientId: z.string().optional(),
  deliverymanId: z.string().optional(),
  availableAt: z.coerce.date().optional(),
  pickupAt: z.coerce.date().optional(),
  deliveredAt: z.coerce.date().optional(),
  returnedAt: z.coerce.date().optional(),
})

const updateDeliveryBodyPipe = new ZodValidationPipe(updateDeliveryBodySchema)

type updateDeliveryBody = z.infer<typeof updateDeliveryBodySchema>

@Controller(':deliveryId')
export class UpdateDeliveryController {
  constructor(private updateDelivery: UpdateDeliveryUseCase) {}
  @Put()
  @Roles(Role.ADMIN)
  @HttpCode(204)
  async handle(
    @Param('deliveryId') deliveryId: string,
    @Body(updateDeliveryBodyPipe) body: updateDeliveryBody,
  ) {
    try {
      const {
        additionalAddressInformation,
        address,
        availableAt,
        city,
        deliveredAt,
        deliverymanId,
        latitude,
        longitude,
        pickupAt,
        recipientId,
        returnedAt,
        state,
        zipCode,
      } = body

      await this.updateDelivery.execute({
        deliveryId,
        additionalAddressInformation,
        address,
        availableAt,
        city,
        deliveredAt,
        deliverymanId,
        latitude,
        longitude,
        pickupAt,
        recipientId,
        returnedAt,
        state,
        zipCode,
      })
    } catch (error) {
      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
