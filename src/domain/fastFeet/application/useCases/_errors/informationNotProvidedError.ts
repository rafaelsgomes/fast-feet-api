import { IError } from '@/core/errors/IError'

export class InformationNotProvidedError extends Error implements IError {
  constructor() {
    super('Information not provided.')
  }
}
