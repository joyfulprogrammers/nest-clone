import { type DynamicModuleMetadata } from "../decorator/module-decorator";

export class ContainerContextManager {
  #moduleContainer: DynamicModuleMetadata[] = [];

  addModule(module: DynamicModuleMetadata): void {
    this.#moduleContainer.push(module);
  }

  getModules(): DynamicModuleMetadata[] {
    return this.#moduleContainer;
  }

  getProviders(): any[] {
    return this.#moduleContainer.flatMap((module) => module.providers);
  }

  getControllers(): any[] {
    return this.#moduleContainer.flatMap((metadata) => metadata.controllers);
  }
}
