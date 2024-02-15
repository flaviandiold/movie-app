import { IsDateString } from "class-validator"
import { Director } from "src/entity/director.model"

export class EditMovieDTO{
    name?: string
    description?: string
    @IsDateString()
    releaseDate?: Date
    directorId?:number
}