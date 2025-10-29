import { parseListOfStrings, parseNonEmptyString, parseRegex } from "./utils/parse";
import { parsePackageDependenciesResolutionMethod, PackageDependenciesResolutionMethodLiteral } from "./models";

export interface RawActionInput {
  changedFiles: string;
  changedFilesSeparator: string;
  allPackages: string;
  allPackagesSeparator: string;
  changedPackagesSeparator: string;
  packageDependenciesResolutionMethod: string;
  poetryPathDependenciesGroups: string;
  poetryPathDependenciesGroupsSeparator: string;
}

export interface ActionInput {
  changedFiles: string[];
  allPackages: string[];
  changedPackagesSeparator: string;
  packageDependenciesResolutionMethod: PackageDependenciesResolutionMethodLiteral;
  poetryPathDependenciesGroups: string[];
}

export function parseActionInput(raw: RawActionInput): ActionInput {
  const changedFilesSeparator = parseNonEmptyString(raw.changedFilesSeparator);
  const allPackagesSeparator = parseNonEmptyString(raw.allPackagesSeparator);
  const poetryPathDependenciesGroupsSeparator = parseNonEmptyString(raw.poetryPathDependenciesGroupsSeparator);

  return {
    changedFiles: parseListOfStrings(raw.changedFiles, changedFilesSeparator),
    allPackages: parseListOfStrings(raw.allPackages, allPackagesSeparator),
    changedPackagesSeparator: parseNonEmptyString(raw.changedPackagesSeparator),
    packageDependenciesResolutionMethod: parsePackageDependenciesResolutionMethod(
      raw.packageDependenciesResolutionMethod,
    ),
    poetryPathDependenciesGroups: parseListOfStrings(
      raw.poetryPathDependenciesGroups,
      poetryPathDependenciesGroupsSeparator,
    ),
  };
}
