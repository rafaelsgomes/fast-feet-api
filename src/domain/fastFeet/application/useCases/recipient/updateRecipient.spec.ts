import { InMemoryRecipientRepository } from 'test/repositories/inMemoryRecipientRepository'
import { UpdateRecipientUseCase } from './updateRecipient'
import { makeRecipient } from 'test/factories/makeRecipient'

let repository: InMemoryRecipientRepository
let sut: UpdateRecipientUseCase

describe('Update recipient', () => {
  beforeEach(() => {
    repository = new InMemoryRecipientRepository()
    sut = new UpdateRecipientUseCase(repository)
  })

  it('should be able to update a recipient email', async () => {
    const recipient = makeRecipient()

    await repository.create(recipient)

    await sut.execute({
      recipientId: recipient.id,
      email: 'updated@email.com',
    })

    expect(repository.items[0].email).toEqual('updated@email.com')
    expect(repository.items[0].updatedAt).toEqual(expect.any(Date))
  })

  it('should be able to update a recipient name', async () => {
    const recipient = makeRecipient()

    await repository.create(recipient)

    await sut.execute({
      recipientId: recipient.id,
      name: 'John Doe',
    })

    expect(repository.items[0].name).toEqual('John Doe')
    expect(repository.items[0].updatedAt).toEqual(expect.any(Date))
  })

  it('should not be able to update when the recipient does not exists', async () => {
    expect(() => {
      return sut.execute({
        recipientId: 'recipient.id',
        name: 'John Doe',
      })
    }).rejects.toBeInstanceOf(Error)
  })

  it('should not be able to update when new information is not provided', async () => {
    const recipient = makeRecipient()

    await repository.create(recipient)

    await sut.execute({
      recipientId: recipient.id,
    })

    expect(repository.items[0].updatedAt).toBeUndefined()
  })
})
