import { ExecutionContext, Injectable, CanActivate } from '@nestjs/common';

@Injectable()
export class LoggedInGuard implements CanActivate {
  async canActivate(context: ExecutionContext) {
      const request = context.switchToHttp().getRequest();
      const response = context.switchToHttp().getResponse();
      if (request.isAuthenticated()) return response.send(`${request.user.username} already logged in`).end();
      return true;
  }
}