import { IsDateString, IsNotEmpty, isDate } from "class-validator"
import { CreateDirectorDTO } from "src/director/dto/create-director.dto"
import { Director } from "src/entity/director.model"

export class CreateMovieDTO{
    @IsNotEmpty()
    name: string
    @IsNotEmpty()
    description: string
    @IsNotEmpty()
    @IsDateString()
    releaseDate: Date
    @IsNotEmpty()
    director: CreateDirectorDTO
}