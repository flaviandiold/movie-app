import { Inject, Injectable } from "@nestjs/common";
import { CreateMovieDTO } from "./dto/create-movie.dto";
import { Movie } from "src/entity/movie.model";
import { EditMovieDTO } from "./dto/edit-movie.dto";
import { Director } from "src/entity/director.model";
import { QueryTypes } from "sequelize";
import { Wishlist } from "src/entity/wishlist.entity";

@Injectable()
export class MoviesRepository{
    constructor(@Inject('SEQUELIZE') private database){}
    
    async getAllLikesOfMovie(movieId: number) {
        const likes = await this.database.query(`SELECT u.id,u.name,w.comment from wishlist w join users u on u.id = w.user_id where w.movie_id=${movieId}`);
        return likes;
    }
    async movieCountOfDirector(director: Director) {
        const count = this.database.models.Movie.count({
            where: {
                directorId: director.getDataValue('id')
            }
        });
        return count;
    }
    
    async getWishlistOf(userId: number) {
        const wishlist = await this.database.query(`Select m.name,m.description,w.comment from movies m join wishlist w on m.id = w.movies_id where w.user_id=${userId}`, { type: QueryTypes.SELECT });
        return wishlist;
    }

    async removeLikeOn(moviesId: number, userId: any) {
        await this.database.models.Wishlist.destroy({
            where: {
                userId,
                moviesId
            }
        });
    }

    async hasLikeBy(moviesId: number, userId: any) : Promise<boolean>{
        const count = await this.database.models.Wishlist.count({
            where: {
                userId,
                moviesId
            }
        })
        return count === 1;
    }
    async addLikeOn(moviesId: number, comment: string, userId: number) {
        console.log(moviesId,userId,comment);
        await this.database.models.Wishlist.create({ userId, moviesId, comment });
        console.log('finished');
    }

    async deleteMovie(id: number) {
        await this.database.models.Movie.destroy({
            where: {
                id
            }
        });
    }
    async edit(id: number, movie: EditMovieDTO) {
        await this.database.models.Movie.update(movie, {
            where: {
               id: id
           } 
        });
    }
    
    async getAll(): Promise<Movie[]> {
        const movies = await this.database.models.Movie.findAll();
        return movies;
    }
    
    async create(movie: CreateMovieDTO, directorId: number): Promise<Movie> {
        const entry: Movie = await this.database.models.Movie.create({...movie, directorId});
        return entry;
    }

    async hasMovieName(name: string): Promise<boolean> {
        if (await this.getMovieForName(name)) return true;
        return false;
    }
    
    async hasMovieId(id: number): Promise<boolean> {
        if (await this.getMovieForId(id)) return true;
        return false;
    }
    
    async getMovieForName(name: string): Promise<Movie | null> {
        const movie = await this.database.models.Movie.findOne({
            where: {
                name: name
            }
        });
        return movie;
    }
    async getMovieForId(id: number): Promise<Movie | null> {
        const movie = await this.database.models.Movie.findByPk(id);
        return movie;
    }
    
} 