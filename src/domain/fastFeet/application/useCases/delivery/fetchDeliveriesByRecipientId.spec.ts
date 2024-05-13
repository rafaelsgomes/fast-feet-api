import { InMemoryDeliveriesRepository } from 'test/repositories/inMemoryDeliveriesRepository'
import { FetchDeliveriesByRecipientIdUseCase } from './fetchDeliveriesByRecipientId'
import { makeDelivery } from 'test/factories/makeDelivery'
import { makeRecipient } from 'test/factories/makeRecipient'
import { InMemoryDeliveriesAttachmentsRepository } from 'test/repositories/inMemoryDeliveriesAttachmentsRepository'
import { InMemoryAttachmentsRepository } from 'test/repositories/inMemoryAttachmentsRepository'
import { InMemoryDeliverymanRepository } from 'test/repositories/inMemoryDeliverymanRepository'
import { InMemoryRecipientRepository } from 'test/repositories/inMemoryRecipientRepository'

let repository: InMemoryDeliveriesRepository
let deliveriesAttachmentsRepository: InMemoryDeliveriesAttachmentsRepository
let attachmentsRepository: InMemoryAttachmentsRepository
let deliverymanRepository: InMemoryDeliverymanRepository
let recipientsRepository: InMemoryRecipientRepository
let sut: FetchDeliveriesByRecipientIdUseCase

describe('Fetch Deliveries By RecipientId', () => {
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
    sut = new FetchDeliveriesByRecipientIdUseCase(repository)
  })
  it('should be able fetch deliveries by recipientId', async () => {
    const recipient = makeRecipient()
    const deliveryOnDatabase = makeDelivery({
      recipientId: recipient.id,
    })

    await repository.create(deliveryOnDatabase)

    const { deliveries } = await sut.execute({
      recipientId: recipient.id,
    })

    expect(deliveries[0]).toEqual(deliveryOnDatabase)
  })

  it('should not be able to get a non-existing delivery', async () => {
    const { deliveries } = await sut.execute({
      recipientId: 'id',
    })
    expect(deliveries).toHaveLength(0)
  })
})
