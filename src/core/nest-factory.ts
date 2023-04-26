import "reflect-metadata";

import { type NestApplication } from "./interface/nest-application.interface";
import { ExpressApplication } from "./platform-express/express-application";
import { DiscoveryService } from "./service/discovery.service";
import { type Type } from "./type/type";

export class NestFactory {
  static create(appModule: Type): NestApplication {
    return new ExpressApplication(new DiscoveryService(appModule));
  }
}
