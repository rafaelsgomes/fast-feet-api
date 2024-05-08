import { IAttachmentsRepository } from '@/domain/fastFeet/application/repositories/IAttachmentsRepository'
import { Attachment } from '@/domain/fastFeet/enterprise/entities/attachment'

export class InMemoryAttachmentsRepository implements IAttachmentsRepository {
  public items: Attachment[] = []

  async create(attachment: Attachment): Promise<void> {
    this.items.push(attachment)
  }
}
