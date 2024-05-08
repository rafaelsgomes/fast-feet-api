import { Injectable } from '@nestjs/common'
import { IAdminRepository } from '../../repositories/IAdminRepository'
import { Admin } from '@/domain/fastFeet/enterprise/entities/admin'
import { UserNotFoundError } from '../_errors/userNotFoundError'

interface GetAdminByDocumentRequest {
  document: string
}

interface GetAdminByDocumentResponse {
  admin: Admin
}

@Injectable()
export class GetAdminByDocumentUseCase {
  constructor(private adminRepository: IAdminRepository) {}

  async execute({
    document,
  }: GetAdminByDocumentRequest): Promise<GetAdminByDocumentResponse> {
    const admin = await this.adminRepository.findByDocument(document)

    if (!admin) {
      throw new UserNotFoundError(document)
    }

    return {
      admin,
    }
  }
}
