import { Job } from 'bullmq';
import { UserService } from 'src/user/user.service';
import { BaseProcessor } from './base.processor';
import { Inject, Injectable, forwardRef } from '@nestjs/common';

export class DeleteUserProcessor extends BaseProcessor{
  constructor(@Inject(forwardRef(() => UserService)) private service: UserService) {
    super('deleteUserQueue');
    this.register();
  }

  register() {
    super.register(this.process.bind(this));
  }
  
  async process(job: Job<any, any, string>): Promise<any> {
    console.log('work started');
    await this.service.deleteUsers();
  }

}