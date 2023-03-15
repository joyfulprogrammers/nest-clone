import { HTTP_METHOD_METADATA } from "./request-decorator";

export const ROUTE_METADATA = Symbol("routeMetadata");

export enum HTTP_METHOD {
  GET = "GET",
}

export interface Router {
  path: string;
  method: HTTP_METHOD;
}

export function Controller(prefixPath: string): ClassDecorator {
  return (target) => {
    const router: Router[] = [];

    Reflect.ownKeys(target.prototype).forEach((key) => {
      const route: Router = Reflect.get(
        target.prototype[key],
        HTTP_METHOD_METADATA
      );

      if (route?.path && route?.method) {
        router.push({
          path: `${prefixPath}${route.path}`,
          method: route.method,
        });
      }
    });

    Reflect.defineProperty(target, ROUTE_METADATA, {
      value: router,
    });
  };
}
