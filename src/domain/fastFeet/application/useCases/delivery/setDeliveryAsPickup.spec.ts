import { InMemoryDeliveriesRepository } from 'test/repositories/inMemoryDeliveriesRepository'
import { SetDeliveryAsPickupUseCase } from './setDeliveryAsPickup'
import { makeDelivery } from 'test/factories/makeDelivery'
import { ResourceNotFoundError } from '@/core/errors/errors/resourceNotFoundError'
import { InMemoryDeliverymanRepository } from 'test/repositories/inMemoryDeliverymanRepository'
import { makeDeliveryman } from 'test/factories/makeDeliveryman'
import { UserNotFoundError } from '../_errors/userNotFoundError'
import { DeliveryIsNotAvailableError } from '../_errors/deliveryIsNotAvailableError'
import { InMemoryDeliveriesAttachmentsRepository } from 'test/repositories/inMemoryDeliveriesAttachmentsRepository'

let repository: InMemoryDeliveriesRepository
let deliverymanRepository: InMemoryDeliverymanRepository
let deliveriesAttachmentsRepository: InMemoryDeliveriesAttachmentsRepository
let sut: SetDeliveryAsPickupUseCase

describe('Set a delivery as pickup', () => {
  beforeEach(() => {
    deliveriesAttachmentsRepository =
      new InMemoryDeliveriesAttachmentsRepository()
    repository = new InMemoryDeliveriesRepository(
      deliveriesAttachmentsRepository,
    )
    deliverymanRepository = new InMemoryDeliverymanRepository()
    sut = new SetDeliveryAsPickupUseCase(repository, deliverymanRepository)
  })
  it('should be able set a delivery as pickup', async () => {
    const deliveryman = makeDeliveryman()
    await deliverymanRepository.create(deliveryman)

    const deliveryOnDatabase = makeDelivery({
      availableAt: new Date(),
    })
    await repository.create(deliveryOnDatabase)

    const { delivery } = await sut.execute({
      deliveryId: deliveryOnDatabase.id,
      deliverymanId: deliveryman.id,
    })

    expect(delivery.availableAt).toEqual(expect.any(Date))
    expect(repository.items[0].availableAt).toEqual(expect.any(Date))
    expect(repository.items[0].deliverymanId).toEqual(deliveryman.id)
  })

  it('should not be able to set a non-existing delivery as pickup', async () => {
    const deliveryman = makeDeliveryman()
    await deliverymanRepository.create(deliveryman)
    expect(() => {
      return sut.execute({
        deliveryId: 'id',
        deliverymanId: deliveryman.id,
      })
    }).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to set a delivery as pickup for a non-existing deliveryman', async () => {
    const deliveryOnDatabase = makeDelivery({
      availableAt: new Date(),
    })
    await repository.create(deliveryOnDatabase)
    expect(() => {
      return sut.execute({
        deliveryId: deliveryOnDatabase.id,
        deliverymanId: 'deliveryman.id',
      })
    }).rejects.toBeInstanceOf(UserNotFoundError)
  })

  it('should not be able to set a delivery as pickup if the delivery is no available', async () => {
    const deliveryman = makeDeliveryman()
    await deliverymanRepository.create(deliveryman)

    const deliveryOnDatabase = makeDelivery()
    await repository.create(deliveryOnDatabase)
    expect(() => {
      return sut.execute({
        deliveryId: deliveryOnDatabase.id,
        deliverymanId: deliveryman.id,
      })
    }).rejects.toBeInstanceOf(DeliveryIsNotAvailableError)
  })
})
