import { Deliveryman } from '../../enterprise/entities/deliveryman'

export abstract class IDeliverymanRepository {
  abstract create(deliveryman: Deliveryman): Promise<void>
  abstract save(deliveryman: Deliveryman): Promise<void>
  abstract findByDocument(document: string): Promise<Deliveryman | null>
  abstract findByEmail(email: string): Promise<Deliveryman | null>
  abstract findById(deliverymanId: string): Promise<Deliveryman | null>
  abstract delete(deliverymanId: string): Promise<void>
}
