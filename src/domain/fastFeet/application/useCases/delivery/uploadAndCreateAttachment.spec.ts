import { UploadAndCreateAttachmentUseCase } from './uploadAndCreateAttachment'
import { InMemoryAttachmentsRepository } from 'test/repositories/inMemoryAttachmentsRepository'
import { InMemoryStorageUploader } from 'test/storage/inMemoryStorageUploader'
import { InvalidAttachmentTypeError } from '../_errors/invalidAttachmentTypeError'

let repository: InMemoryAttachmentsRepository
let uploader: InMemoryStorageUploader
let sut: UploadAndCreateAttachmentUseCase

describe('Upload and create attachment ', async () => {
  beforeEach(() => {
    repository = new InMemoryAttachmentsRepository()
    uploader = new InMemoryStorageUploader()
    sut = new UploadAndCreateAttachmentUseCase(repository, uploader)
  })

  it('should be able to upload and create an attachment', async () => {
    const { attachment } = await sut.execute({
      fileName: 'sample-upload.jpg',
      fileType: 'image/jpg',
      body: Buffer.from(''),
    })

    expect(attachment).toEqual(repository.items[0])
    expect(uploader.uploads).toHaveLength(1)
    expect(uploader.uploads[0]).toEqual(
      expect.objectContaining({
        fileName: 'sample-upload.jpg',
      }),
    )
  })

  it('should not be able to upload an attachment with invalid file type', async () => {
    expect(() => {
      return sut.execute({
        fileName: 'sample-upload.mp3',
        fileType: 'audio/mpeg',
        body: Buffer.from(''),
      })
    }).rejects.toBeInstanceOf(InvalidAttachmentTypeError)
  })
})
