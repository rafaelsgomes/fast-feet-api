import { IEncrypter } from '@/domain/fastFeet/application/cryptography/encryper'

export class InMemoryEncrypter implements IEncrypter {
  async encrypt(payload: Record<string, unknown>): Promise<string> {
    return JSON.stringify(payload)
  }
}
