import type {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
} from '@nestjs/common';
import { Injectable } from '@nestjs/common';

import type { User } from '../modules/user/types/user.type.ts';
import { ContextProvider } from '../providers/context.provider.ts';

@Injectable()
export class AuthUserInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    const request = context.switchToHttp().getRequest<{ user: User }>();

    const user = request.user;
    ContextProvider.setAuthUser(user);

    return next.handle();
  }
}
