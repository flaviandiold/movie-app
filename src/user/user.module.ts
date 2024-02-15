import { Module, forwardRef } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRepository } from 'src/user/user.repository';
import { AuthModule } from 'src/auth/auth.module';
import { DatabaseModule } from 'src/database/database.module';
import  RedisService  from 'src/redis/redis.service';
import { RedisModule } from 'src/redis/redis.module';
import { BullmqModule } from 'src/bullmq/bullmq.module';

@Module({
  imports: [forwardRef(() => AuthModule), DatabaseModule, RedisModule],
  providers: [UserService, UserRepository],
  controllers: [UserController],
  exports: [UserService]
})
export class UserModule {
  constructor(){}
}
