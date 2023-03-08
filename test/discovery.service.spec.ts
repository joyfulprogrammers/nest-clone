import { describe, it, expect } from "vitest";
import { Module } from "../src/core/decorator/module-decorator";
import { DiscoveryService } from "../src/core/discovery.service";

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

    // when
    const discoveryService = new DiscoveryService(AppModule);

    // then
    expect(discoveryService.getModules()).toHaveLength(3);
  });
});
