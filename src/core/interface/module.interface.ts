import { type Type } from "../type/type";

interface Provider {
  provide: Type | symbol;
}

export interface ClassProvider extends Provider {
  useClass: Type;
}

export interface ValueProvider extends Provider {
  useValue: any;
}

export type ProviderMetadata = Type | ClassProvider | ValueProvider;

export interface ModuleMetadata {
  imports?: Array<DynamicModuleMetadata | Type>;
  providers?: ProviderMetadata[];
  controllers?: Type[];
  exports?: any[];
}

export interface DynamicModuleMetadata extends ModuleMetadata {
  module: any;
  global?: boolean;
}
