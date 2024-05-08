import { InMemoryAdminRepository } from 'test/repositories/inMemoryAdminRepository'
import { GetAdminByEmailUseCase } from './getAdminByEmail'
import { makeAdmin } from 'test/factories/makeAdmin'
import { UserNotFoundError } from '../_errors/userNotFoundError'

let repository: InMemoryAdminRepository
let sut: GetAdminByEmailUseCase

describe('Get admin by email', () => {
  beforeEach(() => {
    repository = new InMemoryAdminRepository()
    sut = new GetAdminByEmailUseCase(repository)
  })
  it('should be able to get a admin info by email', async () => {
    const newAdmin = makeAdmin({
      email: '12345678900',
    })

    await repository.create(newAdmin)

    const { admin } = await sut.execute({
      email: newAdmin.email,
    })

    expect(admin.email).toEqual('12345678900')
  })

  it('should not be able to get a admin with wrong email', async () => {
    expect(() => {
      return sut.execute({
        email: 'email',
      })
    }).rejects.toBeInstanceOf(UserNotFoundError)
  })
})
