import { InMemoryDeliverymanRepository } from 'test/repositories/inMemoryDeliverymanRepository'
import { UpdateDeliverymanAllInfoUseCase } from './updateDeliverymanAllInfo'
import { makeDeliveryman } from 'test/factories/makeDeliveryman'
import { InformationNotProvidedError } from '../_errors/informationNotProvidedError'

let repository: InMemoryDeliverymanRepository
let sut: UpdateDeliverymanAllInfoUseCase

describe('Update deliveryman all info', () => {
  beforeEach(() => {
    repository = new InMemoryDeliverymanRepository()
    sut = new UpdateDeliverymanAllInfoUseCase(repository)
  })

  it('should be able to update a deliveryman email', async () => {
    const deliveryman = makeDeliveryman()

    await repository.create(deliveryman)

    await sut.execute({
      deliverymanId: deliveryman.id,
      email: 'updated@email.com',
    })

    expect(repository.items[0].email).toEqual('updated@email.com')
    expect(repository.items[0].updatedAt).toEqual(expect.any(Date))
  })

  it('should be able to update a deliveryman name', async () => {
    const deliveryman = makeDeliveryman()

    await repository.create(deliveryman)

    await sut.execute({
      deliverymanId: deliveryman.id,
      name: 'John Doe',
    })

    expect(repository.items[0].name).toEqual('John Doe')
    expect(repository.items[0].updatedAt).toEqual(expect.any(Date))
  })

  it('should be able to update a deliveryman document', async () => {
    const deliveryman = makeDeliveryman()

    await repository.create(deliveryman)

    await sut.execute({
      deliverymanId: deliveryman.id,
      document: '12345678900',
    })

    expect(repository.items[0].document).toEqual('12345678900')
    expect(repository.items[0].updatedAt).toEqual(expect.any(Date))
  })

  it('should not be able to update when the deliveryman does not exists', async () => {
    expect(() => {
      return sut.execute({
        deliverymanId: 'deliveryman.id',
        name: 'John Doe',
      })
    }).rejects.toBeInstanceOf(Error)
  })

  it('should not be able to update when new information is not provided', async () => {
    const deliveryman = makeDeliveryman()

    await repository.create(deliveryman)

    expect(() => {
      return sut.execute({
        deliverymanId: deliveryman.id,
      })
    }).rejects.toBeInstanceOf(InformationNotProvidedError)
    expect(repository.items[0].updatedAt).toBeUndefined()
  })
})
