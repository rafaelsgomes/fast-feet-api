import { IError } from '@/core/errors/IError'

export class WrongCredentialsError extends Error implements IError {
  constructor() {
    super('Credentials are not valid.')
  }
}
