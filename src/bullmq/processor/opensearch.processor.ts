import { Job, Processor, WorkerOptions } from 'bullmq';
import { OpensearchService } from 'src/opensearch/opensearch.service';
import { BaseProcessor } from './base.processor';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class OpensearchProcessor extends BaseProcessor {
  constructor(private service: OpensearchService) {
    super('opensearchQueue');
    this.register();
  }


  register() {
    super.register(this.process.bind(this));
  }
  async process(job: Job<any, any, string>): Promise<any> {
    console.log(job.data);
    if (job.data.job === 'index')
      await this.service.index(job.data.index, job.data.opensearchEntry, job.data.id);
    else if (job.data.job === 'like')
      await this.service.updateMovieAddLike(job.data.index, job.data.userId, job.data.comment, job.data.id);
    else if (job.data.job === 'unlike')
      await this.service.updateMovieRemoveLike(job.data.index, job.data.id, job.data.userId);
    else if (job.data.job === 'delete')
      await this.service.delete(job.data.index, job.data.id);
    return;
  }

}