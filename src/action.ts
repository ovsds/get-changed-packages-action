import fs from "fs";
import { glob } from "node:fs/promises";
import path from "path";
import toml from "toml";

import { PackageDependenciesResolutionMethodLiteral } from "./models";

export interface ActionResult {
  changedPackages: string[];
}

export interface ActionOptions {
  changedFiles: string[];
  allPackages: string[];
  packageDependenciesResolutionMethod: PackageDependenciesResolutionMethodLiteral;
  poetryPathDependenciesGroups: string[];
  logger: (message: string) => void;
}

export class Action {
  static fromOptions(actionOptions: ActionOptions): Action {
    return new Action(actionOptions);
  }

  private readonly options: ActionOptions;

  constructor(actionOptions: ActionOptions) {
    this.options = {
      ...actionOptions,
      allPackages: actionOptions.allPackages.map((packagePath) => path.resolve(packagePath)),
      changedFiles: actionOptions.changedFiles.map((filePath) => path.resolve(filePath)),
    };
  }

  private async getAllPackages(): Promise<string[]> {
    const result = new Set<string>();
    for await (const packagePath of glob(this.options.allPackages)) {
      result.add(packagePath);
    }
    return Array.from(result);
  }

  private getChangedPackages(allPackages: string[]): string[] {
    const result = [];

    for (const packagePath of allPackages) {
      for (const file of this.options.changedFiles) {
        if (file.startsWith(packagePath)) {
          result.push(packagePath);
          break;
        }
      }
    }
    return result;
  }

  private getPoetryPathPackageDependencies(packagePath: string): Set<string> {
    const pyprojectTomlPath = path.join(packagePath, "pyproject.toml");

    if (!fs.existsSync(pyprojectTomlPath)) {
      throw new Error(`${pyprojectTomlPath} not found`);
    }

    const pyprojectToml = fs.readFileSync(pyprojectTomlPath, "utf-8");
    const pyprojectTomlJson = toml.parse(pyprojectToml);

    const result = new Set<string>();

    for (const group of this.options.poetryPathDependenciesGroups) {
      let dependencies = pyprojectTomlJson;
      let nodeNotFound = false;
      for (const key of group.split(".")) {
        dependencies = dependencies[key];
        if (!dependencies) {
          nodeNotFound = true;
          break;
        }
      }
      if (nodeNotFound) {
        continue;
      }
      for (const dependency_name of Object.keys(dependencies)) {
        const dependency = dependencies[dependency_name];
        if (typeof dependency === "object" && dependency?.path) {
          const dependencyPath = path.join(packagePath, dependency.path);
          result.add(dependencyPath);
        }
      }
    }

    return result;
  }

  private getPoetryPathDependenciesMapping(allPackages: string[]): Map<string, Set<string>> {
    const dependencies = new Map<string, Set<string>>();

    for (const packagePath of allPackages) {
      const packageDependencies = this.getPoetryPathPackageDependencies(packagePath);
      for (const dependencyPath of packageDependencies) {
        if (dependencies.has(dependencyPath)) {
          dependencies.get(dependencyPath)!.add(packagePath);
        } else {
          dependencies.set(dependencyPath, new Set([packagePath]));
        }
      }
    }

    this.options.logger(`Poetry path dependencies:`);
    for (const [dependencyPath, packagePaths] of dependencies.entries()) {
      this.options.logger(`${dependencyPath}:`);
      for (const packagePath of packagePaths) {
        this.options.logger(`  ${packagePath}`);
      }
    }
    this.options.logger("");

    return dependencies;
  }

  private getChangedPackagesWithDependenciesForPoetryPath(changedPackages: string[], allPackages: string[]): string[] {
    const dependencies = this.getPoetryPathDependenciesMapping(allPackages);

    const result = new Set<string>();
    const visitedPackages = new Set<string>();

    const queue = [...changedPackages];

    while (queue.length > 0) {
      const currentPackagePath = queue.shift();
      if (!currentPackagePath) {
        continue;
      }
      if (visitedPackages.has(currentPackagePath)) {
        continue;
      }
      result.add(currentPackagePath);
      const currentPackageDependencies = dependencies.get(currentPackagePath);
      if (currentPackageDependencies) {
        queue.push(...currentPackageDependencies);
      }
      visitedPackages.add(currentPackagePath);
    }
    return Array.from(result);
  }

  private getChangedPackagesWithDependencies(changedPackages: string[], allPackages: string[]): string[] {
    switch (this.options.packageDependenciesResolutionMethod) {
      case "none":
        return changedPackages;
      case "all":
        return allPackages;
      case "poetry-path":
        return this.getChangedPackagesWithDependenciesForPoetryPath(changedPackages, allPackages);
      default:
        throw new Error(
          `Unsupported package dependencies resolution method: ${this.options.packageDependenciesResolutionMethod}`,
        );
    }
  }

  async run(): Promise<ActionResult> {
    const allPackages = await this.getAllPackages();
    const changedPackages = this.getChangedPackages(allPackages);

    this.options.logger(`Found ${changedPackages.length} changed packages:`);
    this.options.logger(changedPackages.join("\n"));
    this.options.logger("");

    const changedPackagesWithDependencies = this.getChangedPackagesWithDependencies(changedPackages, allPackages);

    this.options.logger(`Found ${changedPackagesWithDependencies.length} changed packages with dependencies:`);
    this.options.logger(changedPackagesWithDependencies.join("\n"));
    this.options.logger("");

    return {
      changedPackages: changedPackagesWithDependencies,
    };
  }
}
