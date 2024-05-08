import { IError } from '@/core/errors/IError'

export class DeliveryIsNotAvailableError extends Error implements IError {
  constructor(identifier: string) {
    super(`Delivery ${identifier} is not available`)
  }
}
