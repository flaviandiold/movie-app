import { AllowNull, AutoIncrement, Column, Model, PrimaryKey, Table } from "sequelize-typescript";

@Table({
    tableName: 'session',
    updatedAt: false
})
export class Session extends Model{

    @PrimaryKey
    @AutoIncrement
    @Column
    id: number

    @AllowNull(false)
    @Column
    sessionId: string

    @AllowNull(false)
    @Column
    userId: number

    @AllowNull(false)
    @Column
    active: boolean

    @Column({
        field:'expiry_date'
    })
    expiryDate: Date
}