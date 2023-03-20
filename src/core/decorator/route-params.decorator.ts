export const REQUEST_METADATA = Symbol("REQUEST_METADATA");
export const RESPONSE_METADATA = Symbol("RESPONSE_METADATA");
export const BODY_METADATA = Symbol("BODY_METADATA");
export const PARAM_METADATA = Symbol("PARAM_METADATA");
export const QUERY_METADATA = Symbol("QUERY_METADATA");

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
