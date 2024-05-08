import { Entity } from '@/core/entities/entity'

export interface DeliveryAttachmentProps {
  deliveryId: string
  attachmentId: string
}

export class DeliveryAttachment extends Entity<DeliveryAttachmentProps> {
  get deliveryId() {
    return this.props.deliveryId
  }

  get attachmentId() {
    return this.props.attachmentId
  }

  static create(props: DeliveryAttachmentProps, id?: string) {
    const deliveryAttachment = new DeliveryAttachment(
      {
        ...props,
      },
      id,
    )

    return deliveryAttachment
  }
}
