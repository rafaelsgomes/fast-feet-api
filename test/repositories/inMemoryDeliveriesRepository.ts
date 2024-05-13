import { IAttachmentsRepository } from '@/domain/fastFeet/application/repositories/IAttachmentsRepository'
import { IDeliveryAttachmentsRepository } from '@/domain/fastFeet/application/repositories/IDeliveriesAttachmentsRepository'
import {
  FindManyNearByParams,
  IDeliveriesRepository,
} from '@/domain/fastFeet/application/repositories/IDeliveriesRepository'
import { IDeliverymanRepository } from '@/domain/fastFeet/application/repositories/IDeliverymanRepository'
import { IRecipientRepository } from '@/domain/fastFeet/application/repositories/IRecipientRepository'
import { Delivery } from '@/domain/fastFeet/enterprise/entities/delivery'
import { DeliveryDetails } from '@/domain/fastFeet/enterprise/entities/valueObjects/deliveryDetails'
import { getDistanceBetweenCoordinates } from 'test/utils/getDistanceBetweenCoordinates'

export class InMemoryDeliveriesRepository implements IDeliveriesRepository {
  constructor(
    private deliveryAttachmentsRepository: IDeliveryAttachmentsRepository,
    private attachmentsRepository: IAttachmentsRepository,
    private deliverymanRepository: IDeliverymanRepository,
    private recipientRepository: IRecipientRepository,
  ) {}

  public items: Delivery[] = []

  async create(delivery: Delivery): Promise<void> {
    this.items.push(delivery)
  }

  async save(delivery: Delivery): Promise<void> {
    const deliveryIndex = this.items.findIndex(
      (item) => item.id === delivery.id,
    )

    this.items[deliveryIndex] = delivery

    if (delivery.attachments) {
      await this.deliveryAttachmentsRepository.createMany(
        delivery.attachments.getNewItems(),
      )

      await this.deliveryAttachmentsRepository.deleteMany(
        delivery.attachments.getRemovedItems(),
      )
    }
  }

  async findById(deliveryId: string): Promise<Delivery> {
    const delivery = this.items.find((item) => item.id === deliveryId)

    if (!delivery) {
      return null
    }

    return delivery
  }

  async findDetailsById(deliveryId: string): Promise<DeliveryDetails> {
    const delivery = this.items.find((item) => item.id === deliveryId)

    if (!delivery) {
      return null
    }

    const recipient = await this.recipientRepository.findById(
      delivery.recipientId,
    )

    const deliveryman = await this.deliverymanRepository.findById(
      delivery.deliverymanId,
    )

    const deliveryAttachments =
      await this.deliveryAttachmentsRepository.findManyByDeliveryId(deliveryId)

    const attachments = await Promise.all(
      deliveryAttachments.map(async (item) => {
        const attachment = await this.attachmentsRepository.findById(item.id)

        if (!attachment) {
          throw new Error(
            `Attachment with ID "${item.attachmentId}" does not exists.`,
          )
        }

        return attachment
      }),
    )

    return DeliveryDetails.create({
      additionalAddressInformation: delivery.additionalAddressInformation,
      address: delivery.address,
      attachments,
      city: delivery.city,
      createdAt: delivery.createdAt,
      deliveryId: delivery.id,
      recipientId: recipient ? recipient.id : null,
      recipientName: recipient ? recipient.name : null,
      state: delivery.state,
      zipCode: delivery.zipCode,
      availableAt: delivery.availableAt,
      deliveredAt: delivery.deliveredAt,
      deliverymanId: deliveryman ? deliveryman.id : null,
      deliverymanName: deliveryman ? deliveryman.name : null,
      pickupAt: delivery.pickupAt,
      returnedAt: delivery.returnedAt,
      updatedAt: delivery.updatedAt,
    })
  }

  async findManyByRecipientId(recipientId: string): Promise<Delivery[]> {
    const deliveries = this.items.filter(
      (item) => item.recipientId === recipientId,
    )

    return deliveries
  }

  async findManyByDeliverymanId(deliverymanId: string): Promise<Delivery[]> {
    const deliveries = this.items.filter(
      (item) => item.deliverymanId === deliverymanId,
    )

    return deliveries
  }

  async findManyNearby({
    latitude,
    longitude,
    userId,
  }: FindManyNearByParams): Promise<Delivery[]> {
    return this.items.filter((item) => {
      const distance = getDistanceBetweenCoordinates(
        { latitude, longitude },
        {
          latitude: item.latitude,
          longitude: item.longitude,
        },
      )

      return distance < 10 && item.deliverymanId === userId
    })
  }

  async delete(deliveryId: string): Promise<void> {
    const deliveryIndex = this.items.findIndex((item) => item.id === deliveryId)

    this.items.splice(deliveryIndex, 1)
  }
}
