import { PackageDependenciesResolutionMethodLiteral } from "./models";

export interface ActionResult {
  changedPackages: string[];
}

interface ActionOptions {
  changedFiles: string[];
  allPackages: string[];
  packageDependenciesResolutionMethod: PackageDependenciesResolutionMethodLiteral;
  logger: (message: string) => void;
}

export class Action {
  static fromOptions(actionOptions: ActionOptions): Action {
    return new Action(actionOptions);
  }

  private readonly options: ActionOptions;

  constructor(actionOptions: ActionOptions) {
    this.options = actionOptions;
  }

  private getChangedPackages(): string[] {
    const result = [];

    for (const packagePath of this.options.allPackages) {
      for (const file of this.options.changedFiles) {
        if (file.startsWith(packagePath)) {
          result.push(packagePath);
          break;
        }
      }
    }
    return result;
  }

  private getChangedPackagesWithDependencies(changedPackages: string[]): string[] {
    switch (this.options.packageDependenciesResolutionMethod) {
      case "none":
        return changedPackages;
      case "all":
        return this.options.allPackages;
      default:
        throw new Error(
          `Unsupported package dependencies resolution method: ${this.options.packageDependenciesResolutionMethod}`,
        );
    }
  }

  async run(): Promise<ActionResult> {
    const changedPackages = this.getChangedPackages();

    this.options.logger(`Found ${changedPackages.length} changed packages:`);
    this.options.logger(changedPackages.join("\n"));

    const changedPackagesWithDependencies = this.getChangedPackagesWithDependencies(changedPackages);

    return {
      changedPackages: changedPackagesWithDependencies,
    };
  }
}
