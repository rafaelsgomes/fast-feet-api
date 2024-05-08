import { InMemoryDeliverymanRepository } from 'test/repositories/inMemoryDeliverymanRepository'
import { GetDeliverymanByDocumentUseCase } from './getDeliverymanByDocument'
import { makeDeliveryman } from 'test/factories/makeDeliveryman'
import { UserNotFoundError } from '../_errors/userNotFoundError'

let repository: InMemoryDeliverymanRepository
let sut: GetDeliverymanByDocumentUseCase

describe('Get deliveryman by document', () => {
  beforeEach(() => {
    repository = new InMemoryDeliverymanRepository()
    sut = new GetDeliverymanByDocumentUseCase(repository)
  })
  it('should be able to get a deliveryman info by document', async () => {
    const newDeliveryman = makeDeliveryman({
      document: '12345678900',
    })

    await repository.create(newDeliveryman)

    const { deliveryman } = await sut.execute({
      document: newDeliveryman.document,
    })

    expect(deliveryman.document).toEqual('12345678900')
  })

  it('should not be able to get a deliveryman with wrong document', async () => {
    expect(() => {
      return sut.execute({
        document: 'document',
      })
    }).rejects.toBeInstanceOf(UserNotFoundError)
  })
})
