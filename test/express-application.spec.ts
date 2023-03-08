import request from "supertest";
import { describe, it, expect } from "vitest";
import { DiscoveryService } from "../src/core/discovery.service";
import { ExpressApplication } from "../src/core/platform-express/express-application";

describe("ExpressApplication", () => {
  it("listen", async () => {
    // given
    const app = new ExpressApplication(new DiscoveryService());
    await app.listen({ port: 0 });
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
    const app = new ExpressApplication(new DiscoveryService());
    await app.listen({ port: 0 });
    const server = app.getHttpServer();

    // when
    await app.close();

    // then
    expect(server.listening).toBe(false);
  });
});
