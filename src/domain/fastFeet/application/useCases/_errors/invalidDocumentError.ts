import { IError } from '@/core/errors/IError'

export class InvalidDocumentError extends Error implements IError {
  constructor() {
    super('Invalid document.')
  }
}
