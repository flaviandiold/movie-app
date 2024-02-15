import { Module, forwardRef } from '@nestjs/common';
import { DirectorRepository } from './director.repository';
import { DirectorController } from './director.controller';
import { DirectorService } from './director.service';
import { AuthModule } from 'src/auth/auth.module';
import { DatabaseModule } from 'src/database/database.module';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';
import { MoviesService } from 'src/movies/movies.service';
import { MoviesModule } from 'src/movies/movies.module';
import { OpensearchModule } from 'src/opensearch/opensearch.module';

@Module({
    imports: [
        DatabaseModule,
        AuthModule,
        forwardRef(() => MoviesModule),
        OpensearchModule
    ],
    providers: [DirectorService, DirectorRepository],
    controllers: [DirectorController],
    exports: [DirectorService]
})
export class DirectorModule {
    constructor(){}

}
