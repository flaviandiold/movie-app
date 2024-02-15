import { Module, forwardRef } from '@nestjs/common';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import { MoviesRepository } from './movies.repository';
import { DatabaseModule } from 'src/database/database.module';
import { AuthModule } from 'src/auth/auth.module';
import { DirectorModule } from 'src/director/director.module';
import { RedisModule } from 'src/redis/redis.module';
import { OpensearchModule } from 'src/opensearch/opensearch.module';
import { BullmqModule } from 'src/bullmq/bullmq.module';

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    forwardRef(() => DirectorModule),
    RedisModule,
    OpensearchModule,
    BullmqModule
  ],
  controllers: [MoviesController],
  providers: [MoviesService, MoviesRepository],
  exports: [MoviesService]
})
export class MoviesModule {
  constructor(){}

}
