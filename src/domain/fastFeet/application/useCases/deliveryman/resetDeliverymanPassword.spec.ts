import { InMemoryDeliverymanRepository } from 'test/repositories/inMemoryDeliverymanRepository'
import { ResetDeliverymanPasswordUseCase } from './resetDeliverymanPassword'
import { InMemoryHasher } from 'test/cryptography/inMemoryHasher'
import { makeDeliveryman } from 'test/factories/makeDeliveryman'

let repository: InMemoryDeliverymanRepository
let hasher: InMemoryHasher
let sut: ResetDeliverymanPasswordUseCase

describe('Reset deliveryman password', () => {
  beforeEach(() => {
    repository = new InMemoryDeliverymanRepository()
    hasher = new InMemoryHasher()
    sut = new ResetDeliverymanPasswordUseCase(repository, hasher)
  })

  it('should be able to set a new password to a deliveryman', async () => {
    const deliveryman = makeDeliveryman({
      password: await hasher.hash('password123'),
    })

    await repository.create(deliveryman)

    await sut.execute({
      deliverymanId: deliveryman.id,
      password: 'password124',
    })

    const passwordHashed = await hasher.hash('password124')

    expect(deliveryman).toBeTruthy()
    expect(repository.items[0].password).toEqual(passwordHashed)
    expect(repository.items[0].updatedAt).toEqual(expect.any(Date))
  })

  it('should not be able to set a new password to a deliveryman when the new password is the same as the previous one', async () => {
    const deliveryman = makeDeliveryman({
      password: await hasher.hash('password123'),
    })

    await repository.create(deliveryman)

    expect(() => {
      return sut.execute({
        deliverymanId: deliveryman.id,
        password: 'password123',
      })
    }).rejects.toBeInstanceOf(Error)
  })

  it('should not be able to set a new password to a deliveryman when the deliveryman does not exists', async () => {
    expect(() => {
      return sut.execute({
        deliverymanId: 'deliveryman.id',
        password: 'password123',
      })
    }).rejects.toBeInstanceOf(Error)
  })
})
