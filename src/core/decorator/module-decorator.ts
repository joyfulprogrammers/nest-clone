export const MODULE_METADATA = Symbol("moduleMetadata");

export function Module(metadata: ModuleMetadata): ClassDecorator {
  return (target: any) => {
    Reflect.defineProperty(target, MODULE_METADATA, {
      value: { module: target, ...metadata, global: false },
      writable: false,
      enumerable: true,
      configurable: false,
    });
  };
}

export interface ModuleMetadata {
  imports?: any[];
  providers?: any[];
  controllers?: any[];
  exports?: any[];
}

export interface DynamicModule extends ModuleMetadata {
  module: any;
  global: boolean;
}
