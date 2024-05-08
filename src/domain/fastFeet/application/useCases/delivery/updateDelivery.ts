import { Delivery } from '@/domain/fastFeet/enterprise/entities/delivery'
import { IDeliveriesRepository } from '../../repositories/IDeliveriesRepository'
import { ResourceNotFoundError } from '@/core/errors/errors/resourceNotFoundError'
import { IDeliverymanRepository } from '../../repositories/IDeliverymanRepository'
import { UserNotFoundError } from '../_errors/userNotFoundError'
import { IRecipientRepository } from '../../repositories/IRecipientRepository'
import { InformationNotProvidedError } from '../_errors/informationNotProvidedError'

interface UpdateDeliveryRequest {
  deliveryId: string
  longitude?: number
  latitude?: number
  zipCode?: string
  address?: string
  city?: string
  state?: string
  additionalAddressInformation?: string
  recipientId?: string
  deliverymanId?: string
  availableAt?: Date
  pickupAt?: Date
  deliveredAt?: Date
  returnedAt?: Date
}

interface UpdateDeliveryResponse {
  delivery: Delivery
}

export class UpdateDeliveryUseCase {
  constructor(
    private deliveriesRepository: IDeliveriesRepository,
    private deliverymanRepository: IDeliverymanRepository,
    private recipientRepository: IRecipientRepository,
  ) {}

  async execute({
    deliveryId,
    deliverymanId,
    additionalAddressInformation,
    address,
    availableAt,
    city,
    deliveredAt,
    latitude,
    longitude,
    pickupAt,
    recipientId,
    returnedAt,
    state,
    zipCode,
  }: UpdateDeliveryRequest): Promise<UpdateDeliveryResponse> {
    if (
      !deliverymanId &&
      !additionalAddressInformation &&
      !address &&
      !availableAt &&
      !city &&
      !deliveredAt &&
      !latitude &&
      !longitude &&
      !pickupAt &&
      !recipientId &&
      !returnedAt &&
      !state &&
      !zipCode
    )
      throw new InformationNotProvidedError()

    const delivery = await this.deliveriesRepository.findById(deliveryId)

    if (!delivery) {
      throw new ResourceNotFoundError()
    }

    if (deliverymanId && deliverymanId !== delivery.deliverymanId) {
      const deliveryman =
        await this.deliverymanRepository.findById(deliverymanId)

      if (!deliveryman) {
        throw new UserNotFoundError(deliveryId)
      }

      delivery.deliverymanId = deliverymanId
    }

    if (recipientId && recipientId !== delivery.recipientId) {
      const recipient = await this.recipientRepository.findById(recipientId)

      if (!recipient) {
        throw new UserNotFoundError(recipientId)
      }

      delivery.recipientId = recipientId
    }

    if (
      additionalAddressInformation &&
      additionalAddressInformation !== delivery.additionalAddressInformation
    )
      delivery.additionalAddressInformation = additionalAddressInformation

    if (address && address !== delivery.address) delivery.address = address

    if (availableAt && availableAt !== delivery.availableAt)
      delivery.availableAt = availableAt

    if (city && city !== delivery.city) delivery.city = city

    if (deliveredAt && deliveredAt !== delivery.deliveredAt)
      delivery.deliveredAt = deliveredAt

    if (latitude && latitude !== delivery.latitude) delivery.latitude = latitude

    if (longitude && longitude !== delivery.longitude)
      delivery.longitude = longitude

    if (pickupAt && pickupAt !== delivery.pickupAt) delivery.pickupAt = pickupAt

    if (returnedAt && returnedAt !== delivery.returnedAt)
      delivery.returnedAt = returnedAt

    if (state && state !== delivery.state) delivery.state = state

    if (zipCode && zipCode !== delivery.zipCode) delivery.zipCode = zipCode

    this.deliveriesRepository.save(delivery)

    return {
      delivery,
    }
  }
}
