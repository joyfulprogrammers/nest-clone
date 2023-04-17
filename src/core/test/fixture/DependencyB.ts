import { DependencyA } from "./DependencyA";
import { Controller } from "../../decorator/controller.decorator";

@Controller()
export class DependencyB {
  constructor(private readonly dependencyA: DependencyA) {}
}
