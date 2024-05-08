import { InMemoryAdminRepository } from 'test/repositories/inMemoryAdminRepository'
import { UpdateAdminUseCase } from './updateAdmin'
import { makeAdmin } from 'test/factories/makeAdmin'
import { InformationNotProvidedError } from '../_errors/informationNotProvidedError'

let repository: InMemoryAdminRepository
let sut: UpdateAdminUseCase

describe('Update admin', () => {
  beforeEach(() => {
    repository = new InMemoryAdminRepository()
    sut = new UpdateAdminUseCase(repository)
  })

  it('should be able to update a admin email', async () => {
    const admin = makeAdmin()

    await repository.create(admin)

    await sut.execute({
      adminId: admin.id,
      email: 'updated@email.com',
    })

    expect(repository.items[0].email).toEqual('updated@email.com')
    expect(repository.items[0].updatedAt).toEqual(expect.any(Date))
  })

  it('should be able to update a admin name', async () => {
    const admin = makeAdmin()

    await repository.create(admin)

    await sut.execute({
      adminId: admin.id,
      name: 'John Doe',
    })

    expect(repository.items[0].name).toEqual('John Doe')
    expect(repository.items[0].updatedAt).toEqual(expect.any(Date))
  })

  it('should be able to update a admin document', async () => {
    const admin = makeAdmin()

    await repository.create(admin)

    await sut.execute({
      adminId: admin.id,
      document: '12345678900',
    })

    expect(repository.items[0].document).toEqual('12345678900')
    expect(repository.items[0].updatedAt).toEqual(expect.any(Date))
  })

  it('should not be able to update when the admin does not exists', async () => {
    expect(() => {
      return sut.execute({
        adminId: 'admin.id',
        name: 'John Doe',
      })
    }).rejects.toBeInstanceOf(Error)
  })

  it('should not be able to update when new information is not provided', async () => {
    const admin = makeAdmin()

    await repository.create(admin)

    expect(() => {
      return sut.execute({
        adminId: admin.id,
      })
    }).rejects.toBeInstanceOf(InformationNotProvidedError)
    expect(repository.items[0].updatedAt).toBeUndefined()
  })
})
