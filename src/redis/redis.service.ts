import { Inject, Injectable } from '@nestjs/common';
import { RedisClient } from './redis.provider';

@Injectable()
export default class RedisService {
  public constructor(
    @Inject('REDIS_CLIENT')
    private readonly client: RedisClient,
    ) {}
    
  async deactivateSessionsFor(userId: number) {
    const sessionCache = await this.hgetAll('sessions');
    console.log(sessionCache);
    let sessions = {};
    // for (const ){
      
    // }
  }
  async hset(key: string, value: Map<string,string>) {
    await this.client.hset(key, value);
  }
  
  async hget(key: string, field: string): Promise<string | null> {
    const result = await this.client.hget(key,field);
    return result;
  }

  async hgetAll(key: string) {
    const result = await this.client.hgetall(key);
    return result;
  }

  async hdel(key: string, field: string) {
    await this.client.hdel(key,field);
  }

  async set(key: string, value: string, expirationSeconds: number) {
    await this.client.set(key, value, 'EX', expirationSeconds);
  }

  async get(key: string): Promise<string | null> {
    const result = await this.client.get(key);
    return result;
  }

  async del(key: string) {
    await this.client.del(key);
  }

  async expire(key: string, sec: number) {
    await this.client.expire(key, sec);
  }
}