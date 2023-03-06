import { describe, expect, it } from "vitest";
import { NestFactory } from "../src/core/nest-factory";
import { ContainerContextManager } from "../src/core/container/container-context-manager";
import { Module } from "../src/core/decorator/module-decorator";

describe.skip("controller", () => {
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
    NestFactory.create(AppModule);

    // then
    expect(ContainerContextManager.moduleContainer[0].controllers).toHaveLength(
      1
    );
  });

  it("@Get", async () => {
    // given
    function Controller(prefixPath: string): ClassDecorator {
      return (target) => {
        const router = [] as any[];
        Reflect.ownKeys(target.prototype).map((key) => {
          const route = Reflect.get(target.prototype[key], "PATH");
          if (route && route?.path && route?.method) {
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
        Reflect.defineProperty(target[propertyKey], "PATH", {
          value: {
            method: "GET",
            path: path,
          },
          enumerable: true,
          configurable: true,
          writable: true,
        });
      };
    }

    @Controller("/api")
    class TestController {
      @Get("/say")
      sayHi(req: any, res: any, _next: any) {
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
