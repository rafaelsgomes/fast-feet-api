import { InMemoryAdminRepository } from 'test/repositories/inMemoryAdminRepository'
import { DeleteAdminUseCase } from './deleteAdmin'
import { InMemoryHasher } from 'test/cryptography/inMemoryHasher'
import { makeAdmin } from 'test/factories/makeAdmin'
import { UserNotFoundError } from '../_errors/userNotFoundError'

let repository: InMemoryAdminRepository
let hasher: InMemoryHasher
let sut: DeleteAdminUseCase

describe('Delete admin', () => {
  beforeEach(() => {
    repository = new InMemoryAdminRepository()
    hasher = new InMemoryHasher()
    sut = new DeleteAdminUseCase(repository)
  })
  it('should be able to delete a admin', async () => {
    const admin = makeAdmin({
      document: '12345678900',
      password: await hasher.hash('password123'),
    })

    await repository.create(admin)

    await sut.execute({
      adminId: admin.id,
    })

    expect(repository.items.length).toEqual(0)
  })

  it('should not be able to delete a non existing admin', async () => {
    const admin = makeAdmin({
      password: await hasher.hash('password123'),
    })

    await repository.create(admin)

    expect(() => {
      return sut.execute({
        adminId: 'admin.id',
      })
    }).rejects.toBeInstanceOf(UserNotFoundError)
  })
})
