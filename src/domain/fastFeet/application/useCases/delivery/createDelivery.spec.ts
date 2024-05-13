import { InMemoryDeliveriesRepository } from 'test/repositories/inMemoryDeliveriesRepository'
import { CreateDeliveryUseCase } from './createDelivery'
import { InMemoryRecipientRepository } from 'test/repositories/inMemoryRecipientRepository'
import { makeRecipient } from 'test/factories/makeRecipient'
import { faker } from '@faker-js/faker'
import { UserNotFoundError } from '../_errors/userNotFoundError'
import { InMemoryDeliveriesAttachmentsRepository } from 'test/repositories/inMemoryDeliveriesAttachmentsRepository'
import { InMemoryAttachmentsRepository } from 'test/repositories/inMemoryAttachmentsRepository'
import { InMemoryDeliverymanRepository } from 'test/repositories/inMemoryDeliverymanRepository'

let repository: InMemoryDeliveriesRepository
let deliveriesAttachmentsRepository: InMemoryDeliveriesAttachmentsRepository
let attachmentsRepository: InMemoryAttachmentsRepository
let deliverymanRepository: InMemoryDeliverymanRepository
let recipientsRepository: InMemoryRecipientRepository
let sut: CreateDeliveryUseCase

describe('Create delivery', () => {
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
    sut = new CreateDeliveryUseCase(repository, recipientsRepository)
  })
  it('should be able create a delivery', async () => {
    const recipient = makeRecipient()

    await recipientsRepository.create(recipient)

    const { delivery } = await sut.execute({
      longitude: faker.location.longitude(),
      latitude: faker.location.latitude(),
      zipCode: faker.location.zipCode(),
      address: faker.location.streetAddress(),
      city: faker.location.city(),
      state: faker.location.state(),
      additionalAddressInformation: faker.location.secondaryAddress(),
      recipientId: recipient.id,
    })

    expect(delivery).toBeTruthy()
    expect(repository.items[0]).toEqual(
      expect.objectContaining({
        city: expect.any(String),
        recipientId: expect.any(String),
      }),
    )
  })

  it('should not be able to create a delivery for a non-existing recipient', async () => {
    expect(() => {
      return sut.execute({
        longitude: faker.location.longitude(),
        latitude: faker.location.latitude(),
        zipCode: faker.location.zipCode(),
        address: faker.location.streetAddress(),
        city: faker.location.city(),
        state: faker.location.state(),
        additionalAddressInformation: faker.location.secondaryAddress(),
        recipientId: 'recipient.id',
      })
    }).rejects.toBeInstanceOf(UserNotFoundError)
  })
})
