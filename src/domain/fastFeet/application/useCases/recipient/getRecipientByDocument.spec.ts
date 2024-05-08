import { InMemoryRecipientRepository } from 'test/repositories/inMemoryRecipientRepository'
import { GetRecipientByDocumentUseCase } from './getRecipientByDocument'
import { makeRecipient } from 'test/factories/makeRecipient'
import { UserNotFoundError } from '../_errors/userNotFoundError'

let repository: InMemoryRecipientRepository
let sut: GetRecipientByDocumentUseCase

describe('Get recipient by document', () => {
  beforeEach(() => {
    repository = new InMemoryRecipientRepository()
    sut = new GetRecipientByDocumentUseCase(repository)
  })
  it('should be able to get a recipient info by document', async () => {
    const newRecipient = makeRecipient({
      document: '12345678900',
    })

    await repository.create(newRecipient)

    const { recipient } = await sut.execute({
      document: newRecipient.document,
    })

    expect(recipient.document).toEqual('12345678900')
  })

  it('should not be able to get a recipient with wrong document', async () => {
    expect(() => {
      return sut.execute({
        document: 'document',
      })
    }).rejects.toBeInstanceOf(UserNotFoundError)
  })
})
