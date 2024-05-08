import { IError } from '@/core/errors/IError'

export class UserNotFoundError extends Error implements IError {
  constructor(identifier: string) {
    super(`User ${identifier} does not exists`)
  }
}
