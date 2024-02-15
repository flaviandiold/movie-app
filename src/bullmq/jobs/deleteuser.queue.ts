import { Injectable } from '@nestjs/common';
import { JobsOptions, Queue } from 'bullmq';
import { BaseQueue } from './base.queue';

export class DeleteUserQueue extends BaseQueue{
    constructor() {
        super('deleteUserQueue');
        this.register();
    }

    register() {
        super.register();
        this.queue.add('deleteusers', {
        }, {
            repeat: {
                pattern: '* * * * *'
            }
        });
    }
    
}
