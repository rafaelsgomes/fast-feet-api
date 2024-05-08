import { Delivery } from '@/domain/fastFeet/enterprise/entities/delivery'
import { IDeliveriesRepository } from '../../repositories/IDeliveriesRepository'
import { IRecipientRepository } from '../../repositories/IRecipientRepository'
import { UserNotFoundError } from '../_errors/userNotFoundError'

interface CreateDeliveryRequest {
  longitude: number
  latitude: number
  zipCode: string
  address: string
  city: string
  state: string
  additionalAddressInformation: string
  recipientId: string
}

interface CreateDeliveryResponse {
  delivery: Delivery
}

export class CreateDeliveryUseCase {
  constructor(
    private deliveriesRepository: IDeliveriesRepository,
    private recipientsRepository: IRecipientRepository,
  ) {}

  async execute({
    additionalAddressInformation,
    address,
    city,
    latitude,
    longitude,
    recipientId,
    state,
    zipCode,
  }: CreateDeliveryRequest): Promise<CreateDeliveryResponse> {
    const recipient = await this.recipientsRepository.findById(recipientId)

    if (!recipient) {
      throw new UserNotFoundError(recipientId)
    }

    const delivery = Delivery.create({
      additionalAddressInformation,
      address,
      city,
      latitude,
      longitude,
      recipientId,
      state,
      zipCode,
    })

    this.deliveriesRepository.create(delivery)

    return {
      delivery,
    }
  }
}
