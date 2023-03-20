import {
  type HTTP_METHOD,
  HTTP_METHOD_METADATA,
} from "./request-mapping.decorator";

export const ROUTE_METADATA = Symbol("routeMetadata");

export interface Router {
  path: string;
  method: HTTP_METHOD;
}

export function Controller(prefixPath = "/"): ClassDecorator {
  return (target) => {
    const router: Router[] = [];

    Reflect.ownKeys(target.prototype).forEach((key) => {
      const route: Router = Reflect.getMetadata(
        HTTP_METHOD_METADATA,
        target.prototype[key]
      );

      if (route?.path && route?.method) {
        router.push({
          path: `${prefixPath}${route.path}`.replace(/\/+/g, "/"),
          method: route.method,
        });
      }
    });

    Reflect.defineMetadata(ROUTE_METADATA, router, target);
  };
}
