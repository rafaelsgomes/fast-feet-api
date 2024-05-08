import { IDeliverymanRepository } from '@/domain/fastFeet/application/repositories/IDeliverymanRepository'
import { Deliveryman } from '@/domain/fastFeet/enterprise/entities/deliveryman'

export class InMemoryDeliverymanRepository implements IDeliverymanRepository {
  public items: Deliveryman[] = []

  async create(deliveryman: Deliveryman): Promise<void> {
    this.items.push(deliveryman)
  }

  async save(deliveryman: Deliveryman): Promise<void> {
    const deliverymanIndex = this.items.findIndex(
      (item) => item.id === deliveryman.id,
    )

    this.items[deliverymanIndex] = deliveryman
  }

  async findByDocument(document: string): Promise<Deliveryman> {
    const deliveryman = this.items.find((item) => item.document === document)

    if (!deliveryman) {
      return null
    }

    return deliveryman
  }

  async findByEmail(email: string): Promise<Deliveryman> {
    const deliveryman = this.items.find((item) => item.email === email)

    if (!deliveryman) {
      return null
    }

    return deliveryman
  }

  async findById(deliverymanId: string): Promise<Deliveryman> {
    const deliveryman = this.items.find((item) => item.id === deliverymanId)

    if (!deliveryman) {
      return null
    }

    return deliveryman
  }

  async delete(deliverymanId: string): Promise<void> {
    const deliverymanIndex = this.items.findIndex(
      (item) => item.id === deliverymanId,
    )

    this.items.splice(deliverymanIndex, 1)
  }
}
