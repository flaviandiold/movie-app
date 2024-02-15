import { Body, Controller, Delete, Get, Post, Req, Res, Session, UseGuards, ValidationPipe } from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { UserService } from './user.service';
import { LoginGuard } from 'src/auth/login.guard';
import { AuthGuard } from 'src/auth/auth.guard';
import { LoggedInGuard } from 'src/auth/logged.guard';
import { Request } from 'express';

@Controller()
export class UserController {

    constructor(private service: UserService){}

    @Post('/register')
        @UseGuards(LoggedInGuard)
    async register(@Body(ValidationPipe) user: CreateUserDTO) {
        const result = await this.service.createUser(user);
        return { message: result };
    }

    @Post('/login')
    @UseGuards(LoggedInGuard,LoginGuard)
    async login(@Body(ValidationPipe) user: CreateUserDTO, @Session() session: Record<string, any>, @Req() req :Request) {
        // const result = await this.service.validate(user,session);
        // console.log(session.id);
        // session.authenticate = true;
        return req.user;
    }

    @Get('/logout')
    @UseGuards(AuthGuard)
    async logout(@Req() req: Request) {
        req.session.destroy(this.service.logout.bind(this.service, req.sessionID));
        req.logout(() => {
            return "Logged out";
        });
    }
}
