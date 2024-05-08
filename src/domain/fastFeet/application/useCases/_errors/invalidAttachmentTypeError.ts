import { IError } from '@/core/errors/IError'

export class InvalidAttachmentTypeError extends Error implements IError {
  constructor(type: string) {
    super(`File type "${type}" is not valid.`)
  }
}
