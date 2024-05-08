import { Injectable } from '@nestjs/common'
import { Admin } from '../../../enterprise/entities/admin'
import { IHasher } from '../../cryptography/hasher'
import { IAdminRepository } from '../../repositories/IAdminRepository'
import { IsPasswordNotNewError } from '../_errors/isPasswordNotNewError'
import { UserNotFoundError } from '../_errors/userNotFoundError'

interface ResetAdminPasswordRequest {
  adminId: string
  password: string
}

interface ResetAdminPasswordResponse {
  admin: Admin
}

@Injectable()
export class ResetAdminPasswordUseCase {
  constructor(
    private adminRepository: IAdminRepository,
    private hasher: IHasher,
  ) {}

  async execute({
    adminId,
    password,
  }: ResetAdminPasswordRequest): Promise<ResetAdminPasswordResponse> {
    const admin = await this.adminRepository.findById(adminId)

    if (!admin) {
      throw new UserNotFoundError(adminId)
    }

    const isPasswordNotNew = await this.hasher.compare(password, admin.password)

    if (isPasswordNotNew) {
      throw new IsPasswordNotNewError()
    }

    const passwordHash = await this.hasher.hash(password)

    admin.setNewPassword = passwordHash

    await this.adminRepository.save(admin)

    return {
      admin,
    }
  }
}
