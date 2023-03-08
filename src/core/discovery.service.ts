import { ContainerContextManager } from "./container/container-context-manager";
import {
  MODULE_METADATA,
  type ModuleMetadata,
} from "./decorator/module-decorator";

export class DiscoveryService {
  #container = new ContainerContextManager();

  constructor(private readonly rootModule: any = {}) {
    this.search(rootModule);
  }

  /**
   * 모듈 탐색하는 메소드
   * 모듈을 받아서 모듈들 탐색해서 container 추가
   */
  private search(rootModule: any): void {
    const metadata: ModuleMetadata | undefined = Reflect.get(
      rootModule,
      MODULE_METADATA
    );

    if (!metadata) {
      throw new Error("Module decorator is not provided");
    }

    this.#container.addModule(metadata);
    this.recur(metadata.imports);
  }

  private recur(modules: any[] = []): void {
    for (const module of modules) {
      const metadata: ModuleMetadata | undefined = Reflect.get(
        module,
        MODULE_METADATA
      );

      if (!metadata) {
        return;
      }

      this.#container.addModule(metadata);
      this.recur(metadata.imports);
    }
  }

  getProviders(): any[] {
    return this.#container.getProviders();
  }

  getControllers(): any[] {
    return this.#container.getControllers();
  }

  getModules(): ModuleMetadata[] {
    return this.#container.getModules();
  }
}
