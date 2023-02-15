import type * as http from "http";
import express, { type Express } from "express";
import { type ApplicationOptions } from "../interface/application-options.interface";
import { type Logger } from "../interface/logger.interface";
import { type NestApplication } from "../interface/nest-application.interface";

export class ExpressApplication implements NestApplication {
  readonly #app: Express = express();
  #server?: http.Server;
  readonly #logger: Logger = console;

  async listen(options?: ApplicationOptions): Promise<void> {
    await new Promise((resolve) => {
      const port = options?.port ?? 8080;

      this.#server = this.#app.listen(port, () => {
        this.#logger.info(`listen on ${port}`);
        resolve(undefined);
      });
    });
  }

  async close(): Promise<void> {
    await new Promise((resolve, reject) => {
      if (this.#server == null) {
        resolve(undefined);
        return;
      }

      this.#server.close((err) => {
        if (err !== undefined) {
          reject(err);
          return;
        }
        resolve(undefined);
      });
    });
  }

  getHttpServer(): any {
    return this.#server;
  }
}
