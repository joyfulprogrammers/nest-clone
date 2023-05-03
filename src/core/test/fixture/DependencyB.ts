import { DependencyC } from "./DependencyC";
import { Controller } from "../../decorator/controller.decorator";
import { forwardRef, Inject } from "../../decorator/inject.decorator";

@Controller()
export class DependencyB {
  constructor(
    @Inject(forwardRef(() => DependencyC))
    private readonly dependencyC: DependencyC
  ) {}
}
