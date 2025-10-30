import { parseListOfStrings, parseNonEmptyString } from "./utils/parse";
import {
  parsePackageDependenciesResolutionMethod,
  PackageDependenciesResolutionMethodLiteral,
  ChangedPackagesFormatLiteral,
  parseChangedPackagesFormat,
} from "./models";

export interface RawActionInput {
  changedFiles: string;
  changedFilesSeparator: string;
  allPackages: string;
  allPackagesSeparator: string;
  changedPackagesFormat: string;
  changedPackagesListSeparator: string;
  packageDependenciesResolutionMethod: string;
  poetryPathDependenciesGroups: string;
  poetryPathDependenciesGroupsSeparator: string;
}

export interface ActionInput {
  changedFiles: string[];
  allPackages: string[];
  changedPackagesFormat: ChangedPackagesFormatLiteral;
  changedPackagesListSeparator: string;
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
    changedPackagesFormat: parseChangedPackagesFormat(raw.changedPackagesFormat),
    changedPackagesListSeparator: parseNonEmptyString(raw.changedPackagesListSeparator),
    packageDependenciesResolutionMethod: parsePackageDependenciesResolutionMethod(
      raw.packageDependenciesResolutionMethod,
    ),
    poetryPathDependenciesGroups: parseListOfStrings(
      raw.poetryPathDependenciesGroups,
      poetryPathDependenciesGroupsSeparator,
    ),
  };
}
