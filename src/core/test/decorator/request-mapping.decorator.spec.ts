import { describe, expect, it } from "vitest";
import {
  Controller,
  ROUTE_METADATA,
  type Router,
} from "../../decorator/controller.decorator";
import {
  Delete,
  Get,
  HTTP_METHOD,
  Post,
  Put,
  Patch,
  Head,
  Options,
} from "../../decorator/request-mapping.decorator";

describe("request mapping decorator", () => {
  it("should set metadata for controller", () => {
    // given
    @Controller("/test")
    class TestController {}

    // then
    const metadata: Router[] = Reflect.getMetadata(
      ROUTE_METADATA,
      TestController
    );
    expect(metadata).toHaveLength(0);
  });

  it.each([
    [HTTP_METHOD.GET, Get],
    [HTTP_METHOD.POST, Post],
    [HTTP_METHOD.PATCH, Patch],
    [HTTP_METHOD.PUT, Put],
    [HTTP_METHOD.DELETE, Delete],
    [HTTP_METHOD.OPTIONS, Options],
    [HTTP_METHOD.HEAD, Head],
  ] as const)("should not set metadata for %s", (method, decorator) => {
    @Controller()
    class TestController {
      @decorator()
      test(): string {
        return "";
      }
    }

    // then
    const metadata: Router[] = Reflect.getMetadata(
      ROUTE_METADATA,
      TestController.prototype
    );
    expect(metadata).toHaveLength(1);
    expect(metadata[0].method).toBe(method);
    expect(metadata[0].path).toBe("/");
  });

  it("should replace path with only only slash", () => {
    @Controller("//")
    class TestController {
      @Get("//")
      test(): string {
        return "";
      }
    }

    // then
    const metadata: Router[] = Reflect.getMetadata(
      ROUTE_METADATA,
      TestController
    );
    expect(metadata).toHaveLength(1);
    expect(metadata[0].path).toBe("/");
  });
});
