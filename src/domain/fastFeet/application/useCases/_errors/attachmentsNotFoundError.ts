import { IError } from '@/core/errors/IError'

export class AttachmentsNotFoundError extends Error implements IError {
  constructor() {
    super('Attachments provided not found on database.')
  }
}
