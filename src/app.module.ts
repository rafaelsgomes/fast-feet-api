import { Module } from '@nestjs/common'
import { EnvModule } from './infra/env/env.module'
import { ConfigModule } from '@nestjs/config'
import { envSchema } from './infra/env/env'
import { HttpModule } from './infra/http/http.module'
import { AuthModule } from './infra/auth/auth.module'
import { AuthorizationModule } from './infra/authorization/authorization.module'
import { EventsModule } from './infra/events/events.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    AuthModule,
    AuthorizationModule,
    EnvModule,
    HttpModule,
    AuthModule,
    EventsModule,
  ],
})
export class AppModule {}
