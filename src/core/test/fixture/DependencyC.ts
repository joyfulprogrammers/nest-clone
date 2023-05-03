import { DependencyA } from "./DependencyA";
import { Controller } from "../../decorator/controller.decorator";
import { forwardRef, Inject } from "../../decorator/inject.decorator";

@Controller()
export class DependencyC {
  constructor(
    @Inject(forwardRef(() => DependencyA))
    private readonly dependencyA: DependencyA
  ) {}
}
