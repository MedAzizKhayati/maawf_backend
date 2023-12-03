import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  healthCheck(): string {
    return  `${process.env.APP_NAME} is healthy!`;
  }
}
