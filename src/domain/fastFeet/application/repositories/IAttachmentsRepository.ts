import { Attachment } from '../../enterprise/entities/attachment'

export abstract class IAttachmentsRepository {
  abstract create(attachment: Attachment): Promise<void>
  abstract findById(attachmentId: string): Promise<Attachment | null>
  abstract findManyByIds(attachmentIds: string[]): Promise<Attachment[]>
}
