import { Expose } from "class-transformer";

export class UserSchema{
    @Expose()
    id: number
    @Expose()
    username: string
}