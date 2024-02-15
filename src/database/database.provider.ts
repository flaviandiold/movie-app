import { Provider } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { Director } from 'src/entity/director.model';
import { Movie } from 'src/entity/movie.model';
import { Session } from 'src/entity/session.model';
import { User } from 'src/entity/user.model';
import { Wishlist } from 'src/entity/wishlist.entity';

/*
Movie table will have associations with Director and Genre
    One Movie can have only one director, but one director can direct many movies
    Many to many association => One Movie can belong to many genres, likewise, One genre can contain many movies

User table will have associations with Wishlist,
    Many to many association => One User can like many movies, likewise, one movie can be liked by many users
*/
export const databaseProvider: Provider =
{
    provide: 'SEQUELIZE',
    useFactory: async () => {
        const sequelize = new Sequelize({
            dialect: 'postgres',
            host: 'localhost',
            port: 5432,
            username: 'postgres',
            password: 'admin',
            database: 'trial-movie',
        });
        sequelize.addModels([User, Movie, Director, Wishlist, Session])
        await sequelize.sync({ alter: true });
        return sequelize;
    },
};

// export const models = 
// const sequelize = databaseProvider.useFactory();
// console.log();