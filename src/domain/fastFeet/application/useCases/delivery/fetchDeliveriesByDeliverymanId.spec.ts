import { InMemoryDeliveriesRepository } from 'test/repositories/inMemoryDeliveriesRepository'
import { FetchDeliveriesByDeliverymanIdUseCase } from './fetchDeliveriesByDeliverymanId'
import { makeDelivery } from 'test/factories/makeDelivery'
import { makeDeliveryman } from 'test/factories/makeDeliveryman'
import { InMemoryDeliveriesAttachmentsRepository } from 'test/repositories/inMemoryDeliveriesAttachmentsRepository'

let repository: InMemoryDeliveriesRepository
let deliveriesAttachmentsRepository: InMemoryDeliveriesAttachmentsRepository
let sut: FetchDeliveriesByDeliverymanIdUseCase

describe('Fetch Deliveries By DeliverymanId', () => {
  beforeEach(() => {
    deliveriesAttachmentsRepository =
      new InMemoryDeliveriesAttachmentsRepository()
    repository = new InMemoryDeliveriesRepository(
      deliveriesAttachmentsRepository,
    )
    sut = new FetchDeliveriesByDeliverymanIdUseCase(repository)
  })
  it('should be able fetch deliveries by deliverymanId', async () => {
    const deliveryman = makeDeliveryman()
    const deliveryOnDatabase = makeDelivery({
      deliverymanId: deliveryman.id,
    })

    await repository.create(deliveryOnDatabase)

    const { deliveries } = await sut.execute({
      deliverymanId: deliveryman.id,
    })

    expect(deliveries[0]).toEqual(deliveryOnDatabase)
  })

  it('should not be able to get a non-existing delivery', async () => {
    const { deliveries } = await sut.execute({
      deliverymanId: 'id',
    })
    expect(deliveries).toHaveLength(0)
  })
})
