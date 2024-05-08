import { InMemoryDeliveriesRepository } from 'test/repositories/inMemoryDeliveriesRepository'
import { SetDeliveryAsReturnedUseCase } from './setDeliveryAsReturned'
import { makeDelivery } from 'test/factories/makeDelivery'
import { ResourceNotFoundError } from '@/core/errors/errors/resourceNotFoundError'
import { InMemoryDeliveriesAttachmentsRepository } from 'test/repositories/inMemoryDeliveriesAttachmentsRepository'

let repository: InMemoryDeliveriesRepository
let deliveriesAttachmentsRepository: InMemoryDeliveriesAttachmentsRepository
let sut: SetDeliveryAsReturnedUseCase

describe('Set a delivery as pickup', () => {
  beforeEach(() => {
    deliveriesAttachmentsRepository =
      new InMemoryDeliveriesAttachmentsRepository()
    repository = new InMemoryDeliveriesRepository(
      deliveriesAttachmentsRepository,
    )
    sut = new SetDeliveryAsReturnedUseCase(repository)
  })
  it('should be able set a delivery as returned', async () => {
    const deliveryOnDatabase = makeDelivery({
      availableAt: new Date(),
    })
    await repository.create(deliveryOnDatabase)

    const { delivery } = await sut.execute({
      deliveryId: deliveryOnDatabase.id,
    })

    expect(delivery.returnedAt).toEqual(expect.any(Date))
    expect(repository.items[0].returnedAt).toEqual(expect.any(Date))
  })

  it('should not be able to set a non-existing delivery as returned', async () => {
    expect(() => {
      return sut.execute({
        deliveryId: 'id',
      })
    }).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
