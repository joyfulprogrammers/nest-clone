import { ContainerContextManager } from "../container/container-context-manager";
import { Injector } from "../container/injector";
import { MODULE_METADATA } from "../decorator/module.decorator";
import { type InstanceWrapper } from "../interface/instance-wrapper.interface";
import {
  type DynamicModuleMetadata,
  type ModuleMetadata,
} from "../interface/module.interface";
import { type Type } from "../type/type";

export class DiscoveryService {
  #container = new ContainerContextManager();
  #injector: Injector = new Injector();

  constructor(private readonly rootModule: Type) {
    this.#injector.registerByInstance(this);
    this.search(rootModule);
  }

  /**
   * 모듈 탐색하는 메소드
   * 모듈을 받아서 모듈들 탐색해서 container 추가
   */
  private search(rootModule: Type): void {
    const metadata: ModuleMetadata | undefined = Reflect.getMetadata(
      MODULE_METADATA,
      rootModule
    );

    if (!metadata) {
      throw new Error("Module decorator is not provided");
    }

    this.register(metadata);
    this.#injector.init();
  }

  private isDynamicModule(
    module: Type | DynamicModuleMetadata
  ): module is DynamicModuleMetadata {
    return "module" in module;
  }

  private register(module: ModuleMetadata): void {
    this.#container.addModule(module);

    module.controllers?.forEach((controller) => {
      this.#injector.register(controller);
    });

    module.providers?.forEach((provider) => {
      if ("useClass" in provider) {
        this.#injector.register(provider.useClass, provider.provide);
        return;
      }

      this.#injector.register(provider);
    });

    this.recur(module.imports);
  }

  private recur(modules: Array<Type | DynamicModuleMetadata> = []): void {
    modules.forEach((module) => {
      if (this.isDynamicModule(module)) {
        this.register(module);
        return;
      }

      const metadata: ModuleMetadata = Reflect.getMetadata(
        MODULE_METADATA,
        module
      );

      if (!metadata) {
        return;
      }

      this.register(metadata);
    });
  }

  getProviders(): InstanceWrapper[] {
    return this.#container.getProviders().map((provider) => {
      if ("provide" in provider) {
        return {
          instance: this.#injector.getInstance(provider.provide),
          prototype: provider.useClass.prototype,
        };
      }

      return {
        instance: this.#injector.getInstance(provider),
        prototype: provider.prototype,
      };
    });
  }

  getControllers(): InstanceWrapper[] {
    return this.#container.getControllers().map((controller) => ({
      instance: this.#injector.getInstance(controller),
      prototype: controller.prototype,
    }));
  }

  getModules(): ModuleMetadata[] {
    return this.#container.getModules();
  }

  get<TInput, TResult>(
    typeOrToken: Type<TInput> | Function | string | symbol
  ): TResult {
    return this.#injector.getInstance(typeOrToken);
  }
}
