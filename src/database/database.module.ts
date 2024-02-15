import { Module } from '@nestjs/common';
import {databaseProvider} from './database.provider';

@Module({
    imports: [],
    providers: [databaseProvider],
    exports: [databaseProvider]
})
export class DatabaseModule {
    constructor(){}
}
