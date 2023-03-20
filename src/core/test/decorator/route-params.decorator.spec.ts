import {
  Request as ExpressRequest,
  Response as ExpressResponse,
} from "express";
import { describe, expect, it } from "vitest";
import { Controller } from "../../decorator/controller.decorator";
import { Get } from "../../decorator/request-mapping.decorator";
import {
  Body,
  BODY_METADATA,
  Param,
  PARAM_METADATA,
  Query,
  QUERY_METADATA,
  Request,
  REQUEST_METADATA,
  type RequestPropertyMetadata,
  Response,
  RESPONSE_METADATA,
} from "../../decorator/route-params.decorator";

describe("route params decorator", () => {
  describe("@Request", () => {
    it("inject express request by decorator", () => {
      // given
      @Controller("/test")
      class TestController {
        @Get()
        test(foo: string, @Request() req: ExpressRequest): string {
          return "";
        }
      }

      // then
      const index: number = Reflect.getMetadata(
        REQUEST_METADATA,
        TestController.prototype,
        "test"
      );
      expect(index).toBe(1);
    });
  });

  describe("@Response", () => {
    it("inject express response by decorator", () => {
      // given
      @Controller("/test")
      class TestController {
        @Get()
        test(foo: string, @Response() req: ExpressResponse): string {
          return "";
        }
      }

      // then
      const index: number = Reflect.getMetadata(
        RESPONSE_METADATA,
        TestController.prototype,
        "test"
      );
      expect(index).toBe(1);
    });
  });

  describe("@Body", () => {
    it("inject body data by decorator", () => {
      // given
      @Controller("/test")
      class TestController {
        @Get()
        test(foo: string, @Body() req: string): string {
          return "";
        }
      }

      // then
      const metadata: RequestPropertyMetadata[] = Reflect.getMetadata(
        BODY_METADATA,
        TestController.prototype,
        "test"
      );
      expect(metadata).toHaveLength(1);
      expect(metadata[0].property).toBeUndefined();
      expect(metadata[0].index).toBe(1);
    });

    it("inject body of property by decorator", () => {
      // given
      @Controller("/test")
      class TestController {
        @Get()
        test(foo: string, @Body("id") req: string): string {
          return "";
        }
      }

      // then
      const metadata: RequestPropertyMetadata[] = Reflect.getMetadata(
        BODY_METADATA,
        TestController.prototype,
        "test"
      );
      expect(metadata).toHaveLength(1);
      expect(metadata[0].property).toBe("id");
      expect(metadata[0].index).toBe(1);
    });
  });

  describe("@Param", () => {
    it("inject param data by decorator", () => {
      // given
      @Controller("/test")
      class TestController {
        @Get()
        test(foo: string, @Param() req: string): string {
          return "";
        }
      }

      // then
      const metadata: RequestPropertyMetadata[] = Reflect.getMetadata(
        PARAM_METADATA,
        TestController.prototype,
        "test"
      );
      expect(metadata).toHaveLength(1);
      expect(metadata[0].property).toBeUndefined();
      expect(metadata[0].index).toBe(1);
    });

    it("inject param property by decorator", () => {
      // given
      @Controller("/test")
      class TestController {
        @Get()
        test(foo: string, @Param("id") req: string): string {
          return "";
        }
      }

      // then
      const metadata: RequestPropertyMetadata[] = Reflect.getMetadata(
        PARAM_METADATA,
        TestController.prototype,
        "test"
      );
      expect(metadata).toHaveLength(1);
      expect(metadata[0].property).toBe("id");
      expect(metadata[0].index).toBe(1);
    });
  });

  describe("@Query", () => {
    it("inject query data by decorator", () => {
      // given
      @Controller("/test")
      class TestController {
        @Get()
        test(foo: string, @Query() req: string): string {
          return "";
        }
      }

      // then
      const metadata: RequestPropertyMetadata[] = Reflect.getMetadata(
        QUERY_METADATA,
        TestController.prototype,
        "test"
      );
      expect(metadata).toHaveLength(1);
      expect(metadata[0].property).toBeUndefined();
      expect(metadata[0].index).toBe(1);
    });

    it("inject query property by decorator", () => {
      // given
      @Controller("/test")
      class TestController {
        @Get()
        test(foo: string, @Query("id") req: string): string {
          return "";
        }
      }

      // then
      const metadata: RequestPropertyMetadata[] = Reflect.getMetadata(
        QUERY_METADATA,
        TestController.prototype,
        "test"
      );
      expect(metadata).toHaveLength(1);
      expect(metadata[0].property).toBe("id");
      expect(metadata[0].index).toBe(1);
    });
  });
});
