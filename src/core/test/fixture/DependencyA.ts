import { DependencyB } from "./DependencyB";
import { Controller } from "../../decorator/controller.decorator";

@Controller()
export class DependencyA {
  constructor(private readonly dependencyB: DependencyB) {}
}
