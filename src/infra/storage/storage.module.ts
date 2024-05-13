import { Uploader } from '@/domain/fastFeet/application/storage/uploader'
import { Module } from '@nestjs/common'
import { R2Storage } from './r2Storage'
import { EnvModule } from '../env/env.module'

@Module({
  imports: [EnvModule],
  providers: [
    {
      provide: Uploader,
      useClass: R2Storage,
    },
  ],
  exports: [Uploader],
})
export class StorageModule {}
