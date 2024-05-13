import { ValueObject } from '@/core/entities/valueObject'
import { Attachment } from '../attachment'

export interface DeliveryDetailsProps {
  deliveryId: string
  zipCode: string
  address: string
  city: string
  state: string
  additionalAddressInformation: string
  recipientName: string
  recipientId: string
  deliverymanName?: string
  deliverymanId?: string
  availableAt?: Date | null
  pickupAt?: Date | null
  deliveredAt?: Date | null
  returnedAt?: Date | null
  attachments: Attachment[]
  createdAt: Date
  updatedAt?: Date | null
}

export class DeliveryDetails extends ValueObject<DeliveryDetailsProps> {
  get deliveryId() {
    return this.props.deliveryId
  }

  get zipCode() {
    return this.props.zipCode
  }

  get address() {
    return this.props.address
  }

  get city() {
    return this.props.city
  }

  get state() {
    return this.props.state
  }

  get additionalAddressInformation() {
    return this.props.additionalAddressInformation
  }

  get recipientName() {
    return this.props.recipientName
  }

  get recipientId() {
    return this.props.recipientId
  }

  get deliverymanName() {
    return this.props.deliverymanName
  }

  get deliverymanId() {
    return this.props.deliverymanId
  }

  get availableAt() {
    return this.props.availableAt
  }

  get pickupAt() {
    return this.props.pickupAt
  }

  get deliveredAt() {
    return this.props.deliveredAt
  }

  get returnedAt() {
    return this.props.returnedAt
  }

  get attachments() {
    return this.props.attachments
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  static create(pros: DeliveryDetailsProps) {
    return new DeliveryDetails(pros)
  }
}
