import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetRequestData = createParamDecorator(
  (index: string, ctx: ExecutionContext) =>
    ctx.switchToHttp().getRequest()[index] || null,
);
