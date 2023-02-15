import { type NestApplication } from "./interface/nest-application.interface";
import { ExpressApplication } from "./platform-express/express-application";

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class NestFactory {
  static create(appModule: any): NestApplication {
    return new ExpressApplication();
  }
}
