import { Module, forwardRef } from '@nestjs/common';
import { OpensearchModule } from 'src/opensearch/opensearch.module';
import { OpensearchProcessor } from './processor/opensearch.processor';
import { DeleteUserProcessor } from './processor/delete-user.processor';
import { UserModule } from 'src/user/user.module';
import { User } from 'src/entity/user.model';
import { DeleteUserQueue } from './jobs/deleteuser.queue';
import { OpensearchQueue } from './jobs/opensearch.queue';

@Module({
  imports: [
    forwardRef(() => UserModule),
    OpensearchModule
  ],
  providers: [OpensearchProcessor, DeleteUserProcessor, OpensearchQueue, DeleteUserQueue],
  exports:[OpensearchQueue, DeleteUserQueue]
})
export class BullmqModule {
  constructor(){}

}
