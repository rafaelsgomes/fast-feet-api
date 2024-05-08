import { Deliveryman } from '@/domain/fastFeet/enterprise/entities/deliveryman'

export class DeliverymanPresenter {
  static toHttp(deliveryman: Deliveryman) {
    return {
      id: deliveryman.id,
      document: deliveryman.document,
      name: deliveryman.name,
      email: deliveryman.email,
      createdAt: deliveryman.createdAt,
    }
  }
}
