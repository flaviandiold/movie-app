import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as passport from 'passport';
import * as session from 'express-session';
import RedisStore from 'connect-redis';
import RedisProvider from './redis/redis.provider';
import redis from './redis/redis.service';
const redisService = new redis(RedisProvider);

async function bootstrap() {
  const app = await NestFactory.create(AppModule); 

  console.log('here');
  app.setGlobalPrefix('api/v1');

  app.use(
    session({
      secret: '987w64r92g4fu92tfougeirubv1239p',
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 100*60*60
      },
      store: new RedisStore({
        client: {
          RedisProvider,
          async set(key, value, ex, sec) {
            await redisService.set(key,value,sec);
            
          },
          async get(key) {
            const result = await redisService.get(key);
            return result;
          },
          async del(key) {
            await redisService.del(key);
          },
          async expire(key, sec) {
            await redisService.expire(key, sec);
          }
        }  
      }),
    })
  );
 
  app.use(passport.initialize());
  app.use(passport.session());
 
  await app.listen(8080);
}
bootstrap();

