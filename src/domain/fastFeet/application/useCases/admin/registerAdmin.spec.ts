import { InMemoryAdminRepository } from 'test/repositories/inMemoryAdminRepository'
import { RegisterAdminUseCase } from './registerAdmin'
import { InMemoryHasher } from 'test/cryptography/inMemoryHasher'
import { UserAlreadyExistsError } from '../_errors/userAlreadyExistsError'
import { InvalidDocumentError } from '../_errors/invalidDocumentError'
import { Role } from '@/domain/fastFeet/enterprise/entities/role.enum'

let repository: InMemoryAdminRepository
let hasher: InMemoryHasher
let sut: RegisterAdminUseCase

describe('Register admin', () => {
  beforeEach(() => {
    repository = new InMemoryAdminRepository()
    hasher = new InMemoryHasher()
    sut = new RegisterAdminUseCase(repository, hasher)
  })
  it('should be able to register a new admin', async () => {
    const { admin } = await sut.execute({
      document: '12345678900',
      email: 'johndoe@email.com',
      name: 'John Doe',
      password: 'password123',
    })

    expect(admin).toBeTruthy()
    expect(repository.items.length).toEqual(1)
    expect(repository.items[0].roles).toEqual([Role.ADMIN])
  })

  it('should hash password upon registration', async () => {
    const { admin } = await sut.execute({
      document: '12345678900',
      email: 'johndoe@email.com',
      name: 'John Doe',
      password: 'password123',
    })

    const passwordHashed = await hasher.hash('password123')

    expect(admin).toBeTruthy()
    expect(repository.items[0].password).toEqual(passwordHashed)
  })

  it('should not be able to register with the same document', async () => {
    await sut.execute({
      document: '12345678900',
      email: 'johndoe@email.com',
      name: 'John Doe',
      password: 'password123',
    })

    expect(() => {
      return sut.execute({
        document: '12345678900',
        email: 'johndoe@email.com',
        name: 'John Doe',
        password: 'password123',
      })
    }).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })

  it('should not be able to register with the same email', async () => {
    await sut.execute({
      document: '12345678900',
      email: 'johndoe@email.com',
      name: 'John Doe',
      password: 'password123',
    })

    expect(() => {
      return sut.execute({
        document: '12345678901',
        email: 'johndoe@email.com',
        name: 'John Doe',
        password: 'password123',
      })
    }).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })

  it('should not be able to register with invalid document', async () => {
    expect(() => {
      return sut.execute({
        document: '1234567890',
        email: 'johndoe@email.com',
        name: 'John Doe',
        password: 'password123',
      })
    }).rejects.toBeInstanceOf(InvalidDocumentError)
  })

  it('should not be able to register with invalid document', async () => {
    expect(() => {
      return sut.execute({
        document: '123456789001',
        email: 'johndoe@email.com',
        name: 'John Doe',
        password: 'password123',
      })
    }).rejects.toBeInstanceOf(InvalidDocumentError)
  })
})
