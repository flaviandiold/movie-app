import { Module } from '@nestjs/common';
import { OpensearchModule } from 'src/opensearch/opensearch.module';
import { HooksHelper } from './hooks.helper';

@Module({
    imports: [OpensearchModule],
    providers: [HooksHelper]
})
export class EntityModule {
    constructor(){}

}
