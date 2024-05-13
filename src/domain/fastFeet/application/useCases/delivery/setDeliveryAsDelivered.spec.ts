import { InMemoryDeliveriesRepository } from 'test/repositories/inMemoryDeliveriesRepository'
import { SetDeliveryAsDeliveredUseCase } from './setDeliveryAsDelivered'
import { makeDelivery } from 'test/factories/makeDelivery'
import { ResourceNotFoundError } from '@/core/errors/errors/resourceNotFoundError'
import { InMemoryDeliverymanRepository } from 'test/repositories/inMemoryDeliverymanRepository'
import { makeDeliveryman } from 'test/factories/makeDeliveryman'
import { NotAllowedError } from '../_errors/notAllowedError'
import { InMemoryDeliveriesAttachmentsRepository } from 'test/repositories/inMemoryDeliveriesAttachmentsRepository'
import { InMemoryAttachmentsRepository } from 'test/repositories/inMemoryAttachmentsRepository'
import { makeAttachment } from 'test/factories/makeAttachment'
import { AttachmentsNotFoundError } from '../_errors/attachmentsNotFoundError'
import { InMemoryRecipientRepository } from 'test/repositories/inMemoryRecipientRepository'

let repository: InMemoryDeliveriesRepository
let deliveriesAttachmentsRepository: InMemoryDeliveriesAttachmentsRepository
let attachmentsRepository: InMemoryAttachmentsRepository
let deliverymanRepository: InMemoryDeliverymanRepository
let recipientsRepository: InMemoryRecipientRepository
let sut: SetDeliveryAsDeliveredUseCase

describe('Set a delivery as delivered', () => {
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
    attachmentsRepository = new InMemoryAttachmentsRepository()
    deliverymanRepository = new InMemoryDeliverymanRepository()
    sut = new SetDeliveryAsDeliveredUseCase(repository, attachmentsRepository)
  })
  it('should be able to set a delivery as delivered', async () => {
    const deliveryman = makeDeliveryman()
    await deliverymanRepository.create(deliveryman)

    const attachment = makeAttachment()
    await attachmentsRepository.create(attachment)

    const deliveryOnDatabase = makeDelivery({
      deliverymanId: deliveryman.id,
    })
    await repository.create(deliveryOnDatabase)

    const { delivery } = await sut.execute({
      deliveryId: deliveryOnDatabase.id,
      deliverymanId: deliveryman.id,
      attachmentsIds: [attachment.id],
    })

    expect(delivery.attachments.currentItems).toHaveLength(1)
    expect(delivery.attachments.currentItems).toEqual([
      expect.objectContaining({ attachmentId: attachment.id }),
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

  it('should not be able to set a delivery as delivered if attachment does not exists on database', async () => {
    const deliveryman = makeDeliveryman()
    await deliverymanRepository.create(deliveryman)

    const deliveryOnDatabase = makeDelivery({
      deliverymanId: deliveryman.id,
    })
    await repository.create(deliveryOnDatabase)

    expect(() => {
      return sut.execute({
        deliveryId: deliveryOnDatabase.id,
        deliverymanId: deliveryman.id,
        attachmentsIds: ['1', '2'],
      })
    }).rejects.toBeInstanceOf(AttachmentsNotFoundError)
  })
})
