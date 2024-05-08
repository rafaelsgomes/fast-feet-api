import { InMemoryAdminRepository } from 'test/repositories/inMemoryAdminRepository'
import { ResetAdminPasswordUseCase } from './resetAdminPassword'
import { InMemoryHasher } from 'test/cryptography/inMemoryHasher'
import { makeAdmin } from 'test/factories/makeAdmin'

let repository: InMemoryAdminRepository
let hasher: InMemoryHasher
let sut: ResetAdminPasswordUseCase

describe('Reset admin password', () => {
  beforeEach(() => {
    repository = new InMemoryAdminRepository()
    hasher = new InMemoryHasher()
    sut = new ResetAdminPasswordUseCase(repository, hasher)
  })

  it('should be able to set a new password to a admin', async () => {
    const admin = makeAdmin({
      password: await hasher.hash('password123'),
    })

    await repository.create(admin)

    await sut.execute({
      adminId: admin.id,
      password: 'password124',
    })

    const passwordHashed = await hasher.hash('password124')

    expect(admin).toBeTruthy()
    expect(repository.items[0].password).toEqual(passwordHashed)
    expect(repository.items[0].updatedAt).toEqual(expect.any(Date))
  })

  it('should not be able to set a new password to a admin when the new password is the same as the previous one', async () => {
    const admin = makeAdmin({
      password: await hasher.hash('password123'),
    })

    await repository.create(admin)

    expect(() => {
      return sut.execute({
        adminId: admin.id,
        password: 'password123',
      })
    }).rejects.toBeInstanceOf(Error)
  })

  it('should not be able to set a new password to a admin when the admin does not exists', async () => {
    expect(() => {
      return sut.execute({
        adminId: 'admin.id',
        password: 'password123',
      })
    }).rejects.toBeInstanceOf(Error)
  })
})
