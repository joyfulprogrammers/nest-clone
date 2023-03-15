import { describe, it, expect } from "vitest";
import { Controller } from "../../decorator/controller.decorator";
import { Module } from "../../decorator/module.decorator";
import { DiscoveryService } from "../../service/discovery.service";

describe("DiscoveryService", () => {
  it("getModules", () => {
    // given
    @Module({})
    class ChildAModule {}

    @Module({})
    class ChildBModule {}

    @Module({
      imports: [ChildAModule, ChildBModule],
    })
    class AppModule {}
    const discoveryService = new DiscoveryService(AppModule);

    // when
    const modules = discoveryService.getModules();

    // then
    expect(modules).toHaveLength(3);
  });

  it("getControllers", () => {
    // given
    @Controller()
    class ControllerA {}

    @Controller()
    class ControllerB {}

    @Module({
      controllers: [ControllerA, ControllerB],
    })
    class AppModule {}
    const discoveryService = new DiscoveryService(AppModule);

    // when
    const modules = discoveryService.getControllers();

    // then
    expect(modules).toHaveLength(2);
  });
});
