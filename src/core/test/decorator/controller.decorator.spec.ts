import { describe, expect, it } from "vitest";
import {
  Controller,
  CONTROLLER_METADATA,
} from "../../decorator/controller.decorator";

describe("controller decorator", () => {
  it("should set metadata for controller", () => {
    // given
    @Controller("/test")
    class TestController {}

    // then
    const metadata: string = Reflect.getMetadata(
      CONTROLLER_METADATA,
      TestController.prototype
    );
    expect(metadata).toBe("/test");
  });
});
