import { InMemoryDeliverymanRepository } from 'test/repositories/inMemoryDeliverymanRepository'
import { GetDeliverymanByEmailUseCase } from './getDeliverymanByEmail'
import { makeDeliveryman } from 'test/factories/makeDeliveryman'
import { UserNotFoundError } from '../_errors/userNotFoundError'

let repository: InMemoryDeliverymanRepository
let sut: GetDeliverymanByEmailUseCase

describe('Get deliveryman by email', () => {
  beforeEach(() => {
    repository = new InMemoryDeliverymanRepository()
    sut = new GetDeliverymanByEmailUseCase(repository)
  })
  it('should be able to get a deliveryman info by email', async () => {
    const newDeliveryman = makeDeliveryman({
      document: '12345678900',
    })

    await repository.create(newDeliveryman)

    const { deliveryman } = await sut.execute({
      email: newDeliveryman.email,
    })

    expect(deliveryman.document).toEqual('12345678900')
  })

  it('should not be able to get a deliveryman with wrong email', async () => {
    expect(() => {
      return sut.execute({
        email: 'email',
      })
    }).rejects.toBeInstanceOf(UserNotFoundError)
  })
})
