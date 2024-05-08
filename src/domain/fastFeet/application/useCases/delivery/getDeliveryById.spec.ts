import { InMemoryDeliveriesRepository } from 'test/repositories/inMemoryDeliveriesRepository'
import { GetDeliveryByIdUseCase } from './getDeliveryById'
import { makeDelivery } from 'test/factories/makeDelivery'
import { ResourceNotFoundError } from '@/core/errors/errors/resourceNotFoundError'
import { InMemoryDeliveriesAttachmentsRepository } from 'test/repositories/inMemoryDeliveriesAttachmentsRepository'

let repository: InMemoryDeliveriesRepository
let deliveriesAttachmentsRepository: InMemoryDeliveriesAttachmentsRepository
let sut: GetDeliveryByIdUseCase

describe('Get Delivery', () => {
  beforeEach(() => {
    deliveriesAttachmentsRepository =
      new InMemoryDeliveriesAttachmentsRepository()
    repository = new InMemoryDeliveriesRepository(
      deliveriesAttachmentsRepository,
    )
    sut = new GetDeliveryByIdUseCase(repository)
  })
  it('should be able get a delivery', async () => {
    const deliveryOnDatabase = makeDelivery()

    await repository.create(deliveryOnDatabase)

    const { delivery } = await sut.execute({
      deliveryId: deliveryOnDatabase.id,
    })

    expect(delivery).toEqual(deliveryOnDatabase)
  })

  it('should not be able to get a non-existing delivery', async () => {
    expect(() => {
      return sut.execute({
        deliveryId: 'id',
      })
    }).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
