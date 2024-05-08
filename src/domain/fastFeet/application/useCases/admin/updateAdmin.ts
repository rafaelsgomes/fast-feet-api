import { Injectable } from '@nestjs/common'
import { Admin } from '../../../enterprise/entities/admin'
import { IAdminRepository } from '../../repositories/IAdminRepository'
import { UserNotFoundError } from '../_errors/userNotFoundError'
import { InformationNotProvidedError } from '../_errors/informationNotProvidedError'

interface UpdateAdminRequest {
  adminId: string
  name?: string
  email?: string
  document?: string
}

interface UpdateAdminResponse {
  admin: Admin
}

@Injectable()
export class UpdateAdminUseCase {
  constructor(private adminRepository: IAdminRepository) {}

  async execute({
    adminId,
    email,
    name,
    document,
  }: UpdateAdminRequest): Promise<UpdateAdminResponse> {
    if (!name && !email && !document) {
      throw new InformationNotProvidedError()
    }

    const admin = await this.adminRepository.findById(adminId)

    if (!admin) {
      throw new UserNotFoundError(adminId)
    }

    if (email && email !== admin.email) admin.setNewEmail = email
    if (name && name !== admin.name) admin.setNewName = name
    if (document && document !== admin.document) admin.setNewDocument = document

    await this.adminRepository.save(admin)

    return {
      admin,
    }
  }
}
