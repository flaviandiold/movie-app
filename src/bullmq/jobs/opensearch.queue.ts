import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { BaseQueue } from './base.queue';

export class OpensearchQueue extends BaseQueue {
    
    constructor() {
        super('opensearchQueue');
        this.register();
    }
    
    // like(job: string, movieId: string, userId: number, comment: string) {
    //     this.queue.add(movieId+''+userId, { job: job, movieId, userId, comment });
    // }
    
    // createJob(job: string, index: string, id: string, opensearchEntry: any) {
    //     this.queue.add(index + ':id', { job: job, id: id, index: index, opensearchEntry }, {});
    // }
    
}
