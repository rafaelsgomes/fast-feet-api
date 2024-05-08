import { InMemoryRecipientRepository } from 'test/repositories/inMemoryRecipientRepository'
import { GetRecipientByEmailUseCase } from './getRecipientByEmail'
import { makeRecipient } from 'test/factories/makeRecipient'
import { UserNotFoundError } from '../_errors/userNotFoundError'

let repository: InMemoryRecipientRepository
let sut: GetRecipientByEmailUseCase

describe('Get recipient by email', () => {
  beforeEach(() => {
    repository = new InMemoryRecipientRepository()
    sut = new GetRecipientByEmailUseCase(repository)
  })
  it('should be able to get a recipient info by email', async () => {
    const newRecipient = makeRecipient({
      email: '12345678900',
    })

    await repository.create(newRecipient)

    const { recipient } = await sut.execute({
      email: newRecipient.email,
    })

    expect(recipient.email).toEqual('12345678900')
  })

  it('should not be able to get a recipient with wrong email', async () => {
    expect(() => {
      return sut.execute({
        email: 'email',
      })
    }).rejects.toBeInstanceOf(UserNotFoundError)
  })
})
