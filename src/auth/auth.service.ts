import {  Inject, Injectable, forwardRef } from "@nestjs/common";
import { AuthRepository } from "./auth.repository";
import { CreateSessionDTO } from "src/user/dto/create-session.dto";
import { plainToInstance } from "class-transformer";
import { SessionSchema } from "./schema/session.schema";
import { Session } from "src/entity/session.model";
import  RedisService  from "src/redis/redis.service";
import { User } from "src/entity/user.model";
import { UserService } from "src/user/user.service";
import { UserSchema } from "./schema/user.schema";

@Injectable()
export class AuthService{
  constructor(private authRepo: AuthRepository, private redisService: RedisService, @Inject(forwardRef(() => UserService)) private userService: UserService) { }
  
  async validateUser(username: string, password: string) : Promise<UserSchema>{
    const user = this.userService.validateUser(username, password);
    return plainToInstance(UserSchema, user, {
      excludeExtraneousValues: true
    });
  }
  async hasSessionId(sessionId: string): Promise<boolean> {
    const count = await this.authRepo.countFor(sessionId);
    return count === 1;
  }
  
  async validSession(sid: string): Promise<{ userId: number; active: boolean; }> {
    const session:SessionSchema = plainToInstance(SessionSchema, JSON.parse(await this.redisService.hget('sessions', sid)), {
      excludeExtraneousValues: true
    }) ?? plainToInstance(SessionSchema, (await this.authRepo.getSessionActiveFor(sid))?.dataValues, {
      excludeExtraneousValues: true
    });
    if (!session) return null;
    return {userId: session.userId, active: session.active};
  }
  async destroySessionFor(sessionId: string) {
    await this.redisService.hdel('sessions',sessionId);
    await this.authRepo.destroySessionForId(sessionId);
  }

  async createSession(session: CreateSessionDTO): Promise<SessionSchema> {
    const recentSession : Session = await this.authRepo.logout(session.userId);
    // console.log(recentSession);
    if(recentSession[0])
        await this.redisService.hdel('sessions',recentSession[0].getDataValue('sessionId'));
    const result: Session = await this.authRepo.createSession(session);
    // console.log(result.dataValues);
    return plainToInstance(SessionSchema, result.dataValues, {
      excludeExtraneousValues: true
    });
  }
}