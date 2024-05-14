import { makeNotification } from 'test/factories/makeNotification'
import { ReadNotificationUseCase } from './readNotification'
import { InMemoryNotificationsRepository } from 'test/repositories/inMemoryNotificationsRepository'
import { NotAllowedError } from '@/domain/fastFeet/application/useCases/_errors/notAllowedError'

let repository: InMemoryNotificationsRepository
let sut: ReadNotificationUseCase

describe('Read Notification', async () => {
  beforeEach(() => {
    repository = new InMemoryNotificationsRepository()
    sut = new ReadNotificationUseCase(repository)
  })

  it('should be able to read a notification', async () => {
    const notificationOnDatabase = makeNotification({
      recipientId: 'recipient-1',
    })

    await repository.create(notificationOnDatabase)

    const { notification } = await sut.execute({
      recipientId: 'recipient-1',
      notificationId: notificationOnDatabase.id,
    })

    expect(notification.readAt).toEqual(expect.any(Date))
  })

  it('should not be able to read a notification from another user', async () => {
    const notificationOnDatabase = makeNotification({
      recipientId: 'recipient-1',
    })

    await repository.create(notificationOnDatabase)

    expect(() => {
      return sut.execute({
        recipientId: 'recipient-2',
        notificationId: notificationOnDatabase.id,
      })
    }).rejects.toBeInstanceOf(NotAllowedError)
  })
})
