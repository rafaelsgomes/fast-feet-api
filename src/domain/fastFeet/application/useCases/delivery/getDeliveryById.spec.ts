import { InMemoryDeliveriesRepository } from 'test/repositories/inMemoryDeliveriesRepository'
import { GetDeliveryByIdUseCase } from './getDeliveryById'
import { makeDelivery } from 'test/factories/makeDelivery'
import { ResourceNotFoundError } from '@/core/errors/errors/resourceNotFoundError'
import { InMemoryDeliveriesAttachmentsRepository } from 'test/repositories/inMemoryDeliveriesAttachmentsRepository'
import { makeRecipient } from 'test/factories/makeRecipient'
import { InMemoryRecipientRepository } from 'test/repositories/inMemoryRecipientRepository'
import { NotAllowedError } from '../_errors/notAllowedError'
import { InMemoryAttachmentsRepository } from 'test/repositories/inMemoryAttachmentsRepository'
import { InMemoryDeliverymanRepository } from 'test/repositories/inMemoryDeliverymanRepository'

let repository: InMemoryDeliveriesRepository
let deliveriesAttachmentsRepository: InMemoryDeliveriesAttachmentsRepository
let attachmentsRepository: InMemoryAttachmentsRepository
let deliverymanRepository: InMemoryDeliverymanRepository
let recipientsRepository: InMemoryRecipientRepository
let sut: GetDeliveryByIdUseCase

describe('Get Delivery', () => {
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
    sut = new GetDeliveryByIdUseCase(repository)
  })
  it('should be able get a delivery', async () => {
    const recipient = makeRecipient()
    await recipientsRepository.create(recipient)

    const deliveryOnDatabase = makeDelivery({
      recipientId: recipient.id,
    })

    await repository.create(deliveryOnDatabase)

    const { delivery } = await sut.execute({
      userId: recipient.id,
      deliveryId: deliveryOnDatabase.id,
    })

    expect(delivery).toEqual(
      expect.objectContaining({
        deliveryId: deliveryOnDatabase.id,
        recipientName: recipient.name,
      }),
    )
  })

  it('should not be able to get a non-existing delivery', async () => {
    expect(() => {
      return sut.execute({
        deliveryId: 'id',
        userId: 'userId',
      })
    }).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to get a delivery with wrong userId', async () => {
    const deliveryOnDatabase = makeDelivery()

    await repository.create(deliveryOnDatabase)

    expect(() => {
      return sut.execute({
        deliveryId: deliveryOnDatabase.id,
        userId: 'userId',
      })
    }).rejects.toBeInstanceOf(NotAllowedError)
  })
})
