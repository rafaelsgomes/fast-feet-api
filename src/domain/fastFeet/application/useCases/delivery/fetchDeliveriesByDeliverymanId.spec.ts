import { InMemoryDeliveriesRepository } from 'test/repositories/inMemoryDeliveriesRepository'
import { FetchDeliveriesByDeliverymanIdUseCase } from './fetchDeliveriesByDeliverymanId'
import { makeDelivery } from 'test/factories/makeDelivery'
import { makeDeliveryman } from 'test/factories/makeDeliveryman'
import { InMemoryDeliveriesAttachmentsRepository } from 'test/repositories/inMemoryDeliveriesAttachmentsRepository'
import { InMemoryAttachmentsRepository } from 'test/repositories/inMemoryAttachmentsRepository'
import { InMemoryDeliverymanRepository } from 'test/repositories/inMemoryDeliverymanRepository'
import { InMemoryRecipientRepository } from 'test/repositories/inMemoryRecipientRepository'

let repository: InMemoryDeliveriesRepository
let deliveriesAttachmentsRepository: InMemoryDeliveriesAttachmentsRepository
let attachmentsRepository: InMemoryAttachmentsRepository
let deliverymanRepository: InMemoryDeliverymanRepository
let recipientsRepository: InMemoryRecipientRepository
let sut: FetchDeliveriesByDeliverymanIdUseCase

describe('Fetch Deliveries By DeliverymanId', () => {
  beforeEach(() => {
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
