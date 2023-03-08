import { DiscoveryService } from "./discovery.service";
import { type NestApplication } from "./interface/nest-application.interface";
import { ExpressApplication } from "./platform-express/express-application";

export class NestFactory {
  static create(appModule: any): NestApplication {
    return new ExpressApplication(new DiscoveryService(appModule));
  }
}
