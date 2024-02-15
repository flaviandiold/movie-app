import { Injectable } from "@nestjs/common";
import { Job, Processor } from "bullmq";
import { Worker,WorkerOptions } from "bullmq";


@Injectable()
export class BaseProcessor {
      
    private queueName: string
    private worker: Worker;
   constructor(queueName: string) {
        this.queueName = queueName;  
    }

    register(processor: Processor<any, any, string>, options?: WorkerOptions) {
        if (!options) {
            options = {
                connection: {
                    host: 'localhost',
                    port: 6379
                },
                concurrency: 50
                
            }
        } else if (!options.connection) {
            options.connection = {
                    host: 'localhost',
                    port: 6379
            }
        }

        this.worker = new Worker(this.queueName, processor, options);
        this.worker.on('completed', (job, returnValue) => {
            console.log('completed');
        })
        this.worker.on('failed', (job, error) => {
            console.log('failed',error);
        })
        this.worker.on('stalled', (active,val2) => {
            console.log('stalled', active, val2);
        })
        this.worker.on('progress', (job, progress) => {
            console.log(progress,'progress');
        })
        this.worker.on('error', (error) => {
            console.log(error);
        })
    }
}