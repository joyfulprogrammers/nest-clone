import { type ModuleMetadata } from "../interface/module.interface";

export const MODULE_METADATA = Symbol("MODULE_METADATA");

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
