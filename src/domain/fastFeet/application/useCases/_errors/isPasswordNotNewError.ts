import { IError } from '@/core/errors/IError'

export class IsPasswordNotNewError extends Error implements IError {
  constructor() {
    super('The new password must be different from the previous one.')
  }
}
