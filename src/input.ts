import { parseListOfStrings, parseNonEmptyString, parseRegex } from "./utils/parse";
import { parsePackageDependenciesResolutionMethod, PackageDependenciesResolutionMethodLiteral } from "./models";

export interface RawActionInput {
  changedFiles: string;
  changedFilesSeparator: string;
  allPackages: string;
  allPackagesSeparator: string;
  changedPackagesSeparator: string;
  packageDependenciesResolutionMethod: string;
}

export interface ActionInput {
  changedFiles: string[];
  allPackages: string[];
  changedPackagesSeparator: string;
  packageDependenciesResolutionMethod: PackageDependenciesResolutionMethodLiteral;
}

export function parseActionInput(raw: RawActionInput): ActionInput {
  const changedFilesSeparator = parseNonEmptyString(raw.changedFilesSeparator);
  const allPackagesSeparator = parseNonEmptyString(raw.allPackagesSeparator);

  return {
    changedFiles: parseListOfStrings(raw.changedFiles, changedFilesSeparator),
    allPackages: parseListOfStrings(raw.allPackages, allPackagesSeparator),
    changedPackagesSeparator: parseNonEmptyString(raw.changedPackagesSeparator),
    packageDependenciesResolutionMethod: parsePackageDependenciesResolutionMethod(
      raw.packageDependenciesResolutionMethod,
    ),
  };
}
