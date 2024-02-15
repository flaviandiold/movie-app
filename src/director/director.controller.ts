import { Body, Controller, Get, Post, Query, UseGuards, ValidationPipe } from '@nestjs/common';
import { CreateDirectorDTO } from './dto/create-director.dto';
import { DirectorService } from './director.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('director')
@UseGuards(AuthGuard)
export class DirectorController {

    constructor(private service: DirectorService){}

    @Post('/add')
    async addDirector(@Body(ValidationPipe) director: CreateDirectorDTO) {
        const result = await this.service.addDirector(director);
        return { "message": result };
    } 

    @Get('/sort')
    async moviesSort(@Query('order') order: string) {
        const result = await this.service.moviesSortByDirector(order);
        return result;
    }
}
