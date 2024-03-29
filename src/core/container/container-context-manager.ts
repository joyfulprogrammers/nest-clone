import { type ModuleMetadata } from "../interface/module.interface";

export class ContainerContextManager {
  #moduleContainer: ModuleMetadata[] = [];

  addModule(module: ModuleMetadata): void {
    this.#moduleContainer.push(module);
  }

  getModules(): ModuleMetadata[] {
    return this.#moduleContainer;
  }

  getProviders(): any[] {
    return this.#moduleContainer.flatMap((module) => module.providers ?? []);
  }

  getControllers(): any[] {
    return this.#moduleContainer.flatMap(
      (metadata) => metadata.controllers ?? []
    );
  }
}
