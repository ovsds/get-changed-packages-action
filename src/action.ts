import { PackageDependenciesResolutionMethodLiteral } from "./models";

export interface ActionResult {
  changedPackages: string[];
}

interface ActionOptions {
  changedFiles: string[];
  packageDirectoryRegex: RegExp;
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

  private getChangedPackages(changedFiles: string[], packageDirectoryRegex: RegExp): string[] {
    return Array.from(
      new Set(
        changedFiles
          .map((file) => {
            const match = file.match(packageDirectoryRegex);
            return match ? match[0] : null;
          })
          .filter((directory) => directory !== null),
      ),
    );
  }

  private getChangedPackagesWithDependencies(
    changedPackages: string[],
    packageDependenciesResolutionMethod: PackageDependenciesResolutionMethodLiteral,
  ): string[] {
    switch (packageDependenciesResolutionMethod) {
      case "none":
        return changedPackages;
      default:
        throw new Error(`Unsupported package dependencies resolution method: ${packageDependenciesResolutionMethod}`);
    }
  }

  async run(): Promise<ActionResult> {
    const changedPackages = this.getChangedPackages(this.options.changedFiles, this.options.packageDirectoryRegex);

    this.options.logger(`Found ${changedPackages.length} changed packages:`);
    this.options.logger(changedPackages.join("\n"));

    const changedPackagesWithDependencies = this.getChangedPackagesWithDependencies(
      changedPackages,
      this.options.packageDependenciesResolutionMethod,
    );

    return {
      changedPackages: changedPackagesWithDependencies,
    };
  }
}
