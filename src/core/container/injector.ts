import "reflect-metadata";
import { type Type } from "../type/type";

export class Injector {
  #instanceContainer = new Map<Type | Function | string | symbol, any>();

  /**
   * include Class, PrimitiveType...
   */
  #dependencyRegistry = new Map<
    Type | Function | string | symbol,
    { target: Type; visited: boolean }
  >();

  register(target: Type): void {
    this.#dependencyRegistry.set(target.prototype, { target, visited: false });
  }

  init(): void {
    this.#dependencyRegistry.forEach((info, key) => {
      this.recur(info, key);
    });
  }

  getInstance<T = any>(tokenOrKey: Type | Function): T {
    return this.#instanceContainer.get(tokenOrKey.prototype);
  }

  private recur(
    info: { target: Type; visited: boolean },
    tokenOrKey: Type | Function | string | symbol
  ): InstanceType<Type> {
    const savedInstance = this.#instanceContainer.get(tokenOrKey);
    if (savedInstance) {
      return savedInstance;
    }

    if (info.visited) {
      throw new Error(`Circular dependency detected`);
    }
    info.visited = true;

    const args: Type[] =
      Reflect.getMetadata("design:paramtypes", info.target) ?? [];

    const instanceArgs: Array<InstanceType<Type>> = args.map((Arg) => {
      const argInfo = this.#dependencyRegistry.get(Arg.prototype);
      if (Arg === Object) {
        throw new Error(`Circular dependency detected`);
      }
      if (!argInfo) {
        throw new Error(`No provider for ${Arg.name}`);
      }
      return this.recur(argInfo, Arg.prototype);
    });

    // eslint-disable-next-line new-cap
    const instance = new info.target(...instanceArgs);
    this.#instanceContainer.set(tokenOrKey, instance);

    return instance;
  }

  private isClassType(
    target: Type | Function | string | symbol
  ): target is Type {
    const objectType = Object.prototype.toString.call(target);
    const type = objectType?.match(/\[object (\w+)]/)![1].toLowerCase();

    return type === "function";
  }
}
