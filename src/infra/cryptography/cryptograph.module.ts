import { Module } from '@nestjs/common'
import { IHasher } from '@/domain/fastFeet/application/cryptography/hasher'
import { BcryptHasher } from './bcryptHasher'
import { IEncrypter } from '@/domain/fastFeet/application/cryptography/encryper'
import { JwtEncryper } from './jwtEncryper'

@Module({
  providers: [
    {
      provide: IHasher,
      useClass: BcryptHasher,
    },
    {
      provide: IEncrypter,
      useClass: JwtEncryper,
    },
  ],
  exports: [IHasher, IEncrypter],
})
export class CryptographyModule {}
