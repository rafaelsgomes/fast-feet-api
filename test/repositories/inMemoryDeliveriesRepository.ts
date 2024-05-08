import { IDeliveryAttachmentsRepository } from '@/domain/fastFeet/application/repositories/IDeliveriesAttachmentsRepository'
import {
  FindManyNearByParams,
  IDeliveriesRepository,
} from '@/domain/fastFeet/application/repositories/IDeliveriesRepository'
import { Delivery } from '@/domain/fastFeet/enterprise/entities/delivery'
import { getDistanceBetweenCoordinates } from 'test/utils/getDistanceBetweenCoordinates'

export class InMemoryDeliveriesRepository implements IDeliveriesRepository {
  constructor(
    private deliveryAttachmentsRepository: IDeliveryAttachmentsRepository,
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
