import "reflect-metadata";
import { type Type } from "../type/type";

export class Injector {
  /**
   * include instance
   */
  #container = new Map<Type | Function | string | symbol, any>();

  /**
   * include Class, PrimitiveType...
   */
  #info = new Map<Type | Function | string | symbol, any>();

  register(target: any, tokenOrKey?: Type | Function | string | symbol): void {
    if (!tokenOrKey) {
      this.#info.set(target.prototype, target);
      return;
    }

    this.#info.set(tokenOrKey, target);
  }

  init(): void {
    this.#info.forEach((Clazz, key) => {
      this.recur(Clazz, key);
    });
  }

  getInstance<T = any>(tokenOrKey: Type | Function | string | symbol): T {
    if (this.isClassType(tokenOrKey)) {
      return this.#container.get(tokenOrKey.prototype);
    }
    return this.#container.get(tokenOrKey);
  }

  private recur(
    Clazz: Type,
    tokenOrKey: Type | Function | string | symbol
  ): InstanceType<Type> {
    const savedInstance = this.#container.get(tokenOrKey);
    if (savedInstance) {
      return savedInstance;
    }

    const args: Type[] = Reflect.getMetadata("design:paramtypes", Clazz) ?? [];

    const instanceArgs: Array<InstanceType<Type>> = args.map((Arg) =>
      this.recur(Arg, Arg.prototype)
    );

    const instance = new Clazz(...instanceArgs);
    this.#container.set(tokenOrKey, instance);

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
