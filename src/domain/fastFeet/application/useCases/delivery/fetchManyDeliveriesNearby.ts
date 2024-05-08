import { Delivery } from '@/domain/fastFeet/enterprise/entities/delivery'
import { IDeliveriesRepository } from '../../repositories/IDeliveriesRepository'

interface FetchManyDeliveriesNearbyRequest {
  userLatitude: number
  userLongitude: number
  userId: string
}

interface FetchManyDeliveriesNearbyResponse {
  deliveries: Delivery[]
}

export class FetchManyDeliveriesNearbyUseCase {
  constructor(private deliveriesRepository: IDeliveriesRepository) {}

  async execute({
    userId,
    userLatitude,
    userLongitude,
  }: FetchManyDeliveriesNearbyRequest): Promise<FetchManyDeliveriesNearbyResponse> {
    const deliveries = await this.deliveriesRepository.findManyNearby({
      latitude: userLatitude,
      longitude: userLongitude,
      userId,
    })

    return {
      deliveries,
    }
  }
}
