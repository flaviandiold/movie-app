import { IsNotEmpty } from "class-validator";

export class CreateDirectorDTO{
    @IsNotEmpty()
    name: string
}