import { Entity } from '@/core/entities/entity'
import { Optional } from '@/core/types/optional'
import { DeliveryAttachmentList } from './deliveryAttachmentsList'

export interface DeliveryProps {
  longitude: number
  latitude: number
  zipCode: string
  address: string
  city: string
  state: string
  additionalAddressInformation: string
  recipientId: string
  deliverymanId?: string
  availableAt?: Date | null
  pickupAt?: Date | null
  deliveredAt?: Date | null
  returnedAt?: Date | null
  attachments?: DeliveryAttachmentList
  createdAt: Date
  updatedAt?: Date | null
}

export class Delivery extends Entity<DeliveryProps> {
  get longitude() {
    return this.props.longitude
  }

  set longitude(longitude: number) {
    this.props.longitude = longitude
    this.touch()
  }

  get latitude() {
    return this.props.latitude
  }

  set latitude(latitude: number) {
    this.props.latitude = latitude
    this.touch()
  }

  get zipCode() {
    return this.props.zipCode
  }

  set zipCode(zipCode: string) {
    this.props.zipCode = zipCode
    this.touch()
  }

  get address() {
    return this.props.address
  }

  set address(address: string) {
    this.props.address = address
    this.touch()
  }

  get city() {
    return this.props.city
  }

  set city(city: string) {
    this.props.city = city
    this.touch()
  }

  get state() {
    return this.props.state
  }

  set state(state: string) {
    this.props.state = state
    this.touch()
  }

  get additionalAddressInformation() {
    return this.props.additionalAddressInformation
  }

  set additionalAddressInformation(additionalAddressInformation: string) {
    this.props.additionalAddressInformation = additionalAddressInformation
    this.touch()
  }

  get recipientId() {
    return this.props.recipientId
  }

  set recipientId(recipientId: string) {
    this.props.recipientId = recipientId
    this.touch()
  }

  get deliverymanId() {
    return this.props.deliverymanId
  }

  set deliverymanId(deliverymanId: string) {
    this.props.deliverymanId = deliverymanId
    this.touch()
  }

  get availableAt() {
    return this.props.availableAt
  }

  set availableAt(availableAt: Date | null) {
    this.props.availableAt = availableAt
    this.touch()
  }

  get pickupAt() {
    return this.props.pickupAt
  }

  set pickupAt(pickupAt: Date | null) {
    this.props.pickupAt = pickupAt
    this.touch()
  }

  get deliveredAt() {
    return this.props.deliveredAt
  }

  set deliveredAt(deliveredAt: Date | null) {
    this.props.deliveredAt = deliveredAt
    this.touch()
  }

  get returnedAt() {
    return this.props.returnedAt
  }

  set returnedAt(returnedAt: Date | null) {
    this.props.returnedAt = returnedAt
    this.touch()
  }

  get attachments() {
    return this.props.attachments
  }

  set attachments(attachments: DeliveryAttachmentList) {
    this.props.attachments = attachments
    this.touch()
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  static create(
    props: Optional<DeliveryProps, 'createdAt' | 'attachments'>,
    id?: string,
  ) {
    const delivery = new Delivery(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    return delivery
  }
}