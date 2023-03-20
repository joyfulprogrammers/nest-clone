import type * as http from "http";
import express, { type Express } from "express";
import { CONTROLLER_METADATA } from "../decorator/controller.decorator";
import {
  type HTTP_METHOD,
  REQUEST_MAPPING_METADATA,
  type RequestMappingMetadata,
} from "../decorator/request-mapping.decorator";
import {
  BODY_METADATA,
  REQUEST_METADATA,
  type RequestPropertyMetadata,
  RESPONSE_METADATA,
} from "../decorator/route-params.decorator";
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
    this.#app.use(express.json());
    this.#app.use(express.urlencoded({ extended: true }));

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
      const prefix: string =
        Reflect.getMetadata(CONTROLLER_METADATA, controller) || "";

      Object.getOwnPropertyNames(controller.prototype).forEach((property) => {
        const metadata: RequestMappingMetadata | undefined =
          Reflect.getMetadata(
            REQUEST_MAPPING_METADATA,
            controller.prototype,
            property
          );

        if (!metadata) {
          return;
        }

        const requestIndex: number | undefined = Reflect.getMetadata(
          REQUEST_METADATA,
          controller.prototype,
          property
        );
        const responseIndex: number | undefined = Reflect.getMetadata(
          RESPONSE_METADATA,
          controller.prototype,
          property
        );

        const bodyMetadata: RequestPropertyMetadata[] | undefined =
          Reflect.getMetadata(BODY_METADATA, controller.prototype, property);

        // const paramMetadata: RequestPropertyMetadata[] | undefined =
        //   Reflect.getMetadata(PARAM_METADATA, controller.prototype, property);
        //
        // const queryMetadata: RequestPropertyMetadata[] | undefined =
        //   Reflect.getMetadata(QUERY_METADATA, controller.prototype, property);

        this.#router[metadata.method.toLowerCase() as Lowercase<HTTP_METHOD>](
          `${prefix}${metadata.path}`.replace(/\/+/g, "/"),
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          async (req, res, next) => {
            try {
              const method = controller.prototype[property];
              const params = [];
              if (requestIndex !== undefined) {
                params[requestIndex] = req;
              }

              if (responseIndex !== undefined) {
                params[responseIndex] = res;
              }

              bodyMetadata?.forEach((metadata) => {
                const { index, property } = metadata;
                params[index] =
                  property && typeof req.body ? req.body?.[property] : req.body;
              });

              const result = await method(...params);

              typeof result === "object" && result !== null
                ? res.json(result)
                : res.send(result.toString());
            } catch (err) {
              next(err);
            }
          }
        );
      });
    });
    this.#app.use(this.#globalPrefix, this.#router);
  }
}
