export const MODULE_METADATA = Symbol("moduleMetadata");

export function Module(metadata: ModuleMetadata): ClassDecorator {
  return (target: any) => {
    Reflect.defineProperty(target, MODULE_METADATA, { value: metadata });
  };
}

export interface ModuleMetadata {
  imports?: any[];
  providers?: any[];
  controllers?: any[];
  exports?: any[];
}
