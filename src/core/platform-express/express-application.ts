import type * as http from "http";
import express, { type Express } from "express";
import { ROUTE_METADATA, type Router } from "../decorator/controller.decorator";
import { type HTTP_METHOD } from "../decorator/request-mapping.decorator";
import { type ApplicationOptions } from "../interface/application-options.interface";
import { type Logger } from "../interface/logger.interface";
import { type NestApplication } from "../interface/nest-application.interface";
import { type DiscoveryService } from "../service/discovery.service";
import { type Type } from "../type/type";

export class ExpressApplication implements NestApplication {
  readonly #app: Express = express();
  readonly #router = express.Router();
  #server?: http.Server;
  #globalPrefix = "/";

  constructor(
    private readonly discoveryService: DiscoveryService,
    private readonly logger: Logger = console
  ) {}

  setGlobalPrefix(prefix: string): void {
    this.#globalPrefix = prefix;
  }

  async listen(options?: ApplicationOptions): Promise<void> {
    this.initRoutes();

    await new Promise((resolve) => {
      const port = options?.port ?? 8080;

      this.#server = this.#app.listen(port, () => {
        this.logger.info(`listen on ${port}`);
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

  get<TInput, TResult>(
    // eslint-disable-next-line @typescript-eslint/ban-types
    typeOrToken: Type<TInput> | Function | string | symbol
  ): TResult {
    return this.discoveryService as any;
  }

  private initRoutes(): void {
    const controllers = this.discoveryService.getControllers();

    controllers.forEach((controller) => {
      const routes: Router[] = Reflect.getMetadata(ROUTE_METADATA, controller);
      routes.forEach((route) => {
        this.#router[route.method.toLowerCase() as Lowercase<HTTP_METHOD>](
          route.path,
          (req, res) => {
            res.send("/");
          }
        );
      });
    });

    this.#app.use(this.#globalPrefix, this.#router);
  }
}
