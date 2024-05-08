export abstract class IHasher {
  abstract compare(plain: string, hash: string): Promise<boolean>
  abstract hash(plain: string): Promise<string>
}
