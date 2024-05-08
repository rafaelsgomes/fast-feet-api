import { Injectable } from '@nestjs/common'
import { IAdminRepository } from '../../repositories/IAdminRepository'
import { Admin } from '@/domain/fastFeet/enterprise/entities/admin'
import { UserNotFoundError } from '../_errors/userNotFoundError'

interface GetAdminByEmailRequest {
  email: string
}

interface GetAdminByEmailResponse {
  admin: Admin
}

@Injectable()
export class GetAdminByEmailUseCase {
  constructor(private adminRepository: IAdminRepository) {}

  async execute({
    email,
  }: GetAdminByEmailRequest): Promise<GetAdminByEmailResponse> {
    const admin = await this.adminRepository.findByEmail(email)

    if (!admin) {
      throw new UserNotFoundError(email)
    }

    return {
      admin,
    }
  }
}
