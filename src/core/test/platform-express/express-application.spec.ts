import request from "supertest";
import { describe, it, expect } from "vitest";
import { Controller } from "../../decorator/controller.decorator";
import { Module } from "../../decorator/module.decorator";
import { Get } from "../../decorator/request.decorator";
import { ExpressApplication } from "../../platform-express/express-application";
import { DiscoveryService } from "../../service/discovery.service";

describe("ExpressApplication", () => {
  it("listen", async () => {
    // given
    @Module({})
    class AppModule {}
    const app = new ExpressApplication(new DiscoveryService(AppModule));
    await app.listen({ port: 0 });
    const server = app.getHttpServer();

    // when
    const response = await request(server).get("/");

    // then
    expect(response.status).toBe(404);
    expect(server.listening).toBeTruthy();

    await app.close();
  });

  it("route", async () => {
    // given
    @Controller("/api/post")
    class ControllerA {
      @Get()
      index(): string {
        return "ok";
      }
    }
    @Module({ controllers: [ControllerA] })
    class AppModule {}
    const app = new ExpressApplication(new DiscoveryService(AppModule));
    await app.listen({ port: 0 });
    const server = app.getHttpServer();

    // when
    const response = await request(server).get("/api/post");

    // then
    expect(response.status).toBe(200);

    await app.close();
  });

  it("setGlobalPrefix && route", async () => {
    // given
    @Controller("/post")
    class ControllerA {
      @Get()
      index(): string {
        return "ok";
      }
    }
    @Module({ controllers: [ControllerA] })
    class AppModule {}
    const app = new ExpressApplication(new DiscoveryService(AppModule));
    app.setGlobalPrefix("/api");
    await app.listen({ port: 0 });
    const server = app.getHttpServer();

    // when
    const response = await request(server).get("/api/post");

    // then
    expect(response.status).toBe(200);

    await app.close();
  });

  it("close", async () => {
    // given
    @Module({})
    class AppModule {}
    const app = new ExpressApplication(new DiscoveryService(AppModule));
    await app.listen({ port: 0 });
    const server = app.getHttpServer();

    // when
    await app.close();

    // then
    expect(server.listening).toBe(false);
  });
});
