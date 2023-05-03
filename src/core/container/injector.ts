import "reflect-metadata";
import { INJECT_METADATA } from "../decorator/inject.decorator";
import { type Type } from "../type/type";

export class Injector {
  #instanceContainer = new Map<Type | Function | string | symbol, any>();

  #lazyLoadings: any[] = [];

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
      this.recur(info, key);
    });
    this.#lazyLoadings.forEach((fn) => fn());
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

  private recur(
    info: { target: Type; instance: any },
    tokenOrKey: Type | Function | string | symbol
  ): InstanceType<Type> {
    const savedInstance = this.#instanceContainer.get(tokenOrKey);
    if (savedInstance) {
      return savedInstance;
    }

    const args: Type[] =
      Reflect.getMetadata("design:paramtypes", info.target) ?? [];
    const injectMetadatas: Array<{ index: number; key: any }> =
      Reflect.getMetadata(INJECT_METADATA, info.target) || [];

    const instanceArgs: Array<InstanceType<Type>> = args.map((Arg, index) => {
      const injectKey = injectMetadatas.find(({ index: i }) => i === index);
      if (injectKey) {
        if ("forwardRef" in injectKey.key) {
          const instance = this.#dependencyRegistry.get(
            (injectKey.key.forwardRef() as Type).prototype
          )?.instance;

          this.#lazyLoadings.push(() => {
            const source = this.#instanceContainer.get(
              injectKey.key.forwardRef().prototype
            );
            this.#instanceContainer.set(
              injectKey.key.forwardRef().prototype,
              Object.assign(instanceArgs[injectKey.index], source)
            );
          });

          return instance;
        }
      }
      const [key, argInfo] =
        [...this.#dependencyRegistry.entries()].find(
          ([_, value]) => value.target.prototype === Arg.prototype
        ) ?? [];

      if (!key || !argInfo) {
        throw new Error(`Circular dependency detected`);
      }

      return this.recur(argInfo, key);
    });

    // this.#lazyLoadings.push(() => {
    //   injectMetadatas.forEach((metadata) => {
    //     if ("forwardRef" in metadata.key) {
    //       const source = this.#instanceContainer.get(
    //         metadata.key.forwardRef().prototype
    //       );
    //       this.#instanceContainer.set(
    //         metadata.key.forwardRef().prototype,
    //         Object.assign(instanceArgs[metadata.index], source)
    //       );
    //     }
    //   });
    // });

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
