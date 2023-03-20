import "reflect-metadata";

import { type NestApplication } from "./interface/nest-application.interface";
import { ExpressApplication } from "./platform-express/express-application";
import { DiscoveryService } from "./service/discovery.service";

export class NestFactory {
  static create(appModule: any): NestApplication {
    return new ExpressApplication(new DiscoveryService(appModule));
  }
}
