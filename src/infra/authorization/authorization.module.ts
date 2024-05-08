import { Module } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'
import { RolesGuard } from './roles.guard'
import { DatabaseModule } from '../database/database.module'

@Module({
  imports: [DatabaseModule],
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AuthorizationModule {}
