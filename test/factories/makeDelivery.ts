import {
  Delivery,
  DeliveryProps,
} from '@/domain/fastFeet/enterprise/entities/delivery'
import { faker } from '@faker-js/faker'

export function makeDelivery(
  override: Partial<DeliveryProps> = {},
  id?: string,
) {
  const delivery = Delivery.create(
    {
      additionalAddressInformation: faker.location.secondaryAddress(),
      address: faker.location.streetAddress(),
      longitude: faker.location.longitude(),
      latitude: faker.location.latitude(),
      zipCode: faker.location.zipCode(),
      city: faker.location.city(),
      state: faker.location.state(),
      recipientId: faker.string.uuid(),
      deliverymanId: faker.string.uuid(),
      ...override,
    },
    id,
  )
  return delivery
}
