import { describe, it, expect } from "vitest";
import { Controller } from "../../decorator/controller.decorator";
import { Module } from "../../decorator/module.decorator";
import { type InstanceWrapper } from "../../interface/instance-wrapper.interface";
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
    const controllers = discoveryService.getControllers();

    // then
    expect(controllers).toHaveLength(2);
    expect(controllers[0].instance).toBeInstanceOf(ControllerA);
    expect(controllers[1].instance).toBeInstanceOf(ControllerB);
  });

  it("getProviders", () => {
    // given
    class ServiceA {}
    class ServiceB {}
    @Module({
      providers: [ServiceA, ServiceB],
    })
    class AppModule {}
    const discoveryService = new DiscoveryService(AppModule);

    // when
    const providers = discoveryService.getProviders();

    // then
    expect(providers).toHaveLength(2);
    expect(providers[0].instance).toBeInstanceOf(ServiceA);
    expect(providers[1].instance).toBeInstanceOf(ServiceB);
  });

  it("getProviders with useClass", () => {
    // given
    class ServiceA {}
    class ServiceB {}
    @Controller()
    class ControllerD {
      constructor(readonly a: ServiceA, readonly b: ServiceB) {}
    }

    @Module({
      controllers: [ControllerD],
      providers: [ServiceA, { provide: class C {}, useClass: ServiceB }],
    })
    class AppModule {}
    const discoveryService = new DiscoveryService(AppModule);

    // when
    const providers = discoveryService.getProviders();

    // then
    expect(providers).toHaveLength(2);
    expect(providers[0].instance).toBeInstanceOf(ServiceA);
    expect(providers[1].instance).toBeInstanceOf(ServiceB);

    const controller: InstanceWrapper = discoveryService.getControllers()[0];
    expect(controller.instance.a).toBeInstanceOf(ServiceA);
    expect(controller.instance.b).toBeInstanceOf(ServiceB);
  });

  it("getProviders with useValue", () => {
    // given
    class ServiceA {}
    const instance = new ServiceA();
    const token = Symbol("token");

    @Module({
      providers: [{ provide: token, useValue: instance }],
    })
    class AppModule {}
    const discoveryService = new DiscoveryService(AppModule);

    // when
    const result = discoveryService.get(token);

    // then
    expect(result).toBe(instance);
  });
});
