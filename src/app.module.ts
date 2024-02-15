import { Module, forwardRef } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { MoviesModule } from './movies/movies.module';
import { DirectorModule } from './director/director.module';
import { AuthModule } from './auth/auth.module';
import { RedisModule,  } from './redis/redis.module';
import { OpensearchModule } from './opensearch/opensearch.module';
import { EntityModule } from './entity/entity.module';
import { BullmqModule } from './bullmq/bullmq.module';

@Module({
  imports: [
    DatabaseModule,
    UserModule,
    MoviesModule,
    DirectorModule,
    AuthModule,
    RedisModule,
    OpensearchModule,
    EntityModule,
    BullmqModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
}
