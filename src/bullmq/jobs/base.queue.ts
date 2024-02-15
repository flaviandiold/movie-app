import { JobsOptions, Queue } from "bullmq";

export class BaseQueue {
    
    protected queue: Queue;
    private queueName: string
    constructor(queueName: string) { 
        this.queueName = queueName;
    }

    register() {
        this.queue = new Queue(this.queueName, {
            connection: {
                host: 'localhost',
                port: 6379
            }
        });
    }
    
    createJob(name: string, body: any, opts?: JobsOptions | null) {
        this.queue.add(name, body, opts);
    }
    
}
