import { type ApplicationOptions } from "./application-options.interface";
import { type Type } from "../type/type";

export interface NestApplication {
  listen: (options?: ApplicationOptions) => Promise<void>;
  close: () => Promise<void>;
  getHttpServer: () => any;
  get: <TInput = any, TResult = TInput>(
    typeOrToken: Type<TInput> | Function | string | symbol
  ) => TResult;
  setGlobalPrefix: (prefix: string) => void;
}
