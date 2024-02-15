import { HttpException, HttpStatus, Inject, Injectable, forwardRef } from '@nestjs/common';
import { CreateDirectorDTO } from './dto/create-director.dto';
import { DirectorRepository } from './director.repository';
import { Director } from 'src/entity/director.model';
import { MoviesService } from 'src/movies/movies.service';
import { OpensearchService } from 'src/opensearch/opensearch.service';
// import { plainToInstance } from 'class-transformer';

@Injectable()
export class DirectorService {
    
    constructor(private directorRepo: DirectorRepository, @Inject(forwardRef(() => MoviesService)) private movieService : MoviesService, private opensearchService: OpensearchService) { }
    
    async moviesSortByDirector(order: string) {
        const result = this.opensearchService.sort(order, 'movies', 'director.directorName.keyword','name.raw');
        return result;
    }
    async movieCountOf(director: Director) {
        const count = await this.movieService.countMoviesOf(director);
        return count;
    }
    async createDirector(director: CreateDirectorDTO) : Promise<Director> {
        let entry: Director = await this.directorRepo.getDirectorWithName(director.name);
        if (!entry) {
            entry = await this.directorRepo.addDirector(director);
        } 
        return entry;
    }
    async hasDirectorWithId(directorId: number) : Promise<Director>{
        const director = await this.directorRepo.getDirectorWithId(directorId);
        return director
    }
    
    async addDirector(director: CreateDirectorDTO): Promise<string> {
        const isEntryAvailable = await this.directorRepo.hasDirectorWithName(director.name);
        if (isEntryAvailable) {
            throw new HttpException('Such a director record exists', HttpStatus.CONFLICT);
        } 
        try {
            await this.directorRepo.addDirector(director);
            return "Success";
        } catch (error) {
            console.log(error);
            throw new HttpException('Server error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
