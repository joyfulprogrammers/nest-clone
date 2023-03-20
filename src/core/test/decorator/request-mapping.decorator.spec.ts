import { describe, expect, it } from "vitest";
import { Controller } from "../../decorator/controller.decorator";
import {
  Delete,
  Get,
  HTTP_METHOD,
  Post,
  Put,
  Patch,
  Head,
  Options,
  REQUEST_MAPPING_METADATA,
  type RequestMappingMetadata,
} from "../../decorator/request-mapping.decorator";

describe("request mapping decorator", () => {
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
      @decorator("/api")
      test(): string {
        return "";
      }
    }

    // then
    const metadata: RequestMappingMetadata = Reflect.getMetadata(
      REQUEST_MAPPING_METADATA,
      TestController.prototype,
      "test"
    );

    expect(metadata.method).toBe(method);
    expect(metadata.path).toBe("/api");
  });
});
