import { makeDelivery } from 'test/factories/makeDelivery'
import { OnDeliveryMade } from './onDeliveryMade'
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
import { makeDeliveryman } from 'test/factories/makeDeliveryman'
import { makeAttachment } from 'test/factories/makeAttachment'
import { DeliveryAttachment } from '@/domain/fastFeet/enterprise/entities/deliveryAttachment'

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

describe('On Delivery Delivered', () => {
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

    new OnDeliveryMade(
      inMemoryDeliveriesRepository,
      inMemoryDeliverymanRepository,
      sut,
    )
  })
  it('Should send a notification when an delivery is delivered', async () => {
    const deliveryman = makeDeliveryman()
    await inMemoryDeliverymanRepository.create(deliveryman)

    const delivery = makeDelivery({
      deliverymanId: deliveryman.id,
    })
    await inMemoryDeliveriesRepository.create(delivery)

    const attachment1 = makeAttachment()
    const attachment2 = makeAttachment()
    Promise.all([
      await inMemoryAttachmentsRepository.create(attachment1),
      await inMemoryAttachmentsRepository.create(attachment2),
    ])

    const attachmentsIds = [attachment1.id, attachment2.id]

    const attachments = attachmentsIds.map((attachmentId) => {
      return DeliveryAttachment.create({
        attachmentId,
        deliveryId: delivery.id,
      })
    })

    delivery.setDelivered(attachments)

    await inMemoryDeliveriesRepository.save(delivery)

    await waitFor(() => {
      expect(sendNotificationExecuteSpy).toHaveBeenCalled()
    })
  })
})
