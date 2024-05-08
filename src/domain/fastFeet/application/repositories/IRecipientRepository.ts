import { Recipient } from '../../enterprise/entities/recipient'

export abstract class IRecipientRepository {
  abstract create(recipient: Recipient): Promise<void>
  abstract save(recipient: Recipient): Promise<void>
  abstract findByDocument(document: string): Promise<Recipient | null>
  abstract findByEmail(email: string): Promise<Recipient | null>
  abstract findById(recipientId: string): Promise<Recipient | null>
  abstract delete(recipientId: string): Promise<void>
}
