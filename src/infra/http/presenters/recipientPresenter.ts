import { Recipient } from '@/domain/fastFeet/enterprise/entities/recipient'

export class RecipientPresenter {
  static toHttp(recipient: Recipient) {
    return {
      id: recipient.id,
      document: recipient.document,
      name: recipient.name,
      email: recipient.email,
      createdAt: recipient.createdAt,
    }
  }
}
