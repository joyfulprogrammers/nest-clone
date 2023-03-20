export const MODULE_METADATA = Symbol("moduleMetadata");

export function Global(): ClassDecorator {
  return (target: any) => {
    const metadata = Reflect.getMetadata(MODULE_METADATA, target);

    Reflect.defineMetadata(
      MODULE_METADATA,
      { ...metadata, global: true },
      target
    );
  };
}

export function Module(metadata: ModuleMetadata): ClassDecorator {
  return (target: any) => {
    const parentMetadata = Reflect.getMetadata(MODULE_METADATA, target);

    Reflect.defineMetadata(
      MODULE_METADATA,
      {
        ...metadata,
        module: target,
        global: parentMetadata?.global || false,
      },
      target
    );
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
