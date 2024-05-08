import { Injectable } from '@nestjs/common'
import { IAdminRepository } from '../../repositories/IAdminRepository'
import { UserNotFoundError } from '../_errors/userNotFoundError'

interface DeleteAdminRequest {
  adminId: string
}

interface DeleteAdminResponse {}

@Injectable()
export class DeleteAdminUseCase {
  constructor(private adminRepository: IAdminRepository) {}

  async execute({ adminId }: DeleteAdminRequest): Promise<DeleteAdminResponse> {
    const admin = await this.adminRepository.findById(adminId)

    if (!admin) {
      throw new UserNotFoundError(adminId)
    }

    await this.adminRepository.delete(adminId)

    return {}
  }
}
