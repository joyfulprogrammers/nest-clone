import { type Type } from "../type/type";

export class Injector {
  // eslint-disable-next-line @typescript-eslint/ban-types
  #container = new Map<Type | Function | string | symbol, any>();

  register(
    // eslint-disable-next-line @typescript-eslint/ban-types
    typeOrToken: Type | Function | string | symbol,
    cls: any
  ): void {
    if (this.#container.has(typeOrToken)) {
      return;
    }

    this.#container.set(
      typeOrToken,
      // eslint-disable-next-line new-cap
      typeof cls === "function" ? new cls() : cls
    );
  }

  get<TInput, TResult>(
    // eslint-disable-next-line @typescript-eslint/ban-types
    typeOrToken: Type<TInput> | Function | string | symbol
  ): TResult {
    return this.#container.get(typeOrToken);
  }
}
