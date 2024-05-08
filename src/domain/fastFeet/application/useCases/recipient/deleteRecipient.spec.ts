import { InMemoryRecipientRepository } from 'test/repositories/inMemoryRecipientRepository'
import { DeleteRecipientUseCase } from './deleteRecipient'
import { InMemoryHasher } from 'test/cryptography/inMemoryHasher'
import { makeRecipient } from 'test/factories/makeRecipient'
import { UserNotFoundError } from '../_errors/userNotFoundError'

let repository: InMemoryRecipientRepository
let hasher: InMemoryHasher
let sut: DeleteRecipientUseCase

describe('Delete recipient', () => {
  beforeEach(() => {
    repository = new InMemoryRecipientRepository()
    hasher = new InMemoryHasher()
    sut = new DeleteRecipientUseCase(repository)
  })
  it('should be able to delete a recipient', async () => {
    const recipient = makeRecipient({
      document: '12345678900',
      password: await hasher.hash('password123'),
    })

    await repository.create(recipient)

    await sut.execute({
      recipientId: recipient.id,
    })

    expect(repository.items.length).toEqual(0)
  })

  it('should not be able to delete a non existing recipient', async () => {
    const recipient = makeRecipient({
      password: await hasher.hash('password123'),
    })

    await repository.create(recipient)

    expect(() => {
      return sut.execute({
        recipientId: 'recipient.id',
      })
    }).rejects.toBeInstanceOf(UserNotFoundError)
  })
})
