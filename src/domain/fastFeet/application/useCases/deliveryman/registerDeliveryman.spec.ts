import { InMemoryDeliverymanRepository } from 'test/repositories/inMemoryDeliverymanRepository'
import { RegisterDeliverymanUseCase } from './registerDeliveryman'
import { InMemoryHasher } from 'test/cryptography/inMemoryHasher'
import { UserAlreadyExistsError } from '../_errors/userAlreadyExistsError'
import { InvalidDocumentError } from '../_errors/invalidDocumentError'
import { Role } from '@/domain/fastFeet/enterprise/entities/role.enum'

let repository: InMemoryDeliverymanRepository
let hasher: InMemoryHasher
let sut: RegisterDeliverymanUseCase

describe('Register deliveryman', () => {
  beforeEach(() => {
    repository = new InMemoryDeliverymanRepository()
    hasher = new InMemoryHasher()
    sut = new RegisterDeliverymanUseCase(repository, hasher)
  })
  it('should be able to register a new deliveryman', async () => {
    const { deliveryman } = await sut.execute({
      document: '12345678900',
      email: 'johndoe@email.com',
      name: 'John Doe',
      password: 'password123',
    })

    expect(deliveryman).toBeTruthy()
    expect(repository.items.length).toEqual(1)
    expect(repository.items[0].roles).toEqual([Role.USER])
  })

  it('should hash password upon registration', async () => {
    const { deliveryman } = await sut.execute({
      document: '12345678900',
      email: 'johndoe@email.com',
      name: 'John Doe',
      password: 'password123',
    })

    const passwordHashed = await hasher.hash('password123')

    expect(deliveryman).toBeTruthy()
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
