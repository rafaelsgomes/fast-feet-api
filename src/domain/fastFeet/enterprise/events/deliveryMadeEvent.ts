import { DomainEvent } from '@/core/events/domainEvent'
import { Delivery } from '../entities/delivery'

export class DeliveryMadeEvent implements DomainEvent {
  public ocurredAt: Date
  public delivery: Delivery

  constructor(delivery: Delivery) {
    this.delivery = delivery
    this.ocurredAt = new Date()
  }

  getAggregateId(): string {
    return this.delivery.id
  }
}
