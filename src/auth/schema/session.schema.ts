import { Expose } from "class-transformer"

export class SessionSchema{
    @Expose()
    userId: number
    @Expose()
    active: boolean
    @Expose()
    expiryDate: Date
}