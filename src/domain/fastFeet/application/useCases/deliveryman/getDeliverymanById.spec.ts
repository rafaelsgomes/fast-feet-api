import { InMemoryDeliverymanRepository } from 'test/repositories/inMemoryDeliverymanRepository'
import { GetDeliverymanByIdUseCase } from './getDeliverymanById'
import { makeDeliveryman } from 'test/factories/makeDeliveryman'
import { UserNotFoundError } from '../_errors/userNotFoundError'

let repository: InMemoryDeliverymanRepository
let sut: GetDeliverymanByIdUseCase

describe('Get deliveryman by id', () => {
  beforeEach(() => {
    repository = new InMemoryDeliverymanRepository()
    sut = new GetDeliverymanByIdUseCase(repository)
  })
  it('should be able to get a deliveryman info by id', async () => {
    const newDeliveryman = makeDeliveryman({
      document: '12345678900',
    })

    await repository.create(newDeliveryman)

    const { deliveryman } = await sut.execute({
      deliverymanId: newDeliveryman.id,
    })

    expect(deliveryman.document).toEqual('12345678900')
  })

  it('should not be able to get a deliveryman with wrong id', async () => {
    expect(() => {
      return sut.execute({
        deliverymanId: 'id',
      })
    }).rejects.toBeInstanceOf(UserNotFoundError)
  })
})
