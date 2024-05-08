import { InMemoryAdminRepository } from 'test/repositories/inMemoryAdminRepository'
import { GetAdminByDocumentUseCase } from './getAdminByDocument'
import { makeAdmin } from 'test/factories/makeAdmin'
import { UserNotFoundError } from '../_errors/userNotFoundError'

let repository: InMemoryAdminRepository
let sut: GetAdminByDocumentUseCase

describe('Get admin by document', () => {
  beforeEach(() => {
    repository = new InMemoryAdminRepository()
    sut = new GetAdminByDocumentUseCase(repository)
  })
  it('should be able to get a admin info by document', async () => {
    const newAdmin = makeAdmin({
      document: '12345678900',
    })

    await repository.create(newAdmin)

    const { admin } = await sut.execute({
      document: newAdmin.document,
    })

    expect(admin.document).toEqual('12345678900')
  })

  it('should not be able to get a admin with wrong document', async () => {
    expect(() => {
      return sut.execute({
        document: 'document',
      })
    }).rejects.toBeInstanceOf(UserNotFoundError)
  })
})
