import { IRecipientRepository } from '@/domain/fastFeet/application/repositories/IRecipientRepository'
import { Recipient } from '@/domain/fastFeet/enterprise/entities/recipient'

export class InMemoryRecipientRepository implements IRecipientRepository {
  public items: Recipient[] = []

  async create(recipient: Recipient): Promise<void> {
    this.items.push(recipient)
  }

  async save(recipient: Recipient): Promise<void> {
    const recipientIndex = this.items.findIndex(
      (item) => item.id === recipient.id,
    )

    this.items[recipientIndex] = recipient
  }

  async findByDocument(document: string): Promise<Recipient> {
    const recipient = this.items.find((item) => item.document === document)

    if (!recipient) {
      return null
    }

    return recipient
  }

  async findByEmail(email: string): Promise<Recipient> {
    const recipient = this.items.find((item) => item.email === email)

    if (!recipient) {
      return null
    }

    return recipient
  }

  async findById(recipientId: string): Promise<Recipient> {
    const recipient = this.items.find((item) => item.id === recipientId)

    if (!recipient) {
      return null
    }

    return recipient
  }

  async delete(recipientId: string): Promise<void> {
    const recipientIndex = this.items.findIndex(
      (item) => item.id === recipientId,
    )

    this.items.splice(recipientIndex, 1)
  }
}
