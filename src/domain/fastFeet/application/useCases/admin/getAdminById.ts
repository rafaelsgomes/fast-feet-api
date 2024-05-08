import { Injectable } from '@nestjs/common'
import { IAdminRepository } from '../../repositories/IAdminRepository'
import { Admin } from '@/domain/fastFeet/enterprise/entities/admin'
import { UserNotFoundError } from '../_errors/userNotFoundError'

interface GetAdminByIdRequest {
  adminId: string
}

interface GetAdminByIdResponse {
  admin: Admin
}

@Injectable()
export class GetAdminByIdUseCase {
  constructor(private adminRepository: IAdminRepository) {}

  async execute({
    adminId,
  }: GetAdminByIdRequest): Promise<GetAdminByIdResponse> {
    const admin = await this.adminRepository.findById(adminId)

    if (!admin) {
      throw new UserNotFoundError(adminId)
    }

    return {
      admin,
    }
  }
}
