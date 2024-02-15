import { BelongsToMany, Column, DataType, Model, Table } from "sequelize-typescript";
import * as encoder from 'bcrypt';
import { Wishlist } from "./wishlist.entity";
import { Movie } from "./movie.model";
import { Exclude } from "class-transformer";
@Table({
    tableName: 'users',
    createdAt: true
})
export class User extends Model{
    @Column({
        primaryKey: true,
        autoIncrement: true,
        type: DataType.INTEGER
    })
    id: number

    @Column({
        allowNull: false,
        unique: true,
        type: DataType.STRING
    })
    username: string

    @Column({
        allowNull: false,
        set(value: string) {
            this.setDataValue('password', encoder.hashSync(value, 10));
        },
    })
    @Exclude()
    password: string

    @BelongsToMany(() => Movie, () => Wishlist)
    wishlist: Movie[]
}