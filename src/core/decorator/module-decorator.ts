export const MODULE_METADATA = Symbol("moduleMetadata");

export function Global(): ClassDecorator {
  return (target: any) => {
    const metadata = Reflect.get(target, MODULE_METADATA);

    Reflect.defineProperty(target, MODULE_METADATA, {
      value: { ...metadata, global: true },
      enumerable: true,
      configurable: true,
    });
  };
}

export function Module(metadata: ModuleMetadata): ClassDecorator {
  return (target: any) => {
    const parentMetadata = Reflect.get(target, MODULE_METADATA);

    Reflect.defineProperty(target, MODULE_METADATA, {
      value: {
        ...metadata,
        module: target,
        global: parentMetadata?.global || false,
      },
      enumerable: true,
      configurable: true,
    });
  };
}

export interface ModuleMetadata {
  imports?: any[];
  providers?: any[];
  controllers?: any[];
  exports?: any[];
}

export interface DynamicModuleMetadata extends ModuleMetadata {
  module: any;
  global: boolean;
}
