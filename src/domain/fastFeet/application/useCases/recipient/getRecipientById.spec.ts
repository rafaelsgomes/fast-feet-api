import { InMemoryRecipientRepository } from 'test/repositories/inMemoryRecipientRepository'
import { GetRecipientByIdUseCase } from './getRecipientById'
import { makeRecipient } from 'test/factories/makeRecipient'
import { UserNotFoundError } from '../_errors/userNotFoundError'

let repository: InMemoryRecipientRepository
let sut: GetRecipientByIdUseCase

describe('Get recipient by id', () => {
  beforeEach(() => {
    repository = new InMemoryRecipientRepository()
    sut = new GetRecipientByIdUseCase(repository)
  })
  it('should be able to get a recipient info by id', async () => {
    const newRecipient = makeRecipient({
      document: '12345678900',
    })

    await repository.create(newRecipient)

    const { recipient } = await sut.execute({
      recipientId: newRecipient.id,
    })

    expect(recipient.document).toEqual('12345678900')
  })

  it('should not be able to get a recipient with wrong id', async () => {
    expect(() => {
      return sut.execute({
        recipientId: 'id',
      })
    }).rejects.toBeInstanceOf(UserNotFoundError)
  })
})
