import { InMemoryDeliveriesRepository } from 'test/repositories/inMemoryDeliveriesRepository'
import { SetDeliveryAsAvailableUseCase } from './setDeliveryAsAvailable'
import { makeDelivery } from 'test/factories/makeDelivery'
import { ResourceNotFoundError } from '@/core/errors/errors/resourceNotFoundError'
import { InMemoryDeliveriesAttachmentsRepository } from 'test/repositories/inMemoryDeliveriesAttachmentsRepository'

let repository: InMemoryDeliveriesRepository
let deliveriesAttachmentsRepository: InMemoryDeliveriesAttachmentsRepository
let sut: SetDeliveryAsAvailableUseCase

describe('Set a delivery as available', () => {
  beforeEach(() => {
    deliveriesAttachmentsRepository =
      new InMemoryDeliveriesAttachmentsRepository()
    repository = new InMemoryDeliveriesRepository(
      deliveriesAttachmentsRepository,
    )
    sut = new SetDeliveryAsAvailableUseCase(repository)
  })
  it('should be able set a delivery as available', async () => {
    const deliveryOnDatabase = makeDelivery()

    await repository.create(deliveryOnDatabase)

    const { delivery } = await sut.execute({
      deliveryId: deliveryOnDatabase.id,
    })

    expect(delivery.availableAt).toEqual(expect.any(Date))
    expect(repository.items[0].availableAt).toEqual(expect.any(Date))
  })

  it('should not be able to set a non-existing delivery as available', async () => {
    expect(() => {
      return sut.execute({
        deliveryId: 'id',
      })
    }).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
