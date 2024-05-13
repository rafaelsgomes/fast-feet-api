import { InMemoryDeliveriesRepository } from 'test/repositories/inMemoryDeliveriesRepository'
import { UpdateDeliveryUseCase } from './updateDelivery'
import { makeDelivery } from 'test/factories/makeDelivery'
import { ResourceNotFoundError } from '@/core/errors/errors/resourceNotFoundError'
import { InMemoryDeliverymanRepository } from 'test/repositories/inMemoryDeliverymanRepository'
import { makeDeliveryman } from 'test/factories/makeDeliveryman'
import { UserNotFoundError } from '../_errors/userNotFoundError'
import { InMemoryRecipientRepository } from 'test/repositories/inMemoryRecipientRepository'
import { makeRecipient } from 'test/factories/makeRecipient'
import { InformationNotProvidedError } from '../_errors/informationNotProvidedError'
import { faker } from '@faker-js/faker'
import { InMemoryDeliveriesAttachmentsRepository } from 'test/repositories/inMemoryDeliveriesAttachmentsRepository'
import { InMemoryAttachmentsRepository } from 'test/repositories/inMemoryAttachmentsRepository'

let repository: InMemoryDeliveriesRepository
let deliveriesAttachmentsRepository: InMemoryDeliveriesAttachmentsRepository
let attachmentsRepository: InMemoryAttachmentsRepository
let deliverymanRepository: InMemoryDeliverymanRepository
let recipientsRepository: InMemoryRecipientRepository
let sut: UpdateDeliveryUseCase

