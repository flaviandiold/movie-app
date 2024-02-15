import { Column, Table, Model, IsAfter, IsBefore, BelongsTo, ForeignKey, DataType, AfterFind, HasMany, BelongsToMany, AfterCreate } from "sequelize-typescript";
import { Director } from "./director.model";
import { Exclude } from "class-transformer";
import { User } from "./user.model";
import { Wishlist } from "./wishlist.entity";
import { OpensearchService } from "src/opensearch/opensearch.service";
import { Inject } from "@nestjs/common";
import { MovieOS } from "src/movies/dto/movie.opensearch.dto";
import { HooksHelper } from "./hooks.helper";
import { Hooks } from "sequelize/types/hooks";

@Table({
    tableName: 'movies',
})
export class Movie extends Model{
    @Column({
        primaryKey: true,
        autoIncrement: true,
    })
    id: number
    
    @Column({
        allowNull: false,
        unique: true
    })
    name: string

    @Column({
        allowNull: false
    })
    description: string

    @Column({
        allowNull: false,
        field:'release_date'
    })
    releaseDate: Date

    @Exclude()
    @ForeignKey(() => Director)
    @Column
    directorId: number

    @BelongsTo(() => Director, { foreignKey: 'directorId' })
    director: Director

    @BelongsToMany(() => User, () => Wishlist)
    likes: User[]

    // @AfterCreate
    // static async AfterCreate(movie: any) {
    //     const director = await movie.getDirector();
    //     const opensearchEntry: MovieOS = {
    //         name: movie.getDataValue('name'),
    //         description: movie.getDataValue('description'),
    //         release_date: movie.getDataValue('release_date'),
    //         director: {
    //             directorName: director.getDataValue('name')
    //         },
    //         liked:[]
    //     };
    //     const helper = new HooksHelper(OpensearchService);
    //     console.log(movie, 'hook');
    // }
}
