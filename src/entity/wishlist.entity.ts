import { AllowNull, AutoIncrement, Column, ForeignKey, Model, NotNull, PrimaryKey, Table, Unique } from "sequelize-typescript";
import { User } from "./user.model";
import { Movie } from "./movie.model";

@Table({
    tableName: 'wishlist',
})
export class Wishlist extends Model{
    @PrimaryKey
    @AutoIncrement
    @Column
    id: number

    @ForeignKey(() => User)
    @AllowNull(false)
    @Column({
        field: 'user_id'
    })
    userId: number

    @ForeignKey(() => Movie)
    @AllowNull(false)
    @Column({
        field: 'movies_id'
    })
    moviesId: number

    @Column
    comment: string
}