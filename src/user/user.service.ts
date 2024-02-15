import { HttpException, HttpStatus, Inject, Injectable, forwardRef } from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { UserRepository } from './user.repository';
import * as encoder from 'bcrypt';
import { AuthService } from 'src/auth/auth.service';
import { CreateSessionDTO } from './dto/create-session.dto';
import  RedisService from 'src/redis/redis.service';
import { User } from 'src/entity/user.model';
import { DeleteUserQueue } from 'src/bullmq/jobs/deleteuser.queue';

@Injectable()
export class UserService {
    
    constructor(private userRepo: UserRepository,
        @Inject(forwardRef(() => AuthService)) private authService: AuthService,
        private redisService: RedisService,
        ) {
        console.log('user service');
         }
        
        async logout(sessionId: string) {
            await this.authService.destroySessionFor(sessionId);
        }
        async validateUser(username: string, password: string) : Promise<User> {
            const user = await this.userRepo.getUserFor(username);
            if (!user) {
                return null;
            }
            if (!(await encoder.compare(password, user.getDataValue('password')))) {
                return null;
            }
            return user;
        }
        
    async deleteUsers() {
        console.log('comes here');
        await this.userRepo.deleteUsers();
    }
    
        async createUser(user: CreateUserDTO): Promise<string> {
            if (!await this.userRepo.hasUser(user.username)) {
                try {
                    await this.userRepo.create(user);
                    return "Registered";
            } catch (error) {
                console.log(error);
                throw new HttpException('Server Error',HttpStatus.INTERNAL_SERVER_ERROR);
                }
        }
        throw new HttpException('Such an user exists',HttpStatus.CONFLICT);
    }
   
    async validate(user: CreateUserDTO, session: Record<string,any>) {
        const entry = await this.userRepo.getUserFor(user.username);
        if (entry) {
            const sessionEntry = this.convertToDTO(session, entry.getDataValue('id'));
            // this.redisService.set();
            if (await encoder.compare(user.password, entry.getDataValue('password'))) {
                // console.log(await this.redisService.hget('sessions',sessionEntry.sessionId));
                if (await this.redisService.hget('sessions',sessionEntry.sessionId) ?? await this.authService.hasSessionId(sessionEntry.sessionId)) {
                    throw new HttpException('Session already logged in, try logging out first',HttpStatus.CONFLICT);
                }
                const sessionInDB = await this.authService.createSession(sessionEntry);
                await this.redisService.hset('sessions', new Map().set(sessionEntry.sessionId, JSON.stringify(sessionInDB)));
                await this.redisService.deactivateSessionsFor(entry.getDataValue('id'));
                session.authenticate = true;
                return entry.getDataValue('id');
            }
            throw new HttpException('Wrong Credentials',HttpStatus.BAD_REQUEST);
        }
        throw new HttpException('No such user exists', HttpStatus.NOT_FOUND);
    }
    convertToDTO(session: Record<string, any>, id: number): CreateSessionDTO {
        const result = { sessionId: session.id, userId: id};
        return result;
    }
}

