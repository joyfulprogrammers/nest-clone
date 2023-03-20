import { ContainerContextManager } from "../container/container-context-manager";
import {
  type DynamicModuleMetadata,
  MODULE_METADATA,
} from "../decorator/module.decorator";

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
    const metadata: DynamicModuleMetadata | undefined = Reflect.getMetadata(
      MODULE_METADATA,
      rootModule
    );

    if (!metadata) {
      throw new Error("Module decorator is not provided");
    }

    this.#container.addModule(metadata);
    this.recur(metadata.imports);
  }

  private recur(modules: any[] = []): void {
    for (const module of modules) {
      const metadata: DynamicModuleMetadata | undefined = Reflect.getMetadata(
        MODULE_METADATA,
        module
      );

      if (!metadata) {
        return;
      }

      this.#container.addModule(metadata);
      this.recur(metadata.imports);
    }
  }

  getProviders(): DynamicModuleMetadata[] {
    return this.#container.getProviders();
  }

  getControllers(): DynamicModuleMetadata[] {
    return this.#container.getControllers();
  }

  getModules(): DynamicModuleMetadata[] {
    return this.#container.getModules();
  }
}
