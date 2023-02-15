import { type ApplicationOptions } from "./application-options.interface";

export interface NestApplication {
  listen: (options?: ApplicationOptions) => Promise<void>;
  close: () => Promise<void>;
  getHttpServer: () => any;
}
