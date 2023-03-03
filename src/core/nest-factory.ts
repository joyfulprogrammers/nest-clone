import {
  MODULE_METADATA,
  type ModuleMetadata,
  moduleContainer,
} from "./decorator/module-decorator";
import { type NestApplication } from "./interface/nest-application.interface";
import { ExpressApplication } from "./platform-express/express-application";

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class NestFactory {
  static create(appModule: any): NestApplication {
    const metadata: ModuleMetadata | undefined = Reflect.get(
      appModule,
      MODULE_METADATA
    );

    if (!metadata) {
      throw new Error("Module decorator is not provided");
    }

    moduleContainer.push(metadata);
    recur(metadata.imports);

    return new ExpressApplication();
  }
}

function recur(modules: any[] = []): void {
  for (const module of modules) {
    const metadata: ModuleMetadata | undefined = Reflect.get(
      module,
      MODULE_METADATA
    );

    if (!metadata) {
      return;
    }

    moduleContainer.push(metadata);
    recur(metadata.imports);
  }
}
