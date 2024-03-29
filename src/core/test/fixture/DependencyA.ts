import { DependencyB } from "./DependencyB";
import { Controller } from "../../decorator/controller.decorator";
import { forwardRef, Inject } from "../../decorator/inject.decorator";

@Controller()
export class DependencyA {
  constructor(
    @Inject(forwardRef(() => DependencyB))
    private readonly dependencyB: DependencyB
  ) {}
}
