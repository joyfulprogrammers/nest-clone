import { ContainerContextManager } from "./container/container-context-manager";
import {
  MODULE_METADATA,
  type ModuleMetadata,
} from "./decorator/module-decorator";
import { type NestApplication } from "./interface/nest-application.interface";
import { ExpressApplication } from "./platform-express/express-application";

export class NestFactory {
  static create(appModule: any): NestApplication {
    const metadata: ModuleMetadata | undefined = Reflect.get(
      appModule,
      MODULE_METADATA
    );

    if (!metadata) {
      throw new Error("Module decorator is not provided");
    }

    ContainerContextManager.addModule(metadata);
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

    ContainerContextManager.addModule(metadata);
    recur(metadata.imports);
  }
}
