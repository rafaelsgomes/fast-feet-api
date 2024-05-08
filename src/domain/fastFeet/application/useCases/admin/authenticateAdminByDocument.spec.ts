import { InMemoryAdminRepository } from 'test/repositories/inMemoryAdminRepository'
import { AuthenticateAdminByDocumentUseCase } from './authenticateAdminByDocument'
import { InMemoryHasher } from 'test/cryptography/inMemoryHasher'
import { InMemoryEncrypter } from 'test/cryptography/inMemoryEncrypter'
import { makeAdmin } from 'test/factories/makeAdmin'
import { InvalidDocumentError } from '../_errors/invalidDocumentError'
import { WrongCredentialsError } from '../_errors/wrongCredentialsError'

let repository: InMemoryAdminRepository
let hasher: InMemoryHasher
let encryper: InMemoryEncrypter
let sut: AuthenticateAdminByDocumentUseCase

describe('Authenticate admin', () => {
  beforeEach(() => {
    repository = new InMemoryAdminRepository()
    hasher = new InMemoryHasher()
    encryper = new InMemoryEncrypter()
    sut = new AuthenticateAdminByDocumentUseCase(repository, hasher, encryper)
  })
  it('should be able to authenticate a admin', async () => {
    const admin = makeAdmin({
      document: '12345678900',
      password: await hasher.hash('password123'),
    })

    await repository.create(admin)

    const { accessToken } = await sut.execute({
      document: '12345678900',
      password: 'password123',
    })

    expect(accessToken).toEqual(expect.any(String))
  })

  it('should not be able to authenticate with invalid document', async () => {
    const admin = makeAdmin({
      password: await hasher.hash('password123'),
    })

    await repository.create(admin)

    expect(() => {
      return sut.execute({
        document: '1234567890',
        password: 'password123',
      })
    }).rejects.toBeInstanceOf(InvalidDocumentError)
  })

  it('should not be able to authenticate with wrong document', async () => {
    const admin = makeAdmin({
      password: await hasher.hash('password123'),
    })

    await repository.create(admin)

    expect(() => {
      return sut.execute({
        document: '12345678900',
        password: 'password123',
      })
    }).rejects.toBeInstanceOf(WrongCredentialsError)
  })

  it('should not be able to authenticate with wrong password', async () => {
    const admin = makeAdmin({
      document: '12345678900',
    })

    await repository.create(admin)

    expect(() => {
      return sut.execute({
        document: '12345678900',
        password: 'password123',
      })
    }).rejects.toBeInstanceOf(WrongCredentialsError)
  })
})
