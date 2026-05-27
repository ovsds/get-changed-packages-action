import fs from "fs";

import { parseListOfStrings, parseNonEmptyString, parseBoolean } from "./utils/parse";
import {
  parsePackageDependenciesResolutionMethod,
  PackageDependenciesResolutionMethodLiteral,
  ChangedPackagesFormatLiteral,
  parseChangedPackagesFormat,
} from "./models";

export interface RawActionInput {
  changedFiles: string;
  changedFilesFile: string;
  changedFilesSeparator: string;
  allPackages: string;
  allPackagesSeparator: string;
  changedPackagesFormat: string;
  changedPackagesRelativePath: string;
  changedPackagesListSeparator: string;
  packageDependenciesResolutionMethod: string;
  poetryPathDependenciesGroups: string;
  poetryPathDependenciesGroupsSeparator: string;
}

export interface ActionInput {
  changedFiles: string[];
  allPackages: string[];
  changedPackagesFormat: ChangedPackagesFormatLiteral;
  changedPackagesRelativePath: boolean;
  changedPackagesListSeparator: string;
  packageDependenciesResolutionMethod: PackageDependenciesResolutionMethodLiteral;
  poetryPathDependenciesGroups: string[];
}

function resolveChangedFiles(raw: string, file: string): string {
  if (raw !== "" && file !== "") {
    throw new Error("`changed-files` and `changed-files-file` inputs are mutually exclusive");
  }
  if (file === "") {
    return raw;
  }
  if (!fs.existsSync(file)) {
    throw new Error(`changed-files-file does not exist: ${file}`);
  }
  return fs.readFileSync(file, "utf-8");
}

export function parseActionInput(raw: RawActionInput): ActionInput {
  const changedFilesSeparator = parseNonEmptyString(raw.changedFilesSeparator);
  const allPackagesSeparator = parseNonEmptyString(raw.allPackagesSeparator);
  const poetryPathDependenciesGroupsSeparator = parseNonEmptyString(raw.poetryPathDependenciesGroupsSeparator);

  const changedFiles = resolveChangedFiles(raw.changedFiles, raw.changedFilesFile);

  return {
    changedFiles: parseListOfStrings(changedFiles, changedFilesSeparator),
    allPackages: parseListOfStrings(raw.allPackages, allPackagesSeparator),
    changedPackagesFormat: parseChangedPackagesFormat(raw.changedPackagesFormat),
    changedPackagesRelativePath: parseBoolean(raw.changedPackagesRelativePath),
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
