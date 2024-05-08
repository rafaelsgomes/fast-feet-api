import { Delivery } from '../../enterprise/entities/delivery'

export interface FindManyNearByParams {
  latitude: number
  longitude: number
  userId: string
}

export abstract class IDeliveriesRepository {
  abstract create(delivery: Delivery): Promise<void>
  abstract save(delivery: Delivery): Promise<void>
  abstract findById(deliveryId: string): Promise<Delivery | null>
  abstract findManyByRecipientId(recipientId: string): Promise<Delivery[]>
  abstract findManyByDeliverymanId(deliverymanId: string): Promise<Delivery[]>
  abstract findManyNearby(params: FindManyNearByParams): Promise<Delivery[]>

  abstract delete(deliveryId: string): Promise<void>
}
