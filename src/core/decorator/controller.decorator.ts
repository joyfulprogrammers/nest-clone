export const CONTROLLER_METADATA = Symbol("CONTROLLER_METADATA");

export function Controller(prefixPath = "/"): ClassDecorator {
  return (target) => {
    Reflect.defineMetadata(CONTROLLER_METADATA, prefixPath, target);
  };
}
