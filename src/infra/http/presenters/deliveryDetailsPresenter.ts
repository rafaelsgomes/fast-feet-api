import { DeliveryDetails } from '@/domain/fastFeet/enterprise/entities/valueObjects/deliveryDetails'
import { AttachmentPresenter } from './attachmentsPresenter'

export class DeliveryDetailsPresenter {
  static toHttp(deliveryDetails: DeliveryDetails) {
    return {
      id: deliveryDetails.deliveryId,
      zip_code: deliveryDetails.zipCode,
      address: deliveryDetails.address,
      city: deliveryDetails.city,
      state: deliveryDetails.state,
      additional_address_information:
        deliveryDetails.additionalAddressInformation,
      recipient_id: deliveryDetails.recipientId,
      deliveryman_id: deliveryDetails.deliverymanId,
      available_at: deliveryDetails.availableAt,
      attachments: deliveryDetails.attachments.map(AttachmentPresenter.toHTTP),
      pickup_at: deliveryDetails.pickupAt,
      delivered_at: deliveryDetails.deliveredAt,
      returned_at: deliveryDetails.returnedAt,
      created_at: deliveryDetails.createdAt,
      updated_at: deliveryDetails.updatedAt,
    }
  }
}
