import { Delivery } from '@/domain/fastFeet/enterprise/entities/delivery'
import { IDeliveriesRepository } from '../../repositories/IDeliveriesRepository'
import { Injectable } from '@nestjs/common'

interface FetchManyDeliveriesNearbyRequest {
  userLatitude: number
  userLongitude: number
  userId: string
}
interface FetchManyDeliveriesNearbyResponse {
  deliveries: Delivery[]
}
@Injectable()
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
