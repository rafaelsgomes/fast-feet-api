import { IHasher } from '@/domain/fastFeet/application/cryptography/hasher'

export class InMemoryHasher implements IHasher {
  async compare(plain: string, hash: string): Promise<boolean> {
    return plain.concat('-hashed') === hash
  }

  async hash(plain: string): Promise<string> {
    return plain.concat('-hashed')
  }
}
