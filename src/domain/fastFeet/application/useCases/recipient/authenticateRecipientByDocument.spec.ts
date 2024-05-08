import { InMemoryRecipientRepository } from 'test/repositories/inMemoryRecipientRepository'
import { AuthenticateRecipientByDocumentUseCase } from './authenticateRecipientByDocument'
import { InMemoryHasher } from 'test/cryptography/inMemoryHasher'
import { InMemoryEncrypter } from 'test/cryptography/inMemoryEncrypter'
import { makeRecipient } from 'test/factories/makeRecipient'
import { InvalidDocumentError } from '../_errors/invalidDocumentError'
import { WrongCredentialsError } from '../_errors/wrongCredentialsError'

let repository: InMemoryRecipientRepository
let hasher: InMemoryHasher
let encryper: InMemoryEncrypter
let sut: AuthenticateRecipientByDocumentUseCase

describe('Authenticate recipient', () => {
  beforeEach(() => {
    repository = new InMemoryRecipientRepository()
    hasher = new InMemoryHasher()
    encryper = new InMemoryEncrypter()
    sut = new AuthenticateRecipientByDocumentUseCase(
      repository,
      hasher,
      encryper,
    )
  })
  it('should be able to authenticate a recipient', async () => {
    const recipient = makeRecipient({
      document: '12345678900',
      password: await hasher.hash('password123'),
    })

    await repository.create(recipient)

    const { accessToken } = await sut.execute({
      document: '12345678900',
      password: 'password123',
    })

    expect(accessToken).toEqual(expect.any(String))
  })

  it('should not be able to authenticate with invalid document', async () => {
    const recipient = makeRecipient({
      password: await hasher.hash('password123'),
    })

    await repository.create(recipient)

    expect(() => {
      return sut.execute({
        document: '1234567890',
        password: 'password123',
      })
    }).rejects.toBeInstanceOf(InvalidDocumentError)
  })

  it('should not be able to authenticate with wrong document', async () => {
    const recipient = makeRecipient({
      password: await hasher.hash('password123'),
    })

    await repository.create(recipient)

    expect(() => {
      return sut.execute({
        document: '12345678900',
        password: 'password123',
      })
    }).rejects.toBeInstanceOf(WrongCredentialsError)
  })

  it('should not be able to authenticate with wrong password', async () => {
    const recipient = makeRecipient({
      document: '12345678900',
    })

    await repository.create(recipient)

    expect(() => {
      return sut.execute({
        document: '12345678900',
        password: 'password123',
      })
    }).rejects.toBeInstanceOf(WrongCredentialsError)
  })
})
