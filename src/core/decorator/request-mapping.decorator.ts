export const REQUEST_MAPPING_METADATA = Symbol("REQUEST_MAPPING_METADATA");

export const enum HTTP_METHOD {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  PATCH = "PATCH",
  DELETE = "DELETE",
  OPTIONS = "OPTIONS",
  HEAD = "HEAD",
}

export interface RequestMappingMetadata {
  method: HTTP_METHOD;
  path: string;
}

function RequestMapping(method: HTTP_METHOD) {
  return function (path = "/"): MethodDecorator {
    return (target, propertyKey) => {
      Reflect.defineMetadata(
        REQUEST_MAPPING_METADATA,
        {
          method,
          path,
        },
        target,
        propertyKey
      );
    };
  };
}

export const Get = RequestMapping(HTTP_METHOD.GET);
export const Post = RequestMapping(HTTP_METHOD.POST);
export const Put = RequestMapping(HTTP_METHOD.PUT);
export const Delete = RequestMapping(HTTP_METHOD.DELETE);
export const Patch = RequestMapping(HTTP_METHOD.PATCH);
export const Options = RequestMapping(HTTP_METHOD.OPTIONS);
export const Head = RequestMapping(HTTP_METHOD.HEAD);
