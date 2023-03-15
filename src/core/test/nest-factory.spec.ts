import { describe, expect, it } from "vitest";
import { Module, Global } from "../decorator/module.decorator";
import { NestFactory } from "../nest-factory";
import { DiscoveryService } from "../service/discovery.service";

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

  it("load modules recursively", () => {
    // given
    @Module({})
    @Global()
    class ChildAModule {}

    @Global()
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
