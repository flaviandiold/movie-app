import { Module, forwardRef } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthRepository } from './auth.repository';
import { DatabaseModule } from 'src/database/database.module';
import { AuthService } from './auth.service';
import { RedisModule } from 'src/redis/redis.module';
import { UserModule } from 'src/user/user.module';
import { LocalStrategy } from './local.strategy';
import { SessionSerializer } from './session.serialize';

@Module({
    imports:[DatabaseModule, RedisModule, forwardRef(() => UserModule), PassportModule],
    providers:[AuthRepository, AuthService, LocalStrategy, SessionSerializer],
    exports:[AuthService, AuthRepository]
})
export class AuthModule {
    constructor(){}

}
