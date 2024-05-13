import { InMemoryDeliveriesRepository } from 'test/repositories/inMemoryDeliveriesRepository'
import { FetchManyDeliveriesNearbyUseCase } from './fetchManyDeliveriesNearby'
import { InMemoryDeliveriesAttachmentsRepository } from 'test/repositories/inMemoryDeliveriesAttachmentsRepository'
import { makeDelivery } from 'test/factories/makeDelivery'
import { makeDeliveryman } from 'test/factories/makeDeliveryman'
import { InMemoryDeliverymanRepository } from 'test/repositories/inMemoryDeliverymanRepository'
import { InMemoryAttachmentsRepository } from 'test/repositories/inMemoryAttachmentsRepository'
import { InMemoryRecipientRepository } from 'test/repositories/inMemoryRecipientRepository'

let repository: InMemoryDeliveriesRepository
let deliveriesAttachmentsRepository: InMemoryDeliveriesAttachmentsRepository
let attachmentsRepository: InMemoryAttachmentsRepository
let deliverymanRepository: InMemoryDeliverymanRepository
let recipientsRepository: InMemoryRecipientRepository
let sut: FetchManyDeliveriesNearbyUseCase

describe('Fetch Deliveries Nearby', () => {
  beforeEach(async () => {
    deliveriesAttachmentsRepository =
      new InMemoryDeliveriesAttachmentsRepository()
    attachmentsRepository = new InMemoryAttachmentsRepository()
    deliverymanRepository = new InMemoryDeliverymanRepository()
    recipientsRepository = new InMemoryRecipientRepository()
    repository = new InMemoryDeliveriesRepository(
      deliveriesAttachmentsRepository,
      attachmentsRepository,
      deliverymanRepository,
      recipientsRepository,
    )
    deliverymanRepository = new InMemoryDeliverymanRepository()
    sut = new FetchManyDeliveriesNearbyUseCase(repository)
  })

  it('Should be able to fetch nearby deliveries', async () => {
    const deliveryman = makeDeliveryman()
    await deliverymanRepository.create(deliveryman)
    const deliveryOnDataBase = makeDelivery({
      city: 'City 01',
      deliverymanId: deliveryman.id,
      latitude: -23.5201136,
      longitude: -46.5258994,
    })
    const farDeliveryOnDatabase = makeDelivery({
      city: 'City 02',
      deliverymanId: deliveryman.id,
      latitude: -23.4951088,
      longitude: -46.6929418,
    })

    Promise.all([
      await repository.create(deliveryOnDataBase),
      await repository.create(farDeliveryOnDatabase),
    ])

    const { deliveries } = await sut.execute({
      userId: deliveryman.id,
      userLatitude: -23.5201136,
      userLongitude: -46.5258994,
    })

    expect(deliveries).toHaveLength(1)
    expect(deliveries).toEqual([expect.objectContaining({ city: 'City 01' })])
  })
})
