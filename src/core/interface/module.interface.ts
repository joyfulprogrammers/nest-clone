import { type Type } from "../type/type";

export interface ClassProvider {
  provide: Type;
  useClass: Type;
}
export type ProviderMetadata = Type | ClassProvider;

export interface ModuleMetadata {
  imports?: Array<DynamicModuleMetadata | Type>;
  providers?: ProviderMetadata[];
  controllers?: Type[];
  exports?: any[];
}

export interface DynamicModuleMetadata extends ModuleMetadata {
  module: any;
  global: boolean;
}
