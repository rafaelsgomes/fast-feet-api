import { InMemoryDeliveriesRepository } from 'test/repositories/inMemoryDeliveriesRepository'
import { DeleteDeliveryUseCase } from './deleteDelivery'
import { makeDelivery } from 'test/factories/makeDelivery'
import { ResourceNotFoundError } from '@/core/errors/errors/resourceNotFoundError'
import { InMemoryDeliveriesAttachmentsRepository } from 'test/repositories/inMemoryDeliveriesAttachmentsRepository'

let repository: InMemoryDeliveriesRepository
let deliveriesAttachmentsRepository: InMemoryDeliveriesAttachmentsRepository
let sut: DeleteDeliveryUseCase

describe('Delete Delivery', () => {
  beforeEach(() => {
    deliveriesAttachmentsRepository =
      new InMemoryDeliveriesAttachmentsRepository()
    repository = new InMemoryDeliveriesRepository(
      deliveriesAttachmentsRepository,
    )
    sut = new DeleteDeliveryUseCase(repository)
  })
  it('should be able to delete a delivery', async () => {
    const deliveryOnDatabase = makeDelivery()

    await repository.create(deliveryOnDatabase)

    await sut.execute({
      deliveryId: deliveryOnDatabase.id,
    })

    expect(repository.items.length).toEqual(0)
  })

  it('should not be able to delete a non-existing delivery', async () => {
    expect(() => {
      return sut.execute({
        deliveryId: 'id',
      })
    }).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
