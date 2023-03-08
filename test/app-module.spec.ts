import { describe, expect, it } from "vitest";
import { Module } from "../src/core/decorator/module-decorator";
import { DiscoveryService } from "../src/core/discovery.service";
import { NestFactory } from "../src/core/nest-factory";

describe("app module", () => {
  it("should define Module decorator", () => {
    // given
    @Module({})
    class AppModule {}

    // when
    const app = NestFactory.create(AppModule);

    // then
    expect(app).toBeDefined();
  });

  it("load modules recursively", () => {
    // given
    @Module({})
    class ChildAModule {}

    @Module({})
    class ChildBModule {}

    @Module({
      imports: [ChildAModule, ChildBModule],
    })
    class AppModule {}

    // when
    const app = NestFactory.create(AppModule);

    // then
    const discoveryService = app.get(DiscoveryService);
    expect(discoveryService.getModules()).toHaveLength(3);
  });
});
