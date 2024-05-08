import { WatchedList } from '@/core/entities/WatchedList'
import { DeliveryAttachment } from './deliveryAttachment'

export class DeliveryAttachmentList extends WatchedList<DeliveryAttachment> {
  compareItems(a: DeliveryAttachment, b: DeliveryAttachment): boolean {
    return a.attachmentId === b.attachmentId
  }
}
