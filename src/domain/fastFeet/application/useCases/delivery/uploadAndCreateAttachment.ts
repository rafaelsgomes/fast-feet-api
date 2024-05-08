import { Injectable } from '@nestjs/common'
import { InvalidAttachmentTypeError } from '../_errors/invalidAttachmentTypeError'
import { Uploader } from '../../storage/uploader'
import { Attachment } from '@/domain/fastFeet/enterprise/entities/attachment'
import { IAttachmentsRepository } from '../../repositories/IAttachmentsRepository'

interface UploadAndCreateAttachmentUseCaseRequest {
  fileName: string
  fileType: string
  body: Buffer
}

interface UploadAndCreateAttachmentUseCaseResponse {
  attachment: Attachment
}

@Injectable()
export class UploadAndCreateAttachmentUseCase {
  constructor(
    private attachmentsRepository: IAttachmentsRepository,
    private uploader: Uploader,
  ) {}

  async execute({
    fileName,
    fileType,
    body,
  }: UploadAndCreateAttachmentUseCaseRequest): Promise<UploadAndCreateAttachmentUseCaseResponse> {
    if (!/^(image\/(jpeg|jpg|png)|application\/pdf)$/.test(fileType)) {
      throw new InvalidAttachmentTypeError(fileType)
    }

    const { url } = await this.uploader.upload({
      fileName,
      fileType,
      body,
    })

    const attachment = Attachment.create({
      title: fileName,
      url,
    })

    await this.attachmentsRepository.create(attachment)

    return {
      attachment,
    }
  }
}
