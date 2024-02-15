import { IsNotEmpty } from "class-validator"

export class CreateUserDTO{
    @IsNotEmpty()
    username: string
    @IsNotEmpty()
    password: string
}