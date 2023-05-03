export const INJECT_METADATA = Symbol("INJECT_METADATA");

export function forwardRef<A>(type: () => A): { forwardRef: () => A } {
  return { forwardRef: type };
}

export function Inject(
  typeOrToken: any
): (target: any, key?: string | symbol, index?: number) => void {
  return (target, propertyKey, parameterIndex) => {
    if (propertyKey) {
      return;
    }

    const metadata = Reflect.getMetadata(INJECT_METADATA, target) ?? [];

    Reflect.defineMetadata(
      INJECT_METADATA,
      [...metadata, { index: parameterIndex, key: typeOrToken }],
      target
    );
  };
}
