import { type ModuleMetadata } from "../decorator/module-decorator";

export class ContainerContextManager {
  static readonly moduleContainer: ModuleMetadata[] = [];

  static addModule(module: ModuleMetadata): void {
    this.moduleContainer.push(module);
  }
}
