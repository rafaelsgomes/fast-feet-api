import { Injectable } from '@nestjs/common'
import { Admin } from '../../../enterprise/entities/admin'
import { IHasher } from '../../cryptography/hasher'
import { IAdminRepository } from '../../repositories/IAdminRepository'
import { InvalidDocumentError } from '../_errors/invalidDocumentError'
import { UserAlreadyExistsError } from '../_errors/userAlreadyExistsError'

interface RegisterAdminRequest {
  document: string
  name: string
  email: string
  password: string
}

interface RegisterAdminResponse {
  admin: Admin
}

@Injectable()
export class RegisterAdminUseCase {
  constructor(
    private adminRepository: IAdminRepository,
    private hasher: IHasher,
  ) {}

  async execute({
    document,
    email,
    name,
    password,
  }: RegisterAdminRequest): Promise<RegisterAdminResponse> {
    if (document.length < 11 || document.length > 11) {
      throw new InvalidDocumentError()
    }

    const adminAlreadyExists =
      await this.adminRepository.findByDocument(document)

    if (adminAlreadyExists) {
      throw new UserAlreadyExistsError(document)
    }

    const adminEmailAlreadyExists =
      await this.adminRepository.findByEmail(email)

    if (adminEmailAlreadyExists) {
      throw new UserAlreadyExistsError(email)
    }

    const passwordHash = await this.hasher.hash(password)

    const admin = Admin.create({
      document,
      name,
      email,
      password: passwordHash,
    })

    await this.adminRepository.create(admin)

    return {
      admin,
    }
  }
}
