import {
  Response as ExpressResponse,
  Request as ExpressRequest,
} from "express";
import request from "supertest";
import { describe, it, expect } from "vitest";
import { Controller } from "../../decorator/controller.decorator";
import { Module } from "../../decorator/module.decorator";
import {
  Get,
  HTTP_METHOD,
  Post,
} from "../../decorator/request-mapping.decorator";
import {
  Response,
  Request,
  Body,
  Query,
  Param,
} from "../../decorator/route-params.decorator";
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

  it("@Request & @Response", async () => {
    @Controller("/api")
    class ControllerA {
      @Get("/test")
      test(
        @Request() req: ExpressRequest,
        @Response() res: ExpressResponse
      ): void {
        res.json({ ok: true, req: req.method });
      }
    }
    @Module({ controllers: [ControllerA] })
    class AppModule {}
    const app = new ExpressApplication(new DiscoveryService(AppModule));

    await app.listen({ port: 0 });
    const server = app.getHttpServer();

    // when
    const response = await request(server).get("/api/test");

    // then
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ ok: true, req: HTTP_METHOD.GET });

    await app.close();
  });

  it("@Body", async () => {
    @Controller("/api")
    class ControllerA {
      @Post("/test")
      test(@Body() body: { search: string }): { search: string } {
        return body;
      }
    }
    @Module({ controllers: [ControllerA] })
    class AppModule {}
    const app = new ExpressApplication(new DiscoveryService(AppModule));

    await app.listen({ port: 0 });
    const server = app.getHttpServer();

    // when
    const response = await request(server)
      .post("/api/test")
      .send({ search: "yohan" });

    // then
    expect(response.status).toBe(200);
    expect(response.headers["content-type"]).toBe(
      "application/json; charset=utf-8"
    );
    expect(response.body).toEqual({
      search: "yohan",
    });

    await app.close();
  });

  it("@Body property", async () => {
    @Controller("/api")
    class ControllerA {
      @Post("/test")
      test(@Body("search") search: string): string {
        return search;
      }
    }

    @Module({ controllers: [ControllerA] })
    class AppModule {}
    const app = new ExpressApplication(new DiscoveryService(AppModule));

    await app.listen({ port: 0 });
    const server = app.getHttpServer();

    // when
    const response = await request(server)
      .post("/api/test")
      .send({ search: "yohan" });

    // then
    expect(response.status).toBe(200);
    expect(response.headers["content-type"]).toBe("text/html; charset=utf-8");
    expect(response.text).toBe("yohan");

    await app.close();
  });

  it("@Query", async () => {
    @Controller("/api")
    class ControllerA {
      @Get("/test")
      test(@Query() query: { search: string }): { search: string } {
        return query;
      }
    }
    @Module({ controllers: [ControllerA] })
    class AppModule {}
    const app = new ExpressApplication(new DiscoveryService(AppModule));

    await app.listen({ port: 0 });
    const server = app.getHttpServer();

    // when
    const response = await request(server)
      .get("/api/test")
      .query({ search: "yohan" });

    // then
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      search: "yohan",
    });

    await app.close();
  });

  it("@Query property", async () => {
    @Controller("/api")
    class ControllerA {
      @Get("/test")
      test(@Query("search") search: string): string {
        return search;
      }
    }

    @Module({ controllers: [ControllerA] })
    class AppModule {}
    const app = new ExpressApplication(new DiscoveryService(AppModule));

    await app.listen({ port: 0 });
    const server = app.getHttpServer();

    // when
    const response = await request(server)
      .get("/api/test")
      .query({ search: "yohan" });

    // then
    expect(response.status).toBe(200);
    expect(response.text).toBe("yohan");

    await app.close();
  });

  it("@Param", async () => {
    @Controller("/api")
    class ControllerA {
      @Get("/test/:search")
      test(@Param() param: { search: string }): { search: string } {
        return param;
      }
    }
    @Module({ controllers: [ControllerA] })
    class AppModule {}
    const app = new ExpressApplication(new DiscoveryService(AppModule));

    await app.listen({ port: 0 });
    const server = app.getHttpServer();

    // when
    const response = await request(server).get("/api/test/yohan");

    // then
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      search: "yohan",
    });

    await app.close();
  });

  it("@Param property", async () => {
    @Controller("/api")
    class ControllerA {
      @Get("/test/:search")
      test(@Param("search") search: string): string {
        return search;
      }
    }

    @Module({ controllers: [ControllerA] })
    class AppModule {}
    const app = new ExpressApplication(new DiscoveryService(AppModule));

    await app.listen({ port: 0 });
    const server = app.getHttpServer();

    // when
    const response = await request(server).get("/api/test/yohan");

    // then
    expect(response.status).toBe(200);
    expect(response.text).toBe("yohan");

    await app.close();
  });
});
