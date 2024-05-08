import { InMemoryDeliverymanRepository } from 'test/repositories/inMemoryDeliverymanRepository'
import { DeleteDeliverymanUseCase } from './deleteDeliveryman'
import { InMemoryHasher } from 'test/cryptography/inMemoryHasher'
import { makeDeliveryman } from 'test/factories/makeDeliveryman'
import { UserNotFoundError } from '../_errors/userNotFoundError'

let repository: InMemoryDeliverymanRepository
let hasher: InMemoryHasher
let sut: DeleteDeliverymanUseCase

describe('Delete deliveryman', () => {
  beforeEach(() => {
    repository = new InMemoryDeliverymanRepository()
    hasher = new InMemoryHasher()
    sut = new DeleteDeliverymanUseCase(repository)
  })
  it('should be able to delete a deliveryman', async () => {
    const deliveryman = makeDeliveryman({
      document: '12345678900',
      password: await hasher.hash('password123'),
    })

    await repository.create(deliveryman)

    await sut.execute({
      deliverymanId: deliveryman.id,
    })

    expect(repository.items.length).toEqual(0)
  })

  it('should not be able to delete a non existing deliveryman', async () => {
    const deliveryman = makeDeliveryman({
      password: await hasher.hash('password123'),
    })

    await repository.create(deliveryman)

    expect(() => {
      return sut.execute({
        deliverymanId: 'deliveryman.id',
      })
    }).rejects.toBeInstanceOf(UserNotFoundError)
  })
})
