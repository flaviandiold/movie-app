import { AllowNull, AutoIncrement, Column, HasMany, Model, PrimaryKey, Table, Unique } from "sequelize-typescript";
import { Movie } from "./movie.model";
import { CreateMovieDTO } from "src/movies/dto/create-movie.dto";

@Table({
    tableName: 'director',
    timestamps: false
})
export class Director extends Model{
    @PrimaryKey
    @AutoIncrement
    @Column
    id: number

    @AllowNull(false)
    @Unique(true)
    @Column
    name: string

    @HasMany(() => Movie, {foreignKey: 'directorId'})
    movies: Movie[]
}