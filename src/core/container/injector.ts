import "reflect-metadata";
import { INJECT_METADATA } from "../decorator/inject.decorator";
import { type Type } from "../type/type";

export class Injector {
  #instanceContainer = new Map<Type | Function | string | symbol, any>();

  /**
   * include Class, PrimitiveType...
   */
  #dependencyRegistry = new Map<
    Type | Function | string | symbol,
    { target: Type; instance: any }
  >();

  registerByInstance(
    instance: any,
    tokenOrKey?: Type | Function | string | symbol
  ): void {
    if (this.isClassType(instance)) {
      throw new Error("Can register only class instance.");
    }

    if (tokenOrKey) {
      this.#instanceContainer.set(tokenOrKey, instance);
      return;
    }

    this.#instanceContainer.set(instance.constructor.prototype, instance);
  }

  register(target: Type, tokenOrKey?: Type | Function | string | symbol): void {
    if (!tokenOrKey) {
      this.#dependencyRegistry.set(target.prototype, {
        target,
        instance: Object.create(target.prototype),
      });
      return;
    }

    this.#dependencyRegistry.set(tokenOrKey, {
      target,
      instance: Object.create(target.prototype),
    });
  }

  init(): void {
    this.#dependencyRegistry.forEach((info, key) => {
      this.loadInstance(info, key);
    });
  }

  getInstance<T = any>(tokenOrKey: Type | Function | string | symbol): T {
    const instance = this.#instanceContainer.get(tokenOrKey);

    if (instance) {
      return instance;
    }

    if (this.isClassType(tokenOrKey)) {
      return this.#instanceContainer.get(tokenOrKey.prototype);
    }

    throw new Error(
      `Cannot get instance of ${tokenOrKey.toString()} because it is not registered.`
    );
  }

  private loadInstance(
    info: { target: Type; instance: any },
    tokenOrKey: Type | Function | string | symbol
  ): InstanceType<Type> {
    const savedInstance = this.#instanceContainer.get(tokenOrKey);
    if (savedInstance) {
      return savedInstance;
    }

    const dependencies: Type[] =
      Reflect.getMetadata("design:paramtypes", info.target) ?? [];
    const injectMetadatas: Array<{ index: number; key: any }> =
      Reflect.getMetadata(INJECT_METADATA, info.target) || [];

    const instanceArgs: Array<InstanceType<Type>> = dependencies.map(
      (Arg, index) => {
        const injectKey = injectMetadatas.find(({ index: i }) => i === index);
        if (injectKey) {
          if ("forwardRef" in injectKey.key) {
            return this.#dependencyRegistry.get(
              (injectKey.key.forwardRef() as Type).prototype
            )?.instance;
          }
        }
        const [key, argInfo] =
          [...this.#dependencyRegistry.entries()].find(
            ([_, value]) => value.target.prototype === Arg.prototype
          ) ?? [];

        if (!key || !argInfo) {
          throw new Error(`Circular dependency detected`);
        }

        return this.loadInstance(argInfo, key);
      }
    );

    const instance = info.target.prototype.isForwardRef
      ? Object.assign(info.instance, new info.target(...instanceArgs))
      : new info.target(...instanceArgs);
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
