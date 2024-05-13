import { IAttachmentsRepository } from '@/domain/fastFeet/application/repositories/IAttachmentsRepository'
import { Attachment } from '@/domain/fastFeet/enterprise/entities/attachment'

export class InMemoryAttachmentsRepository implements IAttachmentsRepository {
  public items: Attachment[] = []

  async create(attachment: Attachment): Promise<void> {
    this.items.push(attachment)
  }

  async findById(attachmentId: string): Promise<Attachment | null> {
    const attachment = this.items.find((item) => item.id === attachmentId)

    if (!attachment) {
      return null
    }

    return attachment
  }

  async findManyByIds(attachmentIds: string[]): Promise<Attachment[]> {
    const attachments = this.items.filter((item) =>
      attachmentIds.includes(item.id),
    )

    return attachments
  }
}
