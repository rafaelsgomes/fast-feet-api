import { InMemoryDeliverymanRepository } from 'test/repositories/inMemoryDeliverymanRepository'
import { AuthenticateDeliverymanByDocumentUseCase } from './authenticateDeliverymanByDocument'
import { InMemoryHasher } from 'test/cryptography/inMemoryHasher'
import { InMemoryEncrypter } from 'test/cryptography/inMemoryEncrypter'
import { makeDeliveryman } from 'test/factories/makeDeliveryman'
import { InvalidDocumentError } from '../_errors/invalidDocumentError'
import { WrongCredentialsError } from '../_errors/wrongCredentialsError'

let repository: InMemoryDeliverymanRepository
let hasher: InMemoryHasher
let encryper: InMemoryEncrypter
let sut: AuthenticateDeliverymanByDocumentUseCase

describe('Authenticate deliveryman', () => {
  beforeEach(() => {
    repository = new InMemoryDeliverymanRepository()
    hasher = new InMemoryHasher()
    encryper = new InMemoryEncrypter()
    sut = new AuthenticateDeliverymanByDocumentUseCase(
      repository,
      hasher,
      encryper,
    )
  })
  it('should be able to authenticate a deliveryman', async () => {
    const deliveryman = makeDeliveryman({
      document: '12345678900',
      password: await hasher.hash('password123'),
    })

    await repository.create(deliveryman)

    const { accessToken } = await sut.execute({
      document: '12345678900',
      password: 'password123',
    })

    expect(accessToken).toEqual(expect.any(String))
  })

  it('should not be able to authenticate with invalid document', async () => {
    const deliveryman = makeDeliveryman({
      password: await hasher.hash('password123'),
    })

    await repository.create(deliveryman)

    expect(() => {
      return sut.execute({
        document: '1234567890',
        password: 'password123',
      })
    }).rejects.toBeInstanceOf(InvalidDocumentError)
  })

  it('should not be able to authenticate with wrong document', async () => {
    const deliveryman = makeDeliveryman({
      password: await hasher.hash('password123'),
    })

    await repository.create(deliveryman)

    expect(() => {
      return sut.execute({
        document: '12345678900',
        password: 'password123',
      })
    }).rejects.toBeInstanceOf(WrongCredentialsError)
  })

  it('should not be able to authenticate with wrong password', async () => {
    const deliveryman = makeDeliveryman({
      document: '12345678900',
    })

    await repository.create(deliveryman)

    expect(() => {
      return sut.execute({
        document: '12345678900',
        password: 'password123',
      })
    }).rejects.toBeInstanceOf(WrongCredentialsError)
  })
})
