import { IError } from '../IError'

export class ResourceNotFoundError extends Error implements IError {
  constructor() {
    super('Resource Not Found!')
  }
}
