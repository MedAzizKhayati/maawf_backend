import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return `Welcome to ${process.env.APP_NAME}!`;
  }
}
