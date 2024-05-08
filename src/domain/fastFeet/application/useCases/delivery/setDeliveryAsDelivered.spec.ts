import { InMemoryDeliveriesRepository } from 'test/repositories/inMemoryDeliveriesRepository'
import { SetDeliveryAsDeliveredUseCase } from './setDeliveryAsDelivered'
import { makeDelivery } from 'test/factories/makeDelivery'
import { ResourceNotFoundError } from '@/core/errors/errors/resourceNotFoundError'
import { InMemoryDeliverymanRepository } from 'test/repositories/inMemoryDeliverymanRepository'
import { makeDeliveryman } from 'test/factories/makeDeliveryman'
import { NotAllowedError } from '../_errors/notAllowedError'
import { InMemoryDeliveriesAttachmentsRepository } from 'test/repositories/inMemoryDeliveriesAttachmentsRepository'

let repository: InMemoryDeliveriesRepository
let deliverymanRepository: InMemoryDeliverymanRepository
let deliveriesAttachmentsRepository: InMemoryDeliveriesAttachmentsRepository
let sut: SetDeliveryAsDeliveredUseCase

describe('Set a delivery as delivered', () => {
  beforeEach(() => {
    deliveriesAttachmentsRepository =
      new InMemoryDeliveriesAttachmentsRepository()
    repository = new InMemoryDeliveriesRepository(
      deliveriesAttachmentsRepository,
    )
    deliverymanRepository = new InMemoryDeliverymanRepository()
    sut = new SetDeliveryAsDeliveredUseCase(repository)
  })
  it('should be able to set a delivery as delivered', async () => {
    const deliveryman = makeDeliveryman()
    await deliverymanRepository.create(deliveryman)

    const deliveryOnDatabase = makeDelivery({
      deliverymanId: deliveryman.id,
    })
    await repository.create(deliveryOnDatabase)

    const { delivery } = await sut.execute({
      deliveryId: deliveryOnDatabase.id,
      deliverymanId: deliveryman.id,
      attachmentsIds: ['1', '2'],
    })

    expect(delivery.attachments.currentItems).toHaveLength(2)
    expect(delivery.attachments.currentItems).toEqual([
      expect.objectContaining({ attachmentId: '1' }),
      expect.objectContaining({ attachmentId: '2' }),
    ])
    expect(delivery.deliveredAt).toEqual(expect.any(Date))
    expect(delivery.updatedAt).toEqual(expect.any(Date))
  })

  it('should not be able to set a delivery as delivered from another deliveryman', async () => {
    const deliveryman = makeDeliveryman()
    await deliverymanRepository.create(deliveryman)

    const deliveryOnDatabase = makeDelivery({
      deliverymanId: deliveryman.id,
    })
    await repository.create(deliveryOnDatabase)

    expect(() => {
      return sut.execute({
        deliveryId: deliveryOnDatabase.id,
        deliverymanId: 'deliveryman.id',
        attachmentsIds: ['1', '2'],
      })
    }).rejects.toBeInstanceOf(NotAllowedError)
  })

  it('should not be able to set a non-existing delivery as delivered', async () => {
    expect(() => {
      return sut.execute({
        deliveryId: 'id',
        deliverymanId: 'deliveryman.id',
        attachmentsIds: ['1', '2'],
      })
    }).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
