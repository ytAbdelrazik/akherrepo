import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class FailedLoginMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    res.on('finish', () => {
      if (res.statusCode === 401) {
        console.error(`Failed login attempt: ${req.body.email}`);
        // Save this log to the database for admin review
      }
    });
    next();
  }
}
