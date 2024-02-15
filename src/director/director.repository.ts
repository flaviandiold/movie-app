import { Inject, Injectable } from "@nestjs/common";
import { CreateDirectorDTO } from "./dto/create-director.dto";
import { Director } from "src/entity/director.model";

@Injectable()
export class DirectorRepository{
    
    constructor(@Inject('SEQUELIZE') private database) { }
    
    async getDirectorWithName(name: string): Promise<Director> {
        const director = await this.database.models.Director.findOne({
            where: {
                name
            }
        });
        return director;
    }
    async getDirectorWithId(directorId: number) : Promise<Director>{
        const director = await this.database.models.Director.findByPk(directorId);
        return director;
    }

    async addDirector(director: CreateDirectorDTO) : Promise<Director> {
        const entry = await this.database.models.Director.create(director);
        return entry;
    }
    async hasDirectorWithName(name: string) : Promise<boolean> {
        const count = await this.database.models.Director.count({
            where: {
                name:name
            }
        });
        return count >= 1;
    }

}