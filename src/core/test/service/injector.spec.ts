import { describe, it, expect } from "vitest";
import { Injector } from "../../container/injector";
import { Controller } from "../../decorator/controller.decorator";
import { DependencyA } from "../fixture/DependencyA";
import { DependencyB } from "../fixture/DependencyB";

describe("Injector", () => {
  it("should create instance without key", () => {
    // given
    class A {}
    const injector = new Injector();
    injector.register(A);
    injector.init();

    // when
    const instance = injector.getInstance(A);

    // then
    expect(instance).toBeInstanceOf(A);
  });

  it("should create instance with class dependency", () => {
    // given
    class A {}

    @Controller()
    class B {
      constructor(readonly a: A) {}
    }
    const injector = new Injector();
    injector.register(A);
    injector.register(B);
    injector.init();

    // when
    const instance = injector.getInstance<B>(B);

    // then
    expect(instance).toBeInstanceOf(B);
    expect(instance.a).toBeInstanceOf(A);
  });

  it("should create instance with nested class dependency", () => {
    // given
    class A {}
    @Controller()
    class B {
      constructor(readonly a: A) {}
    }
    @Controller()
    class C {
      constructor(readonly b: B) {}
    }
    const injector = new Injector();
    injector.register(A);
    injector.register(B);
    injector.register(C);
    injector.init();

    // when
    const instanceB = injector.getInstance<B>(B);
    const instanceC = injector.getInstance<C>(C);

    // then
    expect(instanceB).toBeInstanceOf(B);
    expect(instanceB.a).toBeInstanceOf(A);
    expect(instanceC.b).toBeInstanceOf(B);
  });

  it("should throw error when there is circular dependencies", () => {
    // given
    const injector = new Injector();
    injector.register(DependencyA);
    injector.register(DependencyB);

    // when
    const init = (): void => {
      injector.init();
    };

    // then
    expect(init).toThrowError("Circular dependency detected");
  });
});
