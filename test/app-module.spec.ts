import { describe, it, expect, beforeEach } from "vitest";
import { ContainerContextManager } from "../src/core/container/container-context-manager";
import { Module } from "../src/core/decorator/module-decorator";
import { NestFactory } from "../src/core/nest-factory";

describe("app module", () => {
  beforeEach(() => {
    (ContainerContextManager.moduleContainer as any) = [];
  });

  it("should define Module decorator", () => {
    @Module({})
    class AppModule {}

    const app = NestFactory.create(AppModule);

    expect(app).toBeDefined();
  });

  it("load modules recursively", () => {
    @Module({})
    class ChildAModule {}

    @Module({})
    class ChildBModule {}

    @Module({
      imports: [ChildAModule, ChildBModule],
    })
    class AppModule {}

    NestFactory.create(AppModule);

    expect(ContainerContextManager.moduleContainer).toHaveLength(3);
  });
});
