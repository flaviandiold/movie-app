import { Module } from '@nestjs/common';
import { OpensearchService } from './opensearch.service';
import { OpensearchProvider } from './opensearch.provider';

@Module({
  providers: [OpensearchService, OpensearchProvider],
  exports:[OpensearchService]
})
export class OpensearchModule {
  constructor(){}

}
