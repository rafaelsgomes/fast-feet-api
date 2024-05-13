import { Delivery } from '@/domain/fastFeet/enterprise/entities/delivery'

export class DeliveryPresenter {
  static toHttp(delivery: Delivery) {
    return {
      id: delivery.id,
      zip_code: delivery.zipCode,
      address: delivery.address,
      city: delivery.city,
      state: delivery.state,
      additional_address_information: delivery.additionalAddressInformation,
      recipient_id: delivery.recipientId,
      deliveryman_id: delivery.deliverymanId,
    }
  }
}
