import { describe, it, expect } from "vitest";
import { Injector } from "../../container/injector";

describe("Injector", () => {
  it("register integer with string key", () => {
    // given
    const injector = new Injector();
    injector.register("integer", 10);

    // when
    const actual = injector.get("integer");

    // then
    expect(actual).toBe(10);
  });

  it("register by symbol key", () => {
    // given
    const symbol = Symbol("symbol");
    const injector = new Injector();
    class Sample {
      foo = 5;
    }
    injector.register(symbol, Sample);

    // when
    const actual: Sample = injector.get(symbol);

    // then
    expect(actual).toBeInstanceOf(Sample);
    expect(actual.foo).toBe(5);
  });

  it("register by class key", () => {
    // given
    const injector = new Injector();
    class Sample {
      foo = 3;
    }
    injector.register(Sample, Sample);

    // when
    const actual: Sample = injector.get(Sample);

    // then
    expect(actual).toBeInstanceOf(Sample);
    expect(actual.foo).toBe(3);
  });

  it("register duplicate key", () => {
    // given
    const injector = new Injector();
    injector.register("key", true);
    injector.register("key", false);

    // when
    const actual: boolean = injector.get("key");

    // then
    expect(actual).toBe(true);
  });
});
