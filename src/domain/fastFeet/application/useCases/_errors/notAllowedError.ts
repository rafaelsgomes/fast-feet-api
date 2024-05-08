import { IError } from '@/core/errors/IError'

export class NotAllowedError extends Error implements IError {
  constructor() {
    super('Not allowed.')
  }
}
