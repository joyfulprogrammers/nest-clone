import request from "supertest";
import { describe, it, expect } from "vitest";
import { ExpressApplication } from "../src/core/platform-express/express-application";

describe("ExpressApplication", () => {
  it("listen", async () => {
    // given
    const app = new ExpressApplication();
    await app.listen({ port: 8888 });
    const server = app.getHttpServer();

    // when
    const response = await request(server).get("/");

    // then
    expect(response.status).toBe(404);
    expect(server.listening).toBeTruthy();

    await app.close();
  });

  it("close", async () => {
    // given
    const app = new ExpressApplication();
    await app.listen({ port: 8889 });
    const server = app.getHttpServer();

    // when
    await app.close();

    // then
    expect(server.listening).toBe(false);
  });
});
