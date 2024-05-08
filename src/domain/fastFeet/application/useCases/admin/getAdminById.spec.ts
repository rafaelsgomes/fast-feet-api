import { InMemoryAdminRepository } from 'test/repositories/inMemoryAdminRepository'
import { GetAdminByIdUseCase } from './getAdminById'
import { makeAdmin } from 'test/factories/makeAdmin'
import { UserNotFoundError } from '../_errors/userNotFoundError'

let repository: InMemoryAdminRepository
let sut: GetAdminByIdUseCase

describe('Get admin by id', () => {
  beforeEach(() => {
    repository = new InMemoryAdminRepository()
    sut = new GetAdminByIdUseCase(repository)
  })
  it('should be able to get a admin info by id', async () => {
    const newAdmin = makeAdmin({
      document: '12345678900',
    })

    await repository.create(newAdmin)

    const { admin } = await sut.execute({
      adminId: newAdmin.id,
    })

    expect(admin.document).toEqual('12345678900')
  })

  it('should not be able to get a admin with wrong id', async () => {
    expect(() => {
      return sut.execute({
        adminId: 'id',
      })
    }).rejects.toBeInstanceOf(UserNotFoundError)
  })
})
