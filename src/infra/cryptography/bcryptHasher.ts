import { IHasher } from '@/domain/fastFeet/application/cryptography/hasher'
import { Injectable } from '@nestjs/common'
import { hash, compare } from 'bcryptjs'

@Injectable()
export class BcryptHasher implements IHasher {
  private HASH_SALT_LENGTH = 8
  hash(plain: string): Promise<string> {
    return hash(plain, this.HASH_SALT_LENGTH)
  }

  compare(plain: string, hash: string): Promise<boolean> {
    return compare(plain, hash)
  }
}
