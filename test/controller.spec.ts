import { describe, expect, it } from "vitest";
import { Module } from "../src/core/decorator/module-decorator";
import { DiscoveryService } from "../src/core/discovery.service";
import { NestFactory } from "../src/core/nest-factory";

describe("controller", () => {
  it("@Controller", () => {
    // given
    function Controller(path: string): ClassDecorator {
      return (clazz) => {
        // save reflect?
      };
    }
    @Controller("/test")
    class TestController {}

    @Module({
      controllers: [TestController],
    })
    class AppModule {}

    // when
    const app = NestFactory.create(AppModule);

    // then
    const discoveryService = app.get(DiscoveryService);
    expect(discoveryService.getControllers()).toHaveLength(1);
  });

  it("@Get", async () => {
    // given
    function Controller(prefixPath: string): ClassDecorator {
      return (target) => {
        const router = [] as any[];

        Reflect.ownKeys(target.prototype).forEach((key) => {
          const route: Record<string, string> = Reflect.get(
            target.prototype[key],
            "PATH"
          );
          if (route?.path && route?.method) {
            router.push({
              path: `${prefixPath}${route.path}`,
              method: route.method,
            });
          }
        });

        Reflect.defineProperty(target, "ROUTE", {
          value: router,
        });
      };
    }

    function Get(path: string): MethodDecorator {
      return (target, propertyKey, descriptor) => {
        Reflect.defineProperty((target as any)[propertyKey], "PATH", {
          value: {
            method: "GET",
            path,
          },
          enumerable: true,
          configurable: false,
          writable: false,
        });
      };
    }

    @Controller("/api")
    class TestController {
      @Get("/say")
      sayHi(req: any, res: any, _next: any): void {
        res.json("hello2");
      }
    }

    // when, then
    expect(Reflect.get(TestController, "ROUTE")).toHaveLength(1);
    expect(Reflect.get(TestController, "ROUTE")[0]).toStrictEqual({
      path: "/api/say",
      method: "GET",
    });
  });
});
