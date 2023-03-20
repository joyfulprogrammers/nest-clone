export const REQUEST_METADATA = Symbol("requestMetadata");
export const RESPONSE_METADATA = Symbol("responseMetadata");
export const BODY_METADATA = Symbol("bodyMetadata");
export const PARAM_METADATA = Symbol("paramMetadata");
export const QUERY_METADATA = Symbol("queryMetadata");

export function Request(): ParameterDecorator {
  return (target, propertyKey, parameterIndex) => {
    Reflect.defineMetadata(
      REQUEST_METADATA,
      parameterIndex,
      target,
      propertyKey
    );
  };
}

export function Response(): ParameterDecorator {
  return (target, propertyKey, parameterIndex) => {
    Reflect.defineMetadata(
      RESPONSE_METADATA,
      parameterIndex,
      target,
      propertyKey
    );
  };
}

export interface RequestPropertyMetadata {
  property?: string;
  index: number;
}

export function Body(property?: string): ParameterDecorator {
  return (target, propertyKey, parameterIndex) => {
    const metadata: RequestPropertyMetadata[] =
      Reflect.getMetadata(BODY_METADATA, target, propertyKey) || [];

    Reflect.defineMetadata(
      BODY_METADATA,
      [...metadata, { property, index: parameterIndex }],
      target,
      propertyKey
    );
  };
}

export function Param(property?: string): ParameterDecorator {
  return (target, propertyKey, parameterIndex) => {
    const metadata: RequestPropertyMetadata[] =
      Reflect.getMetadata(PARAM_METADATA, target, propertyKey) || [];

    Reflect.defineMetadata(
      PARAM_METADATA,
      [...metadata, { property, index: parameterIndex }],
      target,
      propertyKey
    );
  };
}

export function Query(property?: string): ParameterDecorator {
  return (target, propertyKey, parameterIndex) => {
    const metadata: RequestPropertyMetadata[] =
      Reflect.getMetadata(QUERY_METADATA, target, propertyKey) || [];

    Reflect.defineMetadata(
      QUERY_METADATA,
      [...metadata, { property, index: parameterIndex }],
      target,
      propertyKey
    );
  };
}
