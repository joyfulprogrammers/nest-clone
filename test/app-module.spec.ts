import { describe, it, expect } from "vitest";
import {
  Module,
  moduleContainer,
} from "../src/core/decorator/module-decorator";
import { NestFactory } from "../src/core/nest-factory";

describe("app module", () => {
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

    expect(moduleContainer).toHaveLength(3);
  });
});
