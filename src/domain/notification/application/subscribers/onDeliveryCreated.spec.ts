import { makeDelivery } from 'test/factories/makeDelivery'
import { OnDeliveryCreated } from './onDeliveryCreated'
import { InMemoryDeliveriesRepository } from 'test/repositories/inMemoryDeliveriesRepository'
import { InMemoryDeliveriesAttachmentsRepository } from 'test/repositories/inMemoryDeliveriesAttachmentsRepository'
import { InMemoryAttachmentsRepository } from 'test/repositories/inMemoryAttachmentsRepository'
import { InMemoryRecipientRepository } from 'test/repositories/inMemoryRecipientRepository'
import { InMemoryDeliverymanRepository } from 'test/repositories/inMemoryDeliverymanRepository'

import {
  SendNotificationUseCase,
  SendNotificationUseCaseRequest,
  SendNotificationUseCaseResponse,
} from '../useCases/sendNotification'
import { InMemoryNotificationsRepository } from 'test/repositories/inMemoryNotificationsRepository'
import { SpyInstance } from 'vitest'
import { waitFor } from 'test/utils/waitFor'

let inMemoryDeliveriesRepository: InMemoryDeliveriesRepository
let inMemoryDeliveriesAttachmentsRepository: InMemoryDeliveriesAttachmentsRepository
let repository: InMemoryNotificationsRepository
let sut: SendNotificationUseCase

let inMemoryRecipientRepository: InMemoryRecipientRepository
let inMemoryDeliverymanRepository: InMemoryDeliverymanRepository
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository
let sendNotificationExecuteSpy: SpyInstance<
  [SendNotificationUseCaseRequest],
  Promise<SendNotificationUseCaseResponse>
>

describe('On Delivery Created', () => {
  beforeEach(() => {
    inMemoryRecipientRepository = new InMemoryRecipientRepository()
    inMemoryDeliverymanRepository = new InMemoryDeliverymanRepository()
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository()
    inMemoryDeliveriesAttachmentsRepository =
      new InMemoryDeliveriesAttachmentsRepository()

    inMemoryDeliveriesRepository = new InMemoryDeliveriesRepository(
      inMemoryDeliveriesAttachmentsRepository,
      inMemoryAttachmentsRepository,
      inMemoryDeliverymanRepository,
      inMemoryRecipientRepository,
    )

    repository = new InMemoryNotificationsRepository()

    sut = new SendNotificationUseCase(repository)

    sendNotificationExecuteSpy = vi.spyOn(sut, 'execute')

    new OnDeliveryCreated(inMemoryDeliveriesRepository, sut)
  })
  it('Should send a notification when an delivery is created', async () => {
    const delivery = makeDelivery()

    await inMemoryDeliveriesRepository.create(delivery)

    await waitFor(() => {
      expect(sendNotificationExecuteSpy).toHaveBeenCalled()
    })
  })
})
