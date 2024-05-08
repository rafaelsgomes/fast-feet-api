import { InMemoryRecipientRepository } from 'test/repositories/inMemoryRecipientRepository'
import { ResetRecipientPasswordUseCase } from './resetRecipientPassword'
import { InMemoryHasher } from 'test/cryptography/inMemoryHasher'
import { makeRecipient } from 'test/factories/makeRecipient'

let repository: InMemoryRecipientRepository
let hasher: InMemoryHasher
let sut: ResetRecipientPasswordUseCase

describe('Reset recipient password', () => {
  beforeEach(() => {
    repository = new InMemoryRecipientRepository()
    hasher = new InMemoryHasher()
    sut = new ResetRecipientPasswordUseCase(repository, hasher)
  })

  it('should be able to set a new password to a recipient', async () => {
    const recipient = makeRecipient({
      password: await hasher.hash('password123'),
    })

    await repository.create(recipient)

    await sut.execute({
      recipientId: recipient.id,
      password: 'password124',
    })

    const passwordHashed = await hasher.hash('password124')

    expect(recipient).toBeTruthy()
    expect(repository.items[0].password).toEqual(passwordHashed)
    expect(repository.items[0].updatedAt).toEqual(expect.any(Date))
  })

  it('should not be able to set a new password to a recipient when the new password is the same as the previous one', async () => {
    const recipient = makeRecipient({
      password: await hasher.hash('password123'),
    })

    await repository.create(recipient)

    expect(() => {
      return sut.execute({
        recipientId: recipient.id,
        password: 'password123',
      })
    }).rejects.toBeInstanceOf(Error)
  })

  it('should not be able to set a new password to a recipient when the recipient does not exists', async () => {
    expect(() => {
      return sut.execute({
        recipientId: 'recipient.id',
        password: 'password123',
      })
    }).rejects.toBeInstanceOf(Error)
  })
})