describe('Update delivery', () => {
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
    sut = new UpdateDeliveryUseCase(
      repository,
      deliverymanRepository,
      recipientsRepository,
    )
  })

  it('should be able to update a delivery additionalAddressInformation', async () => {
    const deliveryOnDatabase = makeDelivery()
    await repository.create(deliveryOnDatabase)

    const { delivery } = await sut.execute({
      deliveryId: deliveryOnDatabase.id,
      additionalAddressInformation: 'additionalAddressInformation',
    })

    expect(delivery.additionalAddressInformation).toEqual(
      'additionalAddressInformation',
    )
    expect(delivery.updatedAt).toEqual(expect.any(Date))
  })

  it('should be able to update a delivery address', async () => {
    const deliveryOnDatabase = makeDelivery()
    await repository.create(deliveryOnDatabase)

    const { delivery } = await sut.execute({
      deliveryId: deliveryOnDatabase.id,
      address: 'address',
    })

    expect(delivery.address).toEqual('address')
    expect(delivery.updatedAt).toEqual(expect.any(Date))
  })

  it('should be able to update a delivery availableAt', async () => {
    const deliveryOnDatabase = makeDelivery()
    await repository.create(deliveryOnDatabase)

    const { delivery } = await sut.execute({
      deliveryId: deliveryOnDatabase.id,
      availableAt: new Date('2024-3-3'),
    })

    expect(delivery.availableAt).toEqual(new Date('2024-3-3'))
    expect(delivery.updatedAt).toEqual(expect.any(Date))
  })

  it('should be able to update a delivery city', async () => {
    const deliveryOnDatabase = makeDelivery()
    await repository.create(deliveryOnDatabase)

    const { delivery } = await sut.execute({
      deliveryId: deliveryOnDatabase.id,
      city: 'city',
    })

    expect(delivery.city).toEqual('city')
    expect(delivery.updatedAt).toEqual(expect.any(Date))
  })

  it('should be able to update a delivery deliveredAt', async () => {
    const deliveryOnDatabase = makeDelivery()
    await repository.create(deliveryOnDatabase)

    const { delivery } = await sut.execute({
      deliveryId: deliveryOnDatabase.id,
      deliveredAt: new Date('2024-3-3'),
    })

    expect(delivery.deliveredAt).toEqual(new Date('2024-3-3'))
    expect(delivery.updatedAt).toEqual(expect.any(Date))
  })

  it('should be able to update a delivery latitude', async () => {
    const deliveryOnDatabase = makeDelivery()
    await repository.create(deliveryOnDatabase)

    const latitude = faker.location.latitude()

    const { delivery } = await sut.execute({
      deliveryId: deliveryOnDatabase.id,
      latitude,
    })

    expect(delivery.latitude).toEqual(latitude)
    expect(delivery.updatedAt).toEqual(expect.any(Date))
  })

  it('should be able to update a delivery longitude', async () => {
    const deliveryOnDatabase = makeDelivery()
    await repository.create(deliveryOnDatabase)

    const longitude = faker.location.longitude()

    const { delivery } = await sut.execute({
      deliveryId: deliveryOnDatabase.id,
      longitude,
    })

    expect(delivery.longitude).toEqual(longitude)
    expect(delivery.updatedAt).toEqual(expect.any(Date))
  })

  it('should be able to update a delivery pickupAt', async () => {
    const deliveryOnDatabase = makeDelivery()
    await repository.create(deliveryOnDatabase)

    const { delivery } = await sut.execute({
      deliveryId: deliveryOnDatabase.id,
      pickupAt: new Date('2024-3-3'),
    })

    expect(delivery.pickupAt).toEqual(new Date('2024-3-3'))
    expect(delivery.updatedAt).toEqual(expect.any(Date))
  })

  it('should be able to update a delivery returnedAt', async () => {
    const deliveryOnDatabase = makeDelivery()
    await repository.create(deliveryOnDatabase)

    const { delivery } = await sut.execute({
      deliveryId: deliveryOnDatabase.id,
      returnedAt: new Date('2024-3-3'),
    })

    expect(delivery.returnedAt).toEqual(new Date('2024-3-3'))
    expect(delivery.updatedAt).toEqual(expect.any(Date))
  })

  it('should be able to update a delivery state', async () => {
    const deliveryOnDatabase = makeDelivery()
    await repository.create(deliveryOnDatabase)

    const { delivery } = await sut.execute({
      deliveryId: deliveryOnDatabase.id,
      state: 'state',
    })

    expect(delivery.state).toEqual('state')
    expect(delivery.updatedAt).toEqual(expect.any(Date))
  })

  it('should be able to update a delivery zipCode', async () => {
    const deliveryOnDatabase = makeDelivery()
    await repository.create(deliveryOnDatabase)

    const { delivery } = await sut.execute({
      deliveryId: deliveryOnDatabase.id,
      zipCode: 'zipCode',
    })

    expect(delivery.zipCode).toEqual('zipCode')
    expect(delivery.updatedAt).toEqual(expect.any(Date))
  })

  it('should be able to update a delivery deliveryman', async () => {
    const deliveryman = makeDeliveryman()
    await deliverymanRepository.create(deliveryman)

    const deliveryOnDatabase = makeDelivery()
    await repository.create(deliveryOnDatabase)

    const { delivery } = await sut.execute({
      deliveryId: deliveryOnDatabase.id,
      deliverymanId: deliveryman.id,
    })

    expect(delivery.deliverymanId).toEqual(expect.any(String))
    expect(delivery.updatedAt).toEqual(expect.any(Date))
  })

  it('should be able to update a delivery recipient', async () => {
    const recipient = makeRecipient()
    await recipientsRepository.create(recipient)

    const deliveryOnDatabase = makeDelivery()
    await repository.create(deliveryOnDatabase)

    const { delivery } = await sut.execute({
      deliveryId: deliveryOnDatabase.id,
      recipientId: recipient.id,
    })

    expect(delivery.recipientId).toEqual(expect.any(String))
    expect(delivery.updatedAt).toEqual(expect.any(Date))
  })

  it('should not be able to update a non-existing delivery', async () => {
    expect(() => {
      return sut.execute({
        deliveryId: 'id',
        deliverymanId: 'deliveryman.id',
      })
    }).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to update a delivery with a non-existing deliveryman', async () => {
    const deliveryOnDatabase = makeDelivery()
    await repository.create(deliveryOnDatabase)

    expect(() => {
      return sut.execute({
        deliveryId: deliveryOnDatabase.id,
        deliverymanId: 'deliveryman.id',
      })
    }).rejects.toBeInstanceOf(UserNotFoundError)
  })

  it('should not be able to update a delivery with a non-existing recipient', async () => {
    const deliveryOnDatabase = makeDelivery()
    await repository.create(deliveryOnDatabase)

    expect(() => {
      return sut.execute({
        deliveryId: deliveryOnDatabase.id,
        recipientId: 'recipient.id',
      })
    }).rejects.toBeInstanceOf(UserNotFoundError)
  })

  it('should not be able to update when new information is not provided', async () => {
    const delivery = makeDelivery()

    await repository.create(delivery)

    expect(() => {
      return sut.execute({
        deliveryId: delivery.id,
      })
    }).rejects.toBeInstanceOf(InformationNotProvidedError)
    expect(repository.items[0].updatedAt).toBeUndefined()
  })
})
