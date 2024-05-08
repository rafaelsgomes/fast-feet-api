import { Injectable } from '@nestjs/common'
import { IEncrypter } from '../../cryptography/encryper'
import { IHasher } from '../../cryptography/hasher'
import { IAdminRepository } from '../../repositories/IAdminRepository'
import { InvalidDocumentError } from '../_errors/invalidDocumentError'
import { WrongCredentialsError } from '../_errors/wrongCredentialsError'

interface AuthenticateAdminByDocumentRequest {
  document: string
  password: string
}

interface AuthenticateAdminByDocumentResponse {
  accessToken: string
}

@Injectable()
export class AuthenticateAdminByDocumentUseCase {
  constructor(
    private adminRepository: IAdminRepository,
    private hasher: IHasher,
    private encrypter: IEncrypter,
  ) {}

  async execute({
    document,
    password,
  }: AuthenticateAdminByDocumentRequest): Promise<AuthenticateAdminByDocumentResponse> {
    if (document.length < 11 || document.length > 11) {
      throw new InvalidDocumentError()
    }
    const admin = await this.adminRepository.findByDocument(document)

    if (!admin) {
      throw new WrongCredentialsError()
    }

    const isPasswordMatch = await this.hasher.compare(password, admin.password)

    if (!isPasswordMatch) {
      throw new WrongCredentialsError()
    }

    const accessToken = await this.encrypter.encrypt({
      sub: admin.id,
    })

    return {
      accessToken,
    }
  }
}
