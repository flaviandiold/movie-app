import { HttpException, HttpStatus, Inject, Injectable, forwardRef } from '@nestjs/common';
import { MoviesRepository } from './movies.repository';
import { CreateMovieDTO } from './dto/create-movie.dto';
import { Movie } from 'src/entity/movie.model';
import { EditMovieDTO } from './dto/edit-movie.dto';
import { DirectorService } from 'src/director/director.service';
import { Director } from 'src/entity/director.model';
import  RedisService  from 'src/redis/redis.service';
import { OpensearchService } from 'src/opensearch/opensearch.service';
import { MovieOS } from './dto/movie.opensearch.dto';
import { OpensearchQueue } from 'src/bullmq/jobs/opensearch.queue';

@Injectable()
export class MoviesService {
    constructor(
        @Inject('SEQUELIZE') private database,
        private movieRepo: MoviesRepository,
        @Inject(forwardRef(() => DirectorService)) private directorService: DirectorService,
        private redisService: RedisService,
        private opensearchService: OpensearchService,
        private opensearchQueue: OpensearchQueue
        ) { }
        
    async find(search: string) {
        const result = await this.opensearchService.search('movies', search);
        return result;
    }
    async likedMovies(order: string) {
        const result = await this.opensearchService.liked('movies',order);
        return result;
    }
    async moviesSortByName(order: string) {
        const result = this.opensearchService.sort(order, 'movies', 'name.raw');
        return result;
    }
    async countMoviesOf(director: Director): Promise<number> {
        const count = await this.movieRepo.movieCountOfDirector(director);     
        return count;
    }

    async getWishlistOf(userId: number) {
        let wishlist = JSON.parse(await this.redisService.hget('wishlist', userId.toString()));
        if (!wishlist) {
            wishlist = await this.movieRepo.getWishlistOf(userId);
            await this.redisService.hset('wishlist',new Map().set(userId,JSON.stringify(wishlist)));
        }
        return wishlist;
    }

    async getAllLikesOfMovie(movieId: number) {
        const likes = await this.movieRepo.getAllLikesOfMovie(movieId);
        return likes
    }

    async removeLike(movieId: number, userId: any) {
        if (!await this.movieRepo.hasMovieId(movieId)) {
            throw new HttpException('No such movie exists', HttpStatus.BAD_REQUEST);
        }
        if (!await this.movieRepo.hasLikeBy(movieId,userId)) {
            throw new HttpException('You have not liked this movie yet', HttpStatus.BAD_REQUEST);
        }
        try {
            await this.movieRepo.removeLikeOn(movieId, userId);
            await this.redisService.hdel('wishlist', userId.toString());
            // this.opensearchService.updateMovieRemoveLike(movieId, userId);
            this.opensearchQueue.createJob(movieId + ':' + userId, { job: 'like', index: 'movies', userId: userId, id: movieId});
            return "Unliked";
        } catch (error) {
            throw new HttpException('Server error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    async addLike(movieId: number,comment: string, userId: number) {
        if (!await this.movieRepo.hasMovieId(movieId)) {
            throw new HttpException('No such movie exists', HttpStatus.BAD_REQUEST);
        }
        try {
            await this.movieRepo.addLikeOn(movieId,comment, userId);
            console.log('here');
            await this.redisService.hdel('wishlist', userId.toString());
            this.opensearchQueue.createJob(movieId + ':' + userId, { job: 'like', index: 'movies', userId: userId, comment: comment , id: movieId});
            return "Liked";
        } catch (error) {
            // console.log(error);
            throw new HttpException('Movie already liked by you', HttpStatus.CONFLICT);
        }
    }
    
    async deletetMovie(id: number, userId: string) {
        let movie: Movie;
        try {
            movie = await this.movieRepo.getMovieForId(id);
        } catch (error) {
            // console.log(error);
            throw new HttpException('Server error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
        if (movie) {
            try {
                await movie.destroy();
                await this.redisService.hdel('wishlist', userId.toString());
                this.opensearchQueue.createJob('movies:' + id, {job:'delete',id,index:'movies'});
                return "Deleted";
            } catch (error) {
                // console.log(error);
                throw new HttpException('Server error', HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
        throw new HttpException('No such movie exists', HttpStatus.NOT_FOUND);
    }
    
    async editMovie(id: number, movie: EditMovieDTO, userId: string): Promise<string> {
        let entry = await this.movieRepo.getMovieForId(id);
        if (entry) {
            try {
                const director = await this.directorService.hasDirectorWithId(movie.directorId);
                if (!director) {
                    throw new HttpException('No such director exists',HttpStatus.NOT_FOUND);
                }
                await this.movieRepo.edit(id, movie);
                await this.redisService.hdel('wishlist', userId);
                const opensearchEntry = {
                    name: movie.name,
                    description: movie.description,
                    release_date: movie.releaseDate,
                    director: {
                        directorName: director.getDataValue('name')
                    },
                    liked:[]
                };
                this.opensearchQueue.createJob('movies:' + id, {job:'index',id,index:'movies',opensearchEntry});
                return "Edited";
            } catch (error) {
                // console.log(error);
                throw error;
            }
        }
        throw new HttpException('No such movie exists',HttpStatus.NOT_FOUND);
    }
    
    async getMovie(id: number): Promise<Movie> {
        let movie: Movie;
        try {
            movie = await this.movieRepo.getMovieForId(id);
        } catch (error) {
            // console.log(error);
            throw new HttpException('Server error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
        if (movie) {
            return movie;
        }
        throw new HttpException('No such movie exists', HttpStatus.NOT_FOUND);
    }
    async getAll(): Promise<any> {
        const movies = await this.opensearchService.getAll('movies');
        return movies;
    }
    async createMovie(movie: CreateMovieDTO): Promise<{}> {
        if (!await this.movieRepo.hasMovieName(movie.name)) {
            try {
                let result: {};
                let opensearchEntry: MovieOS;
                let id: number;
                await this.database.transaction(async (t) => {
                    const director = await this.directorService.createDirector(movie.director);
                    const movieEntry = await this.movieRepo.create(movie, director.getDataValue('id'));
                    const movieCount = await this.directorService.movieCountOf(director);
                    result = { directorName: director.getDataValue('name'), movieCount };
                    opensearchEntry = {
                        name: movieEntry.getDataValue('name'),
                        description: movieEntry.getDataValue('description'),
                        release_date: movieEntry.getDataValue('release_date'),
                        director: {
                            directorName: director.getDataValue('name')
                        },
                        liked:[]
                    };
                    id = movieEntry.getDataValue('id');
                    this.opensearchQueue.createJob('movies:' + id, {job:'index',id,index:'movies',opensearchEntry});
                })
                // this.opensearchService.index('movies',opensearchEntry,id.toString());
                return result;
            } catch (error) {
                // console.log(error);
                throw error;
            }
        }
        throw new HttpException('Such an movie exists',HttpStatus.CONFLICT);
    }
}
