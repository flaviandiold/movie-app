import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put, Query, Req, UseGuards, ValidationPipe } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { CreateMovieDTO } from './dto/create-movie.dto';
import { EditMovieDTO } from './dto/edit-movie.dto';
import { Request } from 'express';
import { AuthGuard } from 'src/auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('movies')
export class MoviesController {
    
    constructor(private service: MoviesService) { }
    
    @Post('/add')
    async addMovie(@Body(ValidationPipe) movie: CreateMovieDTO) {
        const result = await this.service.createMovie(movie);
        return result;
    }
    
    @Get('/all')
    async getAllMovies() {
        const movies = await this.service.getAll();
        return movies;
    }
    
    @Put('/like/:id')
    async like(@Param('id',ParseIntPipe) movieId: number,@Body() body: {}, @Req() request: Request) {
        const result = await this.service.addLike(movieId, body['comment'], request.user['id']);
        return result;
    }
    @Delete('/unlike/:id')
    async unlike(@Param('id',ParseIntPipe) movieId: number, @Req() request: Request) {
        const result = await this.service.removeLike(movieId, request.user['id']);
        return result;
    }

    @Get('/most-liked')
    async mostLiked() {
        const result = await this.service.likedMovies('DESC');
        return result;
    }
    
    @Get('/least-liked')
    async leastLiked() {
        const result = await this.service.likedMovies('ASC');
        return result;
    }

    @Get('/find')
    async search(@Query('search') search: string) {
        const result = await this.service.find(search);
        return result;
    }

    @Get('/sort')
    async moviesSort(@Query('order') order: string) {
        const result = await this.service.moviesSortByName(order);
        return result;
    }

    @Get('/liked-movies')
    async getWishlikst(@Req() request: Request) {
        const wishlist = await this.service.getWishlistOf(request.user['id']);
        return wishlist
    }

    @Get('/:id')
    async getMovie(@Param('id',ParseIntPipe) id : number) {
        const movie = await this.service.getMovie(id);
        return movie;
    }
    
    @Patch('/:id')
    async editMovie(@Param('id',ParseIntPipe) id : number, @Body(ValidationPipe) movie: EditMovieDTO, @Req() req :Request) {
        const result = await this.service.editMovie(id,movie, req.user['id']);
        return { message: result };
    }
    
    @Delete('/:id')
    async deleteMovie(@Param('id',ParseIntPipe) id : number, @Req() req : Request) {
        console.log('in');
        const result = await this.service.deletetMovie(id, req.user['id']);
        return { message: result };
    }
    
    
}


// console.log('in');